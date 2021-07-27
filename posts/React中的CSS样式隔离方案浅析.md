---
title: '我React中的CSS样式隔离方案浅析'
date: '2021/7/13'
tags:
- React
- Css
mainImg: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYxMjA2NjU&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYxMjA2NjU&ixlib=rb-1.2.1&q=80&w=400'
intro: '在 React 开发中，组件之间的样式因为命名问题容易导致样式污染，为了解决这个问题引申出了不同的 CSS 样式隔离方案，今天谈谈笔者使用过的几种选择。'
---

在 React 开发中，组件之间的样式因为命名问题容易导致样式污染，为了解决这个问题引申出了不同的 CSS 样式隔离方案，今天要谈谈几种笔者使用过的方案：

- CSS-in-JS
- Webpack loader
- Dataset 选择器声明

# 前言

React 官方并没有规定如何在 React 应用中如何写 CSS，即使很多官方指南会写一些行内样式代码，但是官方并不推荐使用这种方式，这种方式的性能并不好。

今天，让我们来看看社区对于 CSS 样式隔离的方案选择都有什么。

# 1. 方案

### 1.1 原生行内样式

行内样式天生具有极高的优先级，除了使用`!important`对非行内样式进行标记，使得其能覆盖非`!important`样式之外，行内样式将会直接决定了元素如何显示。

举个例子:

```jsx
// jsx
const pStyle = {
 	color: 'red'
}
<p style={pStyle}>demo</p>
```

使用`JavaScript`对象和`jsx`语法去控制样式，会直接生成行内样式，一开始接触这种直接在`jsx`中使用对象的方式去写行内样式的方案还感觉挺巧妙的，甚至有点离经叛道，毕竟此前社区一直广泛流传`关注点分离`的观点，将样式和脚本分开为不同文件一直被视为最佳实践。

这种方案的缺点很明显，首先是编码的时候编辑器补全和`lint`困难，并且对伪类和伪类选择器的支持很差，也不支持CSS3 动画，行内样式阅读体验也不是很好，逻辑和内容增加的时候也会让`js`文件变大，不方便维护。

### 1.2 JSS

`JSS`也被称为`CSS-in-JS`，`react-jss`就是其中佼佼者之一，我们可以去官方看看使用示例：[JSS](https://cssinjs.org/react-jss/?v=v10.7.1)。

