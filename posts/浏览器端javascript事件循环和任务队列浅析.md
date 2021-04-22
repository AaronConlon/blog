---
title: '浏览器端javascript事件循环和任务队列浅析'
date: '2021/4/20'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1618655108396-ce1ba6c80b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg4NzMxMjg&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1618655108396-ce1ba6c80b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg4NzMxMjg&ixlib=rb-1.2.1&q=80&w=400'
intro: '事件循环是 JavaScript 语言中非常重要的部分,理解事件循环有利于理解 JavaScript 的设计理念,让我们能编写更好的代码.本文用简单的术语对其进行总结.'
---

​        事件循环是 JavaScript 语言中非常重要的部分,理解事件循环有利于理解 JavaScript 的设计理念,让我们能编写更好的代码.本文用简单的术语对浏览器端的 JavaScript 事件循环和任务队列知识进行浅析和分享.

### 1. 简介

众所周知`JavaScript`是单线程语言,在某个时间点只能运行一项任务,这个限制降低了编程复杂度,我们不需要担心并发问题,只需要思考如何消除线程阻塞,如何编写简明健壮的异步代码以实现我们的需求.

在浏览器端,通常每一个浏览器标签都有自己的一个`事件循环(event loop)`机制来实现`非阻塞`.浏览器是多进程的,其同时管理多个彼此隔离的`事件循环`机制.

本文涉及浏览器端 JavaScript 的`函数调用栈` 、`回调队列`、`微任务`、`宏任务`等知识。

### 2. 调用栈

在直接分析`事件循环`之前,我们先来看看函数`调用栈`的一些前置知识.

`调用栈`是一个`LIFO`的队列,`事件循环`机制持续性地检查`调用栈`中是否有函数需要执行,主线程执行每一个函数的时候都将此函数压入`调用栈`,同时保存此函数相关的`局部变量`和`数据`等信息.

举个例子,我们在浏览器中执行一些测试代码,并且抛出异常.



