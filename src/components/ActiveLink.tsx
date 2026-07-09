"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTypedRoughNotation } from "./RoughNotationText";

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
  const roughNotationRef = useTypedRoughNotation<HTMLAnchorElement>(
    {
      type: "highlight",
      color: "#007a7a",
      strokeWidth: 1.5,
    },
    isActive
  );

  return (
    <Link
      href={href}
      ref={roughNotationRef}
      className={`${className} ${isActive ? "section-heading !text-white" : ""}`}
      data-type="highlight"
      style={style}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
