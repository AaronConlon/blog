---
title: '创建一个支持commonjs和esm的混合npm包'
date: '2021/2/24'
tags:
- npm
mainImg: 'https://images.unsplash.com/photo-1613764225051-a4b7649e938c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1613764225051-a4b7649e938c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '如何创建一个同时支持 esm 和 commonjs 两种规范的混合包?'
---

我们如何能轻松地创建一个同时支持`ESM`和`Commonjs`规范进行引入的`NPM package`?

最好不需要创建两份源码,不需要使用诸如`webpack`之类的工具.

## 起始

这个问题由来已久,寻找一个使用单份源码创建一个轻松同时支持`Commonjs`和`ES Modules`的`NPM package`的解决方案可能会让人很迷惑.

> 同时支持`ESM`和`Commonjs`的`NPM Package`有时被开发者们称之为`Hybird package`,使用者可以轻松通过`import`或者`require`语法引入目标`package`.

对于这个话题,开发者们众说纷纭,我们可以在网上轻松找到众多相关话题和`"有效的解决方案"`.但是在许多场景下存在一定的缺陷,许多方案需要使用`Webpack`或者`Rollup`等工具,甚至使用自定义脚本和其他构建工具,亦或是创建和维护使用`Commonjs`和`ES Modules`规范编写的双重源码库,然而大多数方案都无法生成高效的纯`ESM`代码.

阅读[Node documentation](https://nodejs.org/api/)的时候,文档提及我们可以使用`.mjs`和`.cjs`扩展名来标识当前文件使用的是`ES Modules`规范或者`Commonjs`规范.

### 扩展名方案的问题

在说明我们最后的方案之前,让我们先来谈谈一些备受吹捧的解决技巧.

> 为何不使用`.mjs`或者`.cjs`扩展名来表明内部代码规范?

