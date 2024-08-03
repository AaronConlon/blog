"use client";

import { cn } from "@/features/format";
import { ITableContent } from "@/features/types";
import { debounce } from "lodash-es";
import { BookOpenCheck, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";

interface TableOfContentItemProps {
  items: ITableContent[];
}
export default function ContentNavigate({ items }: TableOfContentItemProps) {
  const [progress, setProgress] = useState("0");
  const [wordCount, setWordCount] = useState(0);

  const handleToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const mdBody = document.querySelector("#blog-container .markdown-body");

    // 获取标题
    const headings = document.querySelectorAll(
      ".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6"
    );
    const title = document.querySelector(".blog-title");
    let titleInView = true;

    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersectionRatio > 0) {
          titleInView = true;
        } else {
          titleInView = false;
        }
      },
      { threshold: 0.5 }
    );

    title && ob.observe(title);

    const onScroll = debounce(() => {
      if (mdBody && title) {
        const { top, height } = mdBody.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const readHeight = windowHeight - top;
        const readProcess = (readHeight / height) * 100;
        const result = readProcess >= 100 ? 100 : readProcess;
        setProgress(result.toFixed(0));
      }
    }, 100);

    // 解析文章字数
    if (mdBody && title) {
      const text = mdBody.textContent;
      console.log(text?.length);
      if (text) {
        setWordCount(text.length);
      }
      document.addEventListener("scroll", onScroll);
    }

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="h-max pt-1 pb-4 rounded-md sticky top-32">
      <div className="relative">
        <span
          className="w-4 h-1 rounded-full bg-primary/80 absolute top-0 left-0 transition-all duration-300"
          style={{
            top: `${progress}%`,
          }}
        ></span>
        {items.map(({ text, id, level }) => (
          <section
            className="text-sm font-thin pt-2 flex gap-1 items-start cursor-pointer"
            key={id}
            style={{
              paddingLeft: `${level * 14}px`,
            }}
            onClick={() => handleToView(id)}
          >
            {text}
          </section>
        ))}
      </div>
      <div className="font-thin text-sm flex items-center gap-1 pl-1 mt-8 pt-4 relative">
        <div
          className="h-[4px] w-full rounded-sm absolute top-0 left-0"
          style={{
            background: `linear-gradient(to right, #007a7a, #007a88 ${progress}%, #007a7a20 ${progress}%)`,
          }}
        ></div>
        <BookOpenCheck
          className={cn({ "text-primary": ~~progress >= 98 })}
          size={20}
        />
        <span className="min-w-14">已读 {progress}%</span>
        {wordCount > 125 && (
          <>
            <ReceiptText size={20} className="ml-4" />
            <span>
              字数{" "}
              {wordCount > 10000
                ? `${(wordCount / 1000).toFixed(2)}千`
                : wordCount}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
