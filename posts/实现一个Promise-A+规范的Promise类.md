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

### 从规范到实现

在开始写代码之前，我们先阅读一下[Promises/A+](https://promisesaplus.com/)的官方文档。

#### 几个术语

言而简之，官方文档上提及了五个术语，如下所示：

- Promise
- thenable
- value
- exception
- reason

`Promise`是一个具有`then`方法的对象或函数，并且此对象或者函数遵循`Promise/A+`规范。

`thenable`指的是一个对象或函数具有一个`then`方法

`value`是一个合法的`Javascript`值。

`exception`是一个使用`throw`语句抛出的值。

`reason`则是`Promise`状态转为`Rejected`的原因。

#### 规范简述

阅读规范需求的描述是实现一个能通过测试的实现的关键。

##### Promise State

- 2.1.1 一个`Promise`的状态只有如下三种：

- pending 初始化状态
  - 可以显式转换状态至`fulfilled`或`rejected`
- fulfilled 成功
  - 2.1.2.1 状态不可再转换
  - 2.1.2.2 具有一个不可改变的`value`
- rejected 失败
  - 2.1.3.1 状态不可再转换
  - 2.1.3.2 具有一个不可改变的`reason`

> 不可改变意味着可以使用`===`进行比较，并且始终为`true`，并非完全的深层属性不可变。

除此之外，使用`new`实例化的时候，我们需要为构造函数提供一个`executor`函数参数。

##### 思考🤔

现在我们从最简单的状态需求开始，假设我们处于一个密闭空间，触手可及的只有手头的键盘。

思考一下如何实现上述`Promise State`，用少量词汇组织将要写的代码的内容，例如：

- 我的 Promise 实现命名为`Yi`
- `Yi`初始值为`undefined`，初始状态为`pending`，状态可以转变为`fulfilled`或者`rejected`,状态改变后不可逆，状态改变的逻辑只执行一次。
- `Yi`具备两个静态方法来显式转换其状态：`resolve`和`reject`，当状态为`pending`时才执行逻辑，这样一来一旦状态改变后续再执行此方法就无碍了。

很快，我们的实现可能如下：

```js
function Y(executor) {
  // 关于 executor
  if(executor === undefined) {
    throw new TypeError('You must give a executor function.')
  }
  if(typeof executor !== 'function') {
    throw new TypeError('Executor must be a function')
  }
  this.state = 'pending'
  this.value = undefined
  executor(resolve, reject)

  function resolve(value) {
    if(this.state !== 'pending') return // 2.1.1.1, 2.1.3.1
    this.state = 'fulfilled' // 2.1.1.1
    this.value = value // 2.1.2.2
  }

  function reject(reason) {
    if(this.state !== 'pending') return // 2.1.1.1, 2.1.3.1
    this.state = 'rejected' // 2.1.1.1
    this.value = reason // 2.1.3.2
  }
}
```

##### `then`方法

> `then`方法是`Promise/A+`规范的核心部分。

一个`Promise`必须提供一个`then`方法以访问其`value`或`reason`,此方法需要接受两个可选参数：

```js
promise.then(onFulfilled, onRejected)
```

其规范如下：

- 2.2.1 `onFulfilled`和`onRejected`都是可选的
  - 2.2.1.1 如果`onFulfilled`不是一个函数，则忽略此参数
  - 2.2.1.2 如果`onRejected`不是一个函数，则忽略此参数
- 2.2.2 如果`onFulfilled`是一个函数
  - 2.2.2.1 此函数在`promise`状态为`fulfilled`的时候被异步调用，并且使用其`value`值作为第一个参数
  - 2.2.2.2 此函数不可在`promise`状态为`fullfilled`之前被调用
  - 2.2.2.3 在一个`promise`实例上只能被调用一次
- 2.2.3 如果`onRejected`是一个函数
  - 2.2.3.1 此函数在`promise`状态为`rejected`的时候被异步调用，并且使用其`value`值作为第一个参数
  - 2.2.3.2 此函数不可在`promise`状态为`rejected`之前被调用
  - 2.2.3.3 在一个`promise`实例上只能被调用一次
- 2.2.4 `onFulfilled`和`onRejected`将被异步调用（在当前执行栈清空之前无法被调用）
- 2.2.5 `onFulfilled`和`onRejected`必须作为一个函数被调用（内部不应使用`this`值，原因在于严格模式和非严格模式的`this`值不一致）
- 2.2.6 `then`可以在同一个`promise`实例上被多次调用，因此我们可以在不同的地方使用某个`promise.then`f方法
  - 当`promise`状态为`fulfilled`时，所有的`then`上传入的`onFulfilled`函数将会按调用的次序依次执行
  - 当`promise`状态为`rejected`时，所有的`then`上传入的`onRejected`函数将会按调用的次序依次执行
- 2.2.7 `then`方法最终将返回一个新的`promise`实例: `promise2 = promise1.then(onFulfilled, onRejected)`
  - 2.2.7.1 如果`onFulfilled`或`onRejected`返回一个值`x`，执行`Promise`的解析步骤： `[[Resolve]](promise2, x)`
  - 2.2.7.2 如果`onFulfilled`或`onRejected`抛出一个异常`e`，则`promise2`直接`reject(e)`
  - 2.2.7.3 如果`onFulfilled`不是一个函数，并且`promise1`状态为`fulfilled`，则`promise2`沿用`promise1`的状态和值。
  - 2.2.7.4 如果`onFulfilled`不是一个函数，并且`promise1`状态为`rejected`，则`promise2`沿用`promise1`的状态和`reason`

##### 完善 ✍️

按规范的定义，我们来完善之前的代码并实现`then`方法。

```js
function Y(executor) {
  if(executor === undefined) {
    throw new TypeError('You must give a executor function.')
  }
  if(typeof executor !== 'function') {
    throw new TypeError('Executor must be a function')
  }
  this.state = 'pending'
  this.value = undefined
  // 针对状态变更后需要异步调用的某些函数的规范定义，添加的数组属性
  this.consumers = []
  executor(resolve, reject)

  function resolve(value) {
    if(this.state !== 'pending') return // 2.1.1.1, 2.1.3.1
    this.state = 'fulfilled' // 2.1.1.1
    this.value = value // 2.1.2.2
    this.broadcast()
  }

  function reject(reason) {
    if(this.state !== 'pending') return // 2.1.1.1, 2.1.3.1
    this.state = 'rejected' // 2.1.1.1
    this.value = reason // 2.1.3.2
    this.broadcast()
  }

  function then(onFulfilled, onRejected) {
    const consumer = new Y(function() {});
    // 2.2.1.1, 2.2.1.2
    consumer.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : undefined
    consumer.onRejected = typeof onRejected === 'function' ? onRejected : undefined
    this.consumers.push(consumer);
    this.broadcast();
    return consumer
  }

  function broadcast() {
    // 2.2.5
    const promise = this;
    // 2.2.2.1, 2.2.2.2, 2.2.3.1, 2.2.3.2
    if(promise.state === 'pending') return;
    // 2.2.6.1, 2.2.6.2
    const callbackName = promise.state === 'fulfilled' ? 'onFulfilled' : 'onRejected'
    const resolver = promise.state === 'fulfilled' ? 'resolve' : 'reject'
    // 2.2.4
    setTimeout(
      function() {
        // 2.2.6.1, 2.2.6.2, 2.2.2.3, 2.2.3.3
        // 调用的时候遍历数组，并且清空数组
        const arr = promise.consumers.splice(0)
        for (let i = 0; i < arr.length; i++) {
          try {
            const consumer = arr[i];
            const callback = consumer[callbackName]
            // 2.2.1.1, 2.2.1.2. 2.2.5
            if(callback) {
              // 2.2.7.1 暂时直接处理
              consumer.resolve(callback[promise.value])
            } else {
              // 2.2.7.3
              consumer[resolver](promise.value)
            }
          } catch (e) {
            // 2.2.7.2
            consumer.reject(e)
          }
        }
      }
    )
  }
}
```

网上对于状态转换后异步调用`onFulfilled`或者`onRejected`的逻辑实现众说纷纭，在对比了多个实现方案后，笔者个人较为推荐上述代码中的方案：

- 使用`consumers`数组存放`then`方法返回的`promise`
- 在`then`方法中为每个将要返回的`promise`添加`onFulfilled`和`onRejected`属性。
- 对于某些`promise`已经转换过状态的情形，需要在`then`方法中调用一次`broadcast`方法。

> `broadcast` 方法非常关键，在`resolve`、`reject`、`then`方法中都会调用一次。

我们使用`broadcast`方法来做一个“广播”的功能，当`promise`状态转换之后就视情形异步调用`onFulfilled`或者`onRejected`。

##### The Promise Resolution Procedure

> Promise Resolution procedure 表示为`[[Resolve]](promise, x)`,为什么我们需要实现此规范？

当我们使用`resolve`或者`reject`方法的时候，传入的参数可以是任意有效的`Javascript`值。某些场景下，这个值可能是一个原始类型的数据，也可能是一个`thenables`对象，亦或是一个其他`Promise`实现方案创建的`Promise`实例。

我们需要处理这个问题，让不同的传参都有一个确切的处理方案。



对于一个`Promise`的实现来说，我们还需要添加一个`catch`方法，这个方法可以看成`then`方法的语法糖。

```js
Yi.prototype.catch = function(onRejected) {
  return this.then(undefined, onRejected)
}
```

