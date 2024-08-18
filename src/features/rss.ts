import { Feed } from "feed";
import matter from "gray-matter";
import { marked } from "marked";
import fs from "node:fs";
import { getCacheIssues } from "./cache";
import { TIssue } from "./types";

const domain = "https://i5lin.top";

const buildRss = (issues: TIssue[]) => {
  const feed = new Feed({
    title: `AaronConlon's Blog`, // Feed 的标题
    description: `AaronConlon's Blog`, // Feed 的标题`,
    id: domain,
    link: domain,
    language: "zhCN", // 语言
    image: `${domain}/coder3.svg`, // Feed 的图像
    favicon: `${domain}/favicon.ico`, // Feed 的 favicon
    copyright: "All rights reserved 2024, Blog", // 版权信息
    updated: new Date(), // Feed 的更新时间
    generator: "Feed for Node.js", // 生成器信息
    feedLinks: {
      rss: `${domain}/rss`, // RSS 2.0 feed 链接
    },
    author: {
      name: "Aaron Conlon",
      email: "rivenqinyy@gmail.com",
      link: domain,
    },
  });

  issues.forEach((issue) => {
    const { data, content } = matter(issue.body);
    feed.addItem({
      title: issue.title,
      id: issue.id.toString(),
      link: `${domain}/blog/post/${issue.id}`,
      description: data?.description || content.slice(0, 200),
      content: marked(content, {
        async: false,
      }) as string,
      author: [
        {
          name: issue.user.login,
          link: issue.user.html_url,
        },
      ],
      date: new Date(issue.created_at),
    });
  });
  fs.writeFileSync("./public/rss.xml", feed.rss2(), {
    mode: "w",
  });
};

export const buildRssFile = async () => {
  if (process.env?.DEV === "true") {
    return;
  }
  const issues = await getCacheIssues();
  buildRss(issues);
};
