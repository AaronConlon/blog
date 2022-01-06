---
title: "基于GitHub的评论组件(React+Next.js)"
date: "2021/12/21"
tags:
  - React
  - Next.js
  - Github
mainImg: "https://images.unsplash.com/photo-1551302602-838bcb66b6d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAwMzQzMDM&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1551302602-838bcb66b6d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAwMzQzMDM&ixlib=rb-1.2.1&q=80&w=400"
intro: "早之前使用 hexo 搭建博客的时候，评论系统用过 Gitalk 和 Gitment，现在有需要为我的某个应用写一个评论组件，于是基于 Next.js 写了一个。"
---

### 前言

此前用过 Gitalk 和 Gitment，最近又有需求为应用添加一个评论系统，想着干脆自己折腾一个，既可以增强开发能力，提升经验，又可以为应用添加一个定制的评论系统，一举两得，于是有了这篇文章。

> ps: 已有大神开发成品[utterances](https://utteranc.es/),简单易用，本文和笔者开发的组件处于基础阶段，仅供学习。

### OAuth 浅解

### 过程

首先，思考了技术可行性:

- GitHub: 既可以做认证又可以提供一系列的接口来保存评论和创建或编辑评论等
- Next.js + Next-auth 可以轻松实现账户认证功能

#### GitHub 相关

登录 `GitHub`账户后前往设置 - 开发者设置 - OAuth Apps 选项处，右上角添加新的应用。

逐一填写应用名、主页（开发时填写 http://localhost:port 即可）、认证回调地址。

由于笔者使用`Next.js+Next-auth`，按`Next-auth`文档指引这里填写：`http://localhost:3000/api/auth/callback/github`。

创建成功后会生成两个关键数据作为认证凭证，后续会用到，分别是：

- client id
- Client secret(可以有多个)

### Next.js 相关

稍等，由于时间有限，我采用了 Next-auth 这个库做第三方认证，最后做好了。但是不够稳定，在 github 的认证请请求中容易超时无响应，我没有时间再处理这个问题了，于是使用了第三方的库:utterances!

我会回来完善我的这个库的，一旦我确认了我的工作之后！！！
