import { getCacheIssues, getCacheLabels } from "@/features/cache";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap[]> {
  const [issues, labels] = await Promise.all([
    getCacheIssues(),
    getCacheLabels(),
  ]);
  const domain = process.env.DOMAIN!;
  const issueItems: any = issues.map((issue) => ({
    url: `${domain}/issues/${issue.id}`,
    lastModified: issue.updated_at,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const tagItems = labels.map((label) => ({
    url: `${domain}/tag/${label.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...issueItems,
    ...tagItems,
  ];
}
