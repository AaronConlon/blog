"use client";

export default function GiscusContainer() {
  return (
    <>
      <div className="giscus max-w-[760px] w-full mx-auto p-1 my-4 min-h-[400px] border"></div>
      ;
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
