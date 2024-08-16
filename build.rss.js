const fs = require("fs");
const { Feed } = require("feed");
const { marked } = require("marked");
const matter = require("gray-matter");
const domain = "https://i5lin.top";

let token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("GITHUB_TOKEN is required");
  process.exit(1);
}

const fetchIssues = async () => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const resp = await fetch(
    "https://api.github.com/repos/AaronConlon/blog/issues?per_page=100&state=open&owner=AaronConlon",
    { headers }
  );
  if (resp.ok) {
    return resp.json();
  }
};

const buildRss = (issues) => {
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
      }),
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
};

(async function main() {
  const issues = await fetchIssues();
  const rss = buildRss(issues);
  fs.writeFileSync("public/rss.xml", rss);
  console.log("BUILD RSS SUCCESS");
})();
