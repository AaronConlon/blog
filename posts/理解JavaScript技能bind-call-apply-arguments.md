---
date: "2020/7/4"
title: "理解JavaScript技能:bind-call-apply-arguments"
tags:
  - Javascript
  - 设计模式
author:
  name: Tim Neutkens
ogImage:
coverImg: "https://www.jav321.com/digital/video/blk00471/blk00471jp-12.jpg"
intro: "JavaScript语言的`this`功能让我感觉到了混乱,在一些其他的面向对象语言中,this始终指向的是对象当前的实例,但是在JavaScript中,这就不一定了,在js中取决于函数的调用者."
---

![](https://miro.medium.com/max/1400/1*hAo_ppCOqQX9O9bVlMN_fw.png)

JavaScript 语言的`this`功能让我感觉到了混乱,在一些其他的面向对象语言中,this 始终指向的是对象当前的实例,但是在 JavaScript 中,这就不一定了,在 js 中取决于函数的调用者.具体的实例如下:

```JavaScript
const person = {
  firstName: 'John',
  lastName: 'Doe',
  printName: function() {
    console.log(this.firstName + ' ' + this.lastName);
  }
};
const far = person.printName
console.log(far())
// 输出undefined undefined
// 因为this指向了window全局对象,而不是person
```

为了阻止这种迷幻的 this 指向,明确执行逻辑.JavaScript 提供了一些方案:

- call()
- bind()
- apply()

以上方法可以设置 this 的指向.JavaScript 中每个函数都有如上三个方法.

#### bind method

`bind()`创建了一个新的函数,并将`this`指向一个特殊的对象.语法和示例如下:

```js
function.bind(thisArg, optionArguments)

const john = {
  name: 'John',
  age: 24,
};
const jane = {
  name: 'Jane',
  age: 22,
};

john.far = far
john.far(1)
john.far.bind(jane, [1,2])(111)

// 输出
//我是 John
//[Arguments] { '0': 1 }
//我是 Jane
//[Arguments] { '0': [ 1, 2 ], '1': 111 }
```

始终记住`bind方法创建了一个函数`,this 指向 bind 函数的第一个参数,后续参数依次作为新的函数的参数,按顺序为新的函数提供参数.

#### call method

`call方法`同样为调用它的函数提供明确的 this 指向,并且`立即执行此函数`,不像 bind 还要做一次函数的 copy.

```js
function.call(thisArgs, optionArgs)
```

#### apply method

`apply方法`则跟`call`非常类似,唯一的区别是语法:

```js
function.apply(thisArgs, [argumentsArr])
```

在第二个参数这里接受的是一个数组对象.并且,就算后续再加参数,函数内部的 arguments 对象也不会将之保存下来.

#### arguments

最后,想要再学习一下函数的`arguments`对象.每个函数内部都内置此对象以保存函数接收到的参数.

![](https://miro.medium.com/max/1400/1*Z9IhXv0dyGqmzOr2_9qTvQ.png)

arguments 实际上是一个`类数组`对象,并且,我们常用的箭头函数内部`不支持`此对象(浏览器环境,node 有所不同).

> An **arrow function expression** is a syntactically compact alternative to a regular [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function), although without its own bindings to the `this`, `arguments`, `super`, or `new.target` keywords. Arrow function expressions are ill suited as methods, and they cannot be used as constructors.

`arguments`对象支持 index 操作和获取 length.有时候我们要把它转化为一个数组,方便操作.

```js
const args = Array.prototype.slice.call(arguments);
// ES6
const args = [...arguments];
```

`须知和推荐`

> 对参数使用 slice 会阻止某些 JavaScript 引擎中的优化 (比如 V8 - [更多信息](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments))。如果你关心性能，尝试通过遍历 arguments 对象来构造一个新的数组。另一种方法是使用被忽视的`Array`构造函数作为一个函数

```js
const args =
  arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
```

如果嵌套多层函数,则 arguments 保存了最近的函数接收的参数信息.

#### 参考资料

- [Understanding Call, Bind and Apply Methods in JavaScript](https://blog.bitsrc.io/understanding-call-bind-and-apply-methods-in-javascript-33dbf3217be)

- [Arguments Objects in JavaScript - JavaScript_Dots - Medium](https://medium.com/javascript-dots/arguments-objects-in-javascript-e060df501610)
