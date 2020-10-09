import { Head } from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
// @ts-ignore
import Layout from "../../components/layout.tsx";

export default function Post({
  post,
}: {
  post: {
    title: string;
    date: Date;
    contentHtml: string;
  };
}) {
  return (
    <Layout>
      <p>demo</p>
    </Layout>
  );
}
