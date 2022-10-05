export interface IGithubRepo {
  id: number;
}

export interface IGithubIssue {
  id: number;
  title: string;
  labels: IRepoLabel[];
  contentHtml: string;
  content: string;
  created_at: string;
  updated_at: string;
  description: string;
  comments: number;
  comments_url: string;
}

export interface IRepoLabel {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: false;
  description: string;
  cover: string;
}

export enum ESort {
  updated_at = "日期",
  comments = "热度",
}
