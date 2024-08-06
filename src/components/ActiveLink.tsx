"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ActiveLink = ({
  href,
  children,
  className = "",
  style = {},
}: ActiveLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref legacyBehavior>
      <a
        className={`${className} ${
          isActive ? "section-heading !text-white" : ""
        }`}
        data-type="highlight"
        style={style}
      >
        {children}
      </a>
    </Link>
  );
};

export default ActiveLink;
