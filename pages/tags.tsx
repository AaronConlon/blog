import { tabAtom, userInfoAtom } from "@/store";

import { GetStaticProps } from "next";
import { IRepoLabel } from "@/interfaces";
import { IUserInfo } from "@/interfaces/userInfo";
import { request } from "@/utils/request";
import { useAtom } from "jotai";
import { useEffect } from "react";

interface IProps {
  info: IUserInfo;
  labels: IRepoLabel[];
  posts: any[];
}

function TagsPage({ labels, info, posts }: IProps) {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  useEffect(() => {
    setUserInfo(info);
    console.log("渲染标签页22222", posts);
  }, []);

  return (
    <div className="flex gap-8">
      {/* 所有标签 */}
      <ul className="mr-auto">
        {labels && labels.map((i) => <li key={i.id}>{i.name}</li>)}
      </ul>
      {/* 所有文章 */}
    </div>
  );
}

export default TagsPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const [labels, info, posts] = await Promise.all([
    request.get("/api/label"),
    request.get("/api/about"),
    request.get("/api/post"),
  ]);
  return {
    props: {
      labels,
      info,
      posts,
    },
  };
};
