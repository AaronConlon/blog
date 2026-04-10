import BlogContainer from "@/components/Blog/Container";
import { getPublishedIssues } from "@/features/blog-data";

export const dynamic = "force-static";

export default function BlogsPage() {
  const issues = getPublishedIssues();
  return <BlogContainer issues={issues} />;
}
