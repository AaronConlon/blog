import { BsGithub, BsRss } from "react-icons/bs";
import { join, resolve } from "path";

import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbTags } from "react-icons/tb";

export const SITE_NAME = "妙才 Dev";
export const BLOG_DESCRIPTION = "妙才的博客 - web developer - frontend";

export const routePathRecord = {
  index: {
    path: "/",
    text: "首页",
  },
  github: {
    path: "https://github.com/Developer27149/blog",
    text: "源代码",
    icon: <BsGithub className="w-5 h-5" />,
  },
  productions: {
    path: "/productions",
    text: "作品集",
    icon: <AiOutlineFundProjectionScreen className="w-5 h-5" />,
  },
  feed: {
    path: "/api/rss/",
    text: "RSS",
    icon: <BsRss className="w-5 h-5" />,
  },
};
