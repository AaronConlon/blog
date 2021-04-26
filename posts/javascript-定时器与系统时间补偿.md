---
title: 'javascript 定时器与系统时间补偿'
date: '2021/4/23'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1617108029768-c12fff3d7754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTkxMzc5ODE&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1617108029768-c12fff3d7754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTkxMzc5ODE&ixlib=rb-1.2.1&q=80&w=400'
intro: '定时器是异步编程的众多前置知识之一，今天让我们来详细学习一下 JavaScript timer 的知识，点上这一技能点。'
---

今天我们来回顾一下`JavaScript`中的几个定时器相关的函数功能使用以及知识点分析，并且使用`时间补偿`机制创建`尽可能准确`的定时器任务。

## 1. 计时器函数

我们需要明确的是，`计时器函数`并不是`ECMAScript`规范或者`v8`引擎实现的一部分，无论是在浏览器端还是在`Nodejs`端，`setTimeout`和`setInterval`这类定时器函数都是`globalThis`接口的一部分.

> globalThis: ES2020 增加的标准，旨在统一不同环境下的全局对象访问入口，例如 nodejs 之 global，浏览器之 Window / this / frames, web workers 之 self。

### 1.1 setTimeout

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

### 1.2 setInterval

`setInterval`语法上与`setTimeout`类似，但是我们可以使用此函数在指定的时间间隔下将相同的回调函数加入宏任务队列。

在某些场景下我们可以使用`setInterval()`函数处理一些需要间歇性执行的任务，并且可以保存其返回值`intervalID`，通过`clearInterval(intervalID)`函数终止此功能。

### 1.3 setImmediate

`setImmediate`用于`Nodejs`端，其具有与`setTimeout(fn,0)`极其类似的功能，二者都将加入到宏任务队列中，但是在`Nodejs`中二者却又处于不同的执行阶段，在一个异步流程中，`setImmediate()`会比`setTimeout(fn, 0)`先执行，也许你会对二者的执行顺序有所疑惑，不急，待会我们来看看其中的原理。

> Nodejs 中 setTimeout(fn) 或者 setTimeout(fn, 0) 会被强制改为`setTimeout(fn, 1)`

### 1.4 定时器 this

上述几个定时器相关的函数在日常的使用时，需要注意`this`变量的指向问题可能引发的不一致异常。

首先，传入的回调函数的`this`指向性在不同版本的`nodejs`和不同版本`浏览器`之间有所不同，并且受到`严格模式`的影响，最好的选择是在必要情况下使用`es6 bind()`函数显式的绑定`this`，亦或是不在回调函数中使用`this`。

### 1.5 最小延迟时间

> 1. If timeout is less than 0, then set timeout to 0.
> 2. If nesting level is greater than 5, and timeout is less than 4, then set timeout to 4.

根据`whatwg`的规范说明，延时参数在超过 5 层的嵌套后最小延迟时间为`4ms`。

未被激活的后台浏览器标签出于降低消耗和节省电量等原因，最小延时限制为`1000 ms`。这个设计也许会对某些场景下页面转向后台再转到前台的时候定时器异常，这种情况下我们可以使用一下功能监听页面变动：

- window.focus + window.blur
- visibilityChange event

举个例子，为`document`添加`visibilityChange`事件监听,页面恢复的时候修正计时器。

## 2. 定时器线程和执行时机

对于浏览器来说，我们先来看看`chromium`的进程示意图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/128265bfc2be4ede80c06927c6e78d0b~tplv-k3u1fbpfcp-zoom-1.image)

`定时触发器`线程和`JS`引擎线程是分开的，这也是我们编写的`定时器`函数并不会阻塞`JS`主线程的原因。

再来看看`nodejs`事件循环示意图：

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/carbon.png)

我们回到这个问题： `Nodejs`端，`setTimeout(fn)`和 `setImmediate(fn)`谁先执行？

首先我们要明确，`timers`定时器执行`setTimeout`和`setInterval`的回调，`check`阶段执行`setImmediate`的回调。

从上述`Nodejs`事件循环流程图可以看出，`timers`和`check`二者的执行不在一个阶段。

在一个异步流程里，`setImmediate`会先执行。

```js
function foo() {
  setTimeout(function() {
    console.log('setTimeout')
  }, 0)

  setImmediate(function() {
    console.log('setImmediate')
  })
}
setTimeout(foo)
// output
setImmediate
setTimeout
```

简而言之，外层一个`setTimeout`执行的时候在`timers`阶段，内部`setTimeout`直接放到了下一个`timers`阶段，而`setImmediate`放在了当前循环的`check`尾部，因此先输出`setImmediate`。

再来：

```js
function foo() {
  setTimeout(function() {
    console.log('setTimeout')
  }, 0)

  setImmediate(function() {
    console.log('setImmediate')
  })
}
foo()
```

在同步流程中直接调用，二者的输出是不固定顺序的。也许首次是`setTimeout`先输出，但是再试一次就不一定了。

执行同步代码的时候，二者分别加入到`timers`和`check`内，同步代码进入事件循环之后直接检查`timers`,如果同步代码在进入事件循环之前已经过去了`1ms（Nodejs 规定的默认值）`，则直接执行输出`setTimeout`，如果同步代码在进入事件循环的时候还未达到这`1ms`的回调执行条件，则会将上述`timeout`安排到下一个事件循环阶段。



## 3. setTimeout 和时间补偿

机缘巧合下看到一篇文章提及`setTimeout`由于主线程耗时任务的阻塞引起的延时超出预期的文章，其提出了一个利用系统时间进行动态调整延时的方法以实现尽可能准确的`setInterval`函数效果（原文放在参考部分）。

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/20210425000050.png)

如图所示，阻塞代码的耗时是不可预测的，按照默认的延时参数势必导致一部分的时间差异常。

利用时间补偿机制，对`setTimeout`的第二个参数进行动态修正，可以尽可能减小阻塞代码的影响。

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/20210425000950.png)

实例代码如下：

```js
function interval() {
 	const speed = 500;
  let counter = 1;
  const start = new Date().getTime();
  function instance() {
    const ideal = (counter * speed);
    const real = new Date().getTime() - start;
    const diff = real - ideal;
    counter++
    setTimeout(instance, speed - diff)
  }
  setTimeout(instance, speed)
}
```

这是一种有趣的想法，也许在其他特定场景下使用`requestAnimationFrame()`或者`web workers`来处理阻塞代码的问题。

## 参考

- [Creating Accurate Timers in JavaScript - SitePoint](https://www.sitepoint.com/creating-accurate-timers-in-javascript/)

- [JavaScript Timer Functions - Tutorial Republic](https://www.tutorialrepublic.com/javascript-tutorial/javascript-timers.php)

- [JavaScript Timers: Everything you need to know](https://www.freecodecamp.org/news/javascript-timers-everything-you-need-to-know-5f31eaa37162/)

- [setTimeout和setImmediate到底谁先执行，本文让你彻底理解Event Loop](https://juejin.cn/post/6844904100195205133)

- [忍者秘籍：如何实现准时的setTimeout](https://mp.weixin.qq.com/s/u7jtQkWM0k_joOd5gr4VJA)

  

