---
title: 'github action实战: 自动化构建release'
date: '2022/4/4'
tags:
- 自动化
- github action
mainImg: 'https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDkwNTkxOTU&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDkwNTkxOTU&ixlib=rb-1.2.1&q=80&w=400'
intro: '初步尝试利用 github action 自动化打包和发布 release 包。'
---

自从上次我开发完成自己的 chrome 扩展程序"岚"之后，一直不断对其进行优化和功能增强，在很长一段时间内都是手动构建和打包，再上传到 github release，昨天学习了如何通过 github action 进行自动化打包和发布到 release，因此在这里分享一下。

### 构建工作流基础

> github action marketplace 提供许多开发者分享的 action 脚本，我们也可以直接在 github 仓库页面设置工作流

为了增强实践经验，我在本地项目的根目录下一步步创建`workflows`所需的文件。

让我们一步步地创建一个工作流：

- 在项目的根目录创建`.github`目录，内部再创建`workflows`目录用于存放工作流配置文件。
- 在`.github/workflows`中创建配置文件`demo.yml`(注意扩展名)。
- 编辑`demo.yml`配置文件

接着，我们先来看一个仅用于说明和理解`action`的示例配置：

```yaml
name: GitHub Actions Demo
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v2
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."

```

每一个复杂的`action`都是由简单的项配置组成的，`workflows`下可以有多个`action`，每一个`action`都有自己可选的`name`属性（如果不写，则在仓库的操作选项卡中不会显示）。

每一个`action`都是事件触发的，上述`on`配置指定了所有`push`事件都会触发并且执行此`action`。

其语法格式如下：

```bash
# 单个事件
on: push
# 多个事件
on: [push, pull, fork]
```

多个事件只需一个即可触发工作流，如果同时触发多个事件，则会触发多个工作流。

> 更多工作流触发语法：[GitHub Actions 的工作流程语法 - GitHub Docs](https://docs.github.com/cn/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)

在团队开发中，我们通常需要使用筛选器来控制事件触发机制。

```yaml
on:
	push:
		branches:
			- main
			- 'release/**'
```

如上所示，我们可以控制`action`在`main`或`release`相关分支`push`时才触发，甚至可以限定`action`在`label`操作时触发：

```yaml
on:
	label:
		types:
			- created
	push:
		branches:
			- main
		tags:
			- 'v*'
```

如上所示，在`push main`分支且具有`v`开头的`tag`标签时或者在`label`创建时触发。

同时，支持`excluding`排除条件：

```yaml
on:
	push:
		branches-ignore:
			- test
```

此外，还有一些有用的条件限制，例如我们不希望仅仅是更新了`readme`文件，或是`docs`目录下的文档时触发`action`，此时可以：

```yaml
on:
	push:
		paths-ignore:
			- 'docs/**'
```

以此排除`docs`目录下的`push`行为引起不必要的工作流。

此外，还包括一些其他限定触发`action`的场景，在我们需要的时候可以查阅文档。

接上文，在触发机制之下便是作业组合：`jobs`。

作业组合下可以有多个具名`job`，每一个`job`的格式都一样，我们看示例：

```yaml
Explore-GitHub-Actions:
	runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v2
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

`runs-on`配置作业运行的环境，`github`将会将任务派发到指定类型的虚拟机容器中运行。

此外，便是整个`job`的步骤，步骤可以包含以下类型的配置：

- `run`：执行指定运行环境的命令

- `name`：单一步骤的名字

- `uses`：使用`action marketplace`上公开的脚本，便于我们快速实现需求，我们可以使用第三方的脚本而不是每一处都自己写。上述`actions/checkout@v2`就可以非常方便地将我们的仓库检出到运行环境上去。

> 在 github repo 页面，我们可以从`action`页面进入查看当前或历史`action`记录



### 部署实践

首先，来看看需求如何：

- 将代码检出到运行环境，安装`yarn`并且打包构建
- 保存和分享打包信息
- 压缩打包文件
- 创建`release`并且上传打包后的压缩文件到`release`

看代码：

```yaml
name: 自动打包发布
on:
  push:
    tags:
      - "v*"
jobs:
  build-dist:
    name: 构建 chrome 扩展程序安装包
    runs-on: ubuntu-latest
    steps:
      # 准备源码
      - name: 检出代码
        uses: actions/checkout@v2
      - name: 准备 yarn 环境
        uses: borales/actions-yarn@v2.3.0
      # 安装库并构建
      - run: yarn
      - run: yarn build

      - name: 上传共享的数据
        uses: actions/upload-artifact@v2
        with:
          name: dist
          path: dist/

  release:
    name: 发布版本
    runs-on: ubuntu-latest
    needs: build-dist
    steps:
      - name: 下载共享数据
        uses: actions/download-artifact@v2
        with:
          name: dist
      - name: 压缩文件
        uses: thedoctor0/zip-release@master
        with:
          type: "zip"
          filename: lan.zip
          exclusions: "*.git* /*node_modules/* .editorconfig"

      - name: Create Github Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          tag_name: ${{ github.ref_name }}
          release_name: Release ${{ github.ref_name }}
          draft: false
          prerelease: false

      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
        	# outputs 是由 create_release 的 action 脚本内定义的输出
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./lan.zip
          asset_name: lan_${{ github.ref_name }}.zip
          asset_content_type: application/zip
```



> 这篇📒内容仅仅发布在博客，我意识到当自己不熟悉某个技术时，不应该做任何分享。一知半解的分享毫无意义。



### 参考

> 官方文档是最佳的参考，阅读时只需保持耐心

- [GitHub Actions 快速入门 - GitHub Docs](https://docs.github.com/cn/actions/quickstart)
- [GitHub Actions 入门教程 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)
- [自下而上的github actions使用教程 - 墨天轮](https://www.modb.pro/db/46505)
- [你知道什么是 GitHub Action 么？ - 极客挖掘机 - 博客园](https://www.cnblogs.com/babycomeon/p/12771624.html)
