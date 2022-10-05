import type { NextApiRequest, NextApiResponse } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { github } from "@/utils/github";
import { request } from "@octokit/request";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const data = await github("GET /user");
  const data = await request.defaults({
    headers: {
      authorization: `token ${process.env.TOKEN}`,
    },
  })("GET /user");
  res.status(200).json(data.data);
}
