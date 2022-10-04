import type { NextApiRequest, NextApiResponse } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { github } from "@/utils/github";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await github("GET /user");
  res.status(200).json(data);
}
