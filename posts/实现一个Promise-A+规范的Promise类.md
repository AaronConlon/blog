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



### 在一切开始之前

在我们开始之前，假设我们处于一个密闭空间，触手可及的只有手头的键盘。

想想，用少量词汇组织将要写的代码的内容，例如：

- 我的 Promise 实现命名为`Yi`
- `Yi`初始值为`undefined`，初始状态为`pending`，状态可以转变为`fulfilled`或者`rejected`,状态改变后不可逆，状态改变的逻辑只执行一次。
- `Yi`具备两个静态方法：`resolve`和`reject`，当状态为`pending`时才执行逻辑，这样执行一次之后就直接返回，执行这两个方法都会

很快，我们的实现可能如下：

```js
function Yi(executor) {
  this.state = 'pending'
  this.value = undefined
  executor(this.resolve.bind(this), this.reject.bind(this))
}

Yi.prototype.resolve = function(value) {
  if(this.state !== 'pending') return
  this.state = 'fulfilled'
  this.value = value
}

Yi.prototype.reject = function(reason) {
  if(this.state !== 'pending') return
  this.state = 'rejected'
  this.value = reason
}
```

很棒，接着考虑其他功能，`Yi`应该实现`then`方法！

> `then`方法是`Promise/A+`规范的核心部分。

那么，`then`方法必须提供的功能又有哪些才行呢？呃呃😯，想想可能会是：

- `then`接收两个方法：`onFulfilled`和`onRejected`
- 返回一个新的`Yi（Promise）`实例，这样可以进行链式调用。
- 同一个`Yi(Promise)`实例的`then`方法可以执行很多次，每次都应该把新的`Yi（Promise）`实例保存到一个数组中，一个实例对象可能在其不同状态下注册了许多状态变更后的异步，我们将之交给`then`或者`catch`方法新生成的`Yi(Promise)`实例去执行。
- `Yi`应该用一个数组保存`then`注册的状态变更回调任务，在合适的时候将当前`Yi(Promise)`实例的下一个状态的回调通过异步`Api`调用。

> 构造器接收的函数应该是一个`executor`函数参数，这个函数被同步执行。

那么，之前的代码应该改一改：

```js
function Yi(executor) {
  this.state = 'pending'
  this.value = undefined
  this.consumers = []
  executor(this.resolve.bind(this), this.reject.bind(this))
}

Yi.prototype.resolve = function(value) {
  if(this.state !== 'pending') return
  this.state = 'fulfilled'
  this.value = value
  // 状态变更则广播给自己的 consumers
  this.broadcast()
}

Yi.prototype.reject = function(reason) {
  if(this.state !== 'pending') return
  this.state = 'rejected'
  this.value = reason
  // 状态变更则广播给自己的 consumers
  this.broadcast()
}
```

`构造器`内部用一个`consumers`数组保存`then`和`catch`实例方法中实例化的`Yi(promise)`对象。

在`then`方法中需要实例化一个新的`Yi(Promise)`对象，并且为之定义`settled`状态后的属性`onFulfilled`和`onRejected`，执行异步任务的逻辑，用一个`broadcase`函数封装起来：

```js
Yi.prototype.then = function(onFulfilled, onRejected) {
  const promise = new Yi(function() {})
  // 现在，这个返回且被保存到当前 Yi 实例的 consumers 数组中的新实例具有了两个状态稳定后的属性
  promise.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : undefined
  promise.onRejected = typeof onRejected === 'function' ? onRejected : undefined
  this.consumers.push(promise)
  // 发出广播，当旧的 Yi 实例为 settled 状态下的时候可以直接调用相关属性任务
  this.broadcast()
  return promise
}

Yi.prototype.broadcast = function() {
  const promise = this;
  // called after promise is resolved
  if(this.state === 'pending') return

  const callbackType = this.state === 'fulfilled' ? 'onFulfilled' : 'onRejected'
  const toSettled = this.state === 'fulfilled' ? 'resolve' : 'reject'

  setTimeout(() => {
    // 当状态改变后将此前 then 保存的 consumers 内的 promise 全部广播一遍状态变更的消息，并且清空此数组
    promise.consumers.splice(0).forEach(consumer => {
      try {
        const callback = consumer[callbackType]
        // 如果 promise 具有 onFulfilled 或者 onRejected 方法，在 then 方法执行的时候添加的
        // 在 then 的时候判定是否为函数，不是函数则 callback 为 undefined
        if(callback) {
          consumer.resolve(callback(promise.value))
        } else {
          // callback 不是函数，那就默认按状态改变值
          // 状态转为 settled
          consumer[toSettled](promise.value)
        }
      } catch (e) {
        // 异常捕获为 Rejected 状态下的 reason
        consumer.reject(e)
      }
    })
  }, 0);
}
```

对于类似笔者这种功力不足的开发者来说，为了更好地实现`Yi`，理解`Promise`的原理，我想可以降低整体的复杂度，先用`setTimeout`模拟微任务，ok，最终版本一定会按平台通过`nextTick`或者`MutationObserver`来替换`setTimeout`。

话说回来