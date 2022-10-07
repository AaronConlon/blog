// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OWNER, REPO } from "@/utils/consts";
import { getAllIssue, requestWithAuth } from "@/utils/github";

import { IGithubIssue } from "@/interfaces";
import { cycleTimeCheck } from "@/utils/cycleTimeCheck";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: IGithubIssue }>
) {
  const id = req.query?.id;
  if (
    id === undefined ||
    typeof id !== "string" ||
    /^\d+$/.test(id) === false
  ) {
    res.status(404).end();
  } else {
    const { data } = await requestWithAuth(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner: OWNER,
        repo: REPO,
        issue_number: +id,
      }
    );
    res.status(200).json({
      data,
    } as any);
  }
}
