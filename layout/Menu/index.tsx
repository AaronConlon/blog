import { AiFillCode, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { SITE_NAME, routePathRecord } from "@/configs";

import DateAndTime from "./DateComponent";
import { HiMenuAlt1 } from "react-icons/hi";
import LabelList from "@/components/LabelList";
import Link from "next/link";
import SubscriptionMe from "./Subscription";
import clsx from "clsx";
import { labelsAtom } from "@/store";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";

function Menu() {
  const route = useRouter();
  const [labelStore, setLabelStore] = useAtom(labelsAtom);

  return (
    <div
      className="bg-white sticky top-0"
      style={{ zIndex: labelStore.isShow ? 10 : 999 }}
    >
      {/* <video
        src="sea3.mp4"
        muted={true}
        autoPlay={true}
        loop={true}
        className="absolute top-0 left-0 right-0 w-full bottom-0"
      /> */}
      <motion.header
        className="relative sticky top-0 max-w-[1200px] mx-auto py-8 md:px-12"
        initial={{ left: 30 }}
        animate={{ left: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-2 mr-auto">
            <AiFillCode className="w-6 h-6  dark:text-purple-600" />
            <div className="flex items-center gap-1 w-40">
              <Link href={"/"} className="h-4">
                <a className="text-purple-600 dark:text-white text-2xl">
                  {SITE_NAME}
                </a>
              </Link>
              <motion.span
                className="w-1 h-6 bg-purple-600 dark:bg-white"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  type: "keyframes",
                  duration: 1,
                }}
              ></motion.span>
            </div>
          </div>
          {/* 时间和日期 */}
          {/* <DateAndTime /> */}
          {/* 标签 */}
          <div
            className="text-purple-900 flex items-center gap-2 mr-6 cursor-pointer"
            onClick={() =>
              setLabelStore((prev) => ({ ...prev, isShow: !prev.isShow }))
            }
          >
            <HiMenuAlt1 />
            <span>分类</span>
          </div>
          {/* nav list */}
          <ul className="flex gap-8 overflow-hidden">
            {Object.keys(routePathRecord)
              .filter((i) => i !== "index")
              .map((key) => {
                const { path, text, icon } = routePathRecord[key];
                return (
                  <li
                    key={path}
                    className={clsx(
                      "transform-all",
                      route.pathname === path
                        ? "text-purple-500"
                        : "text-purple-900 opacity-80",
                      "hover:text-purple-500 hover:opacity-100"
                    )}
                  >
                    <Link href={path}>
                      <a className="flex items-center gap-2">
                        {icon}
                        <span className="flex-grow overflow-ellipsis whitespace-nowrap overflow-hidden">
                          {text}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* <p className="text-gray-900 opacity-40 text-sm italic text-right">
          该视频由
          <a
            href="https://pixabay.com/zh/users/engin_akyurt-3656355/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=video&amp;utm_content=20223"
            className="px-2 text-purple-900"
          >
            Engin Akyurt
          </a>
          在
          <a
            href="https://pixabay.com/zh//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=video&amp;utm_content=20223"
            className="px-2 text-purple-900"
          >
            Pixabay
          </a>
          上发布
        </p> */}
      </motion.header>
    </div>
  );
}

export default Menu;
