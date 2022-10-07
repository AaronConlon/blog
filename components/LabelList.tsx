import { OWNER, REPO } from "@/utils/consts";
import { calcReverseColor, loadingDelay } from "@/utils";
import { useAtom, useSetAtom } from "jotai";

import { IGithubIssue } from "@/interfaces";
import Link from "next/link";
import { MotionDiv } from "./motion";
import { Scrollbars } from "react-custom-scrollbars";
import { labelsAtom } from "@/store";
import { request } from "@octokit/request";
import { useState } from "react";

function LabelList() {
  const [labelStore, setLabelStore] = useAtom(labelsAtom);
  const [postList, setPostList] = useState<IGithubIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSearchPostByLabel = async (e: MouseEvent, name: string) => {
    e.stopPropagation();
    try {
      /**
       * 获取当前label下的文章，展示出来
       */
      // const data = await request.get(`/api/posts?label=${name}`);
      setIsLoading(true);
      const { data } = await loadingDelay(() =>
        request("GET /repos/{owner}/{repo}/issues", {
          owner: OWNER,
          repo: REPO,
          labels: name,
        })
      );
      console.log(data);
      setPostList(data);
    } catch (error) {
      console.log("搜索失败,", error);
      setPostList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickBox = (e: MouseEvent) => {
    e.stopPropagation();
    setLabelStore({ isShow: false, list: labelStore.list });
  };

  if (labelStore.isShow === false || labelStore.list?.length === 0)
    return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 right-0 bg-[#808080c9] z-50 w-screen h-screen flex justify-center items-end md:items-start p-8 md:p-32"
      onClick={onClickBox}
    >
      <div
        className="p-8 md:p-12 rounded-md max-w-full sm:max-w-[60vw] bg-white min-h-[400px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-wrap justify-center gap-4 mb-8">
          {labelStore.list.map(({ id, name, color }) => (
            <li
              key={id}
              className="p-1 px-2 rounded-sm cursor-pointer"
              style={{
                backgroundColor: `#${color}`,
                color: calcReverseColor(color),
              }}
              onClick={(e) => onSearchPostByLabel(e, name)}
            >
              {name}
            </li>
          ))}
        </ul>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-6 bg-slate-200 rounded"></div>
                <div className="h-6 bg-slate-200 rounded w-[80%]"></div>
                <div className="h-6 bg-slate-200 rounded"></div>
                <div className="h-6 bg-slate-200 rounded w-[60%]"></div>
              </div>
            </div>
          </div>
        ) : postList.length === 0 ? (
          <div>
            <img alt="" src="/empty.svg" className="w-[200px] m-auto" />
            <p className="text-center text-purple-400 pt-8">暂无数据</p>
          </div>
        ) : (
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            autoHeight
            autoHeightMin={0}
            autoHeightMax={528}
            thumbMinSize={30}
            universal={true}
          >
            {postList.map((post, idx) => {
              const { title, number, id } = post;
              return (
                <MotionDiv
                  key={id}
                  className="relative p-2 rounded-sm hover:bg-[#e9ccffaa]"
                  initial={{
                    opacity: 0,
                    right: 5 * idx + 1,
                  }}
                  animate={{
                    opacity: 1,
                    right: 0,
                  }}
                  transition={{
                    delay: 0.1 * idx,
                  }}
                >
                  <Link href={`/post/${number}`}>
                    <a>
                      <span>{title}</span>
                      <p className="text-gray-600 text-sm px-8 py-2">
                        {post.body?.match(/^.*n?/)?.[0] ?? "暂无简介"}
                      </p>
                    </a>
                  </Link>
                </MotionDiv>
              );
            })}
          </Scrollbars>
        )}
      </div>
    </div>
  );
}

export default LabelList;
