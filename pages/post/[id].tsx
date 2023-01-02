import { IGithubIssue, IRepoLabel } from "@/interfaces";
import { labelsAtom, userInfoAtom } from "@/store";
import { useEffect, useState } from "react";

import { GetStaticProps } from "next";
import Head from "next/head";
import { IUserInfo } from "@/interfaces/userInfo";
import Label from "@/components/Label";
import Markdown from "markdown-to-jsx";
import PreBlock from "@/components/PreBlock";
import clsx from "clsx";
import { getAllIssue } from "@/utils/github";
import { request } from "@/utils/request";
import styles from "@/styles/post.module.scss";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";

interface IProps {
  labels: IRepoLabel[];
  info: IUserInfo;
  post: IGithubIssue;
}

function Article({ labels, info, post }: IProps) {
  const setLabelStore = useSetAtom(labelsAtom);
  // @ts-ignore
  const setUserInfoStore = useSetAtom(userInfoAtom);
  const { body, title, labels: _labels } = post;
  const [tagList, setTagList] = useState<HTMLHeadingElement[]>([]);

  useEffect(() => {
    setLabelStore({ isShow: false, list: labels });
    setUserInfoStore(info);
  }, [info, labels, setLabelStore, setUserInfoStore]);

  useEffect(() => {
    // 获取文章的目录
    const _h2 = document
      .querySelector(".post_markdown__cw0np")
      ?.querySelectorAll("h2");
    const _h3 = document
      .querySelector(".post_markdown__cw0np")
      ?.querySelectorAll("h3");
    // @ts-ignore
    let hList: HTMLHeadingElement[] = [];
    if (_h2) hList = hList.concat(Array.from(_h2));
    if (_h3) hList = hList.concat(Array.from(_h3));
    setTagList(hList);
  }, []);

  return (
    <>
      <h1 className="text-[36px] text-center py-24">{title}</h1>
      <div className="fixed top-[50%] transform -translate-y-[50%] left-8 hidden lg:flex lg:flex-col text-purple-600 max-w-48">
        {tagList.map((i, idx) => {
          return (
            <a
              href={`#${i.id}`}
              key={idx}
              className="overflow-hidden overflow-ellipsis whitespace-nowrap"
            >
              {i.textContent}
            </a>
          );
        })}
      </div>
      <div className="flex gap-4 justify-center items-center mb-12 cursor-pointer">
        {_labels.map((label) => (
          <Label label={label} key={label.id} />
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
export const getServerSideProps: GetStaticProps = async (context) => {
  try {
    const {
      params: { id },
    } = context as any;

    const [labels, info, post] = await Promise.all([
      request.get<any>("/api/label"),
      request.get<any>("/api/about"),
      request.get<any>("/api/post?id=" + id),
    ]);
    // 创建RSS文件
    return {
      props: {
        labels,
        info,
        post: post.data,
      },
    };
  } catch (error) {
    console.log("get api data failed!!", error);
    return {
      notFound: true,
    };
  }
};

// export async function getStaticPaths() {
//   if (globalThis.postList === undefined) {
//     await getAllIssue();
//   }
//   return {
//     // @ts-ignore
//     paths: globalThis.postList.map((i) => `/post/${i.number}`),
//     fallback: false,
//   };
// }
