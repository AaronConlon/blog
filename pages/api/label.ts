import type { NextApiRequest, NextApiResponse } from "next";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { github, requestWithAuth } from "@/utils/github";

import { request } from "@octokit/request";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const data = await github("GET /user");

  const data = await requestWithAuth("GET /repos/{owner}/{repo}/labels", {
    owner: "Developer27149",
    repo: "blog",
  });
  // console.log(
  //   "all tags:",
  //   data.data?.filter((i) => i.description === "标签")
  // );

  res.status(200).json(data.data?.filter((i) => i.description === "标签"));
}
