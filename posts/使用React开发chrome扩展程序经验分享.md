---
title: '使用React开发chrome扩展程序经验分享'
date: '2022/2/7'
tags:
- React
- Chrome 扩展
mainImg: 'https://images.unsplash.com/photo-1607970669494-309137683be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQyMTU0MDQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1607970669494-309137683be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQyMTU0MDQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '献给我开发的第一个完整的 chrome 扩展：岚'
---

### 前言

我每天都在用浏览器，不知道哪一天起想要写一个自己的新标签页扩展。

在那之后，我去看了 `chrome` 的文档，去看了 `github` 上一些开发示例，一步步去学习如何写扩展。

经过一段时间的反复修改、重构（重写）、删减，终于提交了第一版本的源代码。

> 源代码：[youyiqin/lan](https://github.com/youyiqin/lan/tree/main)

### 起步

#### Vite

第一步：配置开发环境。

网上有很多 `chrome` 开发的脚手架和模板，我们可以选择适合自己的去作为整个扩展的基础部分。

但我决定从零开始，逐步搭建整个应用。

整体技术栈如下：

- `Vite` 快速打包构建
- `React` 创建页面和功能
- `ESLint`、`Prettier` 提供规范+格式化代码
- `nvm` Node 版本控制
- `Git` 代码版本控制
- `TypeScript` 更好的类型系统支持

上述内容不一一介绍，只是提及一些关键的点。

说穿了，我们还是开发 `chrome` 的扩展。因此，不能用以往的思路去配置 `package.json` 的 `scripts` 命令。

核心在于，我们要用 `Vite` + `React` 互相配合，将代码打包好。

于是，我单独增加了一条构建命令`build:dev`，实例如下：

```json
{
  "name": "lan",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build:dev": "export DEV=dev && tsc && vite build",
    "build": "tsc && vite build && uglifyjs dist/bg.js -o dist/bg.js && uglifyjs dist/once.js -o dist/once.js",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@types/chrome": "^0.0.176",
    "@types/lodash": "^4.14.178",
    "@types/react": "^17.0.33",
    "@types/react-dom": "^17.0.10",
    "@vitejs/plugin-react": "^1.0.7",
    "eslint": "^8.6.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-react": "^7.28.0",
    "fast-glob": "^3.2.10",
    "lodash": "^4.17.21",
    "prettier": "^2.5.1",
    "react-icons": "^4.3.1",
    "sass": "^1.48.0",
    "stylelint-config-prettier": "^9.0.3",
    "stylelint-config-sass-guidelines": "^9.0.1",
    "stylelint-prettier": "^2.0.0",
    "typescript": "^4.4.4",
    "uglify-js": "^3.15.0",
    "vite": "^2.7.2"
  }
}
```

`"build:dev": "export DEV=dev && tsc && vite build"`: 设置一个环境变量，开发内用于调试，然后通过 tsc 编译 TypeScript 代码，再通过 vite 去构建。

在正式构建的时候，提前使用`uglifyjs`去压缩混淆两个单独的`js`文件，其他的`tsx/ts`文件由`vite`处理即可。

同时，还修改了`vite.config.ts`配置文件如下:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fg from "fast-glob";
const isDev = process.env.DEV === "dev";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "watch-external", // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394#63548394
      async buildStart() {
        const files = await fg(["public/**/*"]);
        for (let file of files) {
          this.addWatchFile(file);
        }
      },
    },
  ],
  build: isDev
    ? {
        outDir: "lan_crx",
        watch: {},
        sourcemap: true,
      }
    : {},
});

```

针对开发环境，修改了构建的目录并且增加了 `sourcemap` 功能便于调试和阅读浏览器加载的代码。

其中关键在于`watch`键，这让我们能够在更新了源代码的时候让 `vite` 去重新`build`整个应用。

> 笔者对热更新和 `chrome`如何配合使用依然没有头绪，如果您有所了解，非常欢迎告知👏🏻

构建后的代码依然被浏览器所访问到，我们暂时只能手动刷新浏览器页面去查看效果。

上述配置中，单独增加了一个`watch-external`插件去监听文件变动，这部分`public`目录内的资源和配置文件是不需要 `vite` 处理的，我们只需要在更新的时候`copy`过去即可。

#### Chrome 辅助

在开发中回用到 `chrome`的很多`API`，这一块需要我们在`tsconfig.json`中的编译选项中增加:

`types`类型支持。我的配置文件如下：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client", "chrome"]
  },
  "include": ["./src"]
}
```

