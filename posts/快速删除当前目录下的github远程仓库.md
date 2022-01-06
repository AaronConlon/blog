---
title: "快速打开或删除当前目录下的github远程仓库"
date: "2021/12/24"
tags:
  - 小技巧
mainImg: "https://images.unsplash.com/photo-1590935216109-8d3318de2c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAyODk1ODM&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1590935216109-8d3318de2c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAyODk1ODM&ixlib=rb-1.2.1&q=80&w=400"
intro: "如何通过命令行快速用浏览器打开当前仓库的远程地址？如何快速删除当前目录下的 github 远程仓库？"
---

### 前言

长话短说，分享两个没用（或许）的 github 小技巧。作为一个命令行爱好者，无论何时都在命令行和其他软件之间切换着，那么问题来了，如何快速用浏览器打开当前仓库的远程地址？如何快速把没用的远程仓库删掉（以免丢人现眼 😂）?

### Step by step!

首先，`github`推出了自己的专用命令行应用：`gh`!

![](https://user-images.githubusercontent.com/98482/84171218-327e7a80-aa40-11ea-8cd1-5177fc2d0e72.png)

有了这玩意，创建 github 仓库这类操作就基本可以告别`git`了。

按不同平台来看，安装步骤差不多。

> 当然直接去[cli/cli: GitHub’s official command line tool](https://github.com/cli/cli)看文档是极好的！

- macOs: brew install gh
- windows: scoop / conda / chocolatey / winget 都可以，笔者有 scoop install gh 足矣
- Linux & BSD: 到版本发布页面下载安装或按官方分类好的发行版类型文档进行安装

安装结束之后第一件事就是：

```bash
$ gh auth login
```

进行认证并且获取 token，按提示操作即可！

此外便不多说，歪楼了。

### 打开仓库页

命令行输入：`gh repo view <owner/repo> --web`,其中 `onwer/repo`指的是仓库拥有者和仓库名，如果你想打开当前目录下的仓库则不需要提供此参数，否则可以提供此参数作为目标。

比如你不知道从哪得知有一个很有趣的浏览器扩展：“[philc](https://github.com/philc)/**[vimium](https://github.com/philc/vimium)**”，只需要这样便可以从终端打开这个仓库的页面瞧瞧：

```bash
$ gh repo view philc/vimium --web
```

亦或是当你被朋友推荐用某个`vim`插件时，根据对方提供的配置文件字段就可以直接去这个插件仓库看看了，是不是很没用啊 😋！

### 快速删除某个仓库

不知道老兄是否做过这种蠢事，脑海里蹦出某个炫酷的点子，于是立马：

```bash
$ gh repo create Diao
```

创建了一个仓库，并且瞎七八写了一堆垃圾代码就上传到 github 了，某天幡然醒悟悔不当初，需要赶紧删了这玩意免得丢人现眼，总不能让自己的 github 放这么多没用的仓库吧！

> 一系列的仓库删除就不提了，网上很多介绍，切记如果用第三方的服务，用完就把创建的 token 给删掉，免得被人利用。

这时候你也没必要先打开仓库的页面点进配置页面去删除，最后还要复制一下`owner/repo`确认删除。

> 下述操作是在某个 issue 上复制的。

你可以这样：

```bash
# one time:
$ gh alias set delete 'api -X DELETE repos/$1'
$ gh auth refresh -h github.com -s delete_repo

# usage (WARNING: no confirmation!)
gh delete user/myrepo
```

首先设置一个别名`delete`，然后更新认证的 token 权限，获取到删除仓库的权限，最后就可以一把梭删除自己的这个没用的仓库了。

是不是很没用啊！先这样~
