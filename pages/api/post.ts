// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OWNER, REPO } from "@/utils/consts";

import { getAllIssue } from "@/utils/github";
import { request } from "@octokit/request";

const requestWithAuth = request.defaults({
  headers: {
    authorization: `token ${process.env.TOKEN}`,
  },
});

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // 检查全局状态
  const date = new Date();
  if (globalThis.updateTime === undefined) {
    globalThis.updateTime = date;
  }
  // 上次获取数据是五分钟之前，则重新获取数据
  if (date.valueOf() - globalThis.updateTime.valueOf() >= -5 * 1000 * 60) {
    // 重新获取数据
    console.log("获取函数启动");

    await getAllIssue();
  }

  // console.log(globalThis.postList);

  res.status(200).json({ postList: globalThis.postList });
}
