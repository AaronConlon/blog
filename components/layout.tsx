import Head from "next/head";
import classNames from "classnames";
import Link from "next/link";
import styles from "./layout.module.sass";
import utilStyles from "../styles/utils.module.sass";

type Props = {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="JavaScript web developer - Aaron - blog - articles"
        />
      </Head>
      <header className={styles.header}>
        <>
          <Link href="/">
            <a>
              <img
                src="/images/profile.jpg"
                alt="youyi"
                className={classNames(
                  styles.container,
                  utilStyles.borderCircle
                )}
              />
            </a>
          </Link>
        </>
      </header>
      <main>{children}</main>
      <div className={styles.backToHome}>
        <Link href="/">
          <a>home</a>
        </Link>
      </div>
    </div>
  );
}
