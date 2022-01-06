---
title: '如何正确判断 JavaScript 中的数据类型'
date: '2022/1/6'
tags:
- 面试题
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1608759991391-370fb9fbf7b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0NTQ4OTM&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1608759991391-370fb9fbf7b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0NTQ4OTM&ixlib=rb-1.2.1&q=80&w=400'
intro: '最近面试被问到好几次，如何判断数据的类型，在此记录一下！'
---

### 前言

最近面试被问到好几次，如何判断数据的类型，在此记录一下关于 JavaScript 数据类型的问题！

### 开始

我们知道 `JavaScript` 有以下几种基础数据类型：

- Number

- String

- Null

- Boolean

- Undefined

- BigInt

- Symbol

- Object

在此之外，或许还需要判断是否是数组，是否是函数，亦或是否是某个类的实例等等。

逐一处理~

如果`typeof`不能满足我们的要求，则需要更进一步。

首先便是众所周知的使用`Object.prototype.toString()`方法：

```js
const getType = target => Object.prototype.toString.call(target).slice(8, -1);
```

  借此，我们可以判断出数据在上述八种类型中的类别。

除此之外，还有其他需要判断的问题如下：

- `NaN`: Number.isNaN(target) 跟 isNaN(target) 的区别在于，后者会主动尝试将参数值转为数字，再判断是否是`NaN`。

- `null`和`undefined`：可以使用`!`来判断，此二者取反都是`true`。

  

此外，还可以通过变量的`constructor`构造器来判断数据类型，看几个例子：

```js
const arr = [1];
arr.constructor === Array; // true

const func = function() {}; // func = () => {}
func.constructor === Function; // true
```

这跟目标是一个对象时使用`instanceof`是一样的。

### 进阶

然后我遭遇了另一个问题。

`什么是纯对象：Plain Object？`

在我写此文之前，从没接触过这个词。所谓`plain object`  其实在`jquery`中出现过，在`redux`中也出现过，其也实现了一套代码判断目标对象是否是纯对象。

姑且认为一个对象仅仅是通过字面量来定义，亦或是使用`new Object()`创建的对象。

纯对象具有一层`__proto__`，而非纯对象则至少有两层。

> 参考：[isPlainObject 的不同实现 | 人过不留名 雁过不留声](https://yanni4night.github.io/js/2018/02/06/is-plainobject.html)

接下来让我们来看看`Jquery`是如何定义判断函数的：

```js
function isPlainObject(obj) {
    var proto, Ctor;
    // (1) null 肯定不是 Plain Object
    // (2) 使用 Object.property.toString 排除部分宿主对象，比如 window、navigator、global
    if (!obj || ({}).toString.call(obj) !== "[object Object]") {
        return false;
    }

    proto = Object.getPrototypeOf(obj);

    // 只有从用 {} 字面量和 new Object 构造的对象，它的原型链才是 null
    if (!proto) {
        return true;
    }

    // (1) 如果 constructor 是对象的一个自有属性，则 Ctor 为 true，函数最后返回 false
    // (2) Function.prototype.toString 无法自定义，以此来判断是同一个内置函数
    Ctor = ({}).hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}
```

### 最后

判断类型这个问题，总是很容易谈到原型链，这个知识点下次再谈😂！

