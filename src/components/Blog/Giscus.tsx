"use client";

import { useEffect } from "react";

export default function GiscusContainer() {
  useEffect(() => {
    const container = document.querySelector(".giscus");
    let giscusDiv: HTMLDivElement | null = null;
    if (!container) {
      // create a container
      giscusDiv = document.createElement("div");
      giscusDiv.classList.add("giscus");
      document.body.appendChild(giscusDiv);
      giscusDiv.style.maxWidth = "760px";
    }
    return () => {
      if (giscusDiv) {
        document.body.removeChild(giscusDiv);
      }
    };
  }, []);
  return (
    <>
      <script
        src="https://giscus.app/client.js"
        data-repo="AaronConlon/blog"
        data-repo-id="MDEwOlJlcG9zaXRvcnkyOTkwODg4Mzk="
        data-category="Announcements"
        data-category-id="DIC_kwDOEdO7x84ChXnF"
        data-mapping="url"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        data-loading="lazy"
        crossOrigin="anonymous"
        async
      ></script>
    </>
  );
}
