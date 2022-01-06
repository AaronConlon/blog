---
title: "JavaScript Symbol 浅解"
date: "2021/12/25"
tags:
  - JavaScript
mainImg: "https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAzODA0MDg&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAzODA0MDg&ixlib=rb-1.2.1&q=80&w=400"
intro: "在 JavaScript 世界里，Symbol 的两个问题：是什么和为什么"
---

### 前言

在 ES6 的时候，JavaScript 宣布新增了一个`Symbol`原始数据类型。今天，我们来谈谈此数据类型的作用、特性以及应用场景。

在开始之前，让我们先来探讨一些许多开发者可能不太熟悉的 JavaScript 特性。

### 背景

JavaScript 中的数据类型可以分为两类：

- primitive: 原始值
- 对象（包括函数）

> object.valueOf() 返回该对象的原始值。

其中`primitive`值包括：

- string
- number(包含浮点数和整数、NaN)
- undefined
- boolean
- null (尽管 typeof null === 'object'，null 依然是一种原始值)
- bigInt: 大整数
- symbol: 符号

`primitive`值的一大特性就是`不可变`，一个原始值被赋给了一个变量，这个变量可以重新赋值，但这个原始值不会改变，举个例子：

`let x = 1; x++`

显然，我们只是重新为`x`分配了一个值，但并没有改变原始值`1`。

此前，笔者学习过`C语言`，其具有`值传递`和`引用传递`的概念，JavaScript 也有这样的概念，其基于被传递的数据类型来判断是哪种传递，如果我们给一个函数传入一个原始数据类型，则属于`值传递`，函数内部修改参数变量也不会改变传入的值。但是如果我们传入一个对象，并且在函数内部修改了此对象，则其他引用此对象的代码也会受到影响，因为此对象被修改了。

举个例子：

```js
const foo = (val) => {
  val += 1;
};
let x = 1;
foo(x);
console.log(x); // 1

const bar = (val) => {
  val.age += 1;
};
const obj = { age: 1 };
bar(obj);
console.log(obj.age); // 2
```

原始值始终严格等于另一个具有相同值的原始值，因此无论何时我们都可以进行如下比较：

> NaN 除外，`NaN !== NaN`

```js
const name = "Aarom";
const obj = {
  name: "Aaron",
};
console.log(name === obj.name); // true
```

但是结构相同的非原始值（对象）则不相等。

```js
const obj1 = { name: "Intrinsic" };
const obj2 = { name: "Intrinsic" };
console.log(obj1 === obj2); // false
```

对象在 JavaScript 语言中扮演着特殊的角色，多年前有一句广为流传的描述：`JavaScript 一切皆对象`，如果某人说此观点是错误的，或许也会有人提出质疑：`字符串既然不是对象，为什么它会有属性呢？`

实际上，字符串依然是原始值，当我们使用一个变量保存此字符串时并访问此变量的属性时，JavaScript 内部通过一个包装类的操作创建了一个临时对象，实际上这个字符串值并非对象，就像某人穿上了女装，我们总不能说此人是妹子吧！

话说回来，对象在我们日常开发中无处不在。它们通常由一系列的键值对组成，在`symbol`出现之前，所有的对象`key`值都是字符串，即使使用某个非字符串作为`key`，这个值也会先转为字符串，举个例子：

```js
const obj = {};
obj.foo = 'foo';
obj['bar'] = 'bar';
obj[2] = 2;
obj[{}] = 'someobj'

console.log(obj);
// { '2': 2, foo: 'foo', bar: 'bar',
     '[object Object]': 'someobj' }
```

> Note: 题外话，`Map`可以使用非字符串作为`key`。

### Symbol

`ES6`规范支持了一种新的原始数据类型：`symbol`！

按张鑫旭老师的说法：

此原始值类型的作用只有一个：`作为对象属性的唯一标识符`，防止对象属性冲突发生。

`symbol`是一个不可以重新创建的原始值，举个例子：

```js
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // false
```

> 不支持 `new Symbol()` 操作，其不具有完整的构造函数，而诸如`Boolean`、`String`、`Number`可以使用`new`是历史遗留原因。

上述示例中可以这样添加一个调试信息：

```js
const s = Symbol("debug info!");
console.log(s); // Symbol(debug info)
```

参数`debug info`唯一的作用就是作为调试信息使用，切勿理解为当参数相同时，创建的`symbol`是相等的。

当我们将`symbol`用做对象的`key`时，情况跟字符串有所差别：

```js
const obj = {};
const s1 = Symbol();
obj[s1] = "s1";
obj.age = 100;

console.log(obj); // { age: 100 }
console.log(s1 in obj); // true
console.log(obj[s1]); // s1
console.log(Object.keys(obj));
["age"];
```

注意，对象所有的符号属性都不会在`Object.keys()`的返回结果中，之所以如此是因为：`向后兼容`，旧代码不应该处理新的符号属性，因此不在此方法中返回任何的符号属性。

