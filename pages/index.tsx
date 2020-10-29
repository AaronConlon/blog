import Head from "next/head";
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
  Divider,
} from "@chakra-ui/core";
// eslint-disable-next-line import/extensions
import Layout from "../components/layout";
// eslint-disable-next-line import/extensions
import { getAllPostData } from "../help";
// eslint-disable-next-line import/extensions
import { postProps } from "../help/types";

export default function Home({ posts }: { posts: postProps[] }) {
  return (
    <Layout>
      <Box maxWidth="960px" w="100vw" backgroundColor="white.100" m="0 auto">
        <Flex m="0 auto" pb="1rem" justifyContent="center" alignItems="center">
          <Avatar
            name="youyi"
            src="/avatar.png"
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
            嘿.你好!我叫妙才,我的职业生涯规划,愿要成为一个卓越的软件开发工程师.
          </Text>
        </Flex>
        <Box m="1rem auto">
          <Heading
            as="h5"
            fontSize=".5rem"
            // fontWeight="1.5"
            color="purple.600"
            pl="1rem"
          >
            LATEST BLOG POSTS
          </Heading>
        </Box>
        {posts.map((post) => (
          <Flex
            justifyContent="flex-start"
            w="100%"
            m="2rem auto"
            key={post.id}
          >
            <Box>
              <Image
                src={post.coverImg}
                width="100"
                minW="360px"
                maxW="400px"
              />
            </Box>
           
          </Flex>
        ))}
        <Link href="/posts">
          <Button>
            More&nbsp;
            <span role="img" aria-label="More">
              👀
            </span>
          </Button>
        </Link>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const a = 1;
  return {
    props: {
      posts: getAllPostData().slice(0, 6),
      a,
    },
  };
};
