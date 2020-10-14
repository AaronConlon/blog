export interface postProps {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
  ogImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  coverImg: string;
  intro: string;
}
