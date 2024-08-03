import { isBefore, parseISO, subYears } from "date-fns";

/**
 * 通过一个十六进制的rgb字符串，返回其互补色
 */
export function getComplementaryColor(color: string): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `#${(0xffffff - (r << 16) - (g << 8) - b).toString(16)}`;
}

/**
 * 判断一个 issue 是否是太旧的，即创建时间超过一年
 * @param created_at date string
 * @returns
 */
export function isTooOldIssueCreatedAt(created_at: string): boolean {
  // 解析日期
  const issueDate = parseISO(created_at);
  // 计算当前日期的一年前的日期
  const oneYearAgo = subYears(new Date(), 1);
  // 比较解析后的日期和一年前的日期
  return isBefore(issueDate, oneYearAgo);
}
