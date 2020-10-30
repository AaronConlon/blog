/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import highlight from "remark-highlight.js";

const postsDirectory = path.join(process.cwd(), "posts");

// eslint-disable-next-line import/prefer-default-export
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({
      params: {
        slug: encodeURI(fileName.replace(/\.md$/, "")),
      },
    }));
}

const addHighlight = (htmlStr: string) =>
  htmlStr
    .replace(/<pre><code[^]+?\/pre>/g, (match: string): string => {
      // 匹配到代码块,返回新的代码块来替换旧的匹配到的代码块
      // match 就是所有代码块
      // 思维有点乱,这里为每一个代码块加一个空行结尾,以填充正则表达式所需的条件,实现末尾空行计数
      let element = `${match} \n`;

      // 默认从1开始,这里设置为0,匹配到一行后续自加1
      let lineNumber = 0;

      // 中间发现Markdown文本中代码空行没有被正则表达式匹配到,提前增加空白符修复问题
      element = element.replace(/\n\n/g, "\n \n");
      // 为每一行做匹配,并且替换当前行的内容
      // 正则表达式匹配每一行,并且对每一行进行替换
      return element.replace(/[^]*?\n/g, (matchStr) => {
        lineNumber += 1;
        // 如果是代码块的第一行,Markdown解析之后没有添加换行符,因此我对这行进行针对性的匹配和替换
        if (matchStr.startsWith("<pre")) {
          // 关键代码块HTML内容是: <pre><code class="hljs language-xxx">,因此在这个位置后面加一个行数块
          return matchStr.replace(
            /(?<=">)/,
            `<span class="lineNumber">${lineNumber}</span>`
          );
        }
        return `<span class="lineNumber">${lineNumber}</span>${matchStr}`;
      });
    })
    .replace(
      /(<li class="task-list-item"><input)/g,
      '<li class="task-list-item" style="list-style: none"><input'
    );

export async function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContent);
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(highlight)
    .process(matterResult.content);
  const contentHtml = addHighlight(processedContent.toString());
  return {
    slug,
    contentHtml,
    ...(matterResult.data as {
      date: string;
      title: string;
      tags: string[];
      coverImg: string;
      mainImg: string;
      author?: {
        name?: string;
      };
    }),
  };
}
