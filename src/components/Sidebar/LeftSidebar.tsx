"use client";

import { useEffect, useRef, useState } from "react";

export default function LeftSidebar() {
  const items = ["doing-lately", "projects", "blog", "contact"];
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const leftSidebar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (leftSidebar.current) {
      const sidebarItems =
        leftSidebar.current.querySelectorAll("span[data-key]");

      const ob = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0.1) {
              Array.from(sidebarItems).some((item) => {
                if (item.getAttribute("data-key") === entry.target.id) {
                  setCurrentItem(entry.target.id);
                  return true;
                }
                return false;
              });
            }
          });
        },
        { threshold: 0.5 }
      );
      items.forEach((item) => {
        const target = document.getElementById(item);
        if (target) {
          ob.observe(target);
        }
      });
    }
  }, []);
  return (
    <div
      className="fixed left-4 md:left-10 top-[50%] translate-x-[-50%] hidden md:flex gap-4 md:gap-8 z-10 flex-col"
      ref={leftSidebar}
    >
      {items.map((item) => (
        <span
          key={item}
          data-key={item}
          onClick={() => {
            document.getElementById(item)?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="bg-transparent border border-primary w-3 h-3 transform transition-all rotate-45 flex items-center justify-center"
        >
          {currentItem === item && (
            <span className="bg-primary w-2 h-2 inline-block"></span>
          )}
        </span>
      ))}
    </div>
  );
}
