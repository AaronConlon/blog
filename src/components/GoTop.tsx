"use client";

import { cn } from "@/features/format";
import { debounce } from "lodash-es";
import { ArrowBigUpDash } from "lucide-react";
import { useEffect, useState } from "react";
export default function GoTop() {
  const [isDownScroll, setIsDownScroll] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = debounce(function () {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        // downscroll code
        setIsDownScroll(true);
      } else {
        // upscroll code
        setIsDownScroll(false);
      }
      lastScrollTop = st <= 0 ? 0 : st;
    }, 100);

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "p-1 rounded-md fixed left-4 bottom-4 bg-primary text-white hidden md:block transition-opacity duration-300",
        isDownScroll ? "opacity-100" : "opacity-0"
      )}
    >
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowBigUpDash size={28} />
      </button>
    </div>
  );
}
