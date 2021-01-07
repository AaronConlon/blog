---
title: 'Javascript中的队列和链表'
date: '2021/1/7'
tags:
- JavaScript
- 数据结构与算法
mainImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '几年前在学校使用 c++ 进行数据结构与算法的学习.学得跟屎一样,丢人现眼.前段时间在飞机上看完了队列和链表部分的内容,还是觉得需要整理一下写成文章.'
---

长话短说,本文将队列和链表的知识合二为一.通过一些示例再次巩固这部分的知识.大概内容分为:

- 简单队列
- 双端队列
- 队列应用
  - 击鼓传花
  - 回文字检查
- 单向链表
- 双向链表
- 循环链表
- 排序链表
- 链表模拟栈



队列,先进先出.排过队吗?按顺序添加和处理的任务,都可以用`队列`的结构进行存储和消费.

```js
class Queue {
  constructor () {
    this._items = {}
    this._count = 0
    this._lowestCount = 0
  }

  enqueue(e) {
    this._items[this._count] = e
    this._count++
  }
  dequeue() {
    if(this.isEmpty()) return undefined
    const r = this._items[this._lowestCount]
    delete this._items[this._lowestCount]
    this._lowestCount += 1
    return r
  }

  isEmpty() {
    return this._lowestCount === this._count
  }
  peek() {
    return this.isEmpty()  ? undefined : this._items[this._lowestCount]
  }

  size() {
    return this._count - this._lowestCount
  }

  clear() {
    this._items = {}
    this._count = 0
    this._lowestCount = 0
  }
  toString() {
    if(this.isEmpty()) return ''
    let r = ''
    for (const iterator of Object.values(this._items)) {
      r += r === '' ? `${iterator}` : `, ${iterator}`
    }
    return r
  }
}

let a = new Queue()
console.log(a.isEmpty())
a.enqueue(1)
a.enqueue('just for fun')
console.log(a.toString())
a.clear()
console.log(a.toString())
```

普通队列简单,但是有些场景需要对最新入队的元素进行操作.例如,针对需要存储一系列操作的需求.此时,需要灵活处理队首和队尾的数据内容.

当引发撤销操作的时候,操作队列可以从尾部弹出最后的操作记录.

我们需要双端队列.

```js
class Deque extends Queue{
  constructor () {
    super()
  }

  addFront(e) {
    if(this.isEmpty()) {
      this.enqueue(e)
    } 
    
  }
}
```



