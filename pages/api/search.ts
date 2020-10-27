import { NextApiRequest, NextApiResponse } from "next";
// eslint-disable-next-line import/extensions
import { getAllPostTitleAndSlug } from "../../help";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({
      info: "Method Not allowed.",
    });
  }
  // 根据query进行搜索
  if (req.query.keyword === undefined) {
    res.status(200).json({
      info: "Nothing search.",
    });
  }
  if (Object.keys(req.query).length > 1) {
    res.status(405).json({
      info: "Query params too long.Just support search keyword.",
    });
  }

  // logic
  const searchWord = req.query.keyword;
  const allPost = getAllPostTitleAndSlug().filter((post) => {
    const postPattern = new RegExp(searchWord, "i");
    return postPattern.test(post.title);
  });

  res.status(200).json({
    posts: allPost,
  });
};
