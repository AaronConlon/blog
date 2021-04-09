---
title: 'Javascript,I promise - 异步编程'
date: '2021/4/9'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1611923973164-e0e5f7f69872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5NzU1MTI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1611923973164-e0e5f7f69872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5NzU1MTI&ixlib=rb-1.2.1&q=80&w=400'
intro: 'Promise, JavaScript 世界中的异步处理对象.我阅读了 Dr.Axel 前辈的电子书,充满感激.'
---

虽然此前我已经接触过一些异步编程的概念,并且有过一定的实际运用.但是自我感觉,我对`JavaScript`异步编程的了解依然十分浅显,因此我打算再次对`JavaScript`中的异步编程进行学习和总结,然后分享出来.

# 1. 前文

在对`Promise`知识进行总结之前,我将回顾一部分`JavaScript`与异步编程相关的知识.

## 1.1 浅述 JavaScript 调用栈

当函数之间发生内嵌调用,将产生`函数调用栈`.

> `函数调用栈`是解释器追踪函数执行流的一种机制,函数入栈的同事也保存了其上下文环境.

```js
function h(z) {
  console.log(new Error().stack)
}
function g(y) {
  h(y + 1)
}
function f(x) {
  g(x + 1)
}
f(1)
```

如上述,随着调用函数`f(1)`,调用栈内开始存储函数`f(1)`,内部调用了`g(2)`也被存入调用栈,最后将`h(3)`存入调用栈,当前函数执行结束即将之从调用栈定移除,接着执行可能存在的剩余代码,最终调用栈被清空,执行流程回到全局作用域,最终打印如下:

```js
Error
    at h (REPL3:2:15)
    at g (REPL6:2:3)
    at f (REPL9:2:3)
    at REPL10:1:1
    at Script.runInThisContext (node:vm:133:18)
    at REPLServer.defaultEval (node:repl:474:29)
    at bound (node:domain:416:15)
    at REPLServer.runBound [as eval] (node:domain:427:12)
    at REPLServer.onLine (node:repl:793:10)
    at REPLServer.emit (node:events:388:22)
```

栈是有限度的,不同环境的栈空间大小不等,分配的栈空间被占满之后,将会引发栈溢出错误.



## 1.2 浅述浏览器事件循环

我们可以简单的认为每个浏览器`tab`运行于一个简单的`事件循环`进程来实现`非阻塞`,浏览器中的诸多单一任务,例如:

- 解析 HTML
- 执行脚本中的 JavaScript 代码
- 响应用户交互
- 异步网络请求
- 等等

这些任务形成了独立于主线程的`任务队列(task queue)`,所有任务只能逐一通知主线程进行处理.由于`JavaScript`的单线程限制,即使`Web Worker标准`允许`JavaScript`脚本创建多个线程,但是子线程由主线程控制,且不可操作`DOM`,可以说`JavaScript`的本质依然是`单线程`.

如下是`Philip Roberts`演讲的时候使用的示意图:

![](https://www.ruanyifeng.com/blogimg/asset/2014/bg2014100802.png)

当主线程执行栈上的同步任务执行完毕之后,就去读取`task queue`,按队列先进先出的属性,依次获取任务进行处理,然后重复检查主线程执行栈,通常我们为异步事件编写的`回调函数`,就进入了任务队列.

如果再细分任务队列中的任务,依然可以分为:

- 微任务(micro task)
- 宏任务(macro task)

像`setTimeout`和`setInterval`则是宏任务.

> **当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行**。

## 1.3 定时器简析

`setTimeout(callback, ms)`函数创建了一个定时器等待若干毫秒, 然后将`callback`放入`task queue`,并且在等待计时器的其间脱离了主线程,这也就意味着如果主线程执行了耗时的同步任务,则任务队列被读取的时间就将被延迟了,因此可能不会在`ms`毫秒后执行`callback`回调函数.

实际延时还有其他的影响因素.

- 不同浏览器具有自己的`DOM_MIN_TIMEOUT_VALUE`,最小延时值.
- 为了优化后台 tab 的加载损耗(以及降低耗电量),在未被激活的 tab 中定时器的最小延时限制为`1S`.
- 追踪型脚本延时在后台 tabs 中,这个最小延时限制是 `10S`,这个限制会在文档第一次加载后的`30s`后生效.



## 1.4 显示 DOM 变化

对于大多数`DOM`元素的变化来说,它们的改动数据并不是实时更新的,`DOM`和`布局`的改动也是通过`事件循环`机制来实现的.如果需要频繁更新`DOM`,可以考虑`requestAnimationFrame()`函数.

# 参考

- [JavaScript 运行机制详解：再谈Event Loop - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)