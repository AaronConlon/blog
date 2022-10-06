// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { cycleTimeCheck } from "@/utils/cycleTimeCheck";
import { getAllIssue } from "@/utils/github";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //
  await cycleTimeCheck(getAllIssue);

  res.status(200).json({ postList: globalThis.postList });
}