如上所示，单独增加了`chrome`的类型。此时，编辑器中就会为代码进行提示了，方便我们使用浏览器的接口。

> 如果不使用 TypeScript 开发，则使用 `jsconfig.json`进行配置

#### 代码质量

关于代码质量和规范的问题，笔者会另开一个文章单独来讲，这里暂时🕊了。

### 核心

开发环境配置好之后，我们就可以开始设计和编写整个应用了。

在一切开始之前，首先最应该做的事情就是明确所有的功能。

绝不能走一步算一步！

![](http://image.biaobaiju.com/uploads/20190624/12/1561351364-QyDkwGOYbE.jpg)

话说回来，我的扩展是一个简单的新标签页替代品。`chrome` 默认的标签页不符合我的需求，我得让新标签页更简单，仅仅支持以下几个功能：

- 极简风！删除一切花里胡哨。
- 支持超高清壁纸（我真的太爱壁纸）
- 支持下载壁纸
- 🍅番茄钟 简单的自定义倒计时
- 搜索框！通过输入字母组合切换搜索引擎，暂时支持以下几种
  - 谷歌
  - 必应
  - YouTube
  - github
  - 知乎
- 设置
  - 图标大小
  - 搜索框新页面打开方式
  - 番茄钟倒计时时间
  - 搜索框使用简介

确认了需求，就可以一个一个地实现了。

这里歪楼去谈谈`manifest.json`这个扩展核心配置文件：

```json
{
  "name": "岚",
  "description": "极简的新标签页插件，献给喜欢壁纸和极简风格的你。",
  "version": "1.0",
  "manifest_version": 3,
  "permissions": ["storage", "downloads", "unlimitedStorage"],
  "icons": {
    "16": "icons/16.png",
    "32": "icons/32.png",
    "64": "icons/64.png",
    "128": "icons/128.png"
  },
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "background": {
    "service_worker": "bg.js"
  }
}
```

其中三个权限分别对应着某些功能，尤其是最后一个无限制的`storage`存储空间，这是因为默认的`storage`不足以保存超高清的图片`base64`字符串，因此必须申请更多空间。

此外，核心代码中有一个点需要注意，来看看`main.tsx`文件：

```tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { getObjFromStorage } from "./utils/index";
import "./style/global.sass";
import { iconSize } from "./types/index";

const promiseArr = [
  getObjFromStorage("wallpaper"),
  getObjFromStorage("icon_size"),
  getObjFromStorage("tomato_seconds"),
  getObjFromStorage("open_type"),
];
Promise.all(promiseArr).then((props: any[]) => {
  const [wallpaper, icon_size, tomato_seconds, open_type] = props;

  ReactDOM.render(
    <React.StrictMode>
      <App
        wallpaper={wallpaper.wallpaper}
        icon_size={icon_size.icon_size as iconSize}
        tomatoSeconds={tomato_seconds.tomato_seconds}
        openType={open_type.open_type}
      />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
```

整个应用的初始配置都是写在`storage`中的，因此需要用异步的方法获取到配置再渲染到页面中。

> 上述代码中使用单独一条条的配置去保存数据看起来非常“low”，请原谅😂，这是笔者第一个 chrome 扩展~

然后，倒杯茶。

开始 coding 吧。

### 最重要

啥是最重要的？在我写完之后，我才知道最重要的是让人用我的扩展。

这部分比开发更难。

### 其他

笔者也是在学习中尝试编写扩展，由于时间关系功能相对简陋。前期甚至加上了很多其他功能，并且来回反复修改，最后发现并没有什么必要将这些功能集成到这个扩展中来。

很多东西都是在尝试，接下来有很多新的东西可以忙活了。

如果你想体验一下我的扩展，👏🏻欢迎联系我。
