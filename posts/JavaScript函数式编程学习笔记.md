---
date: "2020/6/30"
title: "JavaScript函数式编程学习笔记"
tags:
  - JavaScript
author:
  name: Tim Neutkens
ogImage:
coverImg: "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2378&q=80"
intro: "首先,可以使用`writeHead`设置响应头部,然后根据请求信息,可以读取数据库或者本地文件,获取资源并且设置相关的逻辑代码,返回不同类型的数据.并且,可以在做相关操作之前,记录相关信息,也许这就是中间件的来源."
---

每天晚上花 40 分钟阅读此书 📚.

[Introduction · 函数式编程指北](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)

`阅读书籍` + `编写代码` 助力学习 JavaScript 函数式编程.

`首次阅读`

### 开始函数式编程

在作者说了一大堆耿直的言论之后,再次强调了纯函数的纯.

`纯函数`:相同的输入,得到相同的输出.无任何可观察的副作用的函数.

举个 🌰:

```js
> let xs = [1,2,3,4,5]
undefined
> xs.slice(0,2)
[ 1, 2 ]
> xs
[ 1, 2, 3, 4, 5 ]
> xs.splice(0,2)
[ 1, 2 ]
> xs
[ 3, 4, 5 ]
```

明显, `splice`方法修改了原数组的值.这就是`可观察的副作用`.`slice`函数是纯函数.

函数式编程追求的是可靠的,无副作用的函数.

> 插入一篇文章:[ES6 的 const 并非一定为常量](https://blog.fundebug.com/2018/07/25/es6-const/)

再看:

```js
let mininum = 20;
const checkNum = (age) => {
  return age >= mininum;
};
```

内部依赖于外部的可变数据,导致函数不纯.换句话说,内部变量取决于系统状态,增加了认知负荷.

上述代码可以使用 freeze 和 const 定义的方案让函数变成纯函数.

> 副作用是在计算结果的过程中,系统状态的一种变化,或者和外部世界进行可观察的交互.

副作用可能是:

- 更改文件系统
- 往数据库插入记录
- 发送一个 http 请求
- 可变数据
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态

等等...

看到这里,我确实怀疑无副作用编程是一个美好的幻想.

但是作者接着说,函数式编程的哲学就是嘉定副作用是造成不正当行为的主要原因.

`让副作用可控`.

在数学上,函数中的每一个输入都只有一个输出.`纯函数就是数学上的函数`,并且是函数式编程的全部.

`追求纯的理由`: 纯函数因为相同的输入有稳定相同的输出,故可以根据输入做缓存.看看如下一个函数是如何实现一种 memoize 技术的:

```js
const add = (n) => n + 10;
console.log("简单调用", add(20));
const memorize = (fn) => {
  const cache = {};
  return (...arguments) => {
    const firstArg = arguments[0];
    if (firstArg in cache) {
      console.log("data come from cache");
      return cache[firstArg];
    }
    console.log("data come from calculating...");
    const result = fn(firstArg);
    cache[firstArg] = result;
    return result;
  };
};

const memorizeAdd = memorize(add);
console.log(memorizeAdd(3));
console.log(memorizeAdd(20));
console.log(memorizeAdd(20));
console.log(memorizeAdd(3));
```

把一个缓存对象放在闭包的环境内部,通过接收一个函数并且返回,这个函数在执行的时候检查是否存在缓存的值.

这里回忆一下`arguments`对象.在一个函数内的 arguments 对象代表最近的函数接收的参数对象.

纯函数和缓存结果的逻辑简直是天作之合.纯函数具有可缓存性,缓存的部分不止是结果,甚至缓存具有副作用的函数.除了`可缓存性`之外,纯函数还有`可移植性`,纯函数内部自给自足,依赖明确,易于观察和理解.

`参数`给了开发者足够的信息.`可移植性`让代码可以序列化并且通过 web socket 发送,通过 web workers 执行.只要开发者愿意,纯函数可以`在任何地方执行`.

第三,纯函数让`测试`更加方便,因为测试纯函数只需要给纯函数一个`输入`和一个`断言输出`即可.

最后,纯函数可以方便的`并行运行`,因为不需要访问共享内存,也不会因为副作用进入`竞态环境`.

### 柯里化 curry

纯函数无法脱离`curry`柯里化技术.

> 有些事物在得到之前无足轻重,得到之后就不可或缺.

`curry`的概念: 只传递给函数`一部分参数`来调用它,让它返回一个`函数`去处理剩下的参数.

```js
const add = function (x) {
  return (y) => {
    return x + y;
  };
};

const inc = add(1);
console.log(inc(22)); // 23
```

示例定义一个 add 函数,接受一个`参数`并且返回一个新的`函数`,调用 add 之后,通过闭包记住首个参数.我们可以使用一个特殊的`curry help function`来简化定义和调用.

```js
var curry = require("lodash").curry;
var match = curry(function (what, str) {
  return str.match(what);
});
var replace = curry(function (what, replacement, str) {
  return str.replace(what, replacement);
});
var filter = curry(function (f, ary) {
  return ary.filter(f);
});
var map = curry(function (f, ary) {
  return ary.map(f);
});
```

实际上,我不太清楚`lodash.js`,官网上解释:

> 创建一个函数，该函数接收 `func` 的参数，要么调用`func`返回的结果，如果 `func` 所需参数已经提供，则直接返回 `func` 所执行的结果。或返回一个函数，接受余下的`func` 参数的函数，可以使用 `func.length` 强制需要累积的参数个数。

最近身心俱疲,脑子里命令式和申明式的概念互相缠绕.or 互相`缠绵`.

如上代码,例如`match`函数,被 curry 函数处理后就是一个新的函数,并且可以接收 curry 函数中`参数函数`接收的参数.然而还是不太清楚,脑子笨.直到我继续看下去,且在编辑器里运行:

```js
console.log(match(/\s+/g, "hello world"));
console.log(match(/\s+/g)("hello world ss"));
let hasSpaces = match(/\s+/g);
console.log(hasSpaces(" dd cc "));
```

才体会到`curry`处理后,犹如有了一个`前置性`的,或者说`预加载`函数的效果.

### 资源

- [How to use Memoize to cache JavaScript function results and speed up your code](https://www.freecodecamp.org/news/understanding-memoize-in-javascript-51d07d19430e/)
-
