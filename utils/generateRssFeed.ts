import { Feed } from "feed";
import { IGithubIssue } from "@/interfaces";
import fs from "fs";
import { getAllIssue } from "./github";
import { marked } from "marked";

export default function generateRssFeed(_posts?: IGithubIssue[]) {
  // 每次获取所有文章的时候都重新生成
  try {
    const date = new Date();
    const siteURL = process.env.WEBSITE ?? "https://blog-dev27149.vercel.app";
    console.log(`${date.toLocaleTimeString()} - 开始创建RSS！`);

    const posts = _posts ?? (globalThis.postList as IGithubIssue[]);
    // RSS 来源于全部文章接口被请求
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
      const url = `/post/${post.id}`;
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

    // write to public
    fs.mkdirSync("./public/rss", { recursive: true });
    fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
    fs.writeFileSync("./public/rss/feed.json", feed.json1());
  } catch (error) {
    console.log("创建RSS失败：", error);
  } finally {
    console.log(`${new Date().toLocaleTimeString()} - RSS任务结束`);
  }
}
