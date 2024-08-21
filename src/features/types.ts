export type TIssue = {
  title: string;
  html_url: string;
  created_at: string;
  labels: TLabel[];
  id: number;
  number: number;
  updated_at: string;
  body: string;
  author_association: string;
  url: string;
  reactions: {
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  user: {
    login: string;
    html_url: string;
  };
  state: "open" | "closed" | (string & {});
};

export type TRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  owner: { avatar_url: string };
  topics: string[];
  language: string;
  open_issues_count: number;
};

export type TLabel = {
  id: number;
  name: string;
  description: string;
  color: string;
  url: string;
};

export interface ITableContent {
  text: string;
  id: string;
  level: number;
}

export interface LabelOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export interface ILocalIssue {
  title: string;
  description: string;
  labels: TLabel[];
  cover: string;
  body: string;
  number: number;
  updated_at: string;
  id: string;
}

export interface IUserInfo {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company?: any;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  notification_email: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}