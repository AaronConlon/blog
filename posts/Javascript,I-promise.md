---
title: 'Javascript,I promise - 异步编程'
date: '2021/4/9'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1611923973164-e0e5f7f69872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5NzU1MTI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1611923973164-e0e5f7f69872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5NzU1MTI&ixlib=rb-1.2.1&q=80&w=400'
intro: 'Promise, JavaScript 世界中的异步处理对象.我阅读了 Dr.Axel 前辈的电子书,充满感激.'
---

大家好，今天我们要分享的知识点是`Promise`与异步编程。

`Promise`是对尚不存在结果的对象的一个替身，也许你曾看到类似的术语，例如`future`/`delay`/`deferred`等，实际上这些术语描述的是一个相同的概念，都是一种异步程序执行的机制。

接下来我们分享的知识将涉及以下内容：

- 函数回调
- Promise 浅析
- Async / await
- Promisify

  

# 1. 回调

JavaScript 语言为了让部分任务按异步的方式进行，提供了编写`回调函数`的方法，让某些任务在达成一些条件之后再执行开发者指定的`回调函数`。

举两个例子:

```js
const callbackFn = () => {
  // balabala
}
// browser
setTimeout(callbackFn, 1000)

// nodejs
const fs = require('fs')
fs.readFile('filename', (err, data) => {
  if(err) throw err;
  // balabala
})
// more
console.log(1)
```

如上所示，要么延迟执行回调，要么读取文件后执行回调，二者都不会立即执行从而阻塞主线程，而是各自具有自己的执行条件，满足条件后放入任务循环队列中等待主线程空闲才得以取出并执行。

上述回调函数在某些场景下曾让开发者写出如下类型的代码：

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

无论是写下这段代码的人还是阅读这段代码的人都被其所"折磨"，我们将此类代码结构称为`“回调地狱”`。

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

# 2. Promise 

> IE 浏览器不支持`Promise`,我们可以使用`bluebird`或`es6-promise`等第三方库.

## 2.1 promise 浅析

使用`new`实例化的`Promise`对象具有三种状态:


- `Fulfilled` - `has resolution`: resolve 成功,调用 `onFulfilled`函数
-  `Rejected` - `has rejection`: reject, 调用`onRejected`函数
-  `Pending` - `unresolved`: 初始化状态

> 短横线左边是`Promise/A+`术语,而右边则是`ES6 Promise`术语.

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/image-1582215000590-ffa807c19d5f6959de485fc66664e123.png)

初始状态为`pending`,转为`Fulfilled`或者`Rejected`之后不会再有变化.`Fulfilled`和`Rejected`状态也被称为`Settled`。

`Promise`的状态流转并不复杂，但是我们需要注意其中一些细节。

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

我们通过`new Promise(executor)`实例化一个`promise`的时候,其状态为`pending`.在实例化的时候传入一个函数`executor（执行器）`，此函数将会获取两个实参`resolve`和`reject`函数，二者都可以改变实例的状态和值。

> 不提供 `executor` 将抛出 `typeError`

上述代码的片段：

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
```

需要关注以下几点：

- `Executor`函数的参数没有限制，但通常我们会声明两个形参函数：`resolve`和`reject`，`executor`内部使用此二者可以显式地转换`Promise`实例的状态，设置其值。（不使用这两个函数来转换实例状态意味着此实例的状态不会改变，这也写并没有多大意义）。
- `resolve`和`reject`函数的实参可以是不同类型的值，但是会被进一步处理。也就是说，显示转换状态设置值的时候，传入的参数不一定会直接作为`settled`状态的值。
- `pending`状态到`settled`状态是不可逆的，并且在`executor`中的`resolve`和`reject`函数只能执行一次，后续再执行将会被忽略。

> `executor`函数是同步执行的。`resolve`和`reject`函数接收任意类型的值。

我们来看看给`resolve`函数传入以下三种不同的值会有怎样的结果。

- 原始类型值
- Promise 实例
- thenable 对象

首先是`原始类型值`：

```js
const p = new Promise((resolve, reject) => {
  resolve(Symbol())
  // resolve(1)
  // resolve('1')
  // resolve(null)
  // resolve(undefined)
  // resolve(1n)
  // resolve(true)
  // reject 也是如此
})

