import { FcGraduationCap, FcOrganization, FcVoicemail } from "react-icons/fc";

import { AiFillGithub } from "react-icons/ai";
import FriendLinks from "./Friends";
import { GithubContributions } from "github-contributions-react";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/store";

function Footer() {
  const [userInfo] = useAtom(userInfoAtom);
  console.log(userInfo);

  return (
    <footer className="bg-[#f9f9fa]">
      <div className="flex gap-12 justify-center pt-12">
        <div className="flex flex-col gap-4 justify-evenly">
          <div className="flex gap-4">
            <img
              src={userInfo.avatar_url}
              className="rounded-full w-18 h-18 shadow-purple-600 shadow-sm"
              alt="avatar"
            />
            <div>
              <section className="text-xl">{userInfo.name}</section>
              <p className="text-purple-800 py-2">{userInfo.bio}</p>
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
                <div>{userInfo.email}</div>
              </div>
            </div>
          </div>
          <FriendLinks />
        </div>
        <img src="work.svg" alt="" className="w-128 md:block sm:hidden" />
      </div>
      <div className="pb-8">
        <GithubContributions
          username="Developer27149"
          color="#8B40CC"
          showTotal={false}
          showTitle={false}
        />
      </div>
      <p className="text-center p-8 text-gray-400">
        Power By ❤️ and create by NextJS.
      </p>
    </footer>
  );
}

export default Footer;
