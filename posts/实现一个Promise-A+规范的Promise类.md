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

阅读规范有助于我们编写代码，整理思路，最终写出一个能通过所有`Promise/A+`测试用例的`Promise`实现版本。

##### Promise State

- 2.1.1 一个`Promise`的状态只有如下三种：

- pending 初始化状态
  - 2.1.1.1 可以显式转换状态至`fulfilled`或`rejected`
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

- 我的 Promise 实现命名为`Yo`
- `Yo`初始化的时候设置初始值和初始状态，状态可以转变为`fulfilled`或者`rejected`。
- `Yi`具备两个静态方法来显式转换其状态：`fulfill`和`Reject`，当状态为`pending`时才执行逻辑，这样一来一旦状态改变后续再执行此方法就无碍了。

> 注释里写明对应的规范信息条目

很快，我们的实现如下：

```js
// 将一些常用到的变量保存起来，
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const nop = () => {}
const $undefined = undefined
const $function = "function"
// 使用 Symbol 为 Promise 的属性提供保护
const promiseState = Symbol("promiseState")
const promiseValue = Symbol("promiseValue")

class Yo {
  constructor(executor) {
    // executor 提前检查，如果有异常则不创建额外的内部变量和属性方法，直接抛出异常
    if(executor === $undefined) {
      throw new TypeError("You have to give a executor param.")
    }
    if(typeof executor !== $function) {
      throw new TypeError("Executor must be a function.")
    }
    this[promiseState] = PENDING // 2.1.1
    this[promiseValue] = $undefined
    try {
      executor(this.$resolve.bind(this), this.$reject.bind(this))
    } catch (e) {
      this.$reject.bind(this)(e)
    }
  }

  $resolve(value) {
    if(this[promiseState] !== PENDING) return // 2.1.2.1, 2.1.3.1
    this[promiseState] = FULFILLED // 2.1.1.1
    this[promiseValue] = value // 2.1.2.2
  }

  $reject(reason) {
    if(this[promiseState] !== PENDING) return // 2.1.2.1, 2.1.3.1
    this[promiseState] = REJECTED // 2.1.1.1
    this[promiseValue] = reason // 2.1.3.2
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
  - 2.2.6.1 当`promise`状态为`fulfilled`时，所有的`then`上传入的`onFulfilled`函数将会按调用的次序依次执行
  - 2.2.6.2 当`promise`状态为`rejected`时，所有的`then`上传入的`onRejected`函数将会按调用的次序依次执行
- 2.2.7 `then`方法最终将返回一个新的`promise`实例: `promise2 = promise1.then(onFulfilled, onRejected)`
  - 2.2.7.1 如果`onFulfilled`或`onRejected`返回一个值`x`，执行`Promise`的解析步骤： `[[Resolve]](promise2, x)`
  - 2.2.7.2 如果`onFulfilled`或`onRejected`抛出一个异常`e`，则`promise2`直接`reject(e)`
  - 2.2.7.3 如果`onFulfilled`不是一个函数，并且`promise1`状态为`fulfilled`，则`promise2`沿用`promise1`的状态和值。
  - 2.2.7.4 如果`onFulfilled`不是一个函数，并且`promise1`状态为`rejected`，则`promise2`沿用`promise1`的状态和`reason`

##### 完善 ✍️

按规范的定义，在上述代码的基础下，我们来完善`then`方法。

```js
class Yo {
  constructor(executor) {
    ...
    this[promiseConsumers] = []
    try {
      executor(this.$resolve.bind(this), this.$reject.bind(this))
    } catch (e) {
      this.$reject.bind(this)(e)
    }
  }

  $resolve(value) {
    if(this[promiseState] !== PENDING) return // 2.1.2.1, 2.1.3.1
    this[promiseState] = FULFILLED // 2.1.1.1
    this[promiseValue] = value // 2.1.2.2
    this.broadcast()
  }

  $reject(reason) {
    if(this[promiseState] !== PENDING) return // 2.1.2.1, 2.1.3.1
    this[promiseState] = REJECTED // 2.1.1.1
    this[promiseValue] = reason // 2.1.3.2
    this.broadcast()
  }

  static then(onFulfilled, onRejected) {
    const promise = new Yo(nop) // then 方法返回的新实例
    // 2.2.1.1
    promise.onFulfilled = typeof onFulfilled === $function ? onFulfilled : $undefined;
    // 2.2.1.2
    promise.onRejected = typeof onRejected === $function ? onRejected : $undefined;
    // 2.2.6.1, 2.2.6.2
    this[promiseConsumers].push(promise)
    this.broadcast()
    // 2.2.7
    return promise
  }

  static broadcast() {
    const promise = this;
    // 2.2.2.1, .2.2.2.2, 2.2.3.1, 2.2.3.2
    if(this[promiseState] === PENDING) return
    // 2.2.6.1, 2.2.6.2, 2.2.2.3, 2.2.3.3
    const callbackName = promise[promiseState] === FULFILLED ? "onFulfilled" : "onRejected"
    const resolver = promise[promiseState] === FULFILLED ? "$resolve" : "$reject"
    soon(
      function() {
        // 2.2.6.1, 2.2.6.2, 2.2.2.3, 2.2.3.3
        const consumers = promise[promiseConsumers].splice(0)
        for (let index = 0; index < consumers.length; index++) {
          const consumer = consumers[index];
          try {
            const callback = consumer[callbackName] // 获取 then 方法执行的时候传入的函数
            const value = promise[promiseValue]
            // 2.2.1.1, 2.2.1.2, 2.2.5 without context
            if(callback) {
              consumer['$resolve'](callback(value))
            } else {
              // onFulfilled / onRejected 不是函数
              // 2.2.7.3, 2.2.7.4
              consumer[resolver](value)
            }
          } catch (e) {
            // 异常则设为 rejected
            consumer['$reject'](e)
          }
        }
      }
    )
  }
}

