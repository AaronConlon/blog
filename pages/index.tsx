import { ESort, IGithubIssue, IRepoLabel } from "@/interfaces";
import { GetServerSideProps, GetStaticProps } from "next";
import { labelsAtom, tabAtom, userInfoAtom } from "@/store";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { BLOG_DESCRIPTION } from "@/configs/index";
import { GrDescend } from "react-icons/gr";
import Head from "next/head";
import { IUserInfo } from "@/interfaces/userInfo";
import Image from "next/image";
import Introduction from "@/components/Indroduction";
import MiniArticle from "@/components/MiniArticle";
import { MotionDiv } from "@/components/motion";
import type { NextPage } from "next";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";
import { omit } from "lodash-es";
import { request } from "@/utils/request";
import styles from "@/styles/masonry.module.scss";
import { userInfo } from "os";

interface IProps {
  info: IUserInfo;
  labels: IRepoLabel[];
  posts: IGithubIssue[];
}

const Home = ({ info, labels, posts }: IProps) => {
  // @ts-ignore
  const setUserInfo = useSetAtom(userInfoAtom);
  const [tab, setTab] = useAtom(tabAtom);
  const setLabels = useSetAtom(labelsAtom);
  const [isDesc, setIsDesc] = useState(true);
  const [articleList, setArticleList] = useState(posts);
  const [sortValue, setSortValue] = useState<"updated_at" | "comments">(
    "updated_at"
  );

  useEffect(() => {
    setArticleList(() => {
      const targetList = posts.filter((i) =>
        i.labels.some((j) => j.name === tab)
      );
      targetList.sort((prev, cur) => {
        if (isDesc) {
          if (sortValue === "comments") {
            return prev.comments - cur.comments;
          } else {
            return (
              new Date(prev.created_at).valueOf() -
              new Date(cur.created_at).valueOf()
            );
          }
        } else {
          if (sortValue === "comments") {
            return cur.comments - prev.comments;
          } else {
            return (
              new Date(cur.created_at).valueOf() -
              new Date(prev.created_at).valueOf()
            );
          }
        }
      });

      return targetList;
    });
  }, [isDesc, sortValue, posts, tab]);

  useEffect(() => {
    setUserInfo(info);
    setLabels({ isShow: false, list: labels });
    setTab(labels[0]?.name ?? "CSS");
  }, [info, labels, setLabels, setTab, setUserInfo]);

  return (
    <>
      <Head>
        <title>{info.name}的博客 - web developer</title>
        <meta name="description" content={BLOG_DESCRIPTION} />
      </Head>
      <Introduction />
      <div className="flex sm:px-4 py-16 md:py-20">
        <aside className="sticky top-80 self-start">
          {/* <span className="text-xl font-bold">分类：</span> */}
          <ul className="text-purple-500 bg-light-50 p-4 ">
            {labels.map(({ name, id }) => (
              <li
                key={id}
                className={clsx(
                  "hover:text-purple-600 transition-all hover:bg-blue-50 p-2 py-1 rounded-sm my-1",
                  {
                    "bg-blue-50 border-l-solid border-l-purple-800 border-l-2":
                      tab === name,
                  },
                  styles.hidden_text
                )}
                onClick={() => setTab(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex-grow sm:px-8">
          <div className="flex pb-6 text-xl">
            <span>{tab}</span>
            <span className="bg-purple-300 rounded-full px-1.5 text-[12px] py-[2px] h-[16px] ml-1 mr-auto text-white">
              {articleList.length}
            </span>

            <div className="flex items-center select-none cursor-pointer gap-2">
              <MotionDiv
                initial={{
                  rotate: isDesc ? 0 : "180deg",
                }}
                animate={{
                  rotate: !isDesc ? 0 : "180deg",
                }}
                onClick={() => setIsDesc(!isDesc)}
              >
                <GrDescend className="text-purple-400  w-[12px] h-[12px]" />
              </MotionDiv>
              <div className="text-sm flex border border-gray-100 rounded-md cursor-pointer text-purple-400">
                <span
                  onClick={() => setSortValue("updated_at")}
                  className={clsx("p-1", {
                    "bg-purple-600 text-white": sortValue === "updated_at",
                  })}
                >
                  {ESort.updated_at}
                </span>
                <span
                  onClick={() => setSortValue("comments")}
                  className={clsx("p-1", {
                    "bg-purple-600 text-white": sortValue === "comments",
                  })}
                >
                  {ESort.comments}
                </span>
              </div>
            </div>
          </div>

          {articleList.length > 0 ? (
            <ul className={styles.masonry}>
              {articleList.map((i, idx) => (
                <li
                  key={idx}
                  className="rounded-md block bg-gray-50 mb-8 break-inside-avoid"
                >
                  <MiniArticle {...i} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-4 py-10 items-center">
              <img src="/empty.svg" className="w-128 block" alt="" />
              <p className="text-center text-purple-200 text-2xl block">
                暂无内容
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;

// return props to current page component as props
export const getServerSideProps: GetStaticProps = async (context) => {
  const [labels, info, posts] = await Promise.all([
    request.get<any>("/api/label"),
    request.get<any>("/api/about"),
    request.get<any>("/api/posts"),
  ]);

  return {
    props: {
      labels,
      info,
      posts: posts.postList.map((i: IGithubIssue) => omit(i, "content")),
    },
  };
};