p.then((v) => {
  console.log('resolve'， v);
}).catch((i) => {
  console.log('reject', i);
})
```

原始类型数据传入`resolve`函数，都能顺利将状态转为`fulfilled`并且设置为当前状态下的值。使用`reject`函数则将状态转为`rejected`,值则是原始类型的值。

其次，来看看传入`Promise`对象。

```js
const p = new Promise((resolve, reject) => {
  resolve(Promise.resolve(1))
})
p.then((v) => {
  console.log('resolve', v);
}).catch((i) => {
  console.log('reject', i)
})
// output
resolve 1
```

如果传入给`promise`的参数也是一个`Promise`实例，则相当于一个空包装，最终将得到一个相同状态和值的`Promise`实例。

```js
const p = new Promise((resolve, reject) => {
  resolve(Promise.reject(1))
})
// output
reject 1
```

接着我们来看看传入一个普通的 `thenable` 对象。

> 具有`then`方法的对象称为`thenable`对象，`Promise`实例对象也是一种`thenable`对象。

```js
const obj = {
  name: 'Miao',
  then() {
    console.log('this is then', arguments);
    arguments[0](1)
  }
}
const p = new Promise((resolve, reject) => {
  resolve(obj)
})

p.then((v) => {
  console.log('resolve', v);
}).catch((i) => {
  console.log('reject', i)
})
// output
this is then [Arguments] {
  '0': [Function (anonymous)],
  '1': [Function (anonymous)]
}
resolve 1
```

`executor`内`resolve`一个`thenable`对象，则会将`then`方法视作一个`executor`，在其内部可以显示编写`resolve`和`reject`的逻辑来改变整个`Promise`实例的状态和值。

## 2.2 Promise 实例方法

`Promise`实例有三个实例方法：

- `then`
- `catch`
- `finally`

> 重申：`promise`实例的状态转换是单向的,一旦`settled`则不可逆转,同时我们可以多次利用此`settled`状态的实例。

首先是`then(onFulfilled, onRejected)`方法，此方法接收两个回调函数作为参数，在`Promise`状态为`pending`的时候，我们可以将此方法理解为注册状态转变为`Fulfilled`和`Rejected`后执行的回调函数，并且这些回调函数的执行是异步的。

> `Promise`只能转换一次，因此上述两个参数的操作是互斥的。

在实现上`Node`可以通过`process.nextTick`来创建新的微任务，在浏览器端则可以通过`MutationObserver`功能创建微任务。

以下两种`then`函数的传参都会被忽略, 并且异步返回一个相同值的`Promise`新实例：

```js
// 传非函数处理对象
Promise.resolve(1).then('sss')
// 不传值
Promise.resolve(1).then()

const p = Promise.resolve(1)
let c = p.then()
console.log(p);
setTimeout(() => {
  console.log(c);  
}, 200);
// output
Promise { 1 }
Promise { 1 }
```

不推荐编写上述`then`方法，我们只需要知道此种情形`Promise`会如何处理整体的逻辑流程。

> 无论`Promise`实例处于何种状态，我们注册回调函数都将异步执行。

其次，`catch`方法可以理解为`then`方法的语法糖形式，我们可以将`then(undefiled, onRejected)`视为`catch(onRejected)`一种形式，开发者可以自由选择如何编写`Promise`实例从`pending`转为`settled`状态后的异步回调函数。

最后，`finally`方法则相当于注册一个`Promise`实例`settled`之后的清理方法，通常我们可以传入一个具有清理功能的函数作为参数。

> `finally`返回一个新的`Promise`实例，`finally`设计为一个与状态无关的方法，大多数情况下只是传递上层的`Promise`，除非显式地返回一个新的`Promise`实例，或者抛出异常返回`Rejected`状态的实例。

让我们来写一个示例：

```js
new Promise((resolve ,reject) => resolve(1))
  .then(() => {
    console.log('1');
  })
  .then((v) => {
    console.log('2', v);
    throw new Error('my error')
  })
  .then(() => {
    console.log('3');
  })
  .catch(err => {
    console.log('catch any error');
    return 4 // 或者 return Promise.resolve(4)
  })
  .then((v) => {
    console.log('4', v);
    return 5
  })
  .finally(() => {
    console.log('finally');
  })
  .then(v => {
    console.log(5, v);
  })