// soon function come from Zousan.js
const soon = (() => {
  const fq = [],  // function queue
    // avoid using shift() by maintaining a start pointer
    // and remove items in chunks of 1024 (bufferSize)
    bufferSize = 1024
  let fqStart = 0
  function callQueue() {
    while(fq.length - fqStart) {
      try {
        fq[fqStart]()
      } catch (err) {
        console.log(err)
      }
      fq[fqStart++] = undefined // increase start pointer and dereference function just called
      if(fqStart === bufferSize) {
        fq.splice(0, bufferSize)
        fqStart = 0
      }
    }
  }
  // run the callQueue function asyncrhonously as fast as possible
  // 执行此函数，返回的函数赋值给 cqYield
  const cqYield = (() => {
    // 返回一个函数并且执行
    // This is the fastest way browsers have to yield processing
    if(typeof MutationObserver !== 'undefined')
    {
      // first, create a div not attached to DOM to "observe"
      const dd = document.createElement("div")
      const mo = new MutationObserver(callQueue)
      mo.observe(dd, { attributes: true })

      return function() { dd.setAttribute("a",0) } // trigger callback to
    }

    // if No MutationObserver - this is the next best thing for Node
    if(typeof process !== 'undefined' && typeof process.nextTick === "function")
      return function() { process.nextTick(callQueue) }

    // if No MutationObserver - this is the next best thing for MSIE
    if(typeof setImmediate !== _undefinedString)
      return function() { setImmediate(callQueue) }

    // final fallback - shouldn't be used for much except very old browsers
    return function() { setTimeout(callQueue,0) }
  })()
  // this is the function that will be assigned to soon
  // it take the function to call and examines all arguments
  return fn => {
    fq.push(fn) // push the function and any remaining arguments along with context
    if((fq.length - fqStart) === 1) { // upon addubg our first entry, keck off the callback
      cqYield()
    }
  }
})()
```

网上对于状态转换后异步调用`onFulfilled`或者`onRejected`的逻辑实现众说纷纭，我最喜欢的实现来源于`@trincot`大神在 Stack Overflow 上的解答，感兴趣可以查看文末参考链接。

对于在状态变更后异步调用之前注册的回调函数的解法如下：

- 使用`consumers`数组存放`then`方法返回的`promise`
- 在`then`方法中，为每个将要返回的`promise`添加其传入的同名参数`onFulfilled`和`onRejected`作为`Promise`上的属性。
- 对于某些已经转换过状态的`Promise`实例，需要在`then`方法中调用一次`broadcast`方法。

> `broadcast` 方法非常关键，在`resolve`、`reject`、`then`方法中都会调用一次。

我们使用`broadcast`方法来做一个“广播”的功能，当`Promise`状态转换之后就视其状态创建微任务，异步调用`consumers`数组中所有的`Promise`上的属性方法`onFulfilled`或者`onRejected`。

另外，如何创建微任务以异步执行相关函数也是实现`Promise`类的关键，这里我学习了`@bluejava`前辈的`Promise`实现方案：`Zousan.js` ，文末有其`github`仓库地址。

在`zousan.js`中，作者特地创建了一个`soon`函数，将传入的函数参数尽可能快速地创建微任务以执行。

其核心便是如果是浏览器环境并且支持`MutationObserver`，则创建文档节点使用此`API`创建微任务最终执行目标函数，如若不支持则检查`process.nextTick`和`setImmediate`是否可用，最后用`setTimeout`兜底创建宏任务以达到异步调用目标函数的目的。

至此，我们的`Yo`类几近完成，最后就是规范第三点：`The Promise Resolution Procedure`。

##### The Promise Resolution Procedure

> Promise Resolution procedure 表示为`[[Resolve]](promise, x)`,为什么我们需要实现此规范？

当我们在`executor`函数中使用`resolve`或者`reject`方法的时候，传入的参数可以是任意有效的`Javascript`值。某些场景下，这个值可能是一个原始类型的数据，也可能是一个`thenables`对象，亦或是一个其他`Promise`实现方案创建的`Promise`实例。

**我们需要处理这个问题，让不同的传参都有一个确切的处理方案。**

那么，就让我们继续看规范是如何定义的。

执行`[[Resolve]](promise, x)`的步骤如下：

- 2.3.1 如果`promise`和`x`引用的是同一个对象，则`reject`一个`TypeError`异常作为`reason`。
- 2.3.2 如果`x`是一个`Promise`，则采纳其状态。
  - 2.3.2.1 如果`x`是`pending`的，则`promise`保持`pending`直到`x`状态改变。
  - 2.3.2.2 、2.3.2.3 `x`状态稳定后，直接沿用其`value`或`reason`。
- 2.3.3 如若其不是`Promise`而是一个普通`thenable`对象
  - 2.3.3.1 设`then`等于`x.then`
  - 2.3.3.2 如果执行`then`方法却抛出异常，则`reject`此`promise`，并且将异常作为`reason`。
  - 2.3.3.3 



对于一个`Promise`的实现来说，我们还需要添加一个`catch`方法，这个方法可以看成`then`方法的语法糖。

```js
class Yo{
  ...
  catch(onRejected) {
    return this.then($undefined, onRejected)
  }
  ...
}
```



## 参考

- [Basic Javascript promise implementation attempt - Stack Overflow](https://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/23785244)
- [bluejava/zousan: A Lightning Fast, Yet Very Small Promise A+ Compliant Implementation](https://github.com/bluejava/zousan)

## 致谢

再次感谢 @bluejava 回复我的咨询邮件，并且耐心地与我蹩脚的英语沟通，即使他也许不会注意到这里。