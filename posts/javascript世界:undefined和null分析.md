---
title: 'javascript世界:undefined和null分析'
date: '2021/3/3'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1614103192137-835c33cd0685?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1614103192137-835c33cd0685?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '在 JavaScript 的世界里,存在着许多值得深入探讨和学习的知识,今天先来看看 undefined 和 null 的特性和对比.'
---

许多编程语言都有`空`的概念,并使用`null`关键字表示它,表示这个变量当前并未存在指向,换句话也可以说是这个变量未初始化.

但是在`JavaScript`的世界里,存在着两种`空`的表示方法:`undefined`和`null`.本文简单描述了它们的区别以及各自适宜的使用场景.

# 1. Undefined vs. null

两个关键字都很常用,并且在许多场景下可以相互替换.因此,它们之间的差异是非常微妙的.

## 1.1 ECMAScript 关于二者的定义

- undefined 在未分配变量的时候使用
- null 在变量未分配值的时候使用,表示故意缺少任何对象值,其值不存在.

接下来将配合一些代码进行说明.

## 1.2 两个"空值"和一个错误

> JavaScript 的创建者 Brendan Eich: 在 JavaScript 中具有两个"空值"的表示是一种设计错误.

之所以不将其中之一从`JavaScript`世界中抹去,其原因是 JavaScript 遵守一个设计准则: `始终不破坏向前兼容性`.

这个准则有许多好处,但是最大的坏处就是无法修复设计错误.

## 1.3 undefined 和 null 的历史

在`Java`的世界里,成员变量中,引用类型的变量初始化的时候默认值`null`,每一种原始类型则有自己独特的初始值,比如`int`类型的初始值是 0.

在`JavaScript`的世界里,每个变量可以同时包含`对象值`和`原始值`.因此,如果`null`表示对象值,其值为`空`,则JavaScript 需要一个原始值来表示一种未定义的状态值.这个`未定义的值(原始值)`就是`undefined`.

## 2. undefined 出现场景

如果一个变量没有被初始化,则其具有原始值`undefined`:

```js
let foo;
assert.equal(foo, undefined); // true
```

如果一个对象的属性某个属性没有申明,则其原始值为`undefined`:

```js
const obj = {};
assert.equal(obj.name, undefined); // true
```

如果一个函数未指定返回值,或者不存在`return`关键字,则默认返回`undefined`:

```js
function foo() {}
assert.equal(foo(), undefined); // true
function far() {
  return;
}
assert.equal(far(), undefined); // true
```

如果调用函数的时候,未提供函数定义时声明的参数,并且未指定默认值的时候,参数具有原始值`undefined`:

```js
function foo(value) {
  assert.equal(value, undefined); // true
}
```

以及`ES2020`新增的`Optional chaining`语法,默认返回值是`undefined`:

```js
const obj = {};
obj?.prop // undefined
```

> optional chaining 中只要出现异常,一律返回 undefined.

比如: `val?.name`, 无论 val 是 `null` 还是 `undefined`,都返回 undefined.

## 3. null 出现场景

`Object`的原型也是一个对象,只是此对象的原型值为`null`:

```js
Object.getPrototypeOf(Object.prototype) // null
```

正则表达式匹配不到结果,其值为`null`:

```js
/a/.exec('x') // null
```

另外,`JSON`规范不支持值为`undefined`,如下转换将会忽略部分属性.

> JSON 语义中存在表示空值的`null`,不存在`undefined`这个类型.

```js
JSON.stringify({
  a: undefined,
  b: null
})
// {"b": null}
```

## 4. undefined 和 null 的特殊对待方式

比如我们有一个简单函数如下:

```js
function foo(name='balabala') {
  return name;
}
foo(); // balabala
foo(null); // null 传入 null,优先级高于默认值
foo(undefined); // balabala,传入 undefined 相当于传入原始值,优先级低于默认值
```

在对象解构赋值中的表现也一样:

```js
const [a = 'a'] = [];
// a => 'a'
const [b = 'b'] = [undefined];
// b => 'b'
const {prop: c = 'c'} = {}
// c => 'c'
const {prop: d = 'd'} = {prop: undefined}
// d => 'd'
```

如果赋值为`null`:

```js
const [b = 'b'] = [null];
// b => null
const {prop: d = 'd'} = {prop: null}
// d => null
```

在空值合并的操作中,`??`让我们在值为`null`或者`undefined`的时候使用默认值.

```js
null ?? 1 
// 1
undefined ?? 1 
//1
```

那么在空值合并赋值时,有什么表现呢?

```js
function setName(obj) {
  obj.name ??= '(Unnamed)';
  return obj.name;
}
setName({
  name: null
})
// '(Unnamed)'
  setName({
  name: undefined
})
// '(Unnamed)'
```





# 6. 参考

- [undefined与null的区别 - 阮一峰的网络日志(评论更精彩)](https://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
- [`undefined` vs. `null` revisited](https://2ality.com/2021/01/undefined-null-revisited.html#occurrences-of-null-in-the-language)