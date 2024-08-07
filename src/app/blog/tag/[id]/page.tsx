import BlogContainer from "@/components/Blog/Container";
import { getCacheIssues, getCacheLabels } from "@/features/cache";
import { Metadata } from "next";

export async function generateStaticParams() {
  const labels = await getCacheLabels();
  return labels.map(({ id }) => ({
    id: id.toString(),
  }));
}

export const metadata: Metadata = {
  title: "Blog",
  description: "A blog about software development and other things",
  openGraph: {
    images: ["/coder4.svg"],
    type: "website",
    siteName: "Aaron Conlon's Blog",
    title: "Blog",
    url: process.env.DOMAIN!,
    description: "A blog about software development and other things",
  },
  twitter: {
    images: [
      {
        url: "https://pbs.twimg.com/semantic_core_img/1775195893546856453/f6CELbJn?format=jpg&name=360x360",
        alt: "Og Image Alt",
        width: 1200,
        height: 300,
      },
    ],
    card: "summary_large_image",
    site: "Aaron Conlon's Blog",
    title: "Blog",
    description: "A blog about software development and other things",
  },
};

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [issues, labels] = await Promise.all([
    getCacheIssues(),
    getCacheLabels(),
  ]);

  const currentLabelIssues = issues.filter((issue) =>
    issue.labels.some((label) => label.id.toString() === params.id)
  );
  const labelName =
    labels.find((label) => label.id.toString() === params.id)?.name ??
    "UNKNOWN";

  return <BlogContainer issues={currentLabelIssues} labelName={labelName} />;
}
