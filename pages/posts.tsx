import { GetStaticProps } from "next";
import Link from "next/link";
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
  const [result, setResult] = React.useState({ posts: [] });
  const tagsList = Object.keys(tags);
  function searchCallback(data: any) {
    setResult(data);
  }
  function handdleClick(tagName: string) {
    const target = tags[tagName];
    setResult({ posts: target });
  }
  return (
    <div className={styles.containers}>
      <Avatar
        customStyle={{ margin: "0 auto", height: "128px", width: "128px" }}
      />
      <Search callback={searchCallback} />
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
      <div className={styles.searchResult}>
        {result.posts.length ? (
          result.posts.map((post) => (
            <h4 key={post.title}>
              <Link href={`/posts/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </h4>
          ))
        ) : (
          <div>
            <p>入眼一片荒芜.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
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
