---
title: 'ECMAScript 2022新规范'
date: '2022/7/10'
tags:
- JavaScript
- 规范
- ECMAScript
mainImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTc0NTMyODg&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTc0NTMyODg&ixlib=rb-1.2.1&q=80&w=400'
intro: '一年一度的ECMAScript规范发布，看看今年有什么新内容！'
---



## 前言

`ECMAScript` 是标准化的 `JavaScript` 语言，于 1997 年发布了第一版，现已发展成为世界上使用最广泛的通用编程语言之一。

`ECMAScript 2022 Language`是 ECMAScript 语言规范的第 13 版，因此我们也可以称之为`ES13`!

那么，今年新增了哪些内容呢？



### 类增强

简单来说有以下三点：

- 属性可以通过以下方式创建
  - 公共的实例字段
  - 静态的公共字段
- 新增私属性插槽（井号）
  - 私有字段（私有实例字段和私有静态字段）
  - 私有方法和访问器（非静态）
- 静态的初始化块

直接看代码：

```js
class MyClass {
  instancePublicField = 1; // 公共实例字段
  static staticPublicField = 2; // 静态公共字段

  #instancePrivateField = 3; // 私有实例字段
  static #staticPrivateField = 4; // 静态私有字段

  #nonStaticPrivateMethod() {}
  get #nonStaticPrivateAccessor() {} // 非静态私有访问器
  set #nonStaticPrivateAccessor(value) {}

  static #staticPrivateMethod() {} // 私有静态方法
  static get #staticPrivateAccessor() {} // 静态访问器
  static set #staticPrivateAccessor(value) {}

  static {
    // 静态的初始化块
  }

	constructor(value) {
    this.property = value; // 公共实例字段
  }
}
```



举一个静态初始化块的例子：

```js
class Translator {
  static translations = {
    yes: 'ja',
    no: 'nein',
    maybe: 'vielleicht',
  };
  static englishWords = [];
  static germanWords = [];
  static { // (A)
    for (const [english, german] of Object.entries(this.translations)) {
      this.englishWords.push(english);
      this.germanWords.push(german);
    }
  }
}
```

通过使用静态初始化块，我们可以将所有类相关的代码放在类的内部。

上述例子中，可以将初始化两个`word`数组的过程优化到静态初始化块内部，从而实现我们需要的效果，如果需要还可以访问私有插槽属性。

需要注意的是：

- 一个类可以有多个静态初始化块
- 静态初始化块和静态属性可以交错初始化
- 超类（superclass）的静态初始化块在子类的静态初始化块之前执行

此外，类的私有化属性插槽可以通过`in`操作符检查，举个例子：

```js
class ClassWithPrivateSlot {
  #privateSlot = true;
  static hasPrivateSlot(obj) {
    return #privateSlot in obj;
  }
}

const obj1 = new ClassWithPrivateSlot();
assert.equal(
  ClassWithPrivateSlot.hasPrivateSlot(obj1), true
);

const obj2 = {};
assert.equal(
  ClassWithPrivateSlot.hasPrivateSlot(obj2), false
);
```



### 顶层 await

规范新增顶层`await`支持，现在我们可以直接在模块内使用顶层`await`，而不必再额外进入异步函数内再使用`await`。



看实例：

```js
const res = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
  (response) => response.json()
);

console.log("res is:", res);
```

保存上述内容为文件`index.mjs`，使用`node v17.5`以上版本或`bunjs`直接运行：

`node index.mjs`即可直接获取到输出。

那么，我们可以在什么地方使用这个特性呢？举个例子：

```js
// first.mjs
const response = await fetch('http://example.com/first.txt');
export const first = await response.text();

// main.mjs
import {first} from './first.mjs';
import {second} from './second.mjs';
assert.equal(first, 'First!'); // true
assert.equal(second, 'Second!'); // true
```

有了顶层`await`，我们可以像使用同步导出那样直接导出异步的值。

大致等同于以下代码：

`first.mjs`:

```
export let first;
export const promise = (async () => { // (A)
  const response = await fetch('http://example.com/first.txt');
  first = await response.text();
})();
```

`main.mjs`:

```
import {promise as firstPromise, first} from './first.mjs';
import {promise as secondPromise, second} from './second.mjs';
export const promise = (async () => { // (B)
  await Promise.all([firstPromise, secondPromise]); // (C)
  assert.equal(first, 'First content!');
  assert.equal(second, 'Second content!');
})();
```

方便了不少，不是吗？

### error.cause

为`Error`及其子类添加`cause`属性，更方便地传递错误原因，增强传递错误信息的能力。

```js
function readFiles(filePaths) {
  return filePaths.map(
    (filePath) => {
      try {
        // ···
      } catch (error) {
        throw new Error(
          `While processing ${filePath}`,
          {cause: error}
        );
      }
    });
}
```

现在，可以访问错误对象的`cause`属性获取更多详情。

### .at()

就像使用`python`一样使用`JavaScript`，通过下标访问数组变得容易，具有显式的函数支持，此外跟直接使用`[]`访问不一样的是，`.at()`支持传负数参数进行逆序取值。

### 正则表达式Flag：/d

看例子：

```js
const matchObj = /(a+)(b+)/d.exec('aaaabb');

assert.equal(
  matchObj[1], 'aaaa'
);
assert.deepEqual(
  matchObj.indices[1], [0, 4] // (A)
);

assert.equal(
  matchObj[2], 'bb'
);
assert.deepEqual(
  matchObj.indices[2], [4, 6] // (B)
);
```

通过`d`执行的正则表达式匹配，可以得到匹配的元素的起始下标。



### Object.hasOwn(obj, propKey)

`Object.hasOwn(obj, propKey)`提供了一种安全的方式通过属性`key`检查对象是否含有非继承的目标属性。

```js
const proto = {
  protoProp: 'protoProp',
};
const obj = {
  __proto__: proto,
  objProp: 'objProp',
}

assert.equal('protoProp' in obj, true); // (A)

assert.equal(Object.hasOwn(obj, 'protoProp'), false); // (B)
assert.equal(Object.hasOwn(proto, 'protoProp'), true); // (C)
```



## 最后

众所周知：

`JavaScript`和`ECMAScript`的区别在于，前者是一个不同平台实现的编程语言，后者是这门语言的标准规范，平台基于此规范实现这门语言。

`ECMAScript`由`TC39`标准委员会设计，其成员来自各大科技公司和其他平台等等，每年都会在年中发布最新的规范。

不同的提案经过四个阶段，最终才会进入规范，在进入规范之前不建议使用，因为其始终是不稳定的，关注每年的新增内容即可。





