---
title: 'web开发之节流和防抖'
date: '2022/1/9'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1602345397613-0934a8812d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE3MjM0NDQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1602345397613-0934a8812d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE3MjM0NDQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '节流和防抖的概念在日常的 web 开发中非常有用，可以有效提高效率和减少不必要的额外操作。'
---

### 前言

如果我们在一些被频繁触发的事件里使用防抖和节流的机制，就可以降低 DOM 的操作次数，防止卡顿，甚至是节省流量，降低服务器压力。

比如：window 对象的 `resize`、`scroll`事件，这些事件的执行次数非常多，我们没有必要高频地调用执行函数。在这些问题上，防抖`debounce`和节流`throttle`的思路非常有用。

### 防抖 Debounce

触发动作若干毫秒之后，执行此回调函数。如果在执行前再次触发动作，则取消上一个延时任务，重置延时时间等待若干毫秒之后再次执行回调函数。

如此一来，频率超高的操作触发的动作将会减少回调函数的执行次数。

以下是一个简单的实现：

```js
const debounce = (fn, wait = 0) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function')
  }
  let id;
  return function () {
    let ctx = this,args = arguments;
    clearTimeout(id);
    id = setTimeout(function() {
      fn.apply(this, args);
    },wait)
  }
}
```

### 节流 throttle

所谓节流，可以理解为在指定的时间内只允许执行一次回调函数。

例如，我们不希望用户反复点击某个按钮导致回调函数反复执行。

```js
const throttle = (fn, wait = 0) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function')
  }
  let last = 0;
  return function() {
		// +new Date() equal to new Date().getTime()
    const cur = +new Date();
    if(cur - last > wait) {
      fn.apply(this, arguments);
      last = cur;
    } 
  }
}
```

### Lodash

上述两个简单实现可以让我们对`debounce`和`throttle`有一个初步的理解，但是不可否认的是这两个实现非常简陋，让我们来看看`Lodash`是如何实现这两个方法的。

#### throttle

源代码如下：

```js
function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    leading,
    trailing,
    'maxWait': wait
  })
}

export default throttle
```

节流函数引用了防抖函数的功能，此外开头便增加了两个变量来控制在节流之前和之后是否执行回调函数的功能，我们重点来看防抖的实现。



#### debounce

这里不摘录其源码，因为源码有 200 多行，有兴趣的朋友可以去 github 看看，地址是：[lodash/debounce.js at master · lodash/lodash](https://github.com/lodash/lodash/blob/master/debounce.js)！

其函数`"签名"`是：`function debounce(func, wait, options)`，分别是回调函数，等待时间和其他选项。

官方文档说明如下：

>创建一个 debounced（防抖动）函数，该函数会从上一次被调用后，延迟 `wait` 毫秒后调用 `func` 方法。 debounced（防抖动）函数提供一个 `cancel` 方法取消延迟的函数调用以及 `flush` 方法立即调用。 可以提供一个 options（选项） 对象决定如何调用 `func` 方法，`options.leading` 与|或 `options.trailing` 决定延迟前后如何触发（注：是 先调用后等待 还是 先等待后调用）。 `func` 调用时会传入最后一次提供给 debounced（防抖动）函数 的参数。 后续调用的 debounced（防抖动）函数返回是最后一次 `func` 调用的结果。

由此可以看出，相比于我们的简陋实现，`lodash`还返回了`cancel`和`flush`函数，让我们可以更灵活地处理逻辑问题。

更多细节，我找到了一篇非常好的文章，最后分享给大家。哎，作者的时序图实在是太 6 了，一图胜千言！

### 参考

- [lodash源代码解析—— debounce & throttle - 掘金](https://juejin.cn/post/6934149265153343496)

