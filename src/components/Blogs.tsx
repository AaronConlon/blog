import { getPublishedIssues } from "@/features/blog-data";

import { CONFIG } from "@/config";
import Link from "next/link";
import BlogItem from "./Blog/Item";
import RoughNotationText from "./RoughNotationText";

export default async function Blogs() {
  const issues = getPublishedIssues();
  return (
    <div className="flex flex-col gap-8 py-20 bg-gray-50">
      <div className="font-semibold text-2xl flex justify-center">
        <RoughNotationText id="blog">博客</RoughNotationText>
      </div>
      <p className="max-w-[760px] text-center mx-auto">
        工作和学习中遇到问题时，我会把一些经验记录下来，方便之后复盘。
        如果你感兴趣，也可以
        <Link target="_blank" href={CONFIG.rss} type="application/rss+xml">
          <RoughNotationText type="highlight" color="#fff176">
            订阅我的博客
          </RoughNotationText>
        </Link>
      </p>
      <div className="max-w-[1440px] mx-auto p-4 px-6 xl:px-12 2xl:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 relative">
        {issues.slice(0, 9).map((issue) => (
          <BlogItem key={issue.id} issue={issue} />
        ))}
      </div>
      <Link
        href={"/blog"}
        className="text-center text-primary/80 underline-offset-2 underline"
      >
        查看更多文章...
      </Link>
    </div>
  );
}
