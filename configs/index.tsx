import { join, resolve } from "path";

import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { BsRss } from "react-icons/bs";
import { TbTags } from "react-icons/tb";

export const BLOG_ARTICLE_DIR = join(process.cwd(), "posts");
export const SITE_NAME = "妙才 Dev";

export const routePathRecord = {
  index: {
    path: "/",
    text: "首页",
  },
  ideas: {
    path: "/ideas",
    text: "作品集",
    icon: <AiOutlineFundProjectionScreen className="w-5 h-5" />,
  },
  about: {
    path: "/rss/feed.xml",
    text: "RSS",
    icon: <BsRss className="w-5 h-5" />,
  },
  // about: {
  //   path: "/about",
  //   text: "自述",
  //   icon: <SiAboutdotme className="w-5 h-5" />,
  // },
  // tags: {
  //   path: "/tags",
  //   text: "分类",
  //   icon: <TbTags className="w-5 h-5" />,
  // },
};