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



# 队列

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
    } else if(this._lowestCount > 0) {
      this._lowestCount--      
      this._items[this._lowestCount] = e
    } else {
      for (let i = this._count;i>0;i--) {
        // 往后移动一位
        this._items[i] = this._items[i - 1]
      }
      this._count++
      this._lowestCount = 0
      this._items[0] = e
    }
  }
	// 从队尾出队
  removeBack() {
    if(this.isEmpty()) return undefined
    const lastOne = this._items[this._count - 1]
    if(this.size() === 1) {
      this.clear()
    }
    delete this._items[this._count - 1]
    this._count--
    return lastOne
  }

  peekBack() {
    return this._items[this._count]
  }
}
```

其他方法继承于`Queue`,可以实现双端数据操作.

现在,让我们来模拟`击鼓传花`问题.

> *班级中玩一个游戏，所有学生围成一圈，从某位同学手里开始向旁边的同学传一束花。这个时候某个人（比方班长），在击鼓，鼓声停下的一刻，花落在谁手里，谁就进去表演节目*.

```js
let a = new Queue();
['杜小帅', '高海', '董文武', '雪儿', '洛克斯', '庄杯', 'K'].forEach(i => a.enqueue(i));
let createANum =  () => Math.random().toFixed(1) * 10
function start(queue) {
  if(queue.size() === 1) {
    console.log(`现场唯一的观众: ${queue.dequeue()}`);
  } else {
    if(createANum() > 7) {
      console.log(`${a.dequeue()}, 请开始你的表演.`);
    } else {
      queue.enqueue(queue.dequeue())
    }
  }
}
while(a.size() >= 1) {
  start(a)
}

// output
// 庄杯, 请开始你的表演.
// 董文武, 请开始你的表演.
// 高海, 请开始你的表演.
// 杜小帅, 请开始你的表演.
// 我, 请开始你的表演.
// 洛克斯, 请开始你的表演.
// 现场唯一的观众: 雪儿
```

接下来是回文检查,什么是回文字?

> 回文是指正反序都相等的字符串序列,例如 `lol`,`madam`等等.

最简单的方式就是使用双端队列来处理这个问题.

```js
function palindromeCheaker(str) {
  if(str === undefined || str === '' || str === null) return false;
  const deque = new Deque();
  [...str].forEach(i => deque.enqueue(i));
  while(deque.size() > 1) {
    if(deque.removeBack() !== deque.dequeue()) return false
  }
  return true
}

console.log(palindromeCheaker('121'), palindromeCheaker('madam'), palindromeCheaker('jay'))
// output
// true, true, false
```

JavaScript 任务也使用了队列这种数据结构.详情可以看看:

[详解JavaScript中的Event Loop（事件循环）机制 - 知乎](https://zhuanlan.zhihu.com/p/33058983)



# 链表

存储多个元素,数组可能是最常用的数据结构,如果需要从起点或者中间插入元素,数组的操作成本很高.尽管`JavaScript`数组支持了一些方法来做这些事,但是背后的情况同样如此.

> 数组的元素在内存中是连续的,链表则可以是不连续的,链表的关键是使用节点的属性保存下一个或者上一个链表的信息.

相比于传统数组,链表添加或者移除一个元素不需要移动其他元素,大大降低了内存成本.

![](https://pic2.zhimg.com/v2-8158f5bef33b4d38c0ff43d11139a003_1440w.jpg?source=172ae18b)

上图是从网上随便找的示意图.观察可以发现,如果要找到某个节点,需要从`head`一路往下查找.让我们来实现这一数据结构.

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  push(e) {
    const element = new Node(e)
    this.count++
    if (this.head === undefined) {
      this.head = element
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = element
    }
  }
  /**
   * 
   * @param {number} index 返回删除节点的 element
   */
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head
      if (index == 0) {
        this.head = current.next
      } else {
        let prev = this.getElementByIndex(index - 1)
        current = prev.next
        prev.next = current.next
      }
      this.count--
      return current.element
    } else {
      return undefined
    }
  }

  removeValue(element) {
    const index = this.indexOf(element)
    return this.removeAt(index)
  }

  getElementByIndex(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head
      for (let i = 0; i < index && node !== null; i++) {
        node = node.next
      }
      return node
    } else {
      return undefined
    }
  }

  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element)
      if (this.count === 0) {
        this.head = node
      } else {
        let prev = this.getElementByIndex(index - 1)
        node.next = prev.next
        prev.next = node
      }
      this.count++
    } else {
      return false
    }
  }

  /**
   * 
   * @param {any} element search a element, return a index
   */
  indexOf(element) {
    let current = this.head
    let index = 0
    while (current) {
      if (current.element !== element) {
        current = current.next
        index++
      } else {
        return index
      }
    }
    return -1
  }

  isEmpty() {
    return this.count === 0
  }

  size() {
    return this.count
  }

  getHead() {
    return this.head
  }

  toString() {
    if (this.count === 0) {
      return ''
    }
    let current = this.head
    while (current.next !== undefined) {
      console.log(current.element);
      current = current.next
    }
    console.log(current.element);
  }
}

class Node {
  constructor(element) {
    this.element = element;
    this.next = undefined;
  }
}
```

来思考一个算法题目,翻转链表:

> 题意：反转一个单链表。
>
> 示例: 输入: 1->2->3->4->5->NULL
> 输出: 5->4->3->2->1->NULL



接着,看看`双向链表`:



# 参考

- [数据结构与算法-链表(上) - 知乎](https://zhuanlan.zhihu.com/p/52878334)
- [数据结构与算法-链表(下) - 知乎](https://zhuanlan.zhihu.com/p/52841915)

