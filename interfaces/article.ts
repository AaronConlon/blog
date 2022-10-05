import { IUserInfo } from "./userInfo";

export interface ICoverImg {
  mainImg: string;
  coverImg: string;
}

export interface IArticle extends ICoverImg {
  title: string;
  content: string;
  wordCount: number;
  intro: string;
  tags: string[];
  isTranslate: boolean;
  date: string;
}

export interface IDirRecord {
  dirName: string;
  articleList: IArticle[];
  children: IDirRecord[];
}

export interface ITagRecord {
  [k: string]: IUserInfo[];
}
