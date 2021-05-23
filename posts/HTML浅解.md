---
title: 'HTML浅解'
date: '2021/5/24'
tags:
- HTML
mainImg: 'https://images.unsplash.com/photo-1621579274840-bd3dc60bf590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjE3OTA2Njc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1621579274840-bd3dc60bf590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjE3OTA2Njc&ixlib=rb-1.2.1&q=80&w=400'
intro: '作为一个 web 开发者，我们需要掌握的 HTML 知识到底应该有多少？HTML 真的如此简单吗，我们是否应该给与其更多的重视？'
---

​		作为一个 web 开发者，我们需要掌握的 HTML 知识到底应该有多少？HTML 真的如此简单吗，我们是否应该给与其更多的重视？

​		带着这些疑问，我决定重新学习`HTML`知识，如何学习？



​		我找到了一个挺不错的资源：[HTML Standard](https://html.spec.whatwg.org/)，本文将记录笔者学习的过程所遇到的知识点和一些相关性知识分析。



## 前言

**HTML**（超文本标记语言），也是万维网的核心标记语言，对于现代浏览器来说，`HTML`已经发展到了第五个版本，在多年的演变和改进之下，许多不合时宜的内容被清除了，同时随着版本更迭也有新的内容添加进来，作为一个 web 开发者，我们需要紧跟技术的发展，保持前瞻性和技术敏感度。

知识无限，时间有限。

忽略掉那些琐碎的片段，我们将从不同的问题开启每一个知识点。

## Q&A

### 1. HTML 和 XML 语法的差别

HTML（超文本标记语言）和 XML（可扩展标记语言）结构类似，但是在语法上具有以下不同之处：

- XML 严格区分大小写
- XML 具有严格的树状结构，禁止省略结束标记
- XML 属性值必须用引号包裹起来，而在 HTML 中则是可选的
- XML 所有属性必须具有值，HTML 则允许无值属性（采用默认值）
- XML 解析器不会像 HTML 这样过滤空格
- XML 没有固定的标记标签，所有标签都是自定义可扩展的

二者在作用上也不同：

- XML 偏向于保存数据，可以被视为持久化结构
- HTML 偏向于描述数据结构

其他方面：

- 在浏览器中，HTML 文件的媒体类型是`text/html`，而 XML 的媒体类型则是`application/xhtml+xml`，不同的`MIME`类型在浏览器中将会以不同的解析器去解析文档。



### 2. 请快速介绍一下 HTML 的内容

从最简单的一份`html`文档说起：

```html
<!DOCTYPE html>
<html lang="en">
 <head>
  <title>Sample page</title>
 </head>
 <body>
  <h1>Sample page</h1>
  <p>This is a <a href="demo.html">simple</a> sample.</p>
  <!-- this is a comment -->
 </body>
</html>
```

