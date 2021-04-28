---
title: 'Javascript,I promise - 异步编程'
date: '2021/4/9'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1611923973164-e0e5f7f69872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5NzU1MTI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1611923973164-e0e5f7f69872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5NzU1MTI&ixlib=rb-1.2.1&q=80&w=400'
intro: 'Promise, JavaScript 世界中的异步处理对象.我阅读了 Dr.Axel 前辈的电子书,充满感激.'
---

2015年，`ECMAScript`新增了一个`Promise`对象，用于表示一个`异步操作`的最终完成（失败）及其结果的值。

感谢`Promise`，让开发者们多了一种选择，让不喜欢回调模式的开发者们从回调的泥沼中挣脱出来。

今天，我们一起来学习一下以下内容：

- 函数回调
- Promise 体系
- 回调 vs Promise
- Promise Api 应用场景分析
- Async / await
- Promise Third Library
- 实现一个 `IPromise` 

# 1. 回调

JavaScript 语言为了让部分任务按异步的方式进行，提供了编写`回调函数`的方法，让某些任务在达成一些条件之后再执行开发者指定的`回调函数`。

举两个例子:

```js
// browser
setTimeout(() => {
  // balabala
}, 1000)

// nodejs
const fs = require('fs')
fs.readFile('filename', (err, data) => {
  if(err) throw err;
  // balabala
})
// more
console.log(1)
```

如上所示，要么延迟执行回调，要么读取文件后执行回调，二者都不会立即执行从而阻塞主线程，而是各自具有自己的执行条件，满足条件后放入任务循环队列中等待主线程空闲才得以执行。

上述回调函数在某些场景下曾让许多开发者写出如下类型的代码：

```js

fs.readFile('file1.txt', function(err, data){
  if(err) throw err;
  // ...一些操作
  fs.readFile('file2.txt', function (err, data) {
    if(err) throw err;
    // ...一些操作
    fs.readFile('file3.txt', function (err, data) {
      if(err) throw err;
      // ...一些操作
      fs.readFile('file4.txt', function (err, data) {
        if(err) throw err;
        // ...一些操作
      });
    });
  });
})
```

为什么会这样？因为某些场景下需要对异步操作进行排序，需要保证运行逻辑具有一定的顺序，并且还需要对每一个回调进行错误处理。

上述案例省略了真实的逻辑代码，我们可以看出这种回调的嵌套让代码很容易失控，并且难以阅读和维护。

无论是写下这段代码的人还是阅读这段代码的人都被其所"折磨"，江湖人称`“回调地狱”`。

即使我们将之摊开，为每一个回调函数都编写一个具名的独立函数来调用，依然可读性不佳：

```js
fs.readFile('file1.txt', step1);

function step1(err, data) {
  if(err) throw err;
  // ...
  fs.readFile('file2.txt', step2)
}
function step2(err, data) {
  if(err) throw err;
  // ...
  fs.readFile('file3.txt', step3)
}
function step3(err, data) {
  if(err) throw err;
  // ...
  fs.readFile('file4.txt', step4)
}
function step4(err, data) {
  if(err) throw err;
  // ...
}
```

这些独立函数的命名也许会让开发者觉得非常不适，为了展开层层嵌套，我们编写了许多几乎不会被`重用`的函数，即使现代编辑器在代码跳转的功能上非常方便，阅读此类代码的时候依然会让我们不断的转移视线。

> “懒惰”使人进步。

使用`Promise`,可以避免此类问题，显著减少编码量，提高代码的可读性。

# 2. Promise 体系

> IE 浏览器不支持`Promise`,我们可以使用`es-promise`等第三方库.

## 2.1 promise 实例和状态转换

每个`Promise`实例具有三种状态:

- `pending`: 初始化
- `fulfilled`: 成功
- `rejected`: 失败

> fulfilled 和 rejected 统称`settled`.

下图是`MDN`提供的`Promise`状态转移图示.

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/promises.png)



> 本文不会对`promise`做面面俱到的介绍,推荐阅读官方文档.

首先,我们来创建一个`promise`实例:

```js
// 实例化
const promise = new Promise((resolve, reject) => {
  // balabala
  if(...) {
    // 实例状态变更，设置值
    resolve(value) // success
    resolve(...) // 忽略
  } else {
  	reject(reason) // failure
  }
})
// 链式调用，实例方法 then 返回一个新的实例
promise
  .then(function(value) {
		// balabala
  })
	.then(function(value) {
		// balabala
  })
	.catch(reason => {
  	// balabala
  })
	.finally(() => {})
```

