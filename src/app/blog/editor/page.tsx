import Editor from "@/components/Blog/Editor";
import { getCacheIssues, getCacheLabels } from "@/features/cache";
import { pick } from "lodash-es";

export default async function EditorPage() {
  const [issues, labels] = await Promise.all([
    getCacheIssues(),
    getCacheLabels(),
  ]);

  return (
    <Editor
      issues={issues.map((i) =>
        pick(i, ["number", "title", "id", "updated_at", "body", "labels"])
      )}
      labels={labels}
    />
  );
}
