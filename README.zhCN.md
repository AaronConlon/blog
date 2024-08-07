# Aaron Conlon's Blog

欢迎访问我的个人博客：[i5lin.top](https://i5lin.top/)

## 技术栈

本博客使用以下技术构建：

- [Next.js 14.2](https://nextjs.org/) 与 App Router
- [Tailwind CSS](https://tailwindcss.com/)
- Sitemap 生成
- RSS 订阅
- 基于 GitHub API
- 文章评论系统
- Open Graph 支持

## 特性

- 响应式设计，适配各种设备
- 快速加载和优秀的性能
- SEO 友好
- 支持 Markdown 格式的文章
- 集成 GitHub 内容管理
- 实时评论功能（基于 giscus）

## 本地运行

1. 克隆仓库
   ```
   git clone https://github.com/AaronConlon/blog.git
   ```

2. 安装依赖
   ```
   cd blog
   npm install
   ```
3. 提供环境变量
   ```
   #.local.env
   # 获取文章和仓库数据
   GITHUB_TOKEN='xxxxxxxxxxxxxxxx'
   # 创建网页 meta 数据
   DOMAIN='your-deploy-domain'
   ```
4. 运行开发服务器
   ```
   npm run dev
   ```

5. 在浏览器中打开 `http://localhost:3000`

## 须知
- 文章数据存在 github 的 blog 仓库的 open issues
- 开源项目即个人 github 仓库
- 数据请求走 api.ts ，添加了缓存机制

## 贡献

欢迎提出问题或提交 Pull Requests。对于重大更改，请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)