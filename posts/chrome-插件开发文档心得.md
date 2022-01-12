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
  "icons": {
    "16": "icons/16.png",
    "32": "icons/32.png",
    "48": "icons/64.png",
    "128": "icons/128.png"
  }
  ...
}
```

每一个字段都有自己的含义，大多数字段是可选的，少数基础信息字段例如上述`json`文件中的字段则是需要添加的，毕竟你至少需要告诉浏览器和用户，这个扩展叫什么，有什么作用，版本号是多少，使用的描述文件版本是多少。

不同的`manifest_version`对应的应用解析功能不同，某些`API`会对兼容性有要求。

#### 环境配置

推荐在项目根目录创建一个`jsconfig.json`配置文件告诉`vscode`，增强`JavaScript`的类型采集，提供关于`chrome`的 api 提示！

```json
{
  "typeAcquisition": {
    "include": ["chrome"]
  }
}
```

这样我们写一些关于`chrome`的代码就能够得到良好的方法提示和补全了！

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

> 什么是 service_worker 脚本?
>
> Service workers 本质上充当 web 应用程序、浏览器和网络之间的代理服务器，它是一个注册在指定源和路径下的事件驱动`worker`，它不能直接访问`DOM`而是通过响应`postMessage`接口发送的消息来与其控制的页面通信，相对于驱动应用的主`JavaScript`线程，它运行在浏览器其他线程中，因此避免了堵塞，在 chrome 扩展开发中使用此技术主要是为了处理不需要页面和用户交互的功能。需要注意的是，`service worker`将在不需要的时候终止，在需要的时候重新运行。

此时，刷新一下浏览器扩展这里刚安装的扩展，即可看到其`ID`下面有一行`Inspect views`检查视图可以点击`service worker`进入一个单独的`DevTools`去调试我们指定的`background.js`脚本。

在这个脚本文件中，我们就可以为一些特殊的事件添加回调函数去实现一些功能，举个例子：

> [API Reference - Chrome Developers](https://developer.chrome.com/docs/extensions/reference/) API 传送门

```js
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});
```

如字面意思，在 chrome 运行后并且安装成功此扩展后执行回调函数，调用 chrome 此扩展的`storage`存储同步保存颜色对象，再在控制台打印一条信息。

如果只是这样，我们会遇到一个问题，并且非常有意义。

控制台会告诉我们`TypeError: Cannot read properties of undefined (reading 'sync')`!

在扩展开发中，浏览器许多功能需要申请`权限`，申请方法就是在`manifest.json`文件中提前指定权限字段，这些信息也会在发布到 chrome 商店后提供给用户看，告知用户此扩展需要哪些权限。

╰(*°▽°*)╯

编辑`manifest.json`吧，告诉浏览器：嘿，请给我`storage`权限！

```json
{
  ...
  "permissions": ["storage"]
  ...
}
```

> 每次更新权限，都需要重新安装扩展。

#### 用户接口

我们可以在`manifest.json`中增加一个`action`字段，来提供一个浏览器顶部右上角显示一个可以交互的扩展功能区域。

> 可以通过 chrome.action 去控制它，例如设置背景色、增加文字徽章等效果

配置更新：

```json
{
  ...
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/16.png",
      "32": "icons/32.png"
    }
  }
  ...
}
```

增加了`action`，并且指定了默认的`popup`文件，以及不同尺寸的默认小图标。

接下来，我们增加一个扩展交互功能点，让用户可以通过点击操作更改当前页面的背景色！

我们称之为：`popup`!

先在根目录下创建一个`popup.html`文件！

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>popup</title>
    <style>
      button {
        height: 30px;
        width: 30px;
        outline: none;
        margin: 10px;
        border: none;
        border-radius: 2px;
      }
      button.current {
        box-shadow: 0 0 0 2px white, 0 0 0 4px black;
      }
    </style>
  </head>
  <body>
    <button id="btn"></button>
  </body>
</html>
```

> 上述都是基础的 HTML 和 CSS 内容

现在，我们可以点击浏览器右上角的灰色的小拼图块，它会显示一系列你安装的扩展，在这个列表中找到我们的`demo`扩展，点击右边的📌按钮即可将我们的扩展固定在浏览器顶部地址栏右边位置，点击`demo`扩展小图标就会将`popup.html`显示在下方。

> 这个`popup.html`视图有多大？答案是浏览器会让它尽可能的小，从而不占界面视图空间，最大高 600px ，宽 800 px！

来看看咱们的示例当前的项目文件结构：

```bash
.
├── background.js
├── icons
│   ├── 128.png
│   ├── 16.png
│   ├── 32.png
│   └── 64.png
├── manifest.json
└── popup.html
```

Ok!就像回到远古时代开发一个`html`页面一样，我们可以为其引入一个`.js`脚本，也可以直接在`html`内嵌`script`!

为了展示效果，我们创建一个`popup.js`，并且在`popup.html`底部引入！

Popup.html:

```html
...
<body>
   <script src="popup.js"></script>
</body>
...
```

再编辑此脚本：

```js
const btn = document.querySelector("#btn");

const setBtnBgColor = () => {
  chrome.storage.sync.get("color", ({ color }) => {
    btn.style.backgroundColor = color;
  });
};
setBtnBgColor();

```

现在，用户触发此`action`就会加载`popup.js`，执行这两段代码让`popup`弹出区域的按钮变绿。

此外，我们再添加一些逻辑：

```js
// 为按钮添加点击事件
btn.addEventListener("click", async () => {
  // 通过 chrome 的 api 获取当前窗口的 tab 信息
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // 确定执行标签的 id，提供一个函数作为回调，在当前页面动态执行 chrome 脚本
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBgColor,
  });
  setBtnBgColor();
});

// 此函数读取我们在 background.js 在 storage 中保存的颜色变量，修改当前页面 body 元素的背景色
function setPageBgColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
    // 随机修改并且更新颜色值
    const newColor = [...color]
      .map((i) => i.replace(/[^#]/, (1 + ~~(Math.random() * 15)).toString(16)))
      .join("");
    // modify color
    chrome.storage.sync.set({
      color: newColor,
    });
  });
}
```

保存！**注意**，我们又使用新的接口：`tabs`和`scripting`！这意味着我们不能忘了向 chrome 申请权限，并且重新安装这个扩展！

来，更新`manifest.json`!

```json
{
  ...
  // tab 和 scripting 对应的权限说明如下
  "permissions": ["storage","activeTab", "scripting"]
  ...
}
```

重新加载我们的 demo 扩展！每次点击图标按钮都可以改变当前页面的背景色了！

#### 选项

如果你使用过一些开发者发布在商店的扩展，或许使用过其单独提供的一个页面来提供修改扩展的各种设置的功能。

在浏览器顶部邮件点击扩展的时候，弹出的列表里会有一个选项行，如果当前扩展提供了选项页面，那么就可以点击进入这个页面，否则将不可用。

我们来创建一个简单的选项页面，命名为：`options.html`，并且创建一个内部引入的脚本：`options.js`!

此时，我们的项目文件结构如下：

```bash
.
├── background.js
├── icons
│   ├── 128.png
│   ├── 16.png
│   ├── 32.png
│   └── 64.png
├── jsconfig.json
├── manifest.json
├── options.html
├── options.js
├── popup.html
└── popup.js
```

