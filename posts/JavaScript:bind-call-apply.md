---
title: 'JavaScript:bind call apply'
date: '2022/1/7'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0ODYzNDY&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0ODYzNDY&ixlib=rb-1.2.1&q=80&w=400'
intro: 'JavaScript 如何实现 bind/call/apply ?'
---

### 前言

在日常的前端开发工作中，有时候会需要为某些函数显式绑定`this`，这时候我们通常可以使用`bind/call/apply`三个方法创建新的函数，并且显式指定`this`。

> "`this`到底引用哪个对象，必须到函数被调用时才能确定" from JavaScript 高程

`bind/call/apply`三者在非严格模式下，`thisArg`指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

今天，我们就来学习一下如何从源码的角度去实现这三个可以显示确定`this`的方法。



### bind

> Tips: 使用 bind() 后返回的新函数，其`name`属性将会有`bound`前缀

语法如下：

`function.bind(thisArg[, arg1[, arg2[, ...]]])`

`bind()`方法创建一个`新的函数`，在`bind()`被调用时，新函数的`this`被指定为`thisArg`，其余参数作为新函数的参数，供调用时使用。

#### 实现

> 参考[implementing Function.prototype.bind](https://gist.github.com/yyx990803/6311083)

```js
Function.prototype.bind = function(context) {
  if(typeof this !== 'function') {
    throw new TypeError("what is tring to be bound is not function");
  }
  var fn = this, // the function to bind
  	slice = Array.prototype.slice, // cache slice method
    args = slice.call(arguments, 1), // get the array of addtional arguments
    noop = function() {}, // 用作原型链连接的中间函数
    bound = function() {
      var ctx = this instanceof noop && context ? this : context;
      return fn.apply(ctx, args.concat(slice(arguments)))
    }

  noop.prototype = fn.prototype;
  bound.prototype = new noop();
  return bound;
}
```

上述代码一开始就调用源是否是一个函数，显然如果不是一个函数却调用了`bind`，我们应该报错提示原因。

其次，使用一个变量保存`调用源`函数`this`，如此一来后续再使用此函数时语义上更明确。

使用`slice.call(arguments, 1)`来将调用`bind`时传入的参数保存下来，存入`args`!

注意`noop`函数，之所以创建这个函数，是为了将原函数的原型保存下来，在最终返回的函数上继承过去，通过这个中间函数就可以避免使用者修改了最后返回的函数的原型链可能导致原函数的原型链异常。



回忆一下`new`操作的`Doc`：

**`new`** 关键字会进行如下的操作：

1. 创建一个空的简单JavaScript对象（即`{}`）；
2. 为步骤1新创建的对象添加属性**`__proto__`**，将该属性链接至构造函数的原型对象 ；
3. 将步骤1新创建的对象作为`this`的上下文 ；
4. 如果该函数没有返回对象，则返回`this`。



我们创建一个`bound`函数，最后返回此函数，这个函数需要关注以下几点：

- 保存原型链
- 检查返回后的函数，被使用的类型，区分为是否使用`new`来创建实例，如果是则不使用`bind`提供的`thisArg`，核心代码是：`this instanceof noop && context ? this : context`。如果使用者将`bind`返回的函数通过`new`去实例化对象，则不应该使用`bind`显式绑定的`thisArg`作为`this`!
- 处理好`bind`时预置的参数和最后调用时的参数顺序

> 笔者依然不懂为何需要在使用 new 实例化的时候，检查 context 的值！不过已经直接去提问作者了😂。

另外,链式调用`bind`的结果,`this`始终是第一个调用时提供的对象.

最后，补充一个网上传的`mdn bind polyfill`:

![](https://miro.medium.com/max/1400/1*moB8J7pRUSd4YCgRg6uWVA.png)

### call 和 apply

> Call 和 apply 将会以显式指定的 this 作为函数 this 来调用函数，`call()` 方法接受的是**一个参数列表**，而 `apply()` 方法接受的是**一个包含多个参数的数组**。

接下来实现这俩方法：

#### Call

```js
Function.prototype.myCall = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("what is tring to be called is not function");
  }
  const contextObj = Object(context);
  const symbol = Symbol();
  contextObj[symbol] = this;
  return contextObj[symbol](...[...arguments].slice(1));
};
```

#### Apply

```js
Function.prototype.myApply = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("what is tring to be called is not function");
  }
  const contextObj = Object(context);
  const symbol = Symbol();
  contextObj[symbol] = this;
  return contextObj[symbol](...[...arguments][1]);
};
```

如果从理解这两个方法的使用来看，不必纠结上述实现在严格模式和非严格模式下的区别，无论`context`是什么，都使用`Object`包装起来就行了。

### 结语

上述三个方法在日常工作中或许不常用到，尤其是在函数式组件越发流行的今天，但是对于 JavaScript 开发者来说，温习和理解它们依然非常有意义，就这样。