![](https://flaviocopes.com/javascript-event-loop/exception-call-stack.png)

浏览器执行每个函数的时候都将函数压入`调用栈`,出错的时候可以很方便的提示我们出错的函数信息.

我们再来看一个简单的例子:

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

事件循环不断地检查调用栈中的函数,并且依次执行这些函数.

![](https://flaviocopes.com/javascript-event-loop/execution-order-first-example.png)

直到整个调用栈被清空.

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

如上所示,我们使用`setTimeout`函数,并且让它尽快执行.此时调用栈如下:

![](https://flaviocopes.com/javascript-event-loop/call-stack-second-example.png)

如此一来,`setTimeout`函数在调用栈中被转移了,直到栈底的`foo()`函数执行完毕才将`setTimeout`的相关部分传入`调用栈`,所有函数的执行顺序如下图:

![](https://flaviocopes.com/javascript-event-loop/execution-order-second-example.png)

传给`setTimeout`的函数,在`setTimeout`进入调用栈并且执行的时候,被转移到了哪里?

### 3. 事件循环

`JavaScript`主线程既可以在运行时将一些耗时亦或需要延后执行的任务单独放到`回调队列（callback queue）`中去，也可以接收浏览器其他线程发送过来的新任务，执行一些`“WebApi“`，尽管没有规范规定该如何实现，但每个浏览器都有自己的实现。

> **To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section.**

为了更好地理解Event Loop，请看下图(转引自Philip Roberts的演讲[《Help, I'm stuck in an event-loop》](http://vimeo.com/96425312))

![](https://miro.medium.com/max/700/1*iHhUyO4DliDwa6x_cO5E3A.gif)

`执行栈`内保存着当前运行的函数信息，`堆`内保存着变量、对象以及闭包作用域链等。

`JavaScript 主线程`通过`WebApi`将一些回调函数不断地添加到`回调队列中`。

当函数`调用栈（深度有限）`被清空的时候，便从回调队列中取出回调任务并执行。

> Callback Queue: 名为队列，实为回调函数的有序集合，主线程取用这些回调任务的顺序是不定的，满足条件的任务会逐一被取出压入调用栈中执行。

`回调队列`保存着等待执行的所有压入的回调函数，这里的回调函数是在一定的条件下被添加到这个集合中来的。

> Each [agent](https://tc39.es/ecma262/#sec-agents) has an associated event loop, which is unique to that agent.An [event loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop) has one or more task queues.

大部分任务来源于浏览器的渲染、用户的交互、本地和网络之间的 IO 事件以及 JavaScript 脚本。每一个任务循环具有一个或者多个任务队列。

为了更精细地控制队列内的不同级别的回调任务的执行顺序，让回调队列内的任务得到更优的时效性和效率平衡，不同的任务又分为：

- `宏任务(macrotasks)`：上图中`callback queue`内都是宏任务。
- `微任务（microtasks）`：存于独立的唯一队列。

让我们把视线从前面的那张流程图中转过来，事件循环需要更细粒度的控制流。

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1555240091093/6Ph81iBLm.png?auto=compress)

`MacroTask`和`MicroTask`的执行顺序和流程稍后进行分析。

我们可以从可操作粒度上体会不同的任务之间`“宏“`与`“微“`的区别（略微补充一些 nodejs 的内容）。

### 4. 宏任务和微任务

> 宏任务存于`Task queue`。

以下类型为宏任务：

- `setTimeout, setInterval, setImmediate(nodejs)`
- `I/O tasks`
- `IndexDB`
- `webWorkers postMessage`
- `UI`渲染任务
- `<script>`标签引入的代码
- ...



> 微任务存于`Job queue`。

以下为操作粒度更高，执行优先级更高的微任务：

- `Promise`
- `process.nextTick(Nodejs)`
- `MutationObserver`
  - [`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)接口提供了监视对DOM树所做更改的能力。它被设计为旧的Mutation Events功能的替代品，该功能是DOM3 Events规范的一部分。
- ...

微任务产生的时机在于：

- JavaScript 修改由`MutationObserver`监控的`DOM`节点
- 使用浏览器原生`Promise`



### 5. 宏任务和微任务的执行时机

浏览器执行一段 JavaScript 脚本的时候解释器将创建其全局执行上下文，同时创建一个`微任务队列（microtask queue）`以存放所有的微任务。

如上所述，在宏任务执行期间存在着产生若干微任务的时机，新增的微任务直接添加到微任务队列。

因此，事件循环中宏任务和微任务的执行流程如图所示：

![](https://mmbiz.qpic.cn/mmbiz_png/4yoHftkuXLfwIQFyvKsiaP92Rd8Qvor0A3hOwpJySwqnkt0mY2StK13icO1lcibonfzxiczrTibfQ0UKO8cJLe0y08g/0?wx_fmt=png)

通常情况下，在JavaScript引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务，此时微任务里新增的微任务也将马上被执行。

之后将执行渲染，后续则从宏任务队列中取出一个任务添加到主线程的调用栈中。

### 6. 简单测试题

如下代码按事件循环的理念来说，其执行结果如何？

```js
console.log('start');
setTimeout(() => console.log('a'))

Promise.resolve().then(() => {
  console.log('b');
}).then(() => {
  console.log('c');
})

setTimeout(() => console.log('d'))
Promise.resolve().then(() => console.log('e'))
console.log('end');
```

其输出顺序为：

```sh
start
end
b
e
c
a
d
```

主线程从上到下，依次输出`start`和`end`，接着微任务`b`和 `e`，同时产生的微任务输出 `c`，后续两个计时器`a`和`d`依次被打印。

### 最后

本文浅析了 JavaScript 在浏览器端的事件循环和任务队列的知识点，浅薄之见，如有错漏欢迎大家指正，谢谢。

### 参考

- [The JavaScript Event Loop](https://flaviocopes.com/javascript-event-loop/)

- [HTML Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

- [JavaScript中的事件循环与消息队列 - 简书](https://www.jianshu.com/p/50ab99baf026)

- [Understanding Event Loop, Call Stack, Event & Job Queue in Javascript | by Rahul Sagore | Medium](https://medium.com/@Rahulx1/understanding-event-loop-call-stack-event-job-queue-in-javascript-63dcd2c71ecd)

- [极客时间 - 李兵 - 浏览器工作原理与实践](https://time.geekbang.org/column/article/113399)

- [浏览器中的事件循环机制 - SegmentFault 思否](https://segmentfault.com/a/1190000012748907)

- [Task Queue and Job Queue - Deep dive into Javascript Event Loop Model](https://blog.greenroots.info/task-queue-and-job-queue-deep-dive-into-javascript-event-loop-model-cjui19qqa005wdgs1742fa4wz)

- JavaScript 事件循环：从起源到浏览器再到 nodejs - Node 地下铁

  

