---
title: 'Javascript-ES6-函数式编程阅读随写'
date: '2020/12/16'
tags:
- Javascript
mainImg: 'https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '第一次看到这本书的时候,记得是几年前在桂电图书馆里,断断续续看了六章,后来便离开了学校.现在买了纸质书打算重新看一遍,这里记录下阅读随想.'
---

# 函数式编程简介

> 函数要小,要更小.

函数式编程,远离外部环境的依赖,隔绝突变与状态.

数学的函数定义中,函数必须接收一个`参数`,返回一个值.函数根据接收的参数运行.给定的参数下,返回值是不变的.

`JavaScript函数式编程`基于数学函数及其思想进行发展.运用函数式的范式进行开发能创造可缓存和可测试的代码库.

> 简单分辨函数与方法 - JS,不必深究 window和 global 对象.

- 函数: 一段通过名称可调用的代码
- 方法: 通过名称且关联对象的名称被调用的代码

函数的引用透明性指的是,函数对相同的输入返回相同的值.不依赖全局数据的函数,能够自由地在多线程状态下运行,全程无锁.并且函数是`可缓存`的,合理运用这一点,可以节省大量重复计算的资源消耗和时间消耗.

> 引用透明性是一种哲学

**命令式?声明式?**

```js
const arr = [1,2,3]
for(i=0;i<arr.length;i++) 
  console.log(i)
```

上述代码示例,我们告诉编译器如何去做,这就是`命令式`.

```js
const arr = [1,2,3]
arr.forEach(i => console.log(i))
```

`forEach`是一个高阶函数,意在告知编译器`做什么`,`如何做`的部分则在高阶函数内的普通函数中实现.这便是`声明式`.



**纯函数**:对给定的输入,返回相同的输出的函数.纯函数不依赖于外部环境.也不会改变外部环境.易于对函数进行`测试`.

纯函数是`易于阅读`的.为纯函数设置`具有意义`的函数名是一种最佳实践.

> 纯函数应该被设计为只做一件事,并且把它做到完美,这也会是 Unix 的哲学.

纯函数支持`管道和组合`.

```shell
cat package.json | grep axios
```

`bash`命令的管道和组合威力巨大,组合是函数式编程的核心.我们称之为`function composition`.

# JavaScript 函数式基础

略,简述基础`JavaScript`.

# 高阶函数 HOF

**JavaScript 数据类型**:

- Number
- String
- Boolean
- Null
- Object
- undefined
- Symbol
- BigInt

除了`object`外,都是原始数据类型.

