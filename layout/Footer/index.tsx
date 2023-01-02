import { FcGraduationCap, FcOrganization, FcVoicemail } from "react-icons/fc";

import { AiFillGithub } from "react-icons/ai";
import FriendLinks from "./Friends";
import { GithubContributions } from "github-contributions-react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/store";

function Footer() {
  const [userInfo] = useAtom(userInfoAtom);
  // 未初始化时不显示
  if (userInfo?.avatar_url === undefined) return null;

  return (
    <motion.footer
      initial={{ opacity: 0, top: 100 }}
      animate={{ opacity: 1, top: 0 }}
      className="bg-[#f9f9fa] relative pb-[44px] sm:pb-0"
    >
      <div className="flex gap-12 justify-center pt-12 sm:flex-row flex-col px-4 md:px-12 max-w-screen lg:max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-4 justify-evenly items-center sm:items-start">
          <div className="flex gap-4">
            <img
              src={userInfo.avatar_url}
              className="rounded-full w-18 h-18 shadow-purple-600 shadow-sm"
              alt="avatar"
            />
            <div>
              <section className="text-xl">{userInfo.name}</section>
              <p className="text-gray-500 py-2">{userInfo.bio}</p>
            </div>
          </div>
          <div className="text-gray-500">
            <p className="py-4">我是{userInfo.name}, 欢迎联系我.</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <AiFillGithub />
                <a
                  href={userInfo.html_url}
                  className="underline-purple-800 underline italic"
                >
                  {userInfo.html_url}
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <FcOrganization />
                <div>{userInfo.company}</div>
              </div>
              <div className="flex gap-4 items-center">
                <FcGraduationCap />
                <div>{userInfo.location}</div>
              </div>
              <div className="flex gap-4 items-center">
                <FcVoicemail />
                <div>
                  <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                </div>
              </div>
            </div>
          </div>
          <FriendLinks />
        </div>
        <img
          src="/work.svg"
          alt=""
          className="w-96 sm:w-112 lg:128 mx-auto my-4"
        />
      </div>
      <div className="pb-8 max-w-screen lg:max-w-[1200px] mx-auto">
        <GithubContributions
          username="Developer27149"
          color="#8B40CC"
          showTotal={false}
          showTitle={false}
        />
      </div>
      <p className="text-center p-8 text-gray-400">Power By Love.</p>
    </motion.footer>
  );
}

export default Footer;
