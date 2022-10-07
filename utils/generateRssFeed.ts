import { Feed } from "feed";
import { IGithubIssue } from "@/interfaces";
import fs from "fs";
import { getAllIssue } from "./github";
import { marked } from "marked";

export default function generateRssFeed() {
  // 没一个小时更新一次
  try {
    const date = new Date();

    console.log(`${date.toLocaleTimeString()} - 开始创建RSS！`);

    const posts = globalThis.postList as IGithubIssue[];
    const siteURL = process.env.WEBSITE!;

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
      const url = `${siteURL}/blog/${post.id}`;
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
