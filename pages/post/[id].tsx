import { IGithubIssue, IRepoLabel } from "@/interfaces";
import { labelsAtom, userInfoAtom } from "@/store";

import { GetStaticProps } from "next";
import Head from "next/head";
import { IUserInfo } from "@/interfaces/userInfo";
import Markdown from "markdown-to-jsx";
import PreBlock from "@/components/PreBlock";
import clsx from "clsx";
import { getAllIssue } from "@/utils/github";
import { request } from "@/utils/request";
import styles from "@/styles/post.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";

interface IProps {
  labels: IRepoLabel[];
  info: IUserInfo;
  post: IGithubIssue;
}

function Article({ labels, info, post }: IProps) {
  const setLabelStore = useSetAtom(labelsAtom);
  const setUserInfoStore = useSetAtom(userInfoAtom);
  const { body, title, labels: _labels } = post;

  useEffect(() => {
    setLabelStore({ isShow: false, list: labels });
    setUserInfoStore(info);
  }, []);

  return (
    <>
      <h1 className="text-[36px] text-center py-24">{title}</h1>
      <div className="flex gap-4 justify-center items-center">
        {_labels.map(({ name }) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <Markdown
        className={clsx(styles.markdown, "pb-12")}
        options={{
          overrides: {
            pre: PreBlock,
          },
        }}
      >
        {body}
      </Markdown>
    </>
  );
}

export default Article;

// return props to current page component as props
export const getStaticProps: GetStaticProps = async (context) => {
  const {
    params: { id },
  } = context;

  const [labels, info, post] = await Promise.all([
    request.get("/api/label"),
    request.get("/api/about"),
    request.get("/api/post?id=" + id),
  ]);
  // 创建RSS文件
  return {
    props: {
      labels,
      info,
      post: post.data,
    },
  };
};

export async function getStaticPaths() {
  if (globalThis.postList === undefined) {
    await getAllIssue();
  }
  return {
    paths: globalThis.postList.map((i) => `/post/${i.number}`),
    fallback: "blocking",
  };
}
