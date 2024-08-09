import { TIssue } from "@/features/types";
import { shuffle } from "lodash-es";
import BlogItem from "./Item";

interface BlogRecommendProps {
  issues: TIssue[];
  currentIssue: TIssue;
}
export default function BlogRecommend({
  issues,
  currentIssue,
}: BlogRecommendProps) {
  const recommendIssues = shuffle(
    issues.filter(
      (issue) =>
        issue.id !== currentIssue.id &&
        issue.labels.some((label) =>
          currentIssue.labels.some(
            (currentLabel) => currentLabel.name === label.name
          )
        )
    )
  ).slice(0, 2);

  if (recommendIssues.length === 0) return null;

  return (
    <div className="px-4 mt-8 mx-auto">
      <section className="text-primary font-semibold text-xl  sm:text-2xl mb-4">
        文章推荐
      </section>
      <div className="flex xl:flex-col gap-4">
        {recommendIssues.map((issue) => (
          <BlogItem key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
