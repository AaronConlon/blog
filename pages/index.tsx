import Head from "next/head";
import Link from "next/link";
import styles from "../styles/index.module.sass";
// @ts-ignore
import GithubStatus from "../components/GithubStatus.tsx";
// @ts-ignore
import Friends from "../components/Friends.tsx";

export default function Home() {
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
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <img src="/avatar.png" alt="my avatar" />
            </a>
          </Link>
        </div>
        <p>Hi there.This is my blog site.I will put some articles here.</p>
        <p>
          Take
          <a href="https://www.javascript.com/">
            <span role="img" aria-label="introduction">
              JavaScript 🔨
            </span>
          </a>
          to create bugs 😂.
        </p>
        <GithubStatus username="youyiqin" />
        <Friends
          friends={[
            {
              name: "ScarSu - 不要标榜，去行动😃",
              isGirl: true,
              homepage: "https://www.scarsu.com/",
              avatar:
                "https://avatars3.githubusercontent.com/u/19526406?s=460&u=8f97c0afa0e36988eacb8fa6d8ee18035ab9e6f1&v=4",
            },
            {
              name: "老胡 - 做一个努力的程序员",
              isGirl: false,
              homepage: "https://www.howie6879.cn/",
              avatar:
                "https://avatars1.githubusercontent.com/u/17047388?s=100&v=4",
            },
          ]}
        />
      </div>
    </div>
  );
}
