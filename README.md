# Aaron Conlon's Blog

[中文](./README.zhCN.md)

Welcome to my personal blog: [i5lin.top](https://i5lin.top/)

## Tech Stack

This blog is built using the following technologies:

- [Next.js 14.2](https://nextjs.org/) with App Router
- [Tailwind CSS](https://tailwindcss.com/)
- Sitemap generation
- RSS subscription
- GitHub API integration
- Comment system for articles
- Open Graph support

## Features

- Responsive design for various devices
- Fast loading and excellent performance
- SEO friendly
- Support for Markdown articles
- Integrated GitHub content management
- Real-time comment functionality (powered by giscus)

## Running Locally

1. Clone the repository
   ```
   git clone https://github.com/AaronConlon/blog.git
   ```

2. Install dependencies
   ```
   cd blog
   npm install
   ```

3. Provide environment variables
   ```
   # .local.env
   # Fetch article and repository data
   GITHUB_TOKEN='xxxxxxxxxxxxxxxx'
   # Create webpage meta data
   DOMAIN='your-deploy-domain'
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser

## Notes

- Article data is stored in the open issues of the blog repository on GitHub
- Open source project is hosted in the personal GitHub repository
- Data requests are handled in api.ts with caching mechanisms

## Contributing

Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)