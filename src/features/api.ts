import { CONFIG } from "@/config";
import { uniqBy } from "lodash-es";
import {
  getBlogCount,
  setBlogCount,
  updateCacheIssues,
  updateCacheLabels,
  updateCacheRepos,
} from "./cache";
import { TIssue, TLabel, TRepo } from "./types";

const headers = {
  Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};



export async function getAllIssue() {
  const blogCount = getBlogCount();
  const respArr = Array.from({ length: Math.ceil(blogCount / 100) }, (_, i) => {
    return fetch(
      `https://api.github.com/repos/${
        CONFIG.author.name
      }/blog/issues?per_page=100&page=${i + 1}`,
      {
        headers,
      }
    );
  });
  const dataArr = await Promise.all(respArr);
  const multiLayerData = await Promise.all(dataArr.map((resp) => resp.json()));
  const data = uniqBy(
    multiLayerData
      .flat()
      .filter(
        (i) =>
          i.author_association === "OWNER" &&
          i.state === "open" &&
          i?.body?.trim()?.length
      ),
    "id"
  );
  updateCacheIssues(data);
  return data as TIssue[];
}

export async function getMyRepos(): Promise<TRepo[]> {
  const resp = await fetch(`https://api.github.com/user/repos`, {
    headers,
    method: "GET",
  });
  const data: TRepo[] = await resp.json();
  const blogRepo = data.find((i) => i.name === "blog");
  if (blogRepo) {
    setBlogCount(blogRepo.open_issues_count);
  }
  updateCacheRepos(data);
  return data;
}

export async function getBlogRepoLabels() {
  const response = await fetch(
    `https://api.github.com/repos/${CONFIG.author.name}/blog/labels`,
    {
      headers,
    }
  );
  const data: TLabel[] = await response.json();
  updateCacheLabels(data);
  return data;
}

export async function getIssueByIssueNumber(num: number) {
  const response = await fetch(
    `https://api.github.com/repos/${CONFIG.author.name}/blog/issues/${num}`,
    {
      headers,
    }
  );
  const data: TIssue = await response.json();
  return data;
}

export async function testToken(token: string) {
  const response = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  return response.status === 200;
}

export async function createIssue(
  issue: {
    title: string;
    body: string;
    labels: string[];
  },
  token: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${CONFIG.author.name}/blog/issues`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      method: "POST",
      body: JSON.stringify(issue),
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}

export async function updateIssue(
  issue: {
    title: string;
    body: string;
    labels: string[];
    state: string;
  },
  issueNumber: number,
  token: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${CONFIG.author.name}/blog/issues/${issueNumber}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      method: "PATCH",
      body: JSON.stringify(issue),
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}