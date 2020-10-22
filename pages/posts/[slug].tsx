/* eslint-disable react/no-danger */
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { Box, Heading, Image, Badge, Stack, Text } from "@chakra-ui/core";
// @ts-ignore
import Layout from "../../components/layout.tsx";
// @ts-ignore
import { getAllPostIds, getPost } from "../../lib/posts.ts";

export default function Post({
  post,
}: {
  post: {
    title: string;
    date: Date;
    tags: string[];
    mainImg: string;
    contentHtml: string;
  };
}) {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
        <link
          rel="stylesheet"
          href="https://highlightjs.org/static/demo/styles/dracula.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"
        />
        <link rel="stylesheet" href="/post.css" />
      </Head>
      <Box>
        <Box width="100%" margin="0 auto" paddingBottom="4rem" maxW="960px">
          <Image src={post.mainImg} alt="" width="100%" />
        </Box>
        <Box width="100%" margin="0 auto" maxW="960px">
          <Heading as="h1">{post.title}</Heading>
          <Stack isInline id="tags" height="2rem">
            {post.tags.map((tag) => (
              <Badge
                variantColor="purple"
                key={tag}
                height="1.2rem"
                fontSize="0.8rem"
                lineHeight="1.2rem"
                paddingLeft="0.5rem"
              >
                <Link href={`/tags/${tag}`}>
                  <a>{tag}</a>
                </Link>
              </Badge>
            ))}
          </Stack>
          <Text>{post.date}</Text>
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </Box>
      </Box>
    </Layout>
  );
}

// 用于限定符合条件的post id列表
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPost(params.slug as string);
  return {
    props: {
      post,
    },
  };
};
