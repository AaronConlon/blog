import { AiFillCode, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { routePathRecord, SITE_NAME } from "@/configs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import DateAndTime from "./DateComponent";
import SubscriptionMe from "./Subscription";

function Menu() {
  const route = useRouter();

  return (
    <motion.header
      className="flex flex-col items-center gap-2 px-4 py-6 relative w-[300px] sticky top-0 h-screen"
      initial={{ left: 30 }}
      animate={{ left: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <div className="flex items-center gap-2">
        <AiFillCode className="w-6 h-6  dark:text-purple-600" />
        <div className="flex items-center gap-1">
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
      <DateAndTime />
      {/* nav list */}
      <ul className="flex flex-grow flex-col gap-2 self-start w-full overflow-hidden">
        {Object.keys(routePathRecord)
          .filter((i) => i !== "index")
          .map((key) => {
            const { path, text, icon } = routePathRecord[key];
            return (
              <li
                key={path}
                className={clsx(
                  "text-gray-400",
                  {
                    "text-purple-500": route.pathname === path,
                  },
                  "hover:text-purple-600"
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
      <SubscriptionMe />
    </motion.header>
  );
}

export default Menu;