乍一看绝对可以使用符号属性作为对象的私有属性！许多其他语言都支持类对象中具有隐藏的私有属性，这一特性在 JavaScript 中没有原生的解决方案，因此长久以来被诟病。

> [tc39/proposal-class-fields: Orthogonally-informed combination of public and private fields proposals](https://github.com/tc39/proposal-class-fields) ES2020 草案中增加了私有实例字段的支持 🎉🎉🎉，现已进入 stage 3

不幸的是，我们依然无法使用符号属性实现私有属性，`Reflect.ownKeys()`方法可以获取到对象上的所有`key`值，包括`symbol`类型的`key`!

```js
function tryToAddPrivate(o) {
  o[Symbol("Pseudo Private")] = 42;
}
const obj = { prop: "hello" };
tryToAddPrivate(obj);

console.log(Reflect.ownKeys(obj));
// [ 'prop', Symbol(Pseudo Private) ]
console.log(obj[Reflect.ownKeys(obj)[1]]); // 42
```

尽管符号属性不能直接为 JavaScript 对象提供私有属性的功能，但符号属性的出现解决了另一个方面的问题：`“防止属性名冲突”`。

试想如果有两个库都想对某个对象进行修改，并且在无意识之下都修改了此对象的某个字符串属性`id`，那么势必会有一方发现此对象的数据与预料中不同。但是，如果库的作者在操作目标对象时使用了符号属性，举个例子：

```js
const library1property = Symbol("lib1");
function lib1tag(obj) {
  obj[library1property] = 42;
}

const library2property = Symbol("lib2");
function lib2tag(obj) {
  obj[library2property] = 369;
}
```

显然，`obj`对象不会具有无意识的属性操作冲突，库作者可以尽情为对象添加新的属性而不必担心其他人无意识之间造成属性冲突。

在此之前，开发者们或许会使用诸如`uuid()`这样的方法创建及其特殊且难以冲突的字符串作为对象的`key`，但是这种方法跟使用符号属性非常相似，但却有其他缺陷。

使用字符串作为属性的`key`很容易被发现，无论是打印出来，还是通过`Object.keys()`获取其`keys`，亦或是通过`JSON.stringify()`都可以察觉到此属性，当我们不希望此属性被发现时，尽量通过符号属性来隐藏它是很好的选择。

> 题外话：JSON 只允许字符串作为属性，符号属性会被忽略。

如若是想让字符串属性无法被枚举，则可以在定义时使用`Object.defineProperty`方法定义某个属性的值和属性类型，举个例子：

```js
const library2property = uuid(); // namespaced approach
function lib2tag(obj) {
  Object.defineProperty(obj, library2property, {
    enumerable: false,
    value: 369
  });
}
const user = {
  name: 'Thomas Hunter II',
  age: 32
};
lib2tag(user);

console.log(JSON.stringify(user));
// '{"name":"Thomas Hunter II",
   "age":32,"f468c902-26ed-4b2e-81d6-5775ae7eec5d":369}'

console.log(user[library2property]); // 369
```

字符串`key`可以通过设置`enumerable`描述符为`false`来实现不可枚举的属性，`JSON`序列化时也会忽略此不可枚举属性。

`Object.keys()`不会返回不可枚举的字符串`key`值（symbol 值无论是否可枚举都不会返回），但是无论如何都可以通过`Reflect.ownKeys()`方法获取到所有的属性，举个例子：

```js
const obj = {};
obj[Symbol()] = 1;
Object.defineProperty(obj, "foo", {
  enumberable: false,
  value: 2,
});
console.log(Object.keys(obj)); // []
console.log(Reflect.ownKeys(obj)); // [ 'foo', Symbol() ]
console.log(JSON.stringify(obj)); // {}
```

尽管依然无法创建对象的私有隐藏属性，但使用这种随机值作为对象属性名的方案确实可以消除不同的库之间的属性名冲突。

### 其他

除此之外，`symbol`还有其他的关注点，以下一一举例：

#### 全局注册表

JavaScript 运行时会创建 symbol `全局注册表`，我们可以通过`Symbol.for(key)`（其中`key`是一个字符串）的方式查找或创建全局的唯一`symbol`，如果此`key`不存在则创建，否则直接返回此全局`symbol`。另外，`Symbol.keyFor(symbol)`则通过`symbol`去检索创建此`symbol`的`key`。

#### 包装器

当使用`Object()`包装一个`symbol`符号，再用此包装对象作为属性`key`时，会自动进行转化，举个例子：

```js
const s = Symbol();
const obj = { [s]: 1 };
console.log(obj[Object(s)]); // 1
```

### 参考

- [JavaScript Symbols: But Why?. Symbols, the newest JavaScript… | by Thomas Hunter II | intrinsic | Medium](https://medium.com/intrinsic-blog/javascript-symbols-but-why-6b02768f4a5c)
- [简单了解 ES6/ES2015 Symbol() 方法 - 张鑫旭](https://www.zhangxinxu.com/wordpress/2018/04/known-es6-symbol-function/)