// output
1
2 undefined
catch any error
4 4
finally
5 5
```

> `Promise`实例支持链式调用,每个`then`函数内部最后将返回一个全新的`promise`实例。

`then`方法默认返回一个值为`undefined`,状态为`fulfilled`的`Promise`实例.

> `回调函数`的写法编写可以一次性监听所有回调函数的错误处理逻辑是很困难的,`Promise实例`的实例方法`catch`能处理链式调用之前所有的`then`函数错误和显式的`reject`行为.

`catch`方法能处理链式调用之前所有的异常，也就是说当前面的`Promise`状态转为`rejected`的时候，会"跳过"`then`方法，从而执行`catch`方法注册的异步回调。

> `Promise`的异步注册监听函数的执行顺序取决于使用实例方法添加的顺序。

## 2.3 Promise 静态方法

`Promise`类具有两个能创建一个新的实例的静态方法:

- Promise.resolve(value)
- Promise.reject(reason)

二者区别在于返回的`promise`实例的状态,前者为`fulfilled`,后者为`rejected`.

`Promise.resolve(value)`可以视为以下代码的简写:

```js
new Promise(resolve => {
  resolve(value)
})
```

`Promise.reject(reason)`亦类似。

再次重申，传入的实参`（value/reason）`可以有几种情形：

- 如果`value`是一个原始数据类型的值，则设置`Promise`实例值为此值，状态设置为`fulfilled`
- 如果`value`是一个`Promise`实例，则沿用此实例的状态和值。
- 如果传入的实参是一个非`Promise`的`thenable`对象，则调用此对象的`then`方法，并且传入`resolve`和`reject`作为实参,将`then`方法作为`executor`，在内部可以设置当前实例的状态和值, 必须显示调用`resolve`或者`reject`方法，使用`return`其他值则无效。

```js
const obj = {
  name: 'o',
  then() {
    console.log('this is then', arguments);
    arguments[1](1)
  }
}
const p = Promise.resolve(obj)
p
	.then(r => console.log('resolve', r))
  .catch(r => {
		console.log('reject', r);
	})

// output
this is then [Arguments] {
  '0': [Function (anonymous)],
  '1': [Function (anonymous)]
}
reject 1
```



此外,`Promise`类还有如下几个静态方法:

- `Promise.all(iterable)`
- `Promise.race(iterable)`
- `Promise.any(iterable)`
- `Promise.allSettled(iterable)`

这几个静态方法各有其应用场景.

> 是否支持这些静态方法取决于当前环境,例如在`IE`浏览器下无法使用`Promise`，在`Node14`下无法使用`Promise.allSettled`，我们可以使用第三方库来进行替换，例如`bluebird`。

### 2.2.1 all

首先,`Promise.all(iterable)`方法接收一个`iterable`对象（通常是数组）作为参数,最终返回一个新的`promise 实例`.

> 如果`iterable`对象是空的,则返回的结果是空数组(尽管我们不太会这么做).

我们通过示例代码来理解规范:

```js
let p1 = Promise.all([
  1,
  Promise.resolve(2)
])
```

合成的`Promise`将在所有内部`Promise`实例转化为`Fulfilled`状态后转换为`Fulfilled`状态，其值是一个可迭代对象转化为`Promise`解决之后的值的数组。

> 可迭代对象将会通过`Promise.resolve`方法转换为`Promise`实例。

如果一旦其中之一出现`rejected`状态的`promise 实例`,则合成的`Promise`实例的状态转化为`rejected`,且值为最先出现的`rejected`状态实例的值.

我们可以使用`Promise.all`来执行一组异步操作,这些操作的时间花费取决于最长的那个元素,并且最终如果一切顺利,则结果的顺序是不变的.

`Promise.all()`方法适用于`合并请求`的场景,例如某些项目中,提交的多个数据需要调用云端接口进行数据校验,当所有数据都通过校验的时候才能执行下一步操作,来看看代码:

```js
// 有一个返回 promise 对象的 asyncApi 函数
// 每一个 test 函数都是一个异步的测试
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

### 2.2.2 race

`Promise.race(iterable)`如其名,类似于`Promise.all()`,接收同类型参数,一旦迭代器中某个`promise`状态转化为`settled`,立即返回此`Promise`实例.

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

- 取消任务(在组件被删除后取消异步任务等)，TC39 委员会实际上准备增加此特性，但最终提案被撤回了，但是没关系，`Bluebird`实现了此功能，我们也可以对此特性进行补充，例如利用`setTimeout`定时器函数可以被取消的特性，编写一些逻辑代码和`Promise`取消状态转换的功能函数。
- 进度追踪(显示进度条等)，原生不支持此特性的原因是担心此特性会导致`Promise`的链式调用和类似`all`静态方法的复杂度增加。

原生`Promise`暂未支持上述两项特性,也许我们可以看看类似`Bluebird`这样的第三方库，它们功能强大并且被广泛使用，值得信赖。

# 3. async / await

提及异步函数，`async/await`语法关键字一定是绕不开的知识点，这是一种使用 `Promise`的特殊语法，并且非常容易理解和使用。

我们直接看示例：

```js
async function foo() {
  // balabala
  return 1;
}
```

> 可以理解为 async 函数最后显式返回的值经过 Promise.resolve 函数的转化，返回一个新的 Promise 实例

在函数前添加`async`标识此函数总是返回一个`Promise`,即使我们显示指定其他的类型值，也会被包装成一个`Promise`并返回，当然，依然推荐显示地指定返回`Promise`。

