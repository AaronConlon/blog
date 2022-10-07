// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OWNER, REPO } from "@/utils/consts";
import { getAllIssue, requestWithAuth } from "@/utils/github";

import { cycleTimeCheck } from "@/utils/cycleTimeCheck";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const id = req.query.id;
  //
  const { data } = await requestWithAuth(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: OWNER,
      repo: REPO,
      issue_number: id,
    }
  );
  res.status(200).json({
    data,
  });
}
