---
title: 'chrome-插件开发文档心得'
date: '2022/1/12'
tags:
- Chrome Extensions
mainImg: 'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIwMDE2NTU&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIwMDE2NTU&ixlib=rb-1.2.1&q=80&w=400'
intro: '仅以本文，献给学习浏览器插件开发的开发者们。'
---

### 前言

chrome 扩展是基于 web 技术的软件应用，它可以让用户能够定制化 chrome 浏览器的使用体验。

在入手浏览器开发之前，请务必把文档看几遍。

本文将通过开发一个修改当前页面背景色的简单扩展为大家提供一个 chrome 扩展开发的体验机会。

### 起步

一个 chrome 扩展可以分为：

- Background scripts
- Content scripts
- Options page
- UI elements
- Various logic files

基于`HTML、CSS、JavaScript`即可构建完善的 chrome 扩展。

首先，我们创建一个`Demo`目录作为实例项目的根目录。

#### Manifest

> Manifest.json 是一个 chrome 扩展的起点

每一个扩展都有自己的描述文件：`manifest.json`!

举个例子：

```json
{
  "name": "Example",
  "description": "Something else."，
  "version": "1.0",
  "manifest_version": 3,
  ...
}
```

每一个字段都有自己的含义，大多数字段是可选的，少数基础信息字段例如上述`json`文件中的字段则是需要添加的，毕竟你至少需要告诉浏览器和用户，这个扩展叫什么，有什么作用，版本号是多少，使用的描述文件版本是多少。

不同的`manifest_version`对应的应用解析功能不同，某些`API`会对兼容性有要求。

#### 安装开发包

打开浏览器的设置项，进入扩展设置并且打开开发者模式，选择载入已解压的扩展，在弹出的文件筐中选中开发的扩展目录即可完成安装。

任何的扩展功能，都需要开发者编写脚本去实现，如上所述只是安装了一个具有描述文件的空扩展。



#### 设置背景脚本

在`manifest.json`中新增配置如下：

```js
{
  ...
  "background": {
    "service_worker": "background.js"
  }
}
```

`background`字段可以添加背景脚本，内部指定通过`service_worker`的形式单独运行一个`background.js`的脚本。

> 什么是 service_worker ?
>
> Service workers 本质上充当 web 应用程序、浏览器和网络之间的代理服务器，它是一个注册在指定源和路径下的事件驱动`worker`，它不能访问`DOM`，相对于驱动应用的主`JavaScript`线程，它运行在浏览器其他线程中，因此避免了堵塞。
