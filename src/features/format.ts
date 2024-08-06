import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import * as matter from "gray-matter";
import { marked, RendererObject } from "marked";

/**
 * 将 yaml markdown meta 解析为对象
 */
export function resolveIssueBody(markdown: string): {
  content: string;
  data: { [key: string]: any };
} {
  // @ts-ignore
  return matter(markdown);
}

export function markedBodyToHTML(body: string) {
  // Override function
  const renderer = {
    heading(text: string, depth: string) {
      const id = Buffer.from(text).toString("base64");
      return `<div style="height:${(6 - Number(depth)) / 2}em;width:100%"></div>
            <h${depth} class="flex items-center gap-1" id="${id}">
              ${text}
            </h${depth}><div style="height:${
        (6 - Number(depth)) / 2
      }em;width:100%"></div>`;
    },
  } as unknown as RendererObject;

  marked.use({ renderer });
  return marked.parse(body);
}

/**
 * 格式化时间 2021-01-01 => 2021年01月01日
 */
export function formatTime(time: string) {
  return format(new Date(time), "yyyy年MM月dd");
}

// 计算出相对于当前的时间
export function formatTimeFromNow(time: string) {
  const timestamp = new Date(time).valueOf();
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: zhCN });
}

// 从 markdown 中提取标题
export function extractHeadings(markdown: string) {
  const tokens = marked.lexer(markdown);
  const headings: {
    level: number;
    text: string;
    id: string;
  }[] = [];

  tokens.forEach((token, idx) => {
    if (token.type === "heading" && token.depth >= 1 && token.depth <= 6) {
      const escapedText = token.text.toLowerCase().replace(/[^\w]+/g, "-");
      const id = Buffer.from(escapedText).toString("base64") + idx;
      headings.push({
        level: token.depth - 1,
        text: token.text,
        id,
      });
    }
  });

  return headings;
}

// 合并 tailwindcss 的 class
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
