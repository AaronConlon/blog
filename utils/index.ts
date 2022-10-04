import * as matter from "gray-matter";

import path, { basename, dirname, join } from "path";

import { IDirRecord } from "@/interfaces/article";
import fs from "fs/promises";

function createRecord(dirName: string): IDirRecord {
  return {
    dirName,
    articleList: [],
    children: [],
  };
}

/**
 * 描述:获取所有文章数据
 * @date 2022-09-03
 * @returns {Array}
 */
export const getArticleList = async () => {};

/**
 * 描述:扫描目标
 * @date 2022-09-03
 * @param {any} dir:string
 * @returns {any}
 */
export const scanArticleDir = async (dirName: string) => {
  // console.log("scan dir:", dirName);

  const record = createRecord(basename(dirName));
  const dirInfo = await fs.readdir(dirName);
  await Promise.all(
    dirInfo.slice(0, 12).map(async (item) => {
      const stat = await fs.lstat(join(dirName, item));
      // read file
      if (stat.isFile() && item.endsWith(".md")) {
        const rawContent = await fs.readFile(join(dirName, item), "utf-8");
        // console.log(rawContent);

        const { data, content } = matter(rawContent);

        record.articleList.push({ ...data, wordCount: content.length });
        record.articleList.sort(
          (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
        );
      }
      if (stat.isDirectory() && item.endsWith("_") && item.startsWith("_")) {
        record.children.push(await scanArticleDir(join(dirName, item)));
      }
    })
  );
  // console.log("record:");
  // console.log(record);

  return record;
};
