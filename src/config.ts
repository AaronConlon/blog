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
    {
      name: "Agent 写作(未发布公开服务)",
      description:
        "通过调用 Codex 的功能，实现本地化的 Agent 协作写作、调整、整理、生图、发布等功能，辅助用户编写微信公众号。",
      homepage: "",
      topics: ["本地平台", "AI"],
      cover:
        "https://de4965e.webp.li/blog-images/2026/07/f8f83d581f53a7deff5389b638b55328.png",
    },
  ],
  og: {
    imageUrl:
      "https://de4965e.webp.li/blog-images/2024/08/8a13bcbe6beda1a0f2ee86f9e6ee92d4.png",
  },
  rss: "/rss.xml",
} as const;
