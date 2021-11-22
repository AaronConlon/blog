---
title: '用fish-shell创建一个快速打开当前仓库主页的函数'
date: '2021/11/23'
tags:
- Fish
mainImg: 'https://images.unsplash.com/photo-1603969409447-ba86143a03f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzc1OTc3MTI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1603969409447-ba86143a03f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzc1OTc3MTI&ixlib=rb-1.2.1&q=80&w=400'
intro: '我在写了一个新的小工具并且将代码上传到 GitHub 的时候，突然发现想要打开这个仓库的主页，然而我找不到 gh 和 git 这俩 cli 支持这个功能的地方，于是我就用自己当前使用的 fish shell 写了一个函数，用于快速打开我的仓库'
---

## 前言

我在写了一个新的小工具并且将代码上传到 GitHub 的时候，突然想要打开这个仓库的主页，然而我找不到 gh 和 git 这俩 cli 支持这个功能的地方，于是我就用自己当前使用的 fish shell 写了一个函数，用于快速打开我的仓库。



## 主体内容

### 系统环境

- `Mac`
- `fish`

### 脚本代码

> 我对 fish 也不够了解，只是为了是实现这个功能而马上去看了其函数的语法和字符串处理的一些知识。

```shell
function ghome
	# 通过 git 尝试获取当前仓库的地址
  set -l homepage_url (command git remote --verbose 2> /dev/null | grep fetch | command cut -c 8-)
  # 显然如果不是仓库则执行失败
  if [ $status -gt 0 ]
    echo 'Not a git repo'
    return 1
  end
	# 没获取到地址也失败
  if [ -z $homepage_url ]
    echo 'Not a git repo'
    return 1
  end
	# 不是 GitHub 的仓库也不算
  if [ -z (echo $homepage_url | grep github) ]
    echo 'Not a git repo...'
    return 1
  end
  # 获取当前的分支名
  set -l branch (command git rev-parse --abbrev-ref HEAD)
	# 获取地址并使用 open 命令打开
  set -l url (string replace -r '\.git.*' '' $homepage_url)
  open $url/tree/$branch
end
```

如此一来，我就可以很方便的使用`ghome`命令直接打开的当前仓库的线上主页了。

## 最后

这看起来只是一个非常无聊的脚本，但是说实话对我来说挺好用的。尬住。

> `fish`是一个非常好用的`shell`环境，某种程度上可以很好的代替`zsh`，你可以在很多地方搜索到它的优缺点~

又十二点过去了，狗命要紧🐶，睡觉，各位晚安。

## 参考

- [Tutorial — fish-shell 3.3.1 documentation](https://fishshell.com/docs/current/tutorial.html)
- 源代码[youyiqin/fish_functions](https://github.com/youyiqin/fish_functions/tree/main)

