import Link from "next/link";
import styles from "../styles/avatar.module.sass";

export default function Avatar() {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <a>
          <img src="/avatar.png" alt="my avatar" />
        </a>
      </Link>
    </div>
  );
}
