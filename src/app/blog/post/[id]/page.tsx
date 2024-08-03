import ContentNavigate from "@/components/Blog/ContentNavigate";
import BlogLayout from "@/components/Blog/Layout";
import MetaInfo from "@/components/Blog/MetaInfo";
import { CONFIG } from "@/config";
import { getIssueByIssueNumber } from "@/features/api";
import { getCacheIssues } from "@/features/cache";
import {
  extractHeadings,
  markedBodyToHTML,
  resolveIssueBody,
} from "@/features/format";
import { Link2 } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;
  const issues = await getCacheIssues();
  const issue = issues.find((issue) => issue.id.toString() === id)!;

  return {
    title: `${issue.title} - ${issue.labels.map((i) => i.name).join("-")} - ${
      CONFIG.author.name
    }'s Blog`,
    openGraph: {
      images: ["/coder3.svg"],
    },
  };
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const issues = await getCacheIssues();
  const currentIssue = issues.find(
    (issue) => issue.id.toString() === params.id
  )!;

  const issueDetail = await getIssueByIssueNumber(currentIssue.number);
  console.log("issue:", issueDetail);
  console.log("issue update time:", issueDetail.updated_at);
  const { content } = resolveIssueBody(issueDetail.body ?? "");

  const tableOfContents = extractHeadings(content);

  console.log(tableOfContents);

  return (
    <BlogLayout>
      <div
        className="w-full mx-auto max-w-[1140px] 2xl:max-w-[1440px] grid grid-cols-1 xl:grid-cols-[auto_280px] md:gap-8 p-2 sm:p-4"
        id="blog-container"
      >
        {/* current blog content */}
        <div className="pt-12 mt-16 max-w-[860px] mx-auto px-[48px]">
          <h1 className="blog-title text-primary section-leading text-3xl font-semibold mb-8 text-center mx-auto max-w-[760px] flex justify-center items-center gap-4">
            {currentIssue.title}
            {process.env.DEV && (
              <Link href={issueDetail.url} target="_blank">
                <Link2 size={24} />
              </Link>
            )}
          </h1>
          <MetaInfo issue={currentIssue} />
          <section
            className="text-sm pt-2 px-2 md:px-6 xl:px-8 mb-16 markdown-body"
            dangerouslySetInnerHTML={{
              __html: markedBodyToHTML(content),
            }}
          ></section>
        </div>

        {/* right side: table of content */}
        <aside className="hidden xl:block relative">
          <ContentNavigate items={tableOfContents} />
        </aside>
      </div>
    </BlogLayout>
  );
}
