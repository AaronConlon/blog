import Editor from "@/components/Blog/Editor";
import { getAllIssues, getAllLabels } from "@/features/blog-data";
import { pick } from "lodash-es";

export const dynamic = "force-static";

export default function EditorPage() {
  const issues = getAllIssues();
  const labels = getAllLabels();

  return (
    <Editor
      issues={issues.map((i) =>
        pick(i, ["number", "title", "id", "updated_at", "body", "labels"])
      )}
      labels={labels}
    />
  );
}
