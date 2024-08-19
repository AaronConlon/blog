import BlogRecommend from "@/components/Blog/BlogRecommend";
import ContentNavigate from "@/components/Blog/ContentNavigate";
import BlogLayout from "@/components/Blog/Layout";
import MetaInfo from "@/components/Blog/MetaInfo";
import { CONFIG } from "@/config";
import { getCacheIssues } from "@/features/cache";
import { markedBodyToHTML, resolveIssueBody } from "@/features/format";
import { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = params.id;
  const issues = await getCacheIssues();
  const issue = issues.find((issue) => issue.id.toString() === id)!;
  const { data } = resolveIssueBody(issue.body ?? "");

  return {
    title: `${issue.title} - ${issue.labels.map((i) => i.name).join("-")} - ${
      CONFIG.author.name
    }'s Blog`,
    openGraph: {
      images: [data?.cover ?? CONFIG.og.imageUrl ?? "/coder3.svg"],
      type: "article",
      siteName: `${CONFIG.author.name}'s Blog`,
      title: `${issue.title} - ${CONFIG.author.name}'s Blog`,
      url: `${process.env.DOMAIN!}/blog/${issue.id}`,
      description:
        data?.description ??
        `${issue.title} - ${issue.labels.map((i) => i.name).join("-")} - ${
          CONFIG.author.name
        }'s Blog`,
    },
    twitter: {
      images: [
        {
          url: data?.cover ?? CONFIG.og.imageUrl ?? "/coder3.svg",
          alt: "Og Image Alt",
          width: 360,
          height: 360,
        },
      ],
      card: "summary_large_image",
      site: `${CONFIG.author.name}'s Blog`,
      title: `${issue.title} - ${CONFIG.author.name}'s Blog`,
      description:
        data?.description ??
        `${issue.title} - ${issue.labels.map((i) => i.name).join("-")} - ${
          CONFIG.author.name
        }'s Blog`,
    },
    metadataBase: new URL(process.env.DOMAIN!),
  };
}

// SSG for static params, control the static page generation
export async function generateStaticParams() {
  const issues = await getCacheIssues();
  return issues
    .filter((issue) => issue.body?.trim().length && issue.state === "open")
    .map(({ id }) => ({
      id: id.toString(),
    }));
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const issues = await getCacheIssues();
  const issue = issues.find((i) => i.id.toString() === params.id)!;
  const { content } = resolveIssueBody(issue.body ?? "");

  return (
    <BlogLayout>
      <div
        className="w-full mx-auto max-w-[1140px] 2xl:max-w-[1440px] grid grid-cols-1 xl:grid-cols-[auto_280px] md:gap-8 p-2 sm:p-4"
        id="blog-container"
      >
        {/* current blog content */}
        <div className="pt-12 sm:mt-16 max-w-[860px] mx-auto sm:px-[48px] animate-fade-up delay-500 w-full">
          <h1 className="blog-title text-primary section-leading text-xl xl:text-3xl font-semibold mb-8 text-center mx-auto max-w-[760px] flex justify-center items-center gap-4">
            {issue.title}
          </h1>
          <MetaInfo issue={issue} />
          <section
            className="text-sm pt-2 px-2 md:px-6 xl:px-8 mb-16 markdown-body"
            dangerouslySetInnerHTML={{
              __html: markedBodyToHTML(content),
            }}
          ></section>
        </div>

        {/* right side: table of content */}
        <aside className="hidden xl:block relative">
          <ContentNavigate />
        </aside>
        <div className="giscus w-full max-w-[760px] mx-auto p-4 my-4 min-h-[400px]"></div>
        <BlogRecommend issues={issues} currentIssue={issue} />
      </div>
    </BlogLayout>
  );
}
