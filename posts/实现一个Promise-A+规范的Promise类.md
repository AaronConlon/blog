---
title: '实现一个Promise-A+规范的Promise类'
date: '2021/5/12'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1616523197635-78aa12a1f36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjA3NDk4ODc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1616523197635-78aa12a1f36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjA3NDk4ODc&ixlib=rb-1.2.1&q=80&w=400'
intro: '为了学习 Promise 的原理，加深对异步 Promise 的理解，我们很有必要学习如何实现一个符合 Promise/A+ 规范的 Promise 类'
---

我之所以做这件事是因为我想更深入理解 `Promise` 的设计理念和设计原理，我看了一些文章和介绍，搜索了一些知识，也学习了其他人的 `Promise`实现源码。

这真的很令我振奋，通过实现一个符合`Promise/A+`规范的`Promise`类，我对`Promise`的理解有了不错的进步，那就废话少说，开始吧。



