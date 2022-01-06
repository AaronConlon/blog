/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import Markdown from "markdown-to-jsx";
// eslint-disable-next-line
import { Box, Heading, Image, Badge, Stack, Tag } from "@chakra-ui/core";
// @ts-ignore
import Layout from "../../components/layout.tsx";
// @ts-ignore
import { getAllPostIds, getPost } from "../../lib/posts.ts";
import sd from "../../styles/Code.module.sass";
// @ts-ignore
import Code from "../../components/Code.tsx";

const assertPrefix = "/blog";
export default function Post({
  post,
}: {
  post: {
    title: string;
    date: Date;
    tags: string[];
    mainImg: string;
    content: string;
  };
}) {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"
        />
        <link rel="stylesheet" href={`${assertPrefix}/post.css`} />
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J0BNBT8YXG"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `<!-- Global site tag (gtag.js) - Google Analytics -->
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J0BNBT8YXG');`,
          }}
        />
      </Head>
      <Box>
        <Box width="100%" margin="0 auto" paddingBottom="2rem" maxW="960px">
          <Image src={post.mainImg} alt="" width="100%" />
        </Box>
        <Box width="100%" margin="0 auto" maxW="960px">
          <Heading
            as="h1"
            textAlign="center"
            overflow="hidden"
            // fontSize="1rem"
            lineHeight={["2.5rem!important", "3rem!important"]}
          >
            {post.title}
          </Heading>
          <Stack
            isInline
            id="tags"
            height="2rem"
            margin="0 auto"
            mr="0.4rem"
            float="right"
            display="flex"
            alignItems="center"
          >
            {post.tags.map((tag) => (
              <Badge
                variantColor="green"
                key={tag}
                height="2rem"
                fontSize="0.6rem"
                borderRadius="5px"
                lineHeight="2rem"
                paddingLeft="8px"
                minW="4rem"
                // cursor="pointer"
              >
                {tag}
              </Badge>
            ))}
          </Stack>
          <Tag mb="2rem" variantColor="green" fontSize="0.6rem" ml="0.4rem">
            最后更新: {post.date}
          </Tag>
          {/* <div
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            style={{ margin: "0 1rem" }}
          /> */}
          <Markdown
            className={sd.content}
            options={{
              overrides: {
                pre: {
                  component: Code,
                },
              },
            }}
          >
            {post.content}
          </Markdown>
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
