import fs from "node:fs/promises";
import path from "node:path";
import { Feed } from "feed";
import matter from "gray-matter";
import { marked } from "marked";

const cwd = process.cwd();
const domain = process.env.DOMAIN ?? "https://i5lin.top";
const owner = "AaronConlon";
const repo = "blog";
const token = process.env.GITHUB_TOKEN;
const requestTimeoutMs = Number(process.env.GITHUB_API_TIMEOUT_MS ?? 15000);
const maxRetries = Number(process.env.GITHUB_API_RETRIES ?? 3);
const allowStaleSnapshot = process.env.ALLOW_STALE_SNAPSHOT === "true";
const snapshotPath = path.join(cwd, "src/generated/blog-data.json");
const rssPath = path.join(cwd, "public/rss.xml");

const headers = {
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `bearer ${token}` } : {}),
};

function normalizeIssues(issues) {
  return issues
    .filter((issue) => !("pull_request" in issue))
    .filter((issue) => issue.author_association === "OWNER")
    .sort(
      (left, right) =>
        new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
    );
}

function isPublishedIssue(issue) {
  return (
    issue.author_association === "OWNER" &&
    issue.state === "open" &&
    Boolean(issue.body?.trim())
  );
}

function getPublishedIssues(issues) {
  return issues
    .filter(isPublishedIssue)
    .sort(
      (left, right) =>
        new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
    );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelay(response, attempt) {
  const retryAfter = Number(response.headers.get("retry-after"));

  if (Number.isFinite(retryAfter) && retryAfter >= 0) {
    return Math.min(retryAfter * 1000, 10000);
  }

  return Math.min(500 * 2 ** attempt, 5000);
}

function isRetryableResponse(response) {
  return response.status === 429 || response.status >= 500;
}

function getNextLink(linkHeader) {
  if (!linkHeader) {
    return null;
  }

  for (const link of linkHeader.split(",")) {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);

    if (match?.[2].split(" ").includes("next")) {
      return match[1];
    }
  }

  return null;
}

async function fetchJsonResponse(url) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

    try {
      const response = await fetch(url, { headers, signal: controller.signal });

      if (response.ok) {
        const data = await response.json();
        return { data, response };
      }

      if (!isRetryableResponse(response) || attempt === maxRetries) {
        const error = new Error(`${response.status} ${response.statusText}: ${url}`);
        error.name = "GitHubApiResponseError";
        throw error;
      }

      await sleep(getRetryDelay(response, attempt));
      continue;
    } catch (error) {
      if (error instanceof Error && error.name === "GitHubApiResponseError") {
        throw error;
      }

      if (attempt === maxRetries) {
        throw new Error(
          `GitHub API request failed after ${maxRetries + 1} attempts: ${url}`,
          { cause: error }
        );
      }

      await sleep(Math.min(500 * 2 ** attempt, 5000));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`GitHub API request failed: ${url}`);
}

async function fetchPaginatedArray(url) {
  const items = [];
  let nextUrl = url;

  while (nextUrl) {
    const { data, response } = await fetchJsonResponse(nextUrl);

    if (!Array.isArray(data)) {
      throw new Error(`Expected an array response from GitHub: ${nextUrl}`);
    }

    items.push(...data);
    nextUrl = getNextLink(response.headers.get("link"));
  }

  return items;
}

async function fetchPaginatedIssues() {
  const issues = await fetchPaginatedArray(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&sort=created&direction=desc`
  );

  return normalizeIssues(issues);
}

function buildRssXml(issues) {
  const feed = new Feed({
    title: "AaronConlon's Blog",
    description: "AaronConlon's Blog",
    id: domain,
    link: domain,
    language: "zh-CN",
    image: `${domain}/coder3.svg`,
    favicon: `${domain}/favicon.ico`,
    copyright: "All rights reserved 2024, Blog",
    updated: new Date(),
    generator: "Feed for Node.js",
    feedLinks: {
      rss: `${domain}/rss.xml`,
    },
    author: {
      name: "Aaron Conlon",
      email: "rivenqinyy@gmail.com",
      link: domain,
    },
  });

  issues.forEach((issue) => {
    let data = {};
    let content = issue.body ?? "";

    try {
      const resolved = matter(issue.body ?? "");
      data = resolved.data;
      content = resolved.content;
    } catch {
      data = {};
      content = issue.body ?? "";
    }

    feed.addItem({
      title: issue.title,
      id: issue.id.toString(),
      link: `${domain}/blog/post/${issue.id}`,
      description: data?.description || content.slice(0, 200),
      content: marked.parse(content),
      author: [
        {
          name: issue.user.login,
          link: issue.user.html_url,
        },
      ],
      date: new Date(issue.created_at),
    });
  });

  return feed.rss2();
}

async function writeArtifacts(data) {
  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.mkdir(path.dirname(rssPath), { recursive: true });

  await fs.writeFile(snapshotPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.writeFile(
    rssPath,
    buildRssXml(data.issues.filter(isPublishedIssue)),
    "utf8"
  );
}

async function readSnapshot() {
  const raw = await fs.readFile(snapshotPath, "utf8");
  const snapshot = JSON.parse(raw);

  if (
    !snapshot ||
    !Array.isArray(snapshot.issues) ||
    !Array.isArray(snapshot.labels) ||
    !Array.isArray(snapshot.repos)
  ) {
    throw new Error(`Invalid blog snapshot: ${snapshotPath}`);
  }

  return snapshot;
}

async function main() {
  try {
    const [issues, labels] = await Promise.all([
      fetchPaginatedIssues(),
      fetchPaginatedArray(
        `https://api.github.com/repos/${owner}/${repo}/labels?per_page=100`
      ),
    ]);

    const data = {
      generatedAt: new Date().toISOString(),
      issues,
      labels,
      repos: [],
    };

    await writeArtifacts(data);

    const publishedIssues = getPublishedIssues(data.issues);

    console.log(
      `[prepare-static-data] snapshot refreshed with ${publishedIssues.length} published posts`
    );
    console.log("[prepare-static-data] published issue titles (newest first):");
    publishedIssues.forEach((issue) => {
      console.log(`- ${issue.updated_at} ${issue.title}`);
    });
  } catch (error) {
    if (!allowStaleSnapshot) {
      throw error;
    }

    const fallback = await readSnapshot().catch(() => null);

    if (!fallback) {
      throw error;
    }

    await writeArtifacts(fallback);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(
      `[prepare-static-data] refresh failed, reused existing snapshot because ` +
        `ALLOW_STALE_SNAPSHOT=true: ${errorMessage}`
    );
  }
}

await main();
