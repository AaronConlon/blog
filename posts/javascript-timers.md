---
title: 'javascript timers'
date: '2021/4/23'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1617108029768-c12fff3d7754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTkxMzc5ODE&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1617108029768-c12fff3d7754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTkxMzc5ODE&ixlib=rb-1.2.1&q=80&w=400'
intro: '定时器是异步编程的众多前置知识之一，今天让我们来详细学习一下 JavaScript timer 的知识，点上这一技能点。'
---

定时器函数能够让我们在特定的时刻执行一个回调函数，今天我们来回顾一下`JavaScript`中的几个定时器相关的函数功能使用以及缺点分析，并且分析一个设计`尽可能`准确的定时器任务。

### 1. setTimeout

首先是`setTimeout`函数，用于在指定的时间延迟后执行一个回调函数，其语法为：

```js
let timeoutID = setTimeout(function[, delay, arg1, arg2, ...]);
let timeoutID = setTimeout(function[, delay]);
let timeoutID = setTimeout(code[, delay]);
```

首个参数通常是一个`函数`，另一种不推荐的危险选择是首个参数传入可执行的字符串,这将会在指定的 delay 毫秒后编译执行字符串。

`delay`参数是延迟的毫秒数，省略或者使用负数都将默认设置为 0，意为尽快执行。

第三可选参数则是传入此回调函数的参数（IE9 及其以下版本不支持此特性）。

此函数返回一个`timeoutID`是一个唯一的正整数，可以使用`clearTimeout(timeoutID)`来取消此定时器。

### 2. setTimeout 的问题

尽管`setTimeout`定义明确，用法清晰，但此函数依然有几个需要我们注意的问题。

首先，传入的回调函数的`this`指向性



### 参考

- [Creating Accurate Timers in JavaScript - SitePoint](https://www.sitepoint.com/creating-accurate-timers-in-javascript/)
- [JavaScript Timer Functions - Tutorial Republic](https://www.tutorialrepublic.com/javascript-tutorial/javascript-timers.php)