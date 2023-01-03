// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Feed } from "feed";
import { IGithubIssue } from "@/interfaces";
import { cycleTimeCheck } from "@/utils/cycleTimeCheck";
import fs from "fs";
import { getAllIssue } from "@/utils/github";
import { info } from "@/utils/debug";
import { marked } from "marked";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const date = new Date();
    await getAllIssue();
    const siteURL = process.env.WEBSITE ?? "https://blog-dev27149.vercel.app";
    const posts = globalThis.postList as IGithubIssue[];
    if (posts === undefined) throw Error("暂无数据");
    const author = {
      name: "妙才",
      email: "rivenqinyy@gmail.com",
      link: "https://twitter.com/miaocai0",
    };

    const feed = new Feed({
      title: "妙才Dev",
      description: "web developer blog.",
      id: siteURL,
      link: siteURL,
      image: `${siteURL}/code.png`,
      favicon: `${siteURL}/code.png`,
      copyright: `All rights reserved ${date.getFullYear()}, 妙才`,
      updated: date,
      generator: "Feed for Node.js",
      feedLinks: {
        rss2: `${siteURL}/rss/feed.xml`, // xml format
        json: `${siteURL}/rss/feed.json`, // json fromat
      },
      author,
    });

    posts.forEach((post) => {
      const url = `${siteURL}/post/${post.id}`;
      feed.addItem({
        title: post.title,
        id: url,
        link: url,
        description: post.description,
        content: marked.parse(post.content),
        author: [author],
        contributor: [author],
        date: new Date(post.updated_at),
      });
    });
    res
      .setHeader("Content-Type", "text/xml")
      .setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
      )
      .status(200)
      .send(feed.rss2());

    // vercel 无法写入文件，暂时不打算单独租服务器运行
    // // write to public
    // fs.mkdirSync("./public/rss", { recursive: true });
    // fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
    // fs.writeFileSync("./public/rss/feed.json", feed.json1());
  } catch (error) {
    info("创建RSS失败：", error);
    res.status(500).end();
  } finally {
    info(`${new Date().toLocaleTimeString()} - RSS任务结束`);
  }
}