> 在[计算机科学](https://zh.wikipedia.org/wiki/電腦科學)中，**抽象化**（英语：Abstraction）是将资料与程序，以它的语义来呈现出它的外观，但是隐藏起它的实现细节。抽象化是用来减少程序的复杂度，使得程序员可以专注在处理少数重要的部分。一个电脑系统可以分割成几个[抽象层](https://zh.wikipedia.org/wiki/抽象層)（Abstraction layer），使得程序员可以将它们分开处理。

抽象化,让我们专注于可控层面的工作,将复杂的内容简单化,让开发者专注于预订的目标,不必`事事关心`.

我们通过`高阶函数`实现抽象.

```js
const forEach = (arr, Fn) => {
  for(let i=0;i<arr.length;i++) Fn(arr[i])
}
```

这是一个简单的高阶函数,抽象了`遍历数组`的问题,如果你使用这个函数,你并不需要关注内部代码是如何实现的.上述例子是一个简单逻辑,同理也可以是更为复杂的逻辑,这样一来就将复杂问题`抽象`出来了.

让我们开始学习构建复杂的高阶函数.

创建一个`every`函数如下:

```js
const every = (arr, fn) => {
  let result = true
  for(const i=0;i<arr.length;i++) {
    result = result && fn(arr[i])
  }
  return result
}

// for..of.. 版本
// for...of..是 es6 的函数,可以方便遍历数组
const every = (arr, fn) => {
  let result = true
  for(const value of arr) {
    result = result && fn(arr[value])
  }
  return result
}
```

如此一来,我们抽象了对数组遍历的操作.

接着,编写一个`some`函数,其接受一个数组和一个函数,如果数组中一个元素通过接收的函数返回`true`,则`some`函数返回`true`:

```js
const every = (arr, fn) => {
  let result = true
  for(const value of arr) {
    result = result || fn(arr[value])
  }
  return result
}
```

> some 函数和 every 函数都不算高效,这里只是作为对高阶函数的展示.

`JavaScript`的`array`原型内置`sort`函数,可以给数组排序.这是一个典型的`高阶函数`.它接收一个可选的函数来决定排序顺序逻辑.极大的提高了排序的灵活性.我们知道,默认的`sort`排序是将数组元素转换为`string`并且按`Unicode`编码点进行排序,因此数字 2 在默认排序算法中小于 12.让我们看看此可选的`compare`函数的骨架:

```js
function compare(a, b) {
  if(条件) {
    // a 小于 b
    return -1
  }
  if(条件) {
    // a 大于 b
    return 1
  }
  // a 等于 b
  return 0
}
```

举个例子,现在我们有一个用户数组,每个元素是一个用户的信息.

```js
const people = [
  {
    name: 'Aaron',
    age: 10
  },
  {
    name: 'Rose',
    age: 11
  }
]
```

而需求则是,通过姓名排序或者通过年龄排序.根据前置知识,可以写出如下代码:

```js
// 简化逻辑,忽略相等的情况
people.sort((a, b) => a.name > b.name ? 1 : -1)
people.sort((a, b) => a.age > b.age ? 1: -1)
```

上述代码,我们将雷同的部分写了两遍.现在我们来设计一个函数,接收一个参数,返回一个函数.是的,将要设计的这个函数是一个`高阶函数`.

```js
const sortBy = (property) => {
  return (a, b) => {
    return a[property] > b[property] ? 1 : -1
  }
}
// 简化版
const sortBy = property => (a, b) => a[property] > b[property] ? 1 : -1
```

现在,我们可以重写按`name`或者`age`的排序代码了.

```js
people.sort(sortBy('name'))
people.sort(sortBy('age'))
```

这就是`高阶函数`的魅力.运用高阶函数,提高代码质量,降低代码数量.

# 闭包与高阶函数

 简而言之,闭包就是一个内部函数.在一个函数内部的函数,可以称为`闭包函数`.

从`技术上`来讲,上述闭包函数的闭包场景存在三个可访问的作用域:

- 自身声明内变量
- 外部函数变量
- 全局变量

**闭包可以记住上下文环境**.话说回来,由于我们要在函数式编程中处理很多函数,因此需要一种调试方法.

举个例子,一个字符串数组,想要解析成整数数组,如下代码会有问题:

```js
['1', '2'].map(parseInt)
```

`map`函数用三个参数调用了`parseInt`,分别是:

1. element
2. index
3. arr

而`parseInt`函数全盘接纳,来看看此函数的定义:

```js
parseInt(string, radix);
```

`radix`是可选的基数,如果提供 10,则转换为十进制的整数.

如果 `radix` 是 `undefined`、`0`或未指定的，JavaScript会假定以下情况：

1. 如果输入的 `string`以 "`0x`"或 "`0x`"（一个0，后面是小写或大写的X）开头，那么radix被假定为16，字符串的其余部分被当做十六进制数去解析。
2. 如果输入的 `string`以 "`0`"（0）开头， `radix`被假定为`8`（八进制）或`10`（十进制）。具体选择哪一个radix取决于实现。ECMAScript 5 澄清了应该使用 10 (十进制)，但不是所有的浏览器都支持。**因此，在使用 `parseInt` 时，一定要指定一个 radix**。
3. 如果输入的 `string` 以任何其他值开头， `radix` 是 `10` (十进制)。

如果第一个字符不能转换为数字，`parseInt`会返回 `NaN`。

此时,`['1', '2'].map(parseInt)`的结果是: [1, NaN].

如何用函数式的思维,创建一个高阶函数,对`parseInt`进行抽象.

```js
const unary = (fn) => fn.length === 1 ? fn : (arg) => fn(arg)
['1','2','3'].map(unary(parseInt))
```

现在,即使`map`以三个参数调用`unary`函数执行后返回的函数,都只会让`element`参数生效.

我们得到了预期中的结果:`[1,2,3]` :seedling:

现在,让我们为自己的工具库添加一个工具函数,这个函数接收一个函数作为参数,让这个接收的函数只能被执行一次.

```js
const once = (fn) => {
  let done = false
  return () => done ? undefined : ((done = true), fn.apply(this, arguments))
}
```

现在用一个变量`done`保存函数的执行状态.

```js
const demoFn = (a, b) => {
  console.log(a, b, 'just called once.')
}
const newDemoFn = once(demoFn)
newDemoFn(1, 2) // output: 1 2 just called once.
newDemoFn(3, 4) // no output
```

继续,创建下一个函数`memoized`,使函数记住其计算结果:

```js
const memoized = (fn) => {
  const lookupTable = {}
  return (arg) => lookupTable[arg] || (lookupTable[arg] = fn(arg))
}
```

一个速查`table`保存了函数解构,如果不存在则执行此函数,保存到速查表中并且返回此结果.

**memoized 函数是经典的函数式编程,是闭包与纯函数的实战**

# 数组的函数式编程

我们将创建一组函数用于解决常见的数组问题,关键在于函数式的方法,而非命令式的方法.

> 把函数应用于一个值,并且创建新的值的过程被称为"投影"

`Array.map`就是典型的投影函数.我们来试着创建一个`map`函数.

```js
const map = (arr, fn) => {
  const result = []
  for(const v of arr) {
    result.push(fn(v))
  }
	return result
}
```

一个`filter`函数,对数组内容进行过滤.

```js
const filter = (arr, fn) => {
  const result = []
  for(const v of arr) {
    if(fn(v)) result.push(v)
  }
  return result
}
```

一个`reduce`函数,对数组的所有值进行`归约`操作.

```js
var reduce = (arr, fn, defaultAccumlator) => {
  let accumlator;
  if(defaultAccumlator !== undefined) {
    accumlator = defaultAccumlator
    for(const v of arr) {
      accumlator = fn(accumlator, v)
    }
  } else {
    accumlator = arr[0]
    for(let i=1;i<arr.length;i++) {    
      accumlator = fn(accumlator, arr[i])
    }
  }
  return [accumlator]
}
```

**继续**,上`zip`函数,用于合并两个单独的数组,返回一个处理过的新数组.这个函数可以对给定的两个数组的限定对象进行结对处理,如何处理取决于具体的函数逻辑.结对的结果就是返回一个新的数组.

```js
const zip = (arr1, arr2, fn) => {
  let index, result = []
  for(index = 0;index < Math.min(arr1.length, arr2.length);index++) {
    result.push(fn(arr1[index], arr2[index]))
  }
  return result
}
```

# currying 和偏应用

**一些术语**:

- unary function: 一元函数,只接收一个参数的函数.
- binary function: 二元函数
- 变参函数:接受可变数量参数的函数
- currying: 柯里化,这是一个过程,将一个多参函数转变为一个嵌套的一元函数.

上代码:

```js
const curry = binaryFn => {
  return firstArg => {
    return secondArg => {
      return binaryFn(firstArg, secondArg);
    }
  }
}
// 简化
const curry = binaryFn => firstArg => secondArg => binaryFn(firstArg, secondArg)
```

完美利用了闭包的特性,也许对于一些深谙此道的 coder 而言,这不算什么.但是对于此刻的我来说,从未如此清晰体会到闭包和 currying.如此之美.

开发者编写代码的时候会在应用中编写日志,下面我们编写一个`日志函数`.

```js
const loggerHelper = (mode, msg, errorMsg, lineNo) => {
  if(mode === 'DEBUG') {
    console.debug(msg, errorMsg + 'at line:' + lineNo)
  } else if(mode === 'WARN') {
    console.warn(msg, errorMsg + 'at line:' + lineNo)
  } else if(mode === 'ERROR') {
    console.error(msg, errorMsg + 'at line:' + lineNo)
  } else {
    throw "WRONG MODE"
  }
}
```

上述代码不是良好的设计,多次重用了部分代码,让整体不够简洁.之前创建的`curry`函数也无法处理这个