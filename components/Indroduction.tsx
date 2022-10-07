import Link from "next/link";
import { motion } from "framer-motion";

function Introduction() {
  return (
    <>
      <div className="py-12 flex items-center justify-evenly max-w-[90vw] mx-auto">
        <div className="flex-col gap-8 md:gap-12 text-purple-800 font-bold flex text-2xl md:text-4xl text-center">
          <motion.p
            className="relative leading-10"
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
            <span className="bg-purple-500 text-light-600 p-1 sm:px-2 py-0.5 sm:py-1 rounded-sm md:rounded-md">
              web
            </span>{" "}
            开发者。
          </motion.p>
          <motion.p
            className="relative hidden sm:inline-block"
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
          <img src="/study.svg" alt="" className="sm:w-128 w-96" />
          <div className="sm:w-96 sm:h-96 w-64 h-64 bg-purple-100 rounded-full absolute bottom-6 -left-2 sm:left-0 -z-1"></div>
        </div>
      </div>
    </>
  );
}

export default Introduction;
