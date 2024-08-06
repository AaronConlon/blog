import BlogContainer from "@/components/Blog/Container";
import { getCacheIssues } from "@/features/cache";

export default async function BlogsPage() {
  const issues = await getCacheIssues();
  return <BlogContainer issues={issues} />;
}
