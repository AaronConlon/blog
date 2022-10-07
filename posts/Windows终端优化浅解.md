---
title: "Windows终端优化浅解"
date: "6/12/2022"
tags:
  - Windows
mainImg: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTc0NDI0Njc&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTc0NDI0Njc&ixlib=rb-1.2.1&q=80&w=400"
intro: "即使我们使用Windows系统作为日常开发环境，也可以拥有不错的命令行终端功能！"
---

我日常用过`linux`、`Windows`、`MacOS`系统作为开发环境，其中`Windows`对命令行终端的支持度让我最不满意。于是，我转向了`MacOS`阵营，真香。

前几天，前同事从公司跳槽去了甲方公司，用起了公司配的`Windows`笔记本并且吐槽命令行环境难用，于是我决定写这一篇文章分享出来，让我们花一点点时间优化一下`Windows`环境下的命令行终端的使用体验。

主要内容如下

- 升级核心 shell:`powershell v7`
- 更换默认终端软件:`tabby`
- 选择字体
- 主题优化
- `Fish-like`命令推断
- 支持`autojump`

### 核心 Shell

不同的操作系统平台都有自己的默认`shell`支持，如`linux`常用`bash`，而`MacOS`支持`zsh`，`windows`下起初使用`CMD`，随着版本升级和终端发展，微软开始推广`Powershell`。

`Windows 10/11`默认集成了`Powershell v5`，我们可以去官网下载`v7`版本的`Powershell`:

[Installing PowerShell on Windows - PowerShell | Microsoft Docs](https://docsmdImgsmicrosoftmdImgscom/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7mdImgs2#msi)

> 5mdImgs1 版本的 powershell 基于 mdImgsNET Framework，而 7mdImgsx 则基于 mdImgsNET Core，后者具有跨平台的优势和一些新特性

下载之后安装即可。

### 终端软件 Tabby

> tabby 提供了一系列的快捷键，笔者最常用的是 `ctrl+space`显示和隐藏 tabby

终端软件方面，其实有很多选择。我个人比较喜欢`Tabby`！其官网主页链接：[Tabby - a terminal for a more modern age](https://tabbymdImgssh/) ！

> windows 的老用户或许用过许多其他终端，但是还是推荐大家体验一下新出现的一些应用，新应用在 UI 设计/功能设计上都或多或少弥补了老应用的一些不足。

下载`x64`版本的可执行程序，安装之。

安装完成并且运行，到设置项里修改默认`shell`:

![image-20220612144620868](C:\Users\Zz\Desktop\image-20220612144620868mdImgspng)

选择`Powershell v7`作为默认 shell 即可。

### 字体优化

系统自带的字体在命令行环境下的视觉效果简直一言难尽，推荐下载`fira code`或者`hack`字体，笔者使用的是这里的：[tonsky/FiraCode: Free monospaced font with programming ligatures](https://githubmdImgscom/tonsky/FiraCode) 字体文件，下载安装即可，然后在`Tabby`的外观设置这里输入`Fira Code`作为字体选项。

> [source-foundry/Hack: A typeface designed for source code](https://githubmdImgscom/source-foundry/Hack) 如果你喜欢`hack`的风格，也可以下载使用。

### 终端主题优化 - Oh-my-posh

`oh my zsh`大名鼎鼎，但是在 windows 下我们选择`Powershell`作为核心`shell`，社区里也有[Home | Oh My Posh](https://ohmyposhmdImgsdev/)可用。

我们打开`tabby`，输入安装命令：

```powershell
 winget install JanDeDobbeleermdImgsOhMyPosh --source winget
```

即可通过`winget`安装`ohMyPosh`。

> 如果终端提示权限不足，则可以尝试使用管理员权限打开 powershell，执行`Set-ExecutionPolicy bypass`命令修改执行策略。

接下来，我们要了解一些预置知识：`powershell `的配置文件的路径为：`$PROFILE`，其地位可以视为`bash`的`mdImgsbashrc`。

因此，如果你从未创建过默认配置文件，那么这个文件需要我们手动创建：

```powershell
# 创建
ni -Force $PROFILE
# 通过记事本打开并且编辑
notepad $PROFILE
```

编辑保存以下内容即可在每次打开终端的时候初始化好主题样式：

```powershell
# 使用默认主题
oh-my-posh init pwsh | Invoke-Expression
```

> `mdImgs $PROFILE`等同于`source ~/mdImgsbashrc`，用于读取并且应用最新的配置。

在命令行中执行`Get-PoshThemes`即可预览所有可选的主题，选择你最喜欢的那一个。

> 上述命令将会在最后提示如何修改默认主题，复制好写入`配置`文件即可: `notepad $PROFILE`即可打开编辑默认配置文件

如下是我暂时的配置文件：

```powershell
oh-my-posh init pwsh --config C:\Users\Zz\AppData\Local\Programs\oh-my-posh\themes/spaceshipmdImgsompmdImgsjson | Invoke-Expression
```

在执行`get-poshThemes`成功之后，默认会下载所有主题描述文件到本地的主题目录，我们设置自己的默认主题只需要替换初始化配置字段中的主题名即可，如上我选择了`spaceship`主题。

> 不同主题除了好看之外，还提供了一些可能会有用的信息，例如当前目录下`node`版本、`git`分支信息、时间日期、路径等等

### 命令建议功能

`fish shell`自带了强大的命令建议功能，可以让我们在输入某些前置命令的时候推断出完整的命令，真是好用到爆炸。

首先，我们安装主要的依赖：

```powershell
Install-Module PSReadLine
```

其次，配置`PROFILE`并且激活配置（也可以重启终端、打开新的终端自动读取最新配置）

```powershell
Import-Module PSReadLine
Set-PSReadLineOption -PredictionSource History
```

![image-20220612161939583](C:\Users\Zz\AppData\Roaming\Typora\typora-user-images\image-20220612161939583mdImgspng)

如上所示，输入`c`即可通过历史命令记录进行推断，按`→`键即可自动补全。

### Auto Jump - ZLocation

熟悉`Linux`的朋友或许都知道`Auto Jump`有多好用，简单来说直接通过`j xx`进行优先级判断，自动切换路径到最有可能的位置。

比如，我们经常在终端切换路径到工作区，这时候`Auto Jump`就非常好用，直接通过最简单的命令进行目录跳转。

在`powershell`的生态里，我们有`ZLocation`可用 🎉。

> 给个 Star 吧！[vors/ZLocation: ZLocation is the new Jump-Location](https://githubmdImgscom/vors/ZLocation)

接着，继续更新配置文件以便每次打开终端都自动导入`ZLocation`:

```powershell
oh-my-posh init pwsh --config C:\Users\Zz\AppData\Local\Programs\oh-my-posh\themes/certmdImgsompmdImgsjson | Invoke-Expression

Import-Module PSReadLine
Set-PSReadLineOption -PredictionSource History
Import-Module ZLocation
```

> 不要忘记替换配置文件中我的用户名，注意好路径问题

现在，享受命令`z`带来的效率提升吧！

`z`配合`PSReadLine`的`fish-like`功能简直天衣无缝！

### 最后

`Powershell`和`bash`都是`shell`，都有自己的配置文件和语言规范、生态等等。如果你日常在`Windows`下工作，笔者真诚地推荐你花一点时间了解一下`Powershell`，它可能比你想象中更为强大。

> 如果有任何问题或建议，欢迎联系笔者！
