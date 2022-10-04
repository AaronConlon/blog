// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { request } from "@octokit/request";

const requestWithAuth = request.defaults({
  headers: {
    authorization: "token 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",
  },
});

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await requestWithAuth("GET /user");
  console.log(data);

  res.status(200).json({ name: "John Doe" });
}
