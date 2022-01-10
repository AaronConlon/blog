---
title: 'JavaScript的原型链'
date: '2022/1/10'
tags:
- JavaScript
- 面试题
mainImg: 'https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE4MTc4NjY&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE4MTc4NjY&ixlib=rb-1.2.1&q=80&w=400'
intro: '浅解 JavaScript 原型链！'
---

### 前言

毫无疑问！每一个 JavaScript 工程师都应该了解什么是原型链。



### 原型

在谈原型链之前，我们先谈谈原型，在谈原型之前，我们先来了解一下构造函数。

在 JavaScript 的世界中，实例都是通过构造函数执行得来的，举个例子：

```js
function Person() {
  this.age = 100;
  this.sayAge = function() {
    console.log(this.age);
  }
}
```

我们通过`new`去创建两个实例:

```js
const p1 = new Person();
const p2 = new Person();
```

此时，`p1`和`p2`都具有同名的方法`sayAge()`，但是在创建是实例的时候，这个同名的方法被创建了两次。

`p1.sayAge !== p2.sayAge`！

其逻辑等同于`new Function("console.log(this.age)")`，这就造就了两个同名却不相等的函数。

在功能上二者都是打印`age`，没有必要创建两个函数去处理这个问题。

为了解决这个问题，可以将此函数直接定义在`Person`构造函数之外，然后在内部引用即可。

但是这样一来又会让外部作用域更为混乱，单个方法还好，如果需要创建多个这样的函数，则不容易让这部分代码聚合起来。

针对这个问题，可以使用`原型模式`来解决。

#### 原型模式

每一个函数都有`prototype`属性，这个属性是一个包含应该由特定引用类型的实例共享的属性和方法的`对象`。

在使用`new`操作符构建实例的时候，实例暴露出`__proto__`属性将构造函数原型上将共享的属性和方法复制了下来，如此一来只要我们为构造函数添加好`prototype`属性对象，那么实例就可以共享到这些属性和方法了。

举个例子🌰：

```js
function Person() {}
Person.prototype.age = 100;
Person.prototype.sayAge = function() {
  console.log(this.age);
}
// 实例化
const p1 = new Person();
const p2 = new Person();
p1.sayAge === p2.sayAge; // true
```

上述例子构造函数是空函数，但是实例依然有共享的属性和方法。

#### 理解原型

创建函数的同时，此函数便具有指向其`原型对象`的`prototype`属性！

并且，每一个函数的`原型对象`都自动具有一个`constructor`属性，这个属性指向与之关联的构造函数！

`Person.prototype.constructor === Person`!

换句话说，构造函数具有`prototype`指向原型，而其原型具有`constructor`指向构造函数，二者是一个互相引用的环。

> `Function`的构造函数也是`Function`!
>
> `Function.constructor === Function; // true`

在自定义构造函数的时候，原型默认获得`constructor`属性，其他的方法（诸如`toString()`）继承自`Object`！

在实例化对象的时候，此对象可以通过`__proto__`属性访问到构造函数的原型对象。

> JavaScript 高级程序设计：“实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有！”

### 原型链

让我们来看一张流传很广的图示去学习原型链：

![](https://clarkdo.js.org/public/img/jsobj_full.jpg)

自定义构造函数，通过构造函数进行实例化得到对象的过程我们已经说过了。

现在关注以下图中`Foo()`这个构造函数，这个构造函数也是`实例`！

一切自定义函数的`__proto__`属性都指向了`Function`的原型对象，因此：

`Foo.__proto__ === Function.prototype`!

并且，`Function.__proto__ === Function.prototype`！

这或许会让人非常迷惑，但事实就是如此。

`Function 的构造函数是其本身`！

最后`Function.prorotype.__proto__ === Object.prototype`!

`Object.prototype.__proto__ === null`就是尽头。

原型之原型，构成了一条条链，从`Object`到自定义构造函数创建的实例，对象之间的原型关系便是这些链连接起来的。

这张图能够帮助我们理解原型和原型链，值得收藏~

### 总结

我们通过构造函数创建了实例，实例之间共享着构造函数的原型对象上的属性和方法，每一个实例在`new`的过程中将这些属性和方法放到了`__proto__`上。

此外，构造函数的原型对象和构造函数之间具有相互引用的环。

> 箭头函数不存在原型对象，不能使用`new`去尝试实例化！



### 参考

- [彻底弄懂prototype, __proto__, constructor, instanceof的渊源](https://mp.weixin.qq.com/s/5Pc7tuAyUGeMn7-ws0wBcA)
