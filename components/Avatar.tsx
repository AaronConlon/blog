import Link from "next/link";
import styles from "../styles/avatar.module.sass";

const assertPrefix = "/qinyouyi_blog";
export default function Avatar({ customStyle = {} }) {
  return (
    <div className={styles.logo} style={customStyle}>
      <Link href="/">
        <a>
          <img src={`${assertPrefix}/avatar.png`} alt="my avatar" />
        </a>
      </Link>
    </div>
  );
}
