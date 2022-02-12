---
title: '工作中需要用到的Git知识'
date: '2022/2/10'
tags:
- Git
mainImg: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQ0NzI0MDU&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQ0NzI0MDU&ixlib=rb-1.2.1&q=80&w=400'
intro: 'Git 日常操作须知！'
---

### 前言

入职新公司之后醒悟到自己之前对`Git`的了解依然太少，故整理一下工作中会用到的所有`Git`操作知识。

> [Learn Git Branching](https://learngitbranching.js.org/?locale=zh_CN): 强推边学边玩的游戏教程



### 浅尝辄止

#### commit 

提交记录可以视为项目的快照，如下如所示：

初始阶段：

<img src="mdImgs/image-20220210135808631.png" alt="image-20220210135808631" style="zoom:50%;" />

增加了新的内容，再次使用`git commit`任务提交新内容之后：

<img src="mdImgs/image-20220210135912104.png" alt="image-20220210135912104" style="zoom:50%;" />

新的节点生成了。

#### branch

开发新的需求时，创建新的分支去提交此需求的代码是一个非常好的办法。继续看示例，如下是默认情况：

<img src="mdImgs/image-20220210140153996.png" alt="image-20220210140153996" style="zoom:50%;" />

现在，我们要新增一个功能，为此我们想创建一个名为`newImage`的新分支：

`git branch newImage`

<img src="mdImgs/image-20220210140307559.png" alt="image-20220210140307559" style="zoom:50%;" />

创建了分支之后，还需要切换分支到目标分支上去开发新功能：

> git checkout -b newImage: 创建并切换分支

`git checkout newImage`或`git switch newImage`

<img src="mdImgs/image-20220210140521088.png" alt="image-20220210140521088" style="zoom:50%;" />

现在，所有新增的内容再`commit`，则会以当前分支为起点创建新的节点`c2`：

<img src="mdImgs/image-20220210140612918.png" alt="image-20220210140612918" style="zoom:50%;" />

#### merge

当新分支功能实现之后，我们可以将此分支合并到项目主分支上去。

合并分支不止有一种方法，现在来看第一种：`git merge`。

继续看示例：

<img src="mdImgs/image-20220210141214004.png" alt="image-20220210141214004" style="zoom:50%;" />

当前我们的`bugFix`分支开发完成，为了合并到`main`分支，我们先切换到了`main`分支。

然后：

`git merge bugFix`

<img src="mdImgs/image-20220210141330337.png" alt="image-20220210141330337" style="zoom:50%;" />

此时，`main`分支当前节点会接上`bugFix`的`c2`节点，此时`main`节点就包含了`bugFix`节点上的所有内容。但是，这时候还不算成功合并这俩分支。

我们需要继续执行`bugFix`分支上的合并命令：

`git switch bugFix;git merge main`

<img src="mdImgs/image-20220210141605243.png" alt="image-20220210141605243" style="zoom:50%;" />

现在，每一个分支都包含了所有代码了。

#### rebase

*rebase 将会取出一系列提交记录，复制并且放到另一个地方*。

看示例：

现在我们有两个分支如下所示：

<img src="mdImgs/image-20220210144128221.png" alt="image-20220210144128221" style="zoom:50%;" />

在`bugFix`分支上执行命令：`git rebase main`

<img src="mdImgs/image-20220210144738544.png" alt="image-20220210144738544" style="zoom:50%;" />

现在，`Copy`了 `C3`节点的所有工作内容放在了`main`分支后，并且作为一个新的节点，`C3'`是`C3`的副本，此时这两个节点同时存在。

接着，我们可以切到`main`分支上再`rebase`到`bugFix`分支上！

`git switch main;git rebase bugFix`

<img src="mdImgs/image-20220210145113041.png" alt="image-20220210145113041" style="zoom:50%;" />

此时，我们就完成了分支的合并。

### 循序渐进

接下来的目标是弄懂如何在提交树上移动。

#### 分离 HEAD

> HEAD 永远指向当前分支上最近一次的提交记录（头部~）

通常情况下，HEAD 指向分支名。所谓分离 HEAD 指的是让 HEAD 指向某个具体的提交记录而不是分支名。

如下图：

<img src="mdImgs/image-20220210150937337.png" alt="image-20220210150937337" style="zoom:50%;" />

此时 HEAD 指向 main，main 指向 C1！

我们可以通过`git checkout C1`（C1 指代提交记录的哈希值）来分离 HEAD！

<img src="mdImgs/image-20220210151253672.png" alt="image-20220210151253672" style="zoom:50%;" />

#### 相对引用

在实际项目中，并不存在默认的图示化支持，所以需要用`git log`来查看日志。

> 切记分支用 branch，HEAD 用 checkout

每一条`commit`都有自己唯一的哈希值，除了使用哈希值之外，还可以用相对引用。

- `^`向上移动一个提交记录
- `~3` 可以是任意合理的数字，示例为向上移动三个提交记录 

看示例：

<img src="mdImgs/image-20220210151826055.png" alt="image-20220210151826055" style="zoom:50%;" />

现在，我们可以使用`git checkout main^`来切换到`main`分支的父节点。

<img src="mdImgs/image-20220210151958145.png" alt="image-20220210151958145" style="zoom:50%;" />

比如我们有这样一个场景：

<img src="mdImgs/image-20220210152303465.png" alt="image-20220210152303465" style="zoom:50%;" />

现在需要让`main`分支恢复到节点`C1`:

`git branch -f main HEAD~3`即可强制让`main`分支相对引用上层第三个节点。

<img src="mdImgs/image-20220210152439000.png" alt="image-20220210152439000" style="zoom:50%;" />

#### 撤销变更

人总有犯错的时候，Git 允许我们撤销不必要的变更。

撤销变更的方式分为：

- reset
- revert

##### reset

首先是`reset`!

<img src="mdImgs/image-20220210153918207.png" alt="image-20220210153918207" style="zoom:50%;" />

然后执行重置命令：`git reset HEAD^`

<img src="mdImgs/image-20220210153956095.png" alt="image-20220210153956095" style="zoom:50%;" />

##### revert

> Reset 通常用于修改本地提交记录，如果需要撤销更改并且分享给别人，则需要`git revert`

<img src="mdImgs/image-20220210154110580.png" alt="image-20220210154110580" style="zoom:50%;" />

执行命令`git revert HEAD`:

<img src="mdImgs/image-20220210155612888.png" alt="image-20220210155612888" style="zoom:50%;" />

使用`revert`将会新增一个提交，这个提交基于撤销的目标位置，也就是说`C2'`的状态和`C1`是相同的。

### 渐入佳境

或许上述命令已经能够让你应对百分之工作中 90% 的 Git 问题，但是在处理复杂工作流时，还需要了解更多内容。

接下来我们谈谈如何整理提交记录。

#### Cherry-pick

如果你想将一些提交复制到当前所在的位置(HEAD)下面的话，可以试试`Cherry-pick`，来看看这个场景：

<img src="mdImgs/image-20220210164646032.png" alt="image-20220210164646032" style="zoom:50%;" />

我想把`side`分支上的工作复制到`main`分支，显然`rebase`也可以实现。

但是我们来看看`cherry-pick`如何处理这个需求：

`git cherry-pick c2 c4`

<img src="mdImgs/image-20220210165225268.png" alt="image-20220210165225268" style="zoom:50%;" />

这样就能将`C2`和`C4`的内容复制到了当前分支下，这样一来`main`分支就包含了`C2`和`C4`的内容。

#### 交互式 Rebase

当我们不知道提交记录哈希值时，可以选择使用交互式的`rebase`操作来实现相同的效果。

交互式`rebase`指的是带参数的`rebase`，核心参数是`--interactive`(-i 简写)。

`git`会选择默认的编辑器去处理顺序。

![image-20220210174950934](mdImgs/image-20220210174950934.png)

我们可以删除某些`pick`行，也可以修改行为，更换顺序来处理`rebase`的问题。

### 杂项

#### 提交的技巧

##### 场景 1

有这么一个场景，代码出现了某个棘手的`BUG`，为了方便调试而在代码中添加了一些调试命令并向控制台打印了这些信息，当问题解决之后代码提交之前，我们如何更快地排除那些调试代码呢？

当我们发现`bug`出现在文件`a.js`，但是调试信息遍布整个目录，这时候我们可以让`git`复制解决问题的那一个提交记录即可。

<img src="mdImgs/image-20220210180636221.png" alt="image-20220210180636221" style="zoom:50%;" />

我们只需要`bugFix`这个提交，因此为了将之合并到`main`分支上去，我们可以：

```bash
$ git rebase -i main --solution-ordering C4
$ git rebase bugFix main
```

<img src="mdImgs/image-20220210182452714.png" alt="image-20220210182452714" style="zoom:50%;" />

甚至，只需要将`bugFix`分支的内容复制到`main`分支后面即可：

```bash
$ git switch main
$ git cherry-pick C4
```

<img src="mdImgs/image-20220210181703119.png" alt="image-20220210181703119" style="zoom:50%;" />

##### 场景 2

我在`newImage`分支上提交了一些更新，然后又基于此节点创建了`caption`分支，然后又提交了一次。

但是由于某些原因，我得在原来的提交记录上(`newImage分支`)做一些更新(我不希望这些更新记录在当前的位置)。

我们可以这样实现这个需求：

- 用`git rebase -i`重新排序之前的提交，将目标记录挪到最前面
- 用`git commit --amend` 进行小修改
- 再用`git rebase -i`恢复原来的顺序
- 最后把`main`移动到最前端

最初的状态图如下：

<img src="mdImgs/image-20220210212704433.png" alt="image-20220210212704433" style="zoom: 67%;" />

命令如下：

```bash
$ git rebase -i c1
# 更换 c2 和 c3 的顺序
$ git commit --amend
# 此时，更新头部
$ git rebase -i c1
# 恢复 c2 和 c3 的顺序
$ git rebase caption main
# 合并分支 main 和 caption
```

![image-20220210214641095](mdImgs/image-20220210214641095.png)

##### 场景 3

当我们将想要的提交记录移动到最前端时，可以用`--amend`修改它，但是这样可能会造成由`rebase`产生的冲突。

除了使用上述方案，还可以选择`cherry-pick`来实现。

> 牢记`cherry-pick`可以将树上的提交记录追加到`HEAD`上来。

![image-20220210215346574](mdImgs/image-20220210215346574.png)

现在，我们需要在`newImage`分支节点`C2`上做一些修改，首先让我们切换到`main`上。

```bash
# 切换到 main
$ git switch main
# 将 C2 挪到 main 的下一步
$ git cherry-pick C2
# 提交修改
$ git commit --amend
# 将 C3 移动到当前节点末尾
$ git cherry-pick C3
```

现在，我们实现了针对性修改中间节点记录。

![image-20220210215752988](mdImgs/image-20220210215752988.png)

#### Tag

分支易变，为了便于定位到记录，我们可以创建标签（`Tag`），每一个标签都可以视为一个里程碑，我们可以像用分支一样用标签，并且它不会移动，标签页是一个锚点。

让我们为提交记录`C1`创建一个标签`v1`:

![image-20220210224729142](mdImgs/image-20220210224729142.png)

执行命令：

```bash
$ git tag v1 C1
```

![image-20220210224814517](mdImgs/image-20220210224814517.png)

如果我们再想快速切换到具有特殊意义的地方，就可以通过`checkout tagName`快速完成切换。

此外，`git describe <ref>`可以展示最近的一个标签信息。`ref`是可选的记录引用，你可以写哈希值、标签、分支，甚至什么都不写，默认为当前`HEAD`位置。

输出的结果如下：

`<标签名>_<ref和标签之间的提交记录数>_g<ref的哈希特征值>`

如果我们有这样一个场景：

![image-20220210225857113](mdImgs/image-20220210225857113.png)

那么会有以下输入和输出：

```bash
$ git describe main
# 输出 v1_2_gC2
$ git describe side
# 输出 v2_1_gC4
```

#### 多分支 rebase

我们为了开发某些功能，每一个功能都创建了单独的分支，现在要将这些分支全部合并到`main`分支上去。

![image-20220210231612410](mdImgs/image-20220210231612410.png)

现在，我们有主分支`main`，其他任务分支：

- `bugFix`
- `side`
- `another`

为了将任务分支合并到主分支下，可以逐步`rebase`：

```bash
$ git rebase main bugFix # 将 bugFix rebase 到 main 下
$ git rebase bugFix side # 将 side rebase 到 bugFix 下
$ git rebase side another # 类似
$ git rebase HEAD main # 可以使用 HEAD 代替分支名，这时候 HEAD 总是在当前适宜的位置
```

#### 多上层记录

看看这个场景：

![image-20220210233314336](mdImgs/image-20220210233314336.png)

如果我们执行:`git checkout main^`，那么`HEAD`将会分离到`C1`，如果想分离到`C2`该怎么做？

答案很简单：`git checkout main^2`

继续看示例：

![image-20220210233534390](mdImgs/image-20220210233534390.png)

如果想快速切换到 `C3`，我们可以：

```bash
$ git checkout HEAD^
$ git chekcout HEAD^2 # 选择第二个方向
$ git checkout HEAD~2 # 继续向上 2 个记录
# 甚至可以将这些操作连起来
$ git checkout HEAD~^2~2
```

#### 最终试炼

现在是最后一关，前方是复杂且纠缠不清的分支。

现在我们的 `main` 分支是比 `one`、`two` 和 `three` 要多几个提交。出于某种原因，我们需要把 `main` 分支上最近的几次提交做不同的调整后，分别添加到各个的分支上。

`one` 需要重新排序并删除 `C5`，`two` 仅需要重排排序，而 `three` 只需要提交一次。

![image-20220210235203491](mdImgs/image-20220210235203491.png)

为了实现目的，我们得单独处理这些分支，一步步来：

```bash
$ git rebase -i one c5 # 然后删除 c5，再重新排序
$ git rebase -i two c5 # 重排序
$ git rebase c2'' two # 处理好分支的位置
$ git rebase c2 three # 同上
```

结果是：

![image-20220210235444896](mdImgs/image-20220210235444896.png)

### 还不算完
