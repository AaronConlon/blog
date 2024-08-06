import { CONFIG } from "@/config";
import Link from "next/link";
import { FaDev, FaGithub } from "react-icons/fa";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { TbBrandJuejin } from "react-icons/tb";

export default function SocialMediaSidebar() {
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
    <div className="fixed right-4 xl:right-8 hidden md:flex bottom-0 flex-col z-10 gap-4 items-center">
      {socialMedias.map(({ name, url, icon: Icon }) => (
        <Link href={url} className="relative group" target="_blank" key={name}>
          <Icon
            size={24}
            className="hover:text-primary hover:scale-110 origin-center transition-transform"
          />
          <span className="hidden group-hover:inline-block absolute right-[120%] top-0 w-max bg-primary text-white rounded-sm px-1">
            {name}
          </span>
        </Link>
      ))}

      <div className="w-1 h-16 bg-primary"></div>
    </div>
  );
}
