---
title: 'javascript事件循环浅析'
date: '2021/4/20'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1618655108396-ce1ba6c80b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg4NzMxMjg&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1618655108396-ce1ba6c80b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg4NzMxMjg&ixlib=rb-1.2.1&q=80&w=400'
intro: '事件循环是 JavaScript 语言中非常重要的部分,理解事件循环有利于理解 JavaScript 的设计理念,让我们能编写更好的代码.本文用简单的术语对其进行总结.'
---

​        事件循环是 JavaScript 语言中非常重要的部分,理解事件循环有利于理解 JavaScript 的设计理念,让我们能编写更好的代码.本文用简单的术语对其进行总结.

### 1. 简介

众所周知`JavaScript`是单线程语言,在某个时间点只能运行一项任务,这个限制降低了编程复杂度,我们不需要担心并发问题,只需要思考如何消除线程阻塞,如何编写简明健壮的异步代码以实现我们的需求.

在浏览器端,通常每一个浏览器标签都有自己的一个`事件循环(event loop)`机制来实现`非阻塞`.浏览器是多进程的,其同时管理多个彼此隔离的`事件循环`机制.

> [Web Workers](https://flaviocopes.com/web-workers/)有自己的事件循环机制.

如此一来,我们只需要关心如何当前页面编码的`阻塞因素`在哪,以及如何消除阻塞.

### 2. 阻塞事件循环

任何耗时的 `JavaScript`代码在主线程执行的时候都会阻塞事件循环,也就意味着阻塞了`事件循环`中的任务执行,从而引发页面卡顿,甚至是无响应.

几乎所有的`I/O` 操作在 `JavaScript`中都是非阻塞的,例如`网络请求`,`Nodejs 文件系统`等等.

`回调`在`JavaScript`中被广泛使用,`ES6`更是新增了`Promise`规范,进一步增强了异步编程的可用性,这一切都是为了让开发者能更方便的编写高效无阻塞的代码.



### 3. 调用栈

`调用栈`是一个`LIFO`的队列,`事件循环`机制持续性地检查`调用栈`中是否有函数需要执行,主线程执行每一个函数的时候都将此函数压入`调用栈`,同时保存此函数相关的一些`变量`和`数据`等信息.

举个例子,我们在浏览器中执行一些测试代码,并且抛出异常.



![](https://flaviocopes.com/javascript-event-loop/exception-call-stack.png)

浏览器执行每个函数的时候都将函数压入`调用栈`,出错的时候可以很方便的提示我们出错的函数信息.

### 4. 事件循环

我们来看一个简单的例子:

```js
const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
  console.log('foo')
  bar()
  baz()
}
foo()
// output
foo
bar
baz
```

上述示例执行的时候,首先调用`foo()`,然后在`foo()`中调用`bar()`,接着调用`baz()`,此时调用栈的结构大致如下:

![](https://flaviocopes.com/javascript-event-loop/call-stack-first-example.png)

事件循环持续性的检查调用栈中的函数,并且依次执行这些函数.

![](https://flaviocopes.com/javascript-event-loop/execution-order-first-example.png)

直到整个调用栈被清空.



### 5. 执行队列函数

上述的示例简单来说就是:`JavaScript`不断按顺序地执行函数代码流.

但是,我们可以推迟一些`函数`的执行时间,让它们在`调用栈`被清空的时候再执行.稍微修改一下上述代码示例:

```js
const bar = () => console.log('bar')

const baz = () => console.log('baz')

const foo = () => {
  console.log('foo')
  setTimeout(bar, 0)
  baz()
}

foo()
// output
foo
baz
bar
```

如上所示,我们使用`setTimeout`函数,并且使用超时时间为`0ms`,让它尽快执行.此时调用栈如下:

![](https://flaviocopes.com/javascript-event-loop/call-stack-second-example.png)

如此一来,`setTimeout`函数在调用栈中被转移了,直到栈底的`foo()`函数执行完毕才将`setTimeout`的相关部分传入`调用栈`,所有函数的执行顺序如下图:

![](https://flaviocopes.com/javascript-event-loop/execution-order-second-example.png)

传给`setTimeout`的函数,在`setTimeout`进入调用栈并且执行的时候,被转移到了哪里?

### 6. 消息队列

> 事件循环具有"执行至完成"的重要概念,每一个消息被执行至完成,其他的消息才会被执行,这种模式避免了抢占问题,同时也有其缺点,当此消息较为耗时的时候,会阻塞主线程.

当`setTimeout()`函数执行的时候,JavaScript 引擎按其第二个参数使用了`timer`计时器,传入`setTimeout`函数的`bar()`被转移到了`消息队列(the message queue)`中.

> 一个 JavaScript 运行时包含一个待处理消息的消息队列,每一个消息都关联着一个用于处理此消息的回调函数.

事件循环机制赋予`调用栈`更高的优先级,直到`调用栈`被清空,才开始执行`消息队列`中的回调函数.

也就是说,一旦我们将某些任务转移到`消息队列`,主线程便不必关心其内部实现,浏览器提供了单独的线程来支持其功能,就像在这里,即使`setTimeout`设置其延时时间为`10s`,主线程不会等待`10s`的时间.

### 7. ES6 任务队列

`ES6`新增`Promise`和`Job queue`,二者息息相关.

`Promise`能让异步函数尽快执行,而不是将其放在`调用栈`的末尾.

# 参考

- [The JavaScript Event Loop](https://flaviocopes.com/javascript-event-loop/)