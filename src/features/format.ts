import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import * as matter from "gray-matter";
import { marked, RendererObject } from "marked";

type SemanticCalloutStyle = {
  emoji: string;
  color: string;
  background: string;
  text: string;
};

const semanticCalloutStyles: Record<string, SemanticCalloutStyle> = {
  laugh: { emoji: "😄", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  happy: { emoji: "🙂", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  angry: { emoji: "😠", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  scared: { emoji: "😨", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  sad: { emoji: "😔", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  cry: { emoji: "😢", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  surprise: { emoji: "😮", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  info: { emoji: "i", color: "#5d6ee8", background: "#fff", text: "#24211d" },
  think: { emoji: "💭", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  tip: { emoji: "💡", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  warning: { emoji: "⚠️", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  error: { emoji: "⛔", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  quote: { emoji: "❝", color: "#c58b4a", background: "#f8eadb", text: "#25201b" },
  wow: { emoji: "❞", color: "#c58b4a", background: "#fffaf2", text: "#25201b" },
};

const semanticCalloutAliases: Record<string, string> = {
  开心: "happy",
  高兴: "happy",
  笑: "laugh",
  大笑: "laugh",
  生气: "angry",
  愤怒: "angry",
  害怕: "scared",
  恐惧: "scared",
  难过: "sad",
  悲伤: "sad",
  哭: "cry",
  惊讶: "surprise",
  震惊: "surprise",
  信息: "info",
  提示: "info",
  警告: "warning",
  错误: "error",
  金句: "wow",
};

const normalizeSemanticCalloutKind = (kind: string) => {
  const raw = kind.trim();
  return (
    semanticCalloutAliases[raw] ??
    raw.toLowerCase().replace(/[^\p{L}\p{N}_-]/gu, "")
  );
};

const escapeHTML = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeAttribute = (value: string) =>
  escapeHTML(value).replaceAll('"', "&quot;");

const renderSemanticCalloutBody = (body: string) => {
  const normalized = body.replaceAll("\r\n", "\n").replaceAll("\r", "\n").trim();
  if (!normalized) {
    return "<p>&nbsp;</p>";
  }

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((line) => String(marked.parseInline(line.trim())))
        .filter(Boolean);
      return lines.length > 0 ? `<p>${lines.join("<br>")}</p>` : "";
    })
    .filter(Boolean)
    .join("");
};

const renderSemanticCalloutHTML = (rawKind: string, body: string) => {
  const kind = normalizeSemanticCalloutKind(rawKind) || "note";
  const style = semanticCalloutStyles[kind] ?? {
    emoji: "✦",
    color: "#c58b4a",
    background: "#f8eadb",
    text: "#25201b",
  };

  if (kind === "wow") {
    return [
      '<section class="semantic-callout semantic-callout-wow" data-callout-kind="wow">',
      '<span class="semantic-callout-comma" aria-hidden="true">',
      '<svg viewBox="0 0 56 56" focusable="false"><path d="M22 10c-8 5-12 13-12 24 0 8 5 12 11 12 6 0 10-4 10-10 0-5-3-9-8-10 1-5 4-9 9-13L22 10Zm24 0c-8 5-12 13-12 24 0 8 5 12 11 12 6 0 10-4 10-10 0-5-3-9-8-10 1-5 4-9 9-13L46 10Z"/></svg>',
      "</span>",
      `<section class="semantic-callout-body">${renderSemanticCalloutBody(body)}</section>`,
      "</section>",
    ].join("");
  }

  return [
    `<section class="semantic-callout semantic-callout-${escapeAttribute(kind)}" data-callout-kind="${escapeAttribute(kind)}">`,
    `<span class="semantic-callout-emoji" aria-hidden="true">${style.emoji}</span>`,
    `<section class="semantic-callout-body">${renderSemanticCalloutBody(body)}</section>`,
    "</section>",
  ].join("");
};

/** 将 wx-public-agent 使用的 ::: 自定义块转换为 marked 能识别的 HTML。 */
const transformSemanticCallouts = (markdown: string) => {
  const lines = markdown.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const inlineMatch = line.match(
      /^:::\s*([\p{L}][\p{L}\p{N}_-]*)(?:\s+([\s\S]*?))?\s+:::\s*$/u,
    );
    if (inlineMatch) {
      output.push(renderSemanticCalloutHTML(inlineMatch[1], inlineMatch[2] ?? ""));
      continue;
    }

    const blockMatch = line.match(
      /^:::\s*([\p{L}][\p{L}\p{N}_-]*)(?:\s+(.*))?\s*$/u,
    );
    if (!blockMatch) {
      output.push(line);
      continue;
    }

    const bodyLines: string[] = [];
    if (blockMatch[2]) {
      bodyLines.push(blockMatch[2]);
    }

    let closed = false;
    for (index += 1; index < lines.length; index += 1) {
      if (/^:::\s*$/.test(lines[index])) {
        closed = true;
        break;
      }
      bodyLines.push(lines[index]);
    }

    if (!closed) {
      output.push(line, ...bodyLines);
      break;
    }
    output.push(renderSemanticCalloutHTML(blockMatch[1], bodyLines.join("\n")));
  }

  return output.join("\n\n");
};

const normalizeCodeLanguageValue = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9_+.#-]/g, "");

const codeLanguageMarkerPattern =
  /^\s*--\s*language:\s*([A-Za-z0-9_+.#-]+)\s*--\s*$/;
const codeFencePattern = /^(\s{0,3})(`{3,}|~{3,})(.*)$/;

/** 将独立的 -- language: xx -- 标记合并到后面的代码围栏。 */
const applyCodeLanguageMarkers = (markdown: string) => {
  const lines = markdown.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const output: string[] = [];
  let activeFence = "";
  let pendingLanguage = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(codeFencePattern);

    if (activeFence) {
      output.push(line);
      if (fenceMatch?.[2]?.startsWith(activeFence)) {
        activeFence = "";
      }
      continue;
    }

    const languageMarker = line.match(codeLanguageMarkerPattern);
    if (languageMarker) {
      pendingLanguage = normalizeCodeLanguageValue(languageMarker[1]);
      continue;
    }

    if (fenceMatch) {
      if (pendingLanguage) {
        const info = fenceMatch[3].trim();
        const extraInfo = info ? info.split(/\s+/).slice(1).join(" ") : "";
        output.push(
          `${fenceMatch[1]}${fenceMatch[2]}${pendingLanguage}${extraInfo ? ` ${extraInfo}` : ""}`,
        );
        pendingLanguage = "";
      } else {
        output.push(line);
      }
      activeFence = fenceMatch[2][0];
      continue;
    }

    output.push(line);
  }

  return output.join("\n");
};

/**
 * 将 yaml markdown meta 解析为对象
 */
export function resolveIssueBody(markdown: string): {
  content: string;
  data: { [key: string]: any };
} {
  try {
    // @ts-ignore
    return matter(markdown);
  } catch {
    return {
      content: markdown,
      data: {},
    };
  }
}

export function markedBodyToHTML(body: string) {
  const preparedBody = applyCodeLanguageMarkers(transformSemanticCallouts(body));
  const renderer = {
    heading(token: {
      depth: number;
      text?: string;
      tokens?: unknown[];
    }) {
      const text = token.text ?? "";
      const depth = Number(token.depth ?? 1);
      const id = Buffer.from(text).toString("base64");
      return `<div style="height:${(6 - depth) / 2}em;width:100%"></div>
            <h${depth} class="flex items-center gap-1" id="${escapeAttribute(id)}">
              ${text}
            </h${depth}><div style="height:${(6 - depth) / 2}em;width:100%"></div>`;
    },
    code(token: { text: string; lang?: string }) {
      const language = normalizeCodeLanguageValue(token.lang ?? "");
      const className = language ? ` class="language-${escapeAttribute(language)}"` : "";
      return `<pre><code${className}>${escapeHTML(token.text)}</code></pre>`;
    },
  } as unknown as RendererObject;

  marked.use({ renderer });
  return marked.parse(preparedBody) as string;
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
