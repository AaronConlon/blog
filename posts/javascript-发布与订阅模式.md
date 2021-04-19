---
title: 'javascript-发布与订阅模式'
date: '2021/4/19'
tags:
- JavaScript
- 设计模式
mainImg: 'https://images.unsplash.com/photo-1503901680383-b1d31b841841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg3ODI5NzQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1503901680383-b1d31b841841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTg3ODI5NzQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '我之前有听过发布/订阅模式,但是今天才看到 JavaScript 异步编程,书上有相关的介绍,于是记下学习心得.'
---

`发布/订阅`模式又称为`PubSub`模式.理解和熟练使用`PubSub`模式可以解嵌套那些丑陋冗余的嵌套回调代码,最终编写出易于理解的事件驱动型代码.

## PubSub 模式

早期的`JavaScript`在浏览器端对于`DOM`元素附加事件处理器是非常粗浅的,也许会出现如下代码片段:

```js
// 添加一个事件监听
div.onclick = clickHandler;
// 添加多个
div.onclick = function() {
  clickHandler1.apply(this, arguments)
  clickHandler2.apply(this, arguments);
}
```

一次只能设置一个事件监听,后续再次设置将会覆盖前者.如果想要添加多个事件处理器,则需要额外的封装.

幸运的是, 2000 年 DOM 规范增加了`addEventListener`方法,解决了这一问题.

### EventEmitter 对象

`NodeJs`内含`EventEmitter`类,其他对象都可以继承它,想给`EventEmitter`实例添加事件处理器,只需要`事件类型`和`事件处理器函数`作为参数调用`on`方法即可.

```js
emitter.on('doIt', (name) => {
  // balabala
  console.log(name)
})

// 触发
emitter.emit('doIt', 'Aaron')
```

`emit`意味着触发,负责调用给定事件类型的所有处理器,并且传递其参数,处理器命名惯例约定为`小驼峰`.

> `EventEmitter`对象所有方法为公有方法,一般约定只能从对象内部触发事件,不推荐从对象外其他地方进行调用.

### PubSub 类

我们来创建一个简单`PubSub`类.

```js
class PubSub {
  constructor() {
    this.handlers: {}
  }
  on(eventType, handler) {
    if(!(eventType in this.handlers)) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
    return this;
  }
  emit(eventType, data) {
    if(!this.handlers[eventType]) return this;
    this.handlers[eventType].forEach(callback => {
      callback(data)
    })
    return this;
  }
  
}
```

`on`方法注册一些事件类型和处理器,`emit`方法则对某些事件类型的所有处理器传入`data`参数作为处理器的参数.



`PubSub`模式具有`同步性`,开发者可以灵活地写出`bug`😂,例如这段`JQuery`代码:

```js
$('input[type=submit]')
.on('click', function(){
  $(this).trigger('click')
})
```

在添加处理器的时候显示`trigger`,这种同步性代码显然会引起栈溢出.(正经人谁会写出这种代码?你会吗?)

> 我们常将带有`PubSub`接口的对象称之为`事件化对象`

如果我们没有主动订阅事件,`PubSub`将是完全隐形的.

## 参考

- [The JS Bifrost —Pub-Sub way to code | by Rishikesh Andhale | Globant | Medium](https://medium.com/globant/the-js-bifrost-publish-subscribe-pattern-in-javascript-df796b7a4c12#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlOTU1NmFkNDY4MDMxMmMxMTdhZmFlZjI5MjBmNWY5OWE0Yzc5ZmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2MTg3OTQ1NzUsImF1ZCI6IjIxNjI5NjAzNTgzNC1rMWs2cWUwNjBzMnRwMmEyamFtNGxqZGNtczAwc3R0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzcxOTY4NDAzMTc0MDk3MTcyNiIsImVtYWlsIjoicml2ZW5xaW55eUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMjE2Mjk2MDM1ODM0LWsxazZxZTA2MHMydHAyYTJqYW00bGpkY21zMDBzdHRnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6IkFhcm9uIERaIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpSV9QZzhRNjJVT2ZJLVNoWm11RGdjSU1DbGRjV29fQ0JWR3d3MjNnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFhcm9uIiwiZmFtaWx5X25hbWUiOiJEWiIsImlhdCI6MTYxODc5NDg3NSwiZXhwIjoxNjE4Nzk4NDc1LCJqdGkiOiI4YjYyN2U4YWMwZThhZmRkZGQ4ZjFhMjg4MzI3YjlkZTA4Y2E2MzUyIn0.xKrcAwCsE0o73lBAac3wbJvTxd03a1XJIXnhSwHTHf-CrjB-OWcm-RYJmAKZI0Hctv7gxcy6GYWpqFuZ8CteNALbSN23E551bcc7TTWxqvv0EUc9zCtkg1uWIBuaDYsU8FC9tVbx-Jg5YkCiStMyecjNmTrrvws8aLPHNmaNlh98M4ugydRYn9i8oWXbmNidFsQ0DDsRGu-xORT_9jwgJpVjEo9ZS29hkk1lP_DsM74-lmYEtAgDOZ08OHGVeJl6PA1Q_ERAcueZxrEPTLQ8MHI2GonfsLulvOCGL_lXuT2l_ENh6TM75nCNkXOgCRzRbii2uB39RBeziYWghXSmkA)
- [数据双向绑定的分析和简单实现 - 知乎](https://zhuanlan.zhihu.com/p/25464162)
- [JavaScript异步编程:设计快速响应的网络应用 (图灵程序设计丛书 27)-Kindle商店-亚马逊中国](https://www.amazon.cn/dp/B00JVLEYY2/ref=sr_1_16?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&dchild=1&keywords=javascript%E5%BC%82%E6%AD%A5&qid=1618792066&s=digital-text&sr=1-16)

