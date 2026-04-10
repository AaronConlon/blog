import { getNavigableLabels, getPublishedIssues } from "@/features/blog-data";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const issues = getPublishedIssues();
  const labels = getNavigableLabels();
  const domain = process.env.DOMAIN!;
  const issueItems: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: `${domain}/blog/post/${issue.id}`,
    lastModified: issue.updated_at,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const tagItems: MetadataRoute.Sitemap = labels.map((label) => ({
    url: `${domain}/blog/tag/${label.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...issueItems,
    ...tagItems,
  ];
}
