import Link from "next/link";
import styles from "../styles/avatar.module.sass";

export default function Avatar({ customStyle = {} }) {
  return (
    <div className={styles.logo} style={customStyle}>
      <Link href="/">
        <a>
          <img src="/avatar.png" alt="my avatar" />
        </a>
      </Link>
    </div>
  );
}
