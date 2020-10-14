import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import React from "react";
// @ts-ignore
import Tag from "../components/Tag.tsx";
// @ts-ignore
import { getPostsData } from "../help/index.ts";
import styles from "../styles/posts.module.sass";
// @ts-ignore
import Search from "../components/Search.tsx";
// @ts-ignore
import Avatar from "../components/Avatar.tsx";

export default function Posts({
  tags,
}: {
  tags: {
    [name: string]: Object[];
  };
}) {
  const [showSearchArea, setShowSearchArea] = React.useState(true);
  // console.log(tags);
  const tagsList = Object.keys(tags);
  function handdleClick() {
    console.log(111);
  }
  return (
    <div className={styles.containers}>
      <Avatar />
      {showSearchArea ? <Search /> : null}
      <h5>
        {tagsList.length}
        &nbsp;tags here
      </h5>
      <div className={styles.tagArea}>
        {tagsList.map((tag) => (
          <Tag key={tag} tagName={tag} clickEvent={handdleClick} />
        ))}
      </div>
      <p>
        你好,这里是
        <span>@妙才</span>
        的博客 posts 页,可以通过搜索功能查找一些有趣的内容.
      </p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tags = await getPostsData();
  const resultTagsObj = {};
  Object.keys(tags).forEach((tag) => {
    resultTagsObj[tag] = [...tags[tag]];
  });
  return {
    props: {
      tags: resultTagsObj,
    },
  };
};
