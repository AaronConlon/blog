---
title: 'javascript异步定时器API之间的差异'
date: '2021/4/17'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1616602410944-3ca0544a4a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg2NDgyMjE&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1616602410944-3ca0544a4a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg2NDgyMjE&ixlib=rb-1.2.1&q=80&w=400'
intro: 'JavaScript 是单线程语言,使用异步并发模型处理异步任务.'
---

> 原文传送门 > [The differences between JavaScript’s asynchronous API timers](https://www.freecodecamp.org/news/the-differences-between-javascripts-asynchronous-api-timers-d916e0596716/)

JavaScript 上一个单线程语言,其使用异步并发模型处理异步逻辑.有趣的是,其处理异步任务的方式与传统的编程语言`Java`或者`C#`有所不同.

## Event loop

无论是浏览器还是`Nodejs`环境,JavaScript 都具有异步事件循环机制.

二者不同在于, `Nodejs`环境基于`libuv`.

> [libuv/libuv: Cross-platform asynchronous I/O](https://github.com/libuv/libuv)

