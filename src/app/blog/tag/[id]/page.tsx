import BlogContainer from "@/components/Blog/Container";
import { getCacheIssues, getCacheLabels } from "@/features/cache";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const issues = await getCacheIssues();
  const labels = await getCacheLabels();

  const currentLabelIssues = issues.filter((issue) =>
    issue.labels.some((label) => label.id.toString() === params.id)
  );
  const labelName =
    labels.find((label) => label.id.toString() === params.id)?.name ??
    "UNKNOWN";
  return <BlogContainer issues={currentLabelIssues} labelName={labelName} />;
}
