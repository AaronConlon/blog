import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { Box, Text } from "@chakra-ui/core";
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
    contentHtml: string;
  };
}) {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Box>
        <Text>sdadadad</Text>
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
  console.log(params);

  // const post = await getPost(params.slug as string);
  return {
    props: {
      name: 'aaron',
    },
  };
};
