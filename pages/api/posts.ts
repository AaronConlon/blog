// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { IGithubIssue } from "@/interfaces";
import { cycleTimeCheck } from "@/utils/cycleTimeCheck";
import { getAllIssue } from "@/utils/github";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ postList: IGithubIssue[] }>
) {
  //
  const label = req.query?.label;
  console.log("访问posts");

  await cycleTimeCheck(getAllIssue);

  res.status(200).json({
    postList:
      label === undefined
        ? globalThis.postList
        : globalThis.postList.filter((i: IGithubIssue) =>
            i.labels.some((_label) => _label.name === label)
          ),
  });
}
