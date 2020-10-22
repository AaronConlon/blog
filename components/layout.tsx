import Head from "next/head";
import Link from "next/link";
import { Box, Divider, Badge, Text, Heading } from "@chakra-ui/core";
import styles from "../styles/layout.module.sass";

type Props = {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>妙才的博客</title>
        <meta
          name="description"
          content="javascript node deno linux web developer"
        />
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
        />
      </Head>
      <Box className={styles.container}>
        <header>
          <Box>
            <Heading
              as="h1"
              size="2xl"
              textAlign="center"
              m="0 auto"
              p="1.4rem 1rem"
              color="#0069d6"
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
        </header>
        <main>{children}</main>
        <Divider />
        <Box m="2rem auto" textAlign="center">
          <p>
            谢谢你能看到这里!
            <span role="img" aria-label="emoji">
              🤗
            </span>
            如果你有任何想与我讨论的内容,请给我发邮件,我会回复,这次一定,绝对不
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
