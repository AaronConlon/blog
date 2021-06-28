---
title: '动手写一个chrome扩展程序'
date: '2021/6/28'
tags:
- chrome
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1547190027-9156686aa2f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjQ4ODg5NDQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1547190027-9156686aa2f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjQ4ODg5NDQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '动手写一个 chrome 扩展程序，从零配置开发环境，一步步完成覆盖默认 chrome 标签页的扩展程序 yoyo'
---

我上周写了一个半成品 chrome 扩展程序，使用的是`chrome-extension-cli`这个脚手架，版本还是`v2`的，作者似乎很久没更新了，之前答应好朋友做为她添加`搜索框`的特性，鸽子王放了鸽子。我的我的。

## 设置开发环境

开发环境目标如下：

- 使用 `react` 框架进行 `override tabpage` 的开发
- 支持`swc`编译和`typescript` + `react`开发
- 支持`eslint`格式验证
- 支持`sass`
- 支持图片导入和处理



首先，使用`yarn`初始化项目目录。

### wepack + react + ts + swc

接着，配置`webpack+ts`，使用`swc`代替`ts-loader`处理`ts`文件。

需要安装的库如下：

##### 开发模式依赖安装

- @types/react
- @types/react-dom

- typescript
- webpack
- webpack-cli
- swc
- webpack-dev-server

##### 构建模式依赖安装

- react react-dom

##### 几个配置文件

- `tsconfig.json`

```json
{
  "include": ["./src/*/*"],
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "target": "ES6",
    "module": "CommonJS",
    "lib": ["esnext", "DOM"],
    "allowJs": true,
    "jsx": "react-jsx",
    "sourceMap": true,
    "removeComments": true,
    "noEmit": false,
    "strict": true,
    "alwaysStrict": true,
    "noUnusedLocals": true
  }
}
```

##### package.json

```json
```



## 功能开发

目标如下：

- 支持搜索框组件

- 支持天气定位
- 支持全局显示和隐藏组件控制
- 支持时间和日期显示
- 支持每日毒鸡汤
- 支持随机每日壁纸
- 支持设置本地壁纸不变
- 支持下载壁纸
- 支持留言，所有人可见
