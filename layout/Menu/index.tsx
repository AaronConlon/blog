import { AiFillCode, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { SITE_NAME, routePathRecord } from "@/configs";

import { HiMenuAlt1 } from "react-icons/hi";
import LabelList from "@/components/LabelList";
import Link from "next/link";
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
      <motion.header
        className="relative sticky top-0 max-w-[1200px] mx-auto py-8 px-4 "
        initial={{ left: 30 }}
        animate={{ left: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center sm:justify-start w-full gap-2 sm:mr-auto">
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
          {/* 标签 */}
          <div className="flex fixed items-center bottom-0 bg-[#a865bb]-500 p-4 sm:p-0 sm:bg-white left-0 right-0 justify-between flex-row-reverse sm:flex-row sm:relative">
            <div
              className="text-white sm:text-purple-900 flex items-center gap-2 sm:mr-6 cursor-pointer w-16"
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
                  // @ts-ignore
                  const { path, text, icon } = routePathRecord[key];
                  return (
                    <li
                      key={path}
                      className={clsx(
                        "transform-all",
                        route.pathname === path
                          ? "sm:text-purple-500 text-white"
                          : "sm:text-purple-900 sm:opacity-80 text-white",
                        "sm:hover:text-purple-500 sm:hover:opacity-100"
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
        </div>
      </motion.header>
    </div>
  );
}

export default Menu;