> Try...catch...配合 async/await 使用以处理错误。

使用`async`关键字可以让函数具有`异步`特征，但总体上代码依然是`同步`求值的。

举个例子：

```js
async function foo() {
  console.log(1)
}
foo()
console.log(2)
// output
1
2
```

> 异步函数具有暂停和恢复执行的功能是十分必要的。

使用`await`关键字可以暂停异步函数的执行并且等待返回的`Promise`实例进入`settled`状态。

关键词`await`只在`async`函数内有效：

```js
async function foo() {
  const res = await axios.get('your url')
}
```

在日常工作中无论是浏览器还是`Nodejs`，都可以看到`await`的身影。

尽管其语法简单，我们也需要关注以下两点细节：

- 顶层`await`：此提案当前依然是 `stage 3`，在正式进入稳定版之前，顶层对于`await`的使用依然需要立即执行表达式（IIFE），不幸的是，这种模式导致图形执行和应用程序的静态可分析性的确定性降低。由于这些原因，缺少顶层 `await` 被认为比该功能带来的危害有更高的风险。
- 顶层 `await` 仅限于 ES 模块。明确不支持`CommonJS`模块。
- `await`支持`thenable`对象,如果其后是一个`thenable`对象，则会执行此对象的`then`方法，并且传入`resolve`和`reject`函数作为参数，最终得到一个`settled`的`Promise`实例。
- `await`和`Promise.all`等静态方法配合良好。

```js
const res = await Promise.all([
  promise1,
  promise2,
  ...
])
```

- Error 处理

```js
async function thisThrows() {
  throw new Error("Thrown from thisThrows()");
}

async function run() {
  try {
      await thisThrows();
  } catch (e) {
      console.error(e);
  } finally {
      console.log('We do cleanup here');
  }
}

run();
// output 
Error: Thrown from thisThrows()
    at ...
We do cleanup here
```

我们可以在`async`函数中使用`try...catch...`处理异常问题，就像`Promise`使用实例方法`catch`一样。

# 4. Promisify

`Promise`很棒，但是遵循常见的错误优先的回调风格的函数依然可以在许多场景下活跃着，无论是其开发者在编写代码的时候还未出现`Promise`，亦或是开发者更喜欢回调风格的范式，跟这些回调风格的函数打交道似乎无可避免。

> Nodejs 官方提供了 util.promisify 工具函数用于将传统回调风格的函数转换为返回`Promise`的函数。

我们可以构建一个将`callback`风格的函数转换为`Promise`风格的函数的工具函数。

```js
function promisify(f, multiArgs = false){
  return function(...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) {
        err ? reject(err) : resolve(multiArgs ? results : results[0])
      }
      args.push(callback)
      f.call(this, ...args)
    })
  }
}

const fs = require('fs')
const fsPromise = promisify(fs.readdir)
fsPromise('.').then(r => {
  console.log('resolve', r);
}).catch(r => {
  console.log('reject', r);
})
// output 
resolve [
  'index.js'
]
```

在这个转换过程中，我们将原来的函数包裹进去，并且返回一个可执行的函数，这个函数接收的参数跟原来的`回调风格`函数一致，只是将之转换为`Promise`风格的函数后，传参可以省略`回调函数`，我们在内部构建了一个回调函数，并且将之作为原函数的回调部分作为参数传给了返回函数。

现在，我们将传统回调风格的函数转化为返回`Promise`的函数了，我们可以放心使用`Promise`的新特性了。



# 参考

- [Exploring ES6 - exploring-es6.pdf](chrome-extension://bocbaocobfecmglnmeaeppambideimao/pdf/viewer.html?file=file%3A%2F%2F%2FUsers%2Fyi%2FDesktop%2Fexploring-es6.pdf)
- [architecture - Difference between event handlers and callbacks - Stack Overflow](https://stackoverflow.com/questions/2069763/difference-between-event-handlers-and-callbacks)
- [javascript - addEventListener vs onclick - Stack Overflow](https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick)
- [Getting Started | bluebird](http://bluebirdjs.com/docs/getting-started.html)
- JavaScript 高级程序设计
- [现代 JavaScript 教程](https://zh.javascript.info/)
- [JavaScript | promise resolve() Method - GeeksforGeeks](https://www.geeksforgeeks.org/javascript-promise-resolve-method/)
- [Error handling with Async/Await in JS | by Ian Segers | ITNEXT](https://itnext.io/error-handling-with-async-await-in-js-26c3f20bc06a)
- [Understanding JavaScript Promises](https://nodejs.dev/learn/understanding-javascript-promises)
- [util.promisify(original) | Node.js API 文档](http://nodejs.cn/api/util/util_promisify_original.html)

