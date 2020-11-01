import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line import/extensions
// import { getAllPostTitleAndSlug } from "../../help";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    data: "ok",
  });
};
