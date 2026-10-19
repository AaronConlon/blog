export const CONFIG = {
  author: {
    name: "AaronConlon",
    description:
      "我是一名前端经验扎实、也能处理服务端工作的全栈开发者，喜欢把想法做成可用、可靠的产品。",
    githubProfile: "https://github.com/AaronConlon",
    twitterProfile: "https://twitter.com/AaronConlonDev",
    medium: "https://medium.com/@rivenqinyy",
    devProfile: "https://dev.to/aaron_conlon",
    juejinProfile: "https://juejin.cn/user/2013961032055566",
    email: "rivenqinyy@gmail.com",
  },
  projects: [
    {
      name: "upy",
      description:
        "轻量级 Go 单二进制 Web 部署与运维工具。零外部依赖、极低内存占用，支持从 GitHub Releases 或本地 bundle 秒级部署 SPA 静态应用、Docker 容器与 Systemd 原生服务，内置磁盘维护与约定备份。",
      homepage: "https://github.com/AaronConlon/upy",
      topics: ["Go", "DevOps", "部署工具"],
      cover: "/projects/upy-cover.png",
    },
    {
      name: "微稿 MicroDraft",
      description:
        "微稿是一款面向个人创作者的本地优先写作工具，通过对话打开思路，支持 Markdown 与可视化编辑、微信公众号排版、AI 协作和素材管理，帮助你从一闪而过的念头写成可以发布的初稿。",
      homepage: "https://microdraft.i5lin.top/",
      topics: ["写作工具", "AI", "微信公众号"],
      cover: "https://microdraft.i5lin.top/og-image.png",
    },
    {
      name: "Slokit Analytics",
      description:
        "Slokit Analytics 是一款轻量、隐私友好的 Web Analytics 平台，帮助独立开发者了解访问量、用户来源、热门页面与访问趋势，让每一次访问都变得可理解、可优化。",
      homepage: "https://slokit-gateway.i5lin.top/",
      topics: ["Web Analytics", "隐私友好", "Cloudflare"],
      cover: "https://slokit-gateway.i5lin.top/og-image.png",
    },
    {
      name: "Codia",
      description:
        "Codia 是一个面向人类和 API 的代码图片生成工具。通过友好的 Playground UI 和 API-first 渲染能力，把代码快速生成适合文档、博客、社媒与自动化工作流使用的漂亮图片。",
      homepage: "https://codia.i5lin.top/",
      topics: ["Web 工具", "API", "代码图片"],
      cover: "https://codia.i5lin.top/og-image.png",
    },
    {
      name: "Eye宝",
      description:
        "Eye宝是一款面向家庭的智能眼健康助手，集在线问诊、视力档案、预约记录与专业智能体咨询于一体，帮助用户更轻松地了解视力状况、管理眼健康，让每一次看见都更安心。",
      homepage: "https://demo.i5lin.top/",
      topics: ["Web 应用", "AI", "眼健康"],
      cover:
        "https://de4965e.webp.li/blog-images/2026/07/a62b08226d4b7604c7191170cb90b7b1.png",
    },
    {
      name: "Sisyphus 西西弗标签页",
      description:
        "Sisyphus 是一个为阅读者设计的新标签页插件。精选来自经典文学、哲学与历史作品中的名言，在碎片时间中重新发现思考。",
      homepage:
        "https://chromewebstore.google.com/detail/tabx-make-tab-management/jomfeifdkncokmfdhinficpdhohfiifj",
      topics: ["Chrome 扩展"],
      cover:
        "https://de4965e.webp.li/blog-images/2026/07/82a0d5614581a45c4c6309920eb36538.png",
    },
    {
      name: "OVO 轻量化分布式容器部署平台",
      description:
        "一键管理，轻量化部署，每台 VPS 都在掌控之中。OVO 通过 Server + Client 架构，为 Docker Compose 服务提供实时日志、任务调度、控制命令和自动部署能力。",
      homepage: "https://ovo.i5lin.top",
      topics: ["Web 平台"],
      cover:
        "https://de4965e.webp.li/blog-images/2026/07/8581b8f2a4b0fa4067a10b339b63568f.png",
    },
  ],
  og: {
    imageUrl:
      "https://de4965e.webp.li/blog-images/2024/08/8a13bcbe6beda1a0f2ee86f9e6ee92d4.png",
  },
  rss: "/rss.xml",
} as const;
