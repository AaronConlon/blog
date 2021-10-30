---
title: '从实现Koa文件上传接口学到的东西'
date: '2021/10/31'
tags:
- Node
- Koa
mainImg: 'https://images.unsplash.com/photo-1593720216276-0caa6452e004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2MTQwODc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1593720216276-0caa6452e004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU2MTQwODc&ixlib=rb-1.2.1&q=80&w=400'
intro: '最近在写浏览器扩展的后端程序，框架选择了 Koa ，新实现了文件上传的功能，在这里简单记录一下。'
---

# 前言

> “挺水的。” 
>
> “比没有好！”

我在写后端程序之前，阅读了`《狼书：Node.js Web 应用开发》`，选择了`koa-bodyparser`作为数据类型解析中间件，但是在需要实现文件上传的时候发现`koa-bodyparser`不支持`enctype="multipart/form-data"`。

在 GitHub 的 issue 板块，其核心开发者回复使用`busboy`这个库，但是看起来已经很多年没有更新文档了，于是我查找到了`koa-body`来代替`koa-bodyparser`。



# 使用过程

在`koa-body`的仓库`README`界面上可以看到其功能特性：

[koajs/koa-body: koa body parser middleware](https://github.com/koajs/koa-body)

- can handle requests such as:
  - **multipart/form-data**
  - **application/x-www-urlencoded**
  - **application/json**
  - **application/json-patch+json**
  - **application/vnd.api+json**
  - **application/csp-report**
  - **text/xml**
- option for patch to Koa or Node, or either
- file uploads
- body, fields and files size limiting

👌🏻，支持`multipart/form-data`和文件上传，对于后端接口也提供了良好的`json`解析支持。安装好了之后，按需要的功能进行实例化，然后作为一个中间件来使用即可。

```js
const koaBody = require("koa-body")
...
app.use(koaBody({
  json: true, // 开启 json 支持
  multipart: true, // 开启 multipart/form-data 支持
  formlimit: 2 * 1024 * 1024, // 传输大小限制，默认 56 kb
  formidable: {
    uploadDir: process.env.UPLOAD_PATH, // 上传保存目录
    hash: ‘md5’, // 计算哈希值，提供算法 md1 or sha1
    keepExtensions: true, // 保留扩展名
    multiples: false, // 禁止多文件上传
  }
}))
```

可以从仓库文档看到还可以做其他操作，例如保存前重命名，这类操作都通过配置对象实例化的方式来实现。

然后，我们就可以从路由函数里通过`ctx.request.files`获取到上传的文件信息，包括保存位置、扩展名‘文件名、哈希值、大小等等。

我想过对于重复上传相同哈希值的文件做拦截，后来在其`issue`板块发现有人提过这个问题，这个`issue`没有关闭，有人提议使用`fs`模块做处理，暂时好像只能这样。



# 其他

## curl

写好了接口，我打算使用`curl`来测试，其上传命令如下：

```bash
$ curl -F 'upload_filename=@demo.jpg' http://localhost/upload
```

提供`-F`参数指定请求POST类型并且添加`enctype="multipart/form-data`，指定上传文件名和文件路径。

> 如果想上传多个文件，则继续添加 `-F xxx`即可

## Vim

我最近在坚持使用`vim`进行编程，今晚遇到一个问题，我希望显示相对行数，并且当前行显示为所在行的行数。

其配置为：

```bash
set number relativenumber
# or set nu rnu
```

单纯使用`set rnu`会让所有行都为相对行数，当前行为`0`，`vim7.4`版本后提供了`Hybird`混合模式，可以实现我的需求。

## 文件压缩和下载

此需求在网上看到了一个很好的方案，可以从参考 2 访问到，在这先略过。

# 参考

- [Vim’s absolute, relative and hybrid line numbers](https://jeffkreeftmeijer.com/vim-number/)
- [How to Create and Download a Zip File with Node.js and JavaScript | CheatCode](https://cheatcode.co/tutorials/how-to-create-and-download-a-zip-file-with-node-js-and-javascript)

