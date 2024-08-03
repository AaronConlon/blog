import { CONFIG } from "@/config";
import { FaDev, FaGithub } from "react-icons/fa";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { TbBrandJuejin } from "react-icons/tb";
import LeftSidebar from "./LeftSidebar";
import SocialMediaSidebar from "./SocialMediaSidebar";

export default function SideBar() {
  const socialMedias = [
    {
      name: "GitHub",
      icon: FaGithub,
      url: CONFIG.author.githubProfile,
    },
    {
      name: "Twitter / X",
      icon: FaSquareXTwitter,
      url: CONFIG.author.twitterProfile,
    },
    {
      name: "Linkedin",
      icon: FaLinkedin,
      url: CONFIG.author.linkedinProfile,
    },
    {
      name: "Dev",
      icon: FaDev,
      url: CONFIG.author.devProfile,
    },
    {
      name: "Juejin",
      icon: TbBrandJuejin,
      url: CONFIG.author.juejinProfile,
    },
  ];
  return (
    <>
      <LeftSidebar />
      <SocialMediaSidebar />
    </>
  );
}
