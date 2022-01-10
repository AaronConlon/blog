---
title: 'JavaScript的闭包'
date: '2022/1/9'
tags:
- JavaScript
- 面试题
mainImg: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE3NDI2MDk&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE3NDI2MDk&ixlib=rb-1.2.1&q=80&w=400'
intro: '闭包到底是什么玩意？'
---

### 前言

笔者从事前端开发的工作已经由一年多了，但是到现今为止依然不能很好地跟人解释什么是闭包。

仅以此文，再次尝试解释什么是闭包，希望对你有所帮助，这对我很有意义。

### 闭包 Closure

> 一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**（**closure**）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。
>
> ​																																			from MDN

有两种情况需要特别注意：

1. 函数作为返回值
2. 函数作为参数被传递



### 参考

- [闭包 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