上述示例展示了`promise`的一些特性，如实例化、状态转换赋值、链式调用和异常处理，下面我们会讲到静态方法和实例方法。

## 2.1 Promise 构造器

我们通过`new Promise(executor)`实例化一个`promise`的时候,其状态为`pending`.在实例化的时候传入一个函数`executor`函数去变更实例的状态和值.

## 2.2 Promise 实例方法

> 需要注意的是,`promise`实例的状态转换是单向的,一旦`settled`则不可逆转,同时我们可以多次利用此`settled`状态的实例。

返回的`promise`实例支持链式调用,每个`then`函数内部最后将返回一个新的`promise`实例。

默认返回一个值为`undefined`,状态为`fulfilled`的实例.

> `回调函数`的写法编写可以一次性监听所有回调函数的错误处理逻辑是很困难的,`Promise实例`的实例方法`catch`能处理链式调用之前所有的`then`函数错误和显式的`reject`行为.

## 2.3 Promise 静态方法

`Promise`类具有两个能创建一个新的实例的静态方法:

- Promise.resolve(param)
- Promise.reject(param)

二者区别在于返回的`promise`实例的状态,前者为`fulfilled`,后者为`rejected`.

此外,`Promise`类还有如下几个静态方法:

- `Promise.all(iterable)`
- `Promise.race(iterable)`
- `Promise.any(iterable)`
- `Promise.allSettled(iterable)`

这几个静态方法各有其应用场景.

### 2.2.1 all

首先,`Promise.all(iterable)`方法接收一个`iterable`对象作为参数,最终返回一个`promise 实例`.

首先,如果`iterable`对象是空的,则返回的结果是空数组(尽管我们基本上不会这么做).

其次,如果传入的是原始数据类型则转换为`fulfilled`状态的`promise`实例,其值是原始对象.如果传入的本来就是`promise`对象,则直接按`promise`对象处理.

我们通过示例代码来理解规范:

```js
> Promise.all([1, Promise.resolve(2)]).then(r => console.log(r))
Promise { <pending> }
> [ 1, 2 ]
> Promise.all([1, Promise.resolve(2), Promise.reject(3)])
  	.then(r => console.log(r))
  	.catch(r => console.log(r))
Promise { <pending> }
> 3
```

由上可知,当可迭代对象的所有元素都是`fulfilled`状态的`promise 实例`的话,返回一个数组,数组的值是这些`promise 实例的值`.

如果一旦其中之一出现`rejected`状态的`promise 实例`,则整体状态转化为`rejected`,且值为最先出现的`rejected`状态实例的值.

我们可以使用`Promise.all`来执行一组异步操作,这些操作的时间花费取决于最长的那个元素,并且最终如果一切顺利,则结果的顺序是不变的.

`Promise.all()`方法适用于`合并请求`的场景,例如某些项目中,提交的多个数据需要调用云端接口进行数据校验,当所有数据都通过校验的时候才能执行下一步操作,来看看代码:

```js
// 有一个返回 promise 对象的 asyncApi 函数
const test = (value) => asyncApi(value)
Promise.all([
  test('xxx'),
  test('xx'),
  test('x')
]).then(results => {
  results.forEach(result => {
    // balabala 你的代码逻辑
    // 都通过了
  })
  // do more...
}).catch(error => {
  // 失败的值, balabala
  console.log(error)
})
```

如果我们想要合并检查结果,则可以稍微修改一下代码:

```js
Promise.all([
  test('xxx').catch(err => err),
  test('xx').catch(err => err),
  test('x').catch(err => err)
]).then(results => {
  results.forEach(result => {
    // balabala 你的代码逻辑
    // 都通过了
  })
  // do more...
}).catch(error => {
  // 失败的值, balabala
  console.log(error)
})
```

如果某个`test函数`返回的`promise`状态为`rejected`,如上代码也会将错误数据作为值,`catch`函数之后返回一个`fulfilled`状态的`promise 新实例`.最终`results`数组也包含了可能出现的错误信息,我们可以操作合并的结果进行处理.

### 2.2.2 race

`Promise.race(iterable)`如其名,类似于`Promise.all()`,接收同类型参数,一旦迭代器中某个`promise`状态转化为`settled`,立即返回此结果.

