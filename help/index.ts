const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const remark = require("remark");
const html = require("remark-html");

const postsDir = path.join(process.cwd(), "posts");

const getPostData = (slug: string) => {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const fileContent = fs.readFileSync(fullPath);
  const matterResult = matter(fileContent);
  return matterResult.data;
};

const getAllPostData = () => {
  const fileNames = fs.readdirSync(postsDir);
  const result = [];
  fileNames.forEach((fileName) => {
    let id = "";
    if (fileName.endsWith(".md")) {
      id = fileName.replace(".md", "");
      result.push({
        id,
        ...getPostData(id),
      });
    }
  });

  return result.sort((a, b) => b.date - a.date);
};

// return tags with title and uri target : slug or id,who care.
const getPostsData = () => {
  const allPostData = getAllPostData();
  const tagsObj = {};
  allPostData.forEach((postData) => {
    postData.tags.forEach((tag) => {
      if (tagsObj[tag] === undefined) {
        tagsObj[tag] = new Set();
        tagsObj[tag].add({
          title: postData.title,
          slug: postData.id,
        });
      } else {
        tagsObj[tag].add({
          title: postData.title,
          slug: postData.id,
        });
      }
    });
  });
  return tagsObj;
};

const getAllPostTitleAndSlug = () => {
  const allPostData = getAllPostData();
  return allPostData.map((postData) => ({
    slug: postData.id,
    title: postData.title,
  }));
};

const getPostContentWithHtml = async (content: string) => {
  const processdContent = await remark().use(html).process(content);
  return processdContent.toString();
};

const getPostSlugByTitle = (title: string) => {
  const allPostData = getAllPostData();
  let result = "";
  allPostData.forEach((postData) => {
    if (title === postData.title) {
      result = postData.title;
    }
  });
  return result;
};

export {
  getAllPostData,
  getPostsData,
  getAllPostTitleAndSlug,
  getPostData,
  getPostContentWithHtml,
  getPostSlugByTitle,
};
