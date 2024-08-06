import { getCacheIssues } from "@/features/cache";

import Link from "next/link";
import BlogItem from "./Blog/Item";

export default async function Blogs() {
  const issues = await getCacheIssues();
  return (
    <div className="flex flex-col gap-8 py-20 bg-gray-50">
      <div className="font-semibold text-2xl flex justify-center">
        <span className="section-heading" id="blog">
          Blog
        </span>
      </div>
      <p className="max-w-[760px] text-center mx-auto">
        When I encounter some problems at work and study, I sometimes record
        them so that I can review them later. If you are interested, you can
        also{" "}
        <span
          className="section-heading"
          data-type="highlight"
          data-color="#fff176"
        >
          subscribe to my blog
        </span>
        .
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
        Read more post...
      </Link>
    </div>
  );
}
