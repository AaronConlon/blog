import type { NextApiRequest, NextApiResponse } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { request } from "@octokit/request";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { data = {} } = await request.defaults({
    headers: {
      authorization: `token ${process.env.TOKEN}`,
    },
  })("GET /user");
  res.status(200).json(data);
}
