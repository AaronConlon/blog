import { OWNER, REPO } from "@/utils/consts";

import { request } from "@octokit/request";
import { uniqWith } from "lodash-es";

export const createGithubInstance = () => {
  console.log("env:", process.env.TOKEN);

  return request.defaults({
    headers: {
      authorization: `token ${process.env.TOKEN}`,
    },
  });
};

export const requestWithAuth = request.defaults({
  headers: {
    authorization: `token ${process.env.TOKEN}`,
  },
});

export const getAllIssue = async (pageNum = 1) => {
  console.log("获取所有issue");

  if (globalThis.postList === undefined) {
    globalThis.postList = [];
  }
  // 重新获取数据
  const data = await requestWithAuth("GET /repos/{owner}/{repo}/issues", {
    owner: OWNER,
    repo: REPO,
    per_page: 100,
    creator: OWNER,
  });
  console.log(data.data);

  data.data.forEach(
    ({
      id,
      body,
      body_html,
      labels,
      title,
      created_at,
      updated_at,
      comments,
      comments_url,
    }) => {
      globalThis.postList = uniqWith(
        [
          ...globalThis.postList,
          {
            contentHtml: body_html,
            content: body,
            labels,
            id,
            title,
            created_at,
            updated_at,
            comments,
            comments_url,
            description: body?.match(/^.*n?/)?.[0] ?? "暂无简介",
            cover:
              body?.match(/\!\[\]\(.*?\)/)?.[0] ??
              "![](https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c2VhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=700&q=60)",
          },
        ],
        (prev, cur) => prev.id === cur.id
      );
    }
  );
  if (data.data.length === 100) {
    // 可能存在下一页
    await getAllIssue(pageNum + 1);
  }
};
