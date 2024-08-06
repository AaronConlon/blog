"use client";

import { cn } from "@/features/format";
import { debounce } from "lodash-es";
import { BookOpenCheck, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContentNavigate() {
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [currentHeadingId, setCurrentHeadingId] = useState<string>();
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [headingList, setHeadingList] = useState<
    { textContent: string; id: string; tagName: string }[]
  >([]);

  const handleToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector("body > header.header");
      if (header) {
        header.classList.add("opacity-0");
        setTimeout(() => {
          header.classList.remove("opacity-0");
        }, 1000);
      }
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const mdBody = document.querySelector("#blog-container .markdown-body");

    // 获取标题
    const headings = document.querySelectorAll(
      ".markdown-body>h1, .markdown-body>h2, .markdown-body>h3, .markdown-body>h4, .markdown-body>h5, .markdown-body>h6"
    );
    // update blog body headings
    const newHeadingList = Array.from(headings).map((i) => ({
      textContent: i.textContent ?? "",
      id: i.id,
      tagName: i.tagName,
    }));
    setHeadingList(newHeadingList);

    const inViewGroup = new Set<Element>();
    let prevPos = 0;

    const ob = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const heading = entry.target;
        if (entry.isIntersecting) {
          inViewGroup.add(heading);
        } else {
          inViewGroup.delete(heading);
        }
      });
      // 根据滚动方向，找到当前可见的标题
      if (inViewGroup.size > 0) {
        const headings = Array.from(inViewGroup);
        const firstHeading = headings[0];
        const lastHeading = headings[headings.length - 1];
        let currentTargetId =
          prevPos < window.scrollY ? lastHeading.id : firstHeading.id;
        setCurrentHeadingId(currentTargetId);
        setCurrentHeadingIndex(
          newHeadingList.findIndex((i) => i.id === currentTargetId)
        );
      }
    });
    headings.forEach((heading) => {
      ob.observe(heading);
    });

    let prevPos2 = 0;
    const onScroll = debounce(() => {
      if (mdBody) {
        const isScrollDown = window.scrollY > prevPos2;
        prevPos2 = window.scrollY;
        if (isScrollDown) {
          const { top, height } = mdBody.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const readHeight = windowHeight - top;
          const readProcess = (readHeight / height) * 100;
          const result = readProcess >= 100 ? 100 : readProcess;
          setProgress(~~result);
        }
      }
    }, 50);

    // 解析文章字数
    if (mdBody) {
      const text = mdBody.textContent;
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
    <div className="h-max pt-1 pb-4 rounded-md sticky top-32 animate-fade-down delay-1000">
      <div className="relative">
        <span
          className="w-[2px] left-1 h-3 rounded-full bg-primary absolute transition-all duration-300 transform translate-y-1 ease-in-out"
          style={{
            top: `${(currentHeadingIndex / headingList.length) * 100}%`,
          }}
        ></span>
        {headingList.map(({ id, textContent, tagName }) => (
          <section
            title={textContent ?? undefined}
            className={cn(
              "text-sm font-thin cursor-pointer truncate transition-colors duration-300 ease-in-out",
              {
                "text-primary font-semibold": id === currentHeadingId,
              }
            )}
            key={id}
            style={{
              paddingLeft: `${~~tagName.toUpperCase().replace("H", "") * 14}px`,
            }}
            onClick={() => handleToView(id)}
          >
            {textContent}
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
