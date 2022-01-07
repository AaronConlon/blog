---
title: 'JavaScript:bind call apply'
date: '2022/1/7'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0ODYzNDY&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDE0ODYzNDY&ixlib=rb-1.2.1&q=80&w=400'
intro: 'JavaScript 如何实现 bind/call/apply ?'
---

### 前言

在日常的前端开发工作中，有时候会需要为某些函数显式绑定`this`，这时候我们通常可以使用`bind/call/apply`三个方法创建新的函数，并且显式指定`this`。

> "`this`到底引用哪个对象，必须到函数被调用时才能确定" from JavaScript 高程

今天，我们就来学习一下如何从源码的角度去实现这三个可以显示确定`this`的方法。

### bind

`bind()`方法创建一个`新的函数`，在`bind()`被调用时，新函数的`this`被指定为`bind()`的第一个参数，其余参数作为新函数的参数，供调用时使用。

> Tips: 使用 bind() 后返回的新函数，其`name`属性将会有`bound`前缀

#### 语法

`function.bind(thisArg[, arg1[, arg2[, ...]]])`

#### 实现



### call 和 apply

> Call 和 apply 将会以显式指定的 this 作为函数 this 来调用函数 

`call`和`apply`的区别在于接收函数的参数：

- apply 接收一个数组或 arguments 对象
- call 则逐个接收参数
