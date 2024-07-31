import { FcGraduationCap, FcOrganization, FcVoicemail } from "react-icons/fc";

import { userInfoAtom } from "@/store";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import GitHubCalendar from "react-github-calendar";
import { AiFillGithub } from "react-icons/ai";
import FriendLinks from "./Friends";

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
      <div className="pb-8 max-w-screen hidden xl:block lg:max-w-[1200px] mx-auto my-12 mt-32">
        <GitHubCalendar username="AaronConlon" />
      </div>
      <p className="text-center pt-12 text-gray-400">Power By Love</p>
      <p className="text-center py-4 text-gray-400">2022~2023</p>
    </motion.footer>
  );
}

export default Footer;
