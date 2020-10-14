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
import { getAllPostData } from "../help";
// eslint-disable-next-line import/extensions
import { postProps } from "../help/types";

export default function Home({ posts }: { posts: postProps[] }) {
  console.log(posts);

  return (
    <div>
      <Head>
        <title>妙才的博客</title>
        <meta
          name="description"
          content="javascript node deno linux web developer"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
        />
      </Head>
      <Box maxWidth="960px" w="100vw" backgroundColor="white.100" m="0 auto">
        <Box>
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            m="0 auto"
            p="1.4rem 1rem"
          >
            <Link href="/">
              <a>
                妙才
                <Text as="sub" fontSize="30%">
                  blog
                </Text>
              </a>
            </Link>
          </Heading>
        </Box>
        <Flex m="0 auto" pb="1rem" justifyContent="center" alignItems="center">
          <Avatar
            name="youyi"
            src="/avatar.png"
            height={["20vw", "14vw", "16vw", "8vw"]}
            width={["20vw", "14vw", "16vw", "8vw"]}
            m="1rem"
          />
          <Text fontSize={["12px", "16px", "18px"]} pr="2rem" pl="1rem">
            嘿.你好!我叫妙才,志向是成为一个卓越的软件开发工程师.
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
            <Box ml="1.5rem" position="relative">
              <Link href={`/posts/${post.id}`}>
                <a>
                  <Heading as="h5" fontSize="1.25rem" mb=".8rem" pb=".3rem">
                    {post.title}
                  </Heading>
                </a>
              </Link>
              <Text>{post.intro}</Text>
              <Badge variantColor="purple" position="absolute" bottom="1rem">
                {post.date}
              </Badge>
              {post.tags.map((tag) => (
                <Link href={`/tags/${tag}`} key={tag}>
                  <a>
                    <Badge variantColor="green" mt="1rem" ml=".5rem">
                      {tag}
                    </Badge>
                  </a>
                </Link>
              ))}
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
        <Divider />
        <Box m="2rem auto">
          <p>
            谢谢你能看到这里!
            <span role="img" aria-label="emoji">
              🤗
            </span>
            如果你有任何想与我讨论的内容,请给我发邮件,我保证会回复,这次一定,绝对不
            <span role="img" aria-label="emoji">
              🕊
            </span>
          </p>
          <br />
          <Link href="mailto:rivenqinyy@gmail.com">
            <a style={{ textDecoration: "none" }}>
              <Badge variantColor="green">我的邮件</Badge>
              <span role="img" aria-label="my email">
                📮
              </span>
            </a>
          </Link>
          <br />
          <br />
          <Text color="gray.600">妙才 © 2020. All rights reserved.</Text>
        </Box>
      </Box>
    </div>
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
