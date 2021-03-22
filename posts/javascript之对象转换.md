---
title: 'javascript语言中的类型转换'
date: '2021/3/22'
tags:
- javascript
- tc39
mainImg: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTY0MTAxMzQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTY0MTAxMzQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '你好,TC39.请问 JavaScript 世界中的对象转换是如何实现的呢?'
---

在机缘巧合之下,我看到了国外大神`Dr.Axel Rauschmayer`的博客:[2ality – JavaScript and more](https://2ality.com/index.html),其中一篇文章针对`类型转换`这个问题作了分享,本着求知的想法我静下心阅读了此文,所得所想记录于此.

**2021年03月22日18:52:54**

## 1. 起始

`JavaScript` 是优秀的动态语言,数据类型的转换在日常编程开发中十分常见.本文将结合一些实际问题和个人疑惑对`类型转换`进行学习和解析,尽量深入`ECMAScript规范`,追索玄机.

> 如果喜欢,不妨亲自阅读 [ECMAScript® 2022 Language Specification](https://tc39.es/ecma262/multipage/)

## 2. 何为类型转换?

首先我们要明确一点,`JavaScript`数据分为:

- 原始数据类型(without methods)
  - undefined
  - null
  - string
  - number
  - biginit
  - boolean
  - symbol
- 对象

看看这一行代码:

```js
Number('3') * Number('2')
```

两个数字之间使用乘法操作符相乘,数字类型是明确的从字符串通过`Number()`函数`显式`转过来的.

字符串之间`"不能"`直接执行乘法.

```js
'a' * 'b' // NaN
```

也许你会举出如下可行的例子:

```js
'1' * '2' // 2
```

此时,字符串之间的乘法得出了我们想要的结果.究其实质是因为解释器对字符串进行了`强制类型转换(coercion)`.

JavaScript 语言初期并没有异常捕获(`exceptions`)的规范设计,这也是为什么你会看到现今解释器对如下代码的解释.

```js
1 / true // 1
1 / false // Infinity , 很明显, 0 作为分母是错误的,但是解释器最后的值是 Infinity
Number('a') // NaN 
```

为了实现兼容,`ECMAScript`不得不"允许"这部分错误的设计继续存在.但是,对于一些相对较新的特性来说,修复了这个错误的设计.

例如:

```JavaScript
1 / Symbol() // except error: can not cover a symbol value to a number

1 / 2n // except error: can not mix BigInt and other types,use explicit conversions

1() // except error: 1 is not a function

new 1 // except error: 1 is not a constructor

'ab'.length = 1 // 只读属性不可改
```



## 3. ECMAScript 的规范是如何使用类型转换函数的?

先来看看如下一个使用`Typescript`编写的函数:

```typescript
function multiply(a: number, b: number) {
  // ...
}
```

如上所示,此函数的两个参数的类型都是`number`,在转译为`JavaScript`的过程中,转译器做了什么?

为了在转译后保证参数类型正确,其过程简述为如下代码:

```JavaScript
function multiply(a, b) {
  let _a = ToNumberic(a);
  let _b = ToNumberic(b);
  /// ...
}
```

在解释器内部可以通过如下`抽象操作`函数将目标数据进行类型强制转换:

- ToBoolean()
- ToNumber()
- ToBigInt()
- ToString()
- ToObject()

> 上述函数是`ECMAScript`定义的函数,用于描述伪代码,便于编写规范,我们无法在 JavaScript 中调用它.





加法操作对不同类型的数据将进行三种类型的转换,最终将得到一致的数据类型.最终数据都将转换为原始数据类型.

`{} + {}`将对两个空对象进行类型转换,因为`object`不是`原始数据(primitive)`类型.

> TC39: "负责将对象转换为原始数据类型的函数是`ToPrimitive()`".

函数如其名,此函数的签名如下:

```javascript
ToPrimitive(input, PreferredType?)
```

`input`易于理解,可选的`PreferredType(首选类型)`则接受一个用于表示期待转换结果的原始类型标识字符串,最终返回一个原始类型值.



## references

- [Type coercion in JavaScript](https://2ality.com/2019/10/type-coercion.html)