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

async function fetchJson(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.json();
}

async function fetchPaginatedIssues() {
  const issues = [];

  for (let page = 1; ; page += 1) {
    const pageItems = await fetchJson(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`
    );

    issues.push(...pageItems);

    if (pageItems.length < 100) {
      break;
    }
  }

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
  return JSON.parse(raw);
}

async function main() {
  try {
    const [issues, labels] = await Promise.all([
      fetchPaginatedIssues(),
      fetchJson(`https://api.github.com/repos/${owner}/${repo}/labels?per_page=100`),
    ]);

    const data = {
      generatedAt: new Date().toISOString(),
      issues,
      labels,
      repos: [],
    };

    await writeArtifacts(data);

    console.log(
      `[prepare-static-data] snapshot refreshed with ${
        data.issues.filter(isPublishedIssue).length
      } published posts`
    );
  } catch (error) {
    const fallback = await readSnapshot().catch(() => null);

    if (!fallback) {
      throw error;
    }

    await writeArtifacts(fallback);
    console.warn(
      `[prepare-static-data] refresh failed, reused existing snapshot: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

await main();
