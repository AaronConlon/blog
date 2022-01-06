---
title: "Next.js绝对导入和别名导入"
date: "2021/12/18"
tags:
  - Next.js
mainImg: "https://images.unsplash.com/photo-1499714920856-1236218b4917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzk4MTkzNDU&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1499714920856-1236218b4917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzk4MTkzNDU&ixlib=rb-1.2.1&q=80&w=400"
intro: "在写 Next.js 项目的时候需要处理复杂的相对导入问题，于是学到了如何处理别名"
---

# 前言

在使用`vscode`开发前端`Next.js`项目中使用复杂的相对导入容易出错且很“碍眼” :smile:。

于是查了查如何使用别名和绝对导入，仅以此文记录 📝 此问题，希望笔者和机缘巧合之下阅读到此文的读者有所得。

# 浅解

自从 Nextjs.js `v9.4`开始，用户可以很简单地用上绝对导入和别名这个特性，为什么我们需要如此？

当手头的项目层级与日递增之后，难免出现以下代码段：

```js
import Heading from "../../../../components/Something";
```

我们将复杂的组件拆分成独立的小组件时，难免需要导入一些模块，如果光凭手动导入，出错在所难免。即使诸如`vscode`此类编辑器提供了自动导入的插件或机制，在代码上也不够美观（众口难调）。

再看以下代码段：

```jsx
import Heading from "components/Something";
```

是否简单明了一些？

接下来看看我们需要额外做什么配置来实现这个功能。

## 绝对导入

我们只需要为 `Next.js`项目配置一个编译选项即可，如果你是`js`项目，则在根目录创建`jsconfig.json`配置文件，如下实例：

> 如果是 TypeScript 项目，则在 tsconfig.json 中配置

```json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

只需要添加一个`baseUrl`来指定根目录，后续的导入命令如此类：

```jsx
import Heading from "components/Something";
```

就会在根目录下解析`components`目录下是否有组件`Something`。

笔者手头的项目根目录下具有诸如：

- libs
- styles
- components
- ...

若干个目录，配置了此字段后对于引入资源模块变得相对简单了些。

## Next.js Alias 别名

绝对导入或许会让你对本地模块和第三方模块重名产生担忧 😟，那么我们也可以使用别名来映射某个路径，这样更灵活一些。

举个例子：

手头的项目具有一个 `布局系统`，我们将所有的布局组件全部放在`components/Layout`目录下，如果是绝对导入，则需要这样：

```jsx
import Container from "components/Layout/Container";
```

我们可以更简单，只需在编译配置里增加`paths`配置，依然是`jsconfig.josn`文件：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/layout/*": ["components/Layout/*"]
    }
  }
}
```

> 不要忽略配置`baseUrl`字段，修改配置之后需要重启开发环境。

此时，我们便可以这样导入模块：

```jsx
import Container from "@/layout/Container";
```

上述配置文件中，每一个键字符串都可以灵活配置成你或团队内一致认可的关键字。

最后，👏🏻 欢迎探讨和分享。

# 参考

- [Next.js Absolute Imports and Aliases](https://ahmadawais.com/next-js-absolute-imports-aliases/)
