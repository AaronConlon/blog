import { AiFillCode, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { SITE_NAME, routePathRecord } from "@/configs";

import DateAndTime from "./DateComponent";
import Link from "next/link";
import SubscriptionMe from "./Subscription";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

function Menu() {
  const route = useRouter();

  return (
    <div className="bg-[#eaf1fd] relative overflow-hidden xl:h-screen">
      <video
        src="sea3.mp4"
        muted={true}
        autoPlay={true}
        loop={true}
        className="absolute top-0 left-0 right-0 w-full bottom-0"
      />
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
                className="w-1 h-6 bg-purple-600 dark:bg-white relative top-[2px]"
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
        <div className="py-32 xl:py-96 flex items-center justify-between">
          <div className="flex-col gap-12 text-white font-bold flex text-4xl">
            <p>
              Hi, 我是妙才，一个{" "}
              <span className="bg-orange-500 text-light-600 px-2 py-1 rounded-md">
                web
              </span>{" "}
              开发者。
            </p>
            <p>在此记录自己的职业生涯。</p>
          </div>
          <div className="sm:mx-0 md:lg-24">
            <SubscriptionMe />
          </div>
        </div>

        <p className="text-gray-900 opacity-40 text-sm italic text-right">
          该视频由
          <a
            href="https://pixabay.com/zh/users/engin_akyurt-3656355/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=video&amp;utm_content=20223"
            className="px-2 text-white"
          >
            Engin Akyurt
          </a>
          在
          <a
            href="https://pixabay.com/zh//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=video&amp;utm_content=20223"
            className="px-2 text-white"
          >
            Pixabay
          </a>
          上发布
        </p>
      </motion.header>
    </div>
  );
}

export default Menu;
