import Link from "next/link";
import { motion } from "framer-motion";

function Introduction() {
  return (
    <>
      <div className="py-12 flex items-center justify-evenly max-w-[1200px] mx-auto">
        <div className="flex-col gap-12 text-purple-800 font-bold flex text-4xl">
          <motion.p
            className="relative"
            initial={{
              left: 30,
              opacity: 0,
            }}
            animate={{
              left: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
          >
            Hi, 我是妙才，一个{" "}
            <span className="bg-purple-500 text-light-600 px-2 py-1 rounded-md">
              web
            </span>{" "}
            开发者。
          </motion.p>
          <motion.p
            className="relative"
            initial={{
              top: 30,
              opacity: 0,
            }}
            animate={{
              top: 0,
              opacity: 1,
            }}
            transition={{
              delay: 1,
            }}
          >
            在此记录自己的职业生涯。
          </motion.p>
          <motion.p
            className="relative"
            initial={{
              top: 30,
              opacity: 0,
            }}
            animate={{
              top: 0,
              opacity: 1,
            }}
            transition={{
              delay: 1.5,
            }}
          >
            欢迎订阅我的{" "}
            <span className="bg-purple-500 p-1 rounded-md text-white mr-4">
              <Link href="/rss/feed.xml">RSS</Link>
            </span>
            🚀🚀🚀
          </motion.p>
        </div>
        <div className="sm:mx-0 md:lg-24 relative">
          {/* <SubscriptionMe /> */}
          <img src="/study.svg" alt="" className="w-128" />
          <div className="w-96 h-96 bg-purple-100 rounded-full absolute bottom-24 -z-1"></div>
        </div>
      </div>
    </>
  );
}

export default Introduction;