> 传入的迭代为空的话,返回的`promise`始终`pending`.

`Promise.race()`非常适合做异步请求的`超时`处理.来看一个例子:

```js
// asyncApi() 返回 promise
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(`timeout: ${ms} ms`)
    }, ms)
  })
}

Promise.race([
  asyncApi('xx'),
  timeout(5000)
]).then(res => {
  // success
}).catch(error => {
  // timeout or error
})
```

### 2.2.3 any

`Promise.any(iterable)`是`Promise.all()`的反面,其语法无异.

需要注意的是如果传入的迭代器是空的,则返回`rejected`的`promise `实例.只要有一个成功,则返回此结果.如果迭代器内的`promise`全部返回`rejected`状态,则最终返回`rejected`的`promise`实例.

因此,此方法适用于验证多个异步结果中是否有`fulfilled`的`promise`实例.

如果我们需要向多个数据源获取某一个数据,则可以使用此方法最快速的获取到数据,亦或者所有异步请求都失败.

### 2.2.4 allSettled

`Promise.allSettled(iterable)`方法返回一个在所有给定的`promise`转为`settled`状态后的数组,数组元素是每一个`promise`结果.

如果我们有多个互不依赖的`异步任务`,或者我们总想知道每个`promise`的结果,而不需要其中的`rejected`状态`promise`去引发`catch`,来看看`MDN`的例子:

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result)));
```

输出是:

```shell
> Object { status: "fulfilled", value: 3 }
> Object { status: "rejected", reason: "foo" }
```

如上所示,状态为`fulfilled`时,具有`value`,状态为`rejected`时,具有`reason`.

还记得我们在`Promise.all()`中的迭代器返回的是`promise.catch(err => err)`吗?其实,使用`Promise.allSettled()`相对更好.

## 2.3 Promise 的优劣

`Promise`的出现促进了`异步`编程的发展,我们可以在浏览器端和`node`端看到统一的`Promise`代码.还记得`callback`回调函数的参数约定吗?

```js
function foo(param, (err, data) => {
  if(err) {
    // balabala
  }
  // balabala
})
```

这种参数约定是脆弱的,开发者可以不按此约定编写回调函数,这类隐藏`bug`可能就此而生.

`Promise`的出现,我们必须使用其实例方法`then`和`catch`去按规范编码,否则将会出错,开发者也可以看到明显的错误提示信息.

我们再来看看如下两个例子:

```js
// callback
fs.readFile(name, opts?, (err, string|Buffer) => void)
// Promise
readFilePromisified(name, opts?): Promise<string | Buffer>         
```

`Promise`方案让函数参数和回调解耦开来,所有的参数都用于此函数的输入.

`Promise`在处理单次异步任务的时候表现良好,但是对于多次触发的任务便显得乏力,也许我们需要学习一些`响应式编程`技术,以解决此类问题.

对于`ES6 Promise`来说,缺乏两项很实用的功能:

- 取消任务(在组件被删除后取消异步任务等)
- 查阅进度(显示进度条等)

原生`Promise`暂未支持上述两项特性,也许我们可以看看类似`Bluebird`这样的第三方库,它们实现了更多功能.

# 3. MyPromise

如何不借助外部库和`ES6 Promise`实现一个简单的`MyPromise`?

首先,我们可以定义一个对象保存`Promise`的三种状态.

```js
const states = {
  pending: 'Pending',
  fulfilled: 'Fulfilled',
  rejected: 'Rejected'
}
```

接着,我们使用`class`来定义我们的`MyPromise`:

```js
class MyPromise {
  constructor(executor) {
    const resolve = () => {
      this.state = states.fulfilled
    }
    const reject = () => {
      this.state = states.rejected
    }
    this.state = states.pending // 默认
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}
```

如此一来,我们实例化的时候传入的`executor`函数内部的错误就能被`catch`处理,并且执行`reject`函数,改变`MyPromise`的`state`.

为了在调用`resolve`或者`reject`的时候能改变`MyPromise`的值,我们需要对这两个函数进行优化.

```js
class MyPromise {
  constructor(executor) {
    
    const getCallback = state => value => {
      this.state = state;
      this.value = value;
    }

    const resolve = getCallback(states.fulfilled)
    const reject = getCallback(states.rejected)
    
    this.state = states.pending // 默认
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}
```

我们使用高阶函数`getCallback`来消除重复代码,减少代码量.此时,再使用`resolve(value)`或者`reject(value)`即可修改`MyPromise`的值.

此外,我们还要添加`resolve`和`reject`作为`MyPromise`的静态方法.

```js
class MyPromise {
  ...
  static resolve(value) {
    return new MyPromise(resolve => resolve(value))
  }

