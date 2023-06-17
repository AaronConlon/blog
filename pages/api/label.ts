import type { NextApiRequest, NextApiResponse } from "next";

import { IRepoLabel } from "@/interfaces";
import { info } from "@/utils/debug";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requestWithAuth } from "@/utils/github";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IRepoLabel[]>
) {
  const { data } = await requestWithAuth("GET /repos/{owner}/{repo}/labels", {
    owner: "Developer27149",
    repo: "blog",
  });
  info("labels data:", data);

  res.status(200).json(
    data
      ?.filter((i) => i.description === "标签")
      .sort((a) => {
        if (a.name === "Weekly") {
          return -1;
        }
        return 0;
      }) as any
  );
}
