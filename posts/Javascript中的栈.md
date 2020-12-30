---
title: 'Javascript中的栈'
date: '2020/12/30'
tags:
- JavaScript
- 数据结构与算法
mainImg: 'https://images.unsplash.com/photo-1535191042502-e6a9a3d407e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1535191042502-e6a9a3d407e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '首先要明确什么是栈结构,其次是明确如何用数组和类来模拟栈,创建一个具有基本功能的 Stack 类.'
---

`栈`是一种`last in first out`先进后出的结构.新添加的元素即为`栈顶`另一端称为`栈底`.就像摞起来的书本,先放的在低端,后方的在顶端.

> 栈常用于保存变量和方法调用记录,在浏览器的浏览历史中也能看到栈的应用.

我们将创建一个`基于数组的Stack`类来表示栈.并且支持如下四种方法.

- push(): 入栈
- pop(): 出栈
- peek(): 返回栈顶元素
- isEmpty(): 返回是否空栈
- clear(): 清除栈所有元素
- size():返回栈的元素个数

```js
class Stack {
  constructor() {
    this.items = []
  }
  push(e) {
    this.items.push(e)
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  isEmpty() {
    return this.items.length === 0
  }
  size() {
    return this.items.length
  }
  clear() {
    this.items.length = 0
  }
}
```

啊哈,栈如此简单不是吗?通过数组我们可以轻松创建一个`栈`来满足日常的使用.

让我们来思考一些问题,如果数据量很大,数组的大部分方法的时间复杂度是 O(n) .如果数组的长度很长,查找数据所需要的时间将会变得很长,而且为了保证数组的有序性,每次访问相同的下标能得到同样的结果(在不改变数组内部结构的情况下),数组占用了`更多` 的内存空间.

为了应对这些不足之处,我们可以`基于 JavaScript 对象`创建一个`Stack`类.

```js
class Stack {
  constructor() {
    this.size = 0
    this.items = {}
  }
  push(e) {
    this.size++
    this.items[this.size] = e    
  }
  size() {
    return this.size
  }
  isEmpty() {
    return this.size === 0
  }
  pop() {   
    if(this.isEmpty()) return undefined
    const result = this.items[this.size]
    delete this.items[this.size]
    this.size--
    return result
  }
  peek() {
    return this.items[this.size]
  }
  clear() {
    this.items = {}
    this.size = 0
  }
  toString(){
    if(this.isEmpty()) return ''
    let objString = `${this.items[0]}`
    for(let v = 2; v <= this.size; v++) {
      objString += `, ${this.items[v]}`
    }
    return objString
  }
}
```

`JavaScript`的 class 内的方法和属性是不受保护的,我们没有类似`Java`的`private`声明方式,每个人都可以操作我们的内部数据,为了保护内部数据,业界的最佳实践和默认约定是使用下划线命名.

```js
class Stack {
  constructor() {
    this._items = []
    this._size = 0
  }
}
```

如此一来,在其他开发者无意之下,也不会通过`items`属性破坏栈的内容数据结构.

> 遵守约定是一种美德不是吗?

可是如果开发者上来就是莽,使用`_items`,数据依然得不到保护.

`ES6`新增的`Symbol`基本类型提供了一种解决方案.

```js
const _items = Symbol('stackItems')
class Stack {
  constructor() {
    this[_items] = []
    //
  }
}
```

然而,这依然无法确保开发者不通过`Object.getOwnPropertySymbols`方法获取类声明中的所有`Symbols`

属性.

不过,我们还有一个解决方案可以使用:`ES6:WeakMap`.WeakMap 可以存储键值对,键是对象,值可以是任何数据类型.

```js
const items = new WeakMap()
class Stack {
  constructor() {
    items.set(this, [])
  }
  push(e) {
    const r = items.get(this)
    r.push(e)
  }
  pop() {
    const r = items.get(this)
    return r.pop()
  }
  //
}
```

并且,目前`ECMAScript`类属性提案,使用`#items = []`的私有属性提案已经到达了`Stage 3`.值得等待.

以下是各阶段及含义的描述：

- Stage 0/Strawperson： 潜在的可能被纳入规范的一些想法。
- Stage 1/Proposal：为该想法设想一些适用场景，可能的 case。提出解决实现方案以及可能的变更。
- Stage 2/Draft：经过上一步验证讨论后，这一阶段开始起草语言层面的语义语法，准备正式的规范文档。
- Stage 3/Candidate：提案进入到了候选阶段。开始接收一些反馈对提案进行完善。
- Stage 4/Finished：可以被纳入到正式的 ECMAScript 语言规范中了。



现在我们了解了栈是什么结构,以及通过数组和 JavaScript 对象初步实现了`Stack`类.接下来我们尝试用`Stack`解决问题.