	static reject(value) {
    return new MyPromise((_, reject) => reject(value))
  }
}
```

Ok,现在`new MyPromise(resolve => resolve(1))`等效于`MyPromise.resolve(1)`了.

接着,我们来实现实例方法:`"then"`.我们知道,如果按常规的思路来,`then`方法取决于`MyPromise`的状态,不同的状态具有不同的值,也许需要写一堆`if`语句,如果不想要写这些`if`语句,我们可以换一种思路来为实例设置`then`方法.

```js
class MyPromise {
  constructor(executor) {
    const members = {
      [states.fulfilled]: {
        state: states.fulfilled,
        // 链的机制
        then: onResolved => MyPromise.resolve(onResolved(this.value))
      },
      [states.rejected]: {
        state: states.rejected,
        // rejected 状态直接忽略返回即可
        then: _ => this
      },
      [states.pending]: {
        state: states.pending        
      },
    };
    // 修改状态,添加 then 实例方法
    const changeState = state => Object.assign(this, members[state]);
    // getCallback
    const getCallback = state => value => {
      this.state = state;
      this.value = value;
    }

    const resolve = getCallback(states.fulfilled)
    const reject = getCallback(states.rejected)
    // 初始化状态, 我们通过对象复制的方法修改了状态
    changeState(states.pending);
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  
  static resolve(value) {
    return new MyPromise(resolve => resolve(value))
  }

  static reject(value) {
    return new MyPromise((_, reject) => reject(value))
  }
}
```

如上,我们初步实现了`then`实例方法.但是,如果传入`then`的方法出现异常,依然需要做特殊处理才能得到一个`rejected`的`promise`.

举个例子:

```js
MyPromise.resolve(1).then(() => throw new Error());
```

按规范来看,我们需要返回的是一个`rejected`的`promise`.而不是引发异常.

既然我们已经支持实例化传入的`executor`中的异常能够被`catch`,并且能处理好状态和值,或许我们可以按这个思路寻找解决方案.

不妨修改一下`fulfilled`的`then`逻辑:

```js
class MyPromise {
  constructor(executor) {
    const members = {
      [states.fulfilled]: {
        ...
        then: callback => MyPromise.try(() => callback(this.value))
    }
    ...
  }
  ...
  static try(callback) {
    return new MyPromise(resolve => resolve(callback()))
  }
}
```

我们通过一个`try`函数,得到一个全新的`Promise`实例.其值和状态应该取决于`callback`函数的返回值.

由于我们已经支持实例化参数即使异常依然可以得到具有预期的状态和值的`MyPromise`实例,因此我们可以将麻烦的`then`函数参数作为`callback`

```js
// callback 函数将使用 this.value 作为参数传递下去
const tryCall = callback => MyPromise.try(() => callback(this.value))
then: tryCall
```



如果我们传入`then`的`reactions()`通过`try`函数去创建一个新的`promise`实例,就能保证异常可以被内部`catch`处理了.





# 参考

- [Exploring ES6 - exploring-es6.pdf](chrome-extension://bocbaocobfecmglnmeaeppambideimao/pdf/viewer.html?file=file%3A%2F%2F%2FUsers%2Fyi%2FDesktop%2Fexploring-es6.pdf)
- [JavaScript 运行机制详解：再谈Event Loop - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)
- [JavaScript进阶01：异步1-事件监听和回调函数 | forkai's Notes](https://notes.forkai.com/2017/11/06/javascript%E8%BF%9B%E9%98%B601%EF%BC%9A%E5%BC%82%E6%AD%A51-%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E5%92%8C%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0/)
- [architecture - Difference between event handlers and callbacks - Stack Overflow](https://stackoverflow.com/questions/2069763/difference-between-event-handlers-and-callbacks)
- [javascript - addEventListener vs onclick - Stack Overflow](https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick)
- [Getting Started | bluebird](http://bluebirdjs.com/docs/getting-started.html)
- [Implementing JavaScript Promise in 70 lines of code! | Hacker Noon](https://hackernoon.com/implementing-javascript-promise-in-70-lines-of-code-b3592565af0f)
- [现代 JavaScript 教程](https://zh.javascript.info/)