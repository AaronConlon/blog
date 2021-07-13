---
title: 'React中的CSS样式隔离方案浅析'
date: '2021/7/13'
tags:
- React
- Css
mainImg: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYxMjA2NjU&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYxMjA2NjU&ixlib=rb-1.2.1&q=80&w=400'
intro: '在 React 开发中，组件之间的样式因为命名问题容易导致样式污染，为了解决这个问题引申出了不同的 CSS 样式隔离方案。'
---

在 React 开发中，组件之间的样式因为命名问题容易导致样式污染，为了解决这个问题引申出了不同的 CSS 样式隔离方案，今天要谈谈几种方案：

- 行内样式
- CSS-in-JS
- Webpack loader
- Dataset 选择器声明

# 前言

React 官方并没有规定如何在 React 应用中如何写 CSS，即使很多官方指南会写一些行内样式代码，但是官方并不推荐使用这种方式，这种方式的性能并不好。

今天，让我们来看看社区对于 CSS 样式隔离的方案选择都有什么。

# 1. 方案

### 1.1 行内样式

行内样式天生具有极高的优先级，除了使用`!important`对非行内样式进行标记，使得其能覆盖非`!important`样式之外，行内样式将会直接决定了元素如何显示。

