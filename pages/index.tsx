import React from "react";
import Link from "next/link";
// import styles from "../styles/index.module.sass";
// // @ts-ignore
// import GithubStatus from "../components/GithubStatus.tsx";
// // @ts-ignore
// import Friends from "../components/Friends.tsx";
// // @ts-ignore
// import Avatar from "../components/Avatar.tsx";
import { GetStaticProps } from "next";
import {
  Box,
  Heading,
  Avatar,
  Text,
  Flex,
  Image,
  Badge,
  Button,
} from "@chakra-ui/core";
// eslint-disable-next-line import/extensions
import Layout from "../components/layout";
// eslint-disable-next-line import/extensions
import { getAllPostData } from "../help";
// eslint-disable-next-line import/extensions
import { postProps } from "../help/types";

export default function Home({ posts }: { posts: postProps[] }) {
  const [postsBackup, setPostsBackup] = React.useState(posts);
  const [currentTag, setCurrentTag] = React.useState("");
  const [resultCount, setResultCount] = React.useState(2);
  React.useEffect(() => {
    if (currentTag !== "") {
      setPostsBackup(
        postsBackup.filter((post) =>
          post.tags.some((tag) => tag === currentTag)
        )
      );
    } else {
      setPostsBackup(posts);
    }
  }, [currentTag]);
  const handdleClickTag = (tagStr) => {
    setCurrentTag(tagStr);
  };
  const handleResetCurrentTag = () => {
    setCurrentTag("");
    setResultCount(posts.length);
  };
  const handleGetMoreResults = () => {
    setResultCount((count) => count + 3);
  };
  return (
    <Layout>
      <Box maxWidth="960px" w="100" backgroundColor="white.100" m="0 auto">
        <Flex m="0 auto" pb="1rem" justifyContent="center" alignItems="center">
          <Avatar
            name="youyi"
            src="/blog/avatar.png"
            height={["20vw", "14vw", "16vw", "8vw"]}
            width={["20vw", "14vw", "16vw", "8vw"]}
            m="1rem"
          />
          <Text
            fontWeight="900"
            fontSize={["12px", "16px", "18px"]}
            pr="2rem"
            pl="1rem"
          >
            嘿.你好!我是妙才.永远的现代魔法学徒.
          </Text>
        </Flex>
        <Box m="1rem auto">
          <Heading
            as="h5"
            fontSize=".5rem"
            // fontWeight="1.5"
            color="#0e4096"
            pl="1rem"
          >
            LATEST BLOG POSTS
          </Heading>
        </Box>
        {postsBackup.slice(0, resultCount).map((post, index) => (
          <Flex
            flexDirection={[
              "column",
              "column",
              index % 2 ? "row-reverse" : "row",
            ]}
            justifyContent="center"
            alignItems="center"
            w="90%"
            m="4rem auto"
            key={post.id}
          >
            <Box>
              <Image
                src={post.coverImg}
                width="100%"
                minW="360px"
                // maxW="400px"
              />
            </Box>
            <Box
              p="1.5rem"
              position="relative"
              boxSizing="border-box"
              w="100%"
            >
              <Link href={`/posts/${post.id}`}>
                <a>
                  <Heading
                    as="h5"
                    fontSize="1.25rem"
                    mb=".8rem"
                    pb=".3rem"
                    textAlign={["center", "center", "left"]}
                    wordBreak="break-all"
                  >
                    {post.title}
                  </Heading>
                </a>
              </Link>
              <Text color="black.100" style={{ textIndent: "2rem" }}>
                {post.intro}
              </Text>
              <Flex justifyContent="space-between" paddingTop="2rem">
                <Box height="2rem" lineHeight="2rem">
                  {post.tags.map((tag) => (
                    <Badge
                      variantColor="green"
                      margin="0 2px"
                      cursor="pointer"
                      key={tag}
                      onClick={() => {
                        handdleClickTag(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  <Badge
                    cursor="pointer"
                    m="0 2px"
                    onClick={handleResetCurrentTag}
                  >
                    Reset
                  </Badge>
                </Box>
              </Flex>
            </Box>
          </Flex>
        ))}
        {resultCount >= posts.length ? null : (
          <Button ml="2rem" onClick={handleGetMoreResults}>
            More&nbsp;
            <span role="img" aria-label="More">
              👀
            </span>
          </Button>
        )}
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    posts: getAllPostData(),
  },
});
