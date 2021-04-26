---
title: 'web开发新手之门'
date: '2021/4/26'
tags:
- 翻译
- 观点
mainImg: 'https://images.unsplash.com/photo-1619127278767-8274bcee167b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTk0NDc4MTg&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1619127278767-8274bcee167b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTk0NDc4MTg&ixlib=rb-1.2.1&q=80&w=400'
intro: '今晚炒的菜很好吃，那么就来谈谈新手入行 web 开发该怎么开始吧。'
---

> 为什么你不应该在入门学习 web 前端开发的时候就直接学习 React 、Vue， Angular 这类框架。

作为程序员的第一件事，人们好像真的已经丢失了寻找编程激情的钥匙，反而不断地问自己一些问题。

例如，我该学习什么？

也许该学习`前端框架`或者`云计算`，也许我更适合成为一个`机器学习工程师`,甚至是时候学习一些`后端开发`了。

甚至，谈及到`前端开发`这个领域，有些观点会让你觉得舒适。例如，你不需要学习多少数学知识或者计算机科学相关的技能。你只需要学习一些`HTML`、`CSS`、`Javascript`知识就能够获得一份工作，并且这乍看一眼似乎很容易。

作为一个刚入门的新手开发者，你可能会在已经掌握了一些`HTML`、`CSS`、`Javascript`知识的时候，在网上的某个论坛或者微信群组里看到别人说：

“太年轻了，光学了这些有个屁用，你现在最应该做的就是去学 React，或者是 Vue、Angular 框架。”

这些框架的优点、掌握它们的重要性甚至是一些夸大的宣传不断轰炸着“学艺不精”的新手们，甚至在`GitHub`上这些框架有多少`Star`、众多的生态资源和新技术、绚丽的前端`UI`库、跨平台开发、小程序和云计算技术等等，一个又一个技术词汇向你涌来，似乎你马上就需要学习它们并且很快就能`“精通”`它们，升职加薪 balabala……

于是，你一步步陷入了这些高级词汇和虚幻的技术潮流的陷阱中无法自拔。

当你直接按一些`“软文”`上的学习步骤一步步开始学习某种框架和技术的时候，你极有可能会因为缺少一些用于构建这些框架的编程思想或者进阶的技巧而陷入迷惑之中。

就拿`React.js`来说，你可能会找一本书，或者从`B站`亦或是`慕课网`上找一些教程来学习如何使用`React.js`进行开发。例如，一些初学者在看书的时候比较心急，于是直接跳过一些看起来不那么`紧要`的介绍，一切都很简单，你很快就按第一章的内容写了一个`hello world`,然后看到如下这样的代码：

```js
 'use strict';
var Hello = React.createClass({

  render: function() {
    return React.createElement("h1", null, "Hello World!");
  },

});

var div = document.getElementById("hi");

ReactDOM.render(React.createElement(Hello), div);
```

加入你先前只是稍微了解了点`JavaScript`和`HTML/CSS`知识就开始学习`React.js`，你会问自己：“我现在写的是什么鬼，为什么可以这样写，也许后端开发更适合我，不如看看后端开发的一些东西吧。”

> 注意： 我说的是那些不熟悉代码的人，或者是刚刚开始学习 JavaScript 的人。

就像许许多多的新手那样，你可能会在学习复杂知识的过程中遇到挑战，在缺少一些前置知识体系的前提下，学习难度将会陡增。

你可能会因为一开始就学习这类前端框架类库而找到一份工作，但是我保证你将会在一些开发过程中被一些简单的问题难住。

这并不是危言耸听。

为了避免新入行的朋友们陷入此类容易被忽视的泥沼中，我想向你们提供一些参考和建议。

### HTML、CSS、JavaScript

作为一个