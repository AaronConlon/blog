---
title: 'JavaScript 深拷贝'
date: '2022/1/6'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0Nzc4MTI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0Nzc4MTI&ixlib=rb-1.2.1&q=80&w=400'
intro: '从头写一个 JavaScript 深拷贝函数！'
---

### 前言

所谓深拷贝，指的是在拷贝一个对象的时候，完整的将整个对象及其内部所有属性都拷贝一份出来。

也可以这么说，所谓深拷贝指的是在将一个对象从内存中完整的拷贝一份出来，任意的修改新的对象不会对源对象造成任何影响。

### 各种方式

#### JSON

首先，在某些场景下如果已知待拷贝的对象较为简单，且没有需要特别注意的特殊值，则可以使用`JSON.parse(JSON.stringify(target))`方法完整地拷贝一个对象。

但是其具有以下缺陷：

- JSON 规范无法正确解析 NaN、Infinity、
- 会忽略对象上值为`undefined`的键值对
- 会忽略函数键值对
- 无法获取原型
- 无法正确处理`Date`、`RegExp`、`Math`等对象
  - Date 为字符串
  - RegExp 和 Math 为空对象
- 解析 BigInt 出错
- 解析 Symbol 丢失
- 无法处理循环引用

> 尽管有这么多缺陷，但是日常中处理一些简单的对象还是足够。



#### 递归

让我们来编写一个函数完成深拷贝：

```js
// 使用 map 来保存拷贝记录，防止循环引用拷贝爆栈
const deepClone = function (obj, map = new WeakMap()) {
  // 原始数据类型直接返回
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  // 复制一个函数,但却重置了 this ,没有拷贝函数属性
  if (typeof obj === "function") return obj.bind({});
  // 循环引用直接返回
  if (map.has(obj)) return map.get(obj);
  // 通过对象的构造器来新建一个对象
  var temp = new obj.constructor();
  // 添加到 map 记录中
  map.set(obj, temp);
  // 递归拷贝自身属性
  Reflect.ownKeys(obj).forEach((key) => {
    temp[key] = deepClone(obj[key], map);
  });
  return temp;
};
```

#### 库

- Lodash
- Underscore

### 最后

深拷贝还是推荐使用测试完备的第三方库，如上所示的两个库都对深拷贝有支持到。此外，未来的浏览器也会支持`structuredClone()`这样的深拷贝方法，或许这个问题会得到解决。
