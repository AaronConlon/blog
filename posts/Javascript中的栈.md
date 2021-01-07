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

### 进制转换

 **十进制转二进制,以及任意进制转换**.

先来看看如何计算十进制数转二进制:

![](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F7Po3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F8326cffc1e178a822eea2094f703738da977e834.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612013894&t=ca1c076b08aac87b4847d7caaa0d9cb4)

如果用`栈`来保存余数,最后结果再取出即可.

```js
function decimalToBinary(decNum) {
  const remStack = new Stack()
  let num = decNum
  let rem;
  let binaryString = ''
  while (num > 0) {
    rem = Math.floor(num % 2)
    remStack.push(rem)
    num = Math.floor(num / 2)
  }
  while(!remStack.isEmpty()) {
    binaryString += remStack.pop().toString()
  }
  return binaryString
}
```

如果不是二进制,而是 2~36,开发者指定的进制,则可以适当调整此函数:

```js
function baseConverter(decNum, base) {
  const remStack = new Stack()
  // 便于数字表示
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let num = decNum
  let rem;
  let baseString = ''
  // 基数需要在 2~36 之间
  if(!(base>=2 && base <= 36)) return ''
  while (num > 0) {
    // rem: 余数,
    rem = Math.floor(num % base)
    remStack.push(rem)
    num = Math.floor(num / base)    
  }
  
  while(!remStack.isEmpty()) {
    baseString += digits[remStack.pop()] // 余数转化,方便显示进制数
  }
  
  return baseString
}
```



### 平衡圆括号



**question**:给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
有效字符串需满足：

- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。



```js
function parenthesesBalance(str) {
  if(str.length === 0) return true
  const pair = {'(': ')', '[': ']', '{': '}'}
  const stack = new Stack()
  for (let i = 0;i < str.length; i++) {
    if(str(i) === '(' || str[i] === '[' || str[i] === '{'){
      stack.push(str[i])
    } else {
      let last = stack.pop()
      if(str[i] !== pair[last]) return false
    }
  }
  return true  
}
```



### 汉诺塔

在经典汉诺塔问题中，有 3 根柱子及 N 个不同大小的穿孔圆盘，盘子可以滑入任意一根柱子。一开始，所有盘子自上而下按升序依次套在第一根柱子上(即每一个盘子只能放在更大的盘子上面)。移动圆盘时受到以下限制:
(1) 每次只能移动一个盘子;
(2) 盘子只能从柱子顶端滑出移到下一根柱子;
(3) 盘子只能叠在比它大的盘子上。

请编写程序，用栈将所有盘子从第一根柱子移到最后一根柱子。

你需要原地修改栈。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/hanota-lcci

![](https://www.programmersought.com/images/621/4856108b92aae2dde25a0325f6317d95.png)

![](https://upload-images.jianshu.io/upload_images/5977941-12d456543f5c31e5.png?imageMogr2/auto-orient/strip|imageView2/2/w/375/format/webp)

```js
/**
 * @param {number[]} A
 * @param {number[]} B
 * @param {number[]} C
 * @return {void} Do not return anything, modify C in-place instead.
 */
var hanota = function(A, B, C) {
  	// 当前所有碟子都在 A 栈
    const length = A.length
    const move = (n, a, b, c) => {        
        if(n === 1) {
          // 边界条件,最简单的移动逻辑.可以通过修改栈来实现效果.
            c.push(a.pop())
        } else {
          	// 分解问题,缩小范围,递归调用整个处理问题的函数.
          	// 将最下面碟子上的碟子,通过中间柱子 c,移动到 b
            move(n - 1, a, c, b)
          	// 直接移动 a 到 c
            c.push(a.pop())
          	// 将 b 上的碟子,通过中间柱子 a,移动到 c
            move(n - 1, b, a, c)
        }        
    }
    move(length, A, B, C)
};
```

> [如何理解汉诺塔的递归？ - invalids的回答 - 知乎](https://www.zhihu.com/question/24385418/answer/258015386)

看了知乎大佬的分析,勉强了解了思路.首先,将整个过程分解为:

- n-1 个碟子通过中间柱子,移动到暂时存放的柱子,移动成功后这个柱子便可以理解为一开始的时候所有碟子所在的柱子
- 直接移动 1 个碟子到目标柱子
- 移动 n-1 个碟子到中间柱子

习惯于命令式编程,无法理解这种声明式编程的逻辑.难以理解如何实现这一逻辑.

> 换句话说，只要我们：
>
> 1、写程序告诉电脑“如何分解一个问题”
>
> 2、写程序告诉电脑“当该问题分解到最简时如何处理”
>
> 那么，“具体如何递推、如何回归”这个简单问题就不要再操心了，电脑自己能搞定。
>
> 
>
> ——写出问题分解方法、写出分解到最简后如何解决，这是我们的任务；把问题搞定，是电脑的任务。这就是递归的魅力。
>
> 
>
> 作者：invalid s
> 链接：https://www.zhihu.com/question/24385418/answer/258015386
> 来源：知乎
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

当我又继续看了几个个人体会之后,似乎懂了.

关键在于,缩小范围,直到最小范围.

递归调用的时候,关键在于传入的参数.

我真的懂了吗?