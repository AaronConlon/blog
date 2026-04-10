import snapshot from "@/generated/blog-data.json";
import { TIssue, TLabel, TRepo } from "./types";

type BlogSnapshot = {
  generatedAt: string;
  issues: TIssue[];
  labels: TLabel[];
  repos: TRepo[];
};

const blogSnapshot = snapshot as BlogSnapshot;

export function getBlogSnapshot() {
  return blogSnapshot;
}

export function isPublishedBlogIssue(issue: TIssue) {
  return (
    issue.author_association === "OWNER" &&
    issue.state === "open" &&
    Boolean(issue.body?.trim())
  );
}

function sortIssues(issues: TIssue[]) {
  return [...issues].sort(
    (left, right) =>
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
  );
}

export function getAllIssues() {
  return sortIssues(blogSnapshot.issues);
}

export function getPublishedIssues() {
  return sortIssues(blogSnapshot.issues.filter(isPublishedBlogIssue));
}

export function getPublishedIssueById(id: string) {
  return getPublishedIssues().find((issue) => issue.id.toString() === id);
}

export function getAllLabels() {
  return [...blogSnapshot.labels].sort((left, right) =>
    left.name.localeCompare(right.name)
  );
}

export function getNavigableLabels() {
  const labelIds = new Set(
    getPublishedIssues().flatMap((issue) => issue.labels.map((label) => label.id))
  );

  return getAllLabels().filter((label) => labelIds.has(label.id));
}

export function getPublishedIssuesByLabelId(labelId: string) {
  return getPublishedIssues().filter((issue) =>
    issue.labels.some((label) => label.id.toString() === labelId)
  );
}

export function getLabelById(labelId: string) {
  return getAllLabels().find((label) => label.id.toString() === labelId);
}

export function getRepos() {
  return [...blogSnapshot.repos];
}
