---
title: 'github action 浅解'
date: '2021/11/28'
tags:
- Git
mainImg: 'https://images.unsplash.com/photo-1633791583517-c828e6f851a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzgwODk0OTQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1633791583517-c828e6f851a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzgwODk0OTQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '我需要使用 GitHub action 来自动部署一些应用。'
---

### 前言

我确实需要使用 GitHub action 来做一些事情。此前我照搬他人的配置来创建了自己的博客构建系统，但当时没有仔细🤔思考这整个过程，也没有继续了解 GitHub action 到底是什么，我想今天是时候了，让我们更多地了解 GitHub action！

### What's Github action?

2018 年 10 月，GitHub 推出了`Github Action`持续集成服务，其中包括抓取代码、运行测试、发布到第三方服务、远程登录服务器等等。为了方便开发者执行一些操作，GitHub 允许开发者编写独立的可共享的脚本文件来自动化地执行相关任务。

例如，在 push 新的内容到仓库后自动构建一个静态站点，亦或是通过设置好的 shell 脚本，将数据同步到 VPS 上，再在 VPS 上执行一些任务，这部分就非常灵活了。

我们可以在[官方市场](https://github.com/marketplace?type=actions)或者[awesome actions](https://github.com/sdras/awesome-actions)找到具有特定功能的共享`action`脚本。

### 基本概念

GitHub action 常见术语如下：

- workflow：工作流程，包含以下几点
  - Job: 任务，一个工作流可以具有多个 job
    - step：job 由 step 组成，若干个步骤执行结束即表示 job 结束
      - action：每一个步骤可以执行若干个命令

### 实践

在项目根目录创建一个`.github/workflows`目录，此目录下的所有`.yml`文件都包含着单独的`workflow`，这些工作流脚本将自动运行。

> 详细配置链接 [Workflow syntax for GitHub Actions - GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#on) 

让我们来看一个典型的 workflow 文件示例`demo.yml`：

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

这种配置文件被称为`yaml`文件，上述官方示例中可以看到以下几个典型字段：

- name: 工作流的名称，默认等同于文件名

- on: 运行条件，可以是数组，也可以是单独的字符串，上述表示所有`push`行为都会执行后续任务，甚至可以根据分支来指定执行时机。

- jobs: 则表示此工作流中的任务，`Explore-GitHub-Actions`就是任务`id`，用于区分多个任务，不同任务之间请保持良好的缩进格式。每个任务包括：

  - name（任务名）
  - needs（任务执行的依赖顺序，可以是单独的任务 id，或者是包含任务 id 的数组，当某个任务需要在指定的任务之后执行时，需要设置 needs）
  - runs-on（运行环境，支持常见的服务器发行版，通常使用 ubuntu-latest）

- steps: 任务步骤，包含：

  - name：单个步骤名
  - uses: 使用他人的 action 脚本作为当前步骤的一部分，官方`强烈建议`我们在使用他人的 action 的时候指定 git 链接、SHA 或 Docker tag，这样能避免当他人的 action 更新时产生未知的行为，如下所示：

  ```yaml
  steps:
    # Reference a specific commit
    - uses: actions/checkout@a81bbbf8298c0fa03ea29cdc473d45769f953675
    # Reference the major version of a release
    - uses: actions/checkout@v2
    # Reference a specific version
    - uses: actions/checkout@v2.2.0
    # Reference a branch
    - uses: actions/checkout@main
  ```

  使用第三方 action 的时候也要阅读其`README`文档，以避免某些需要配置的数据缺失。

  - run: 执行某些操作系统 shell 命令，例如常见的`npm install`，如果有多个命令，可以这样写：

  ```yaml
  - name: install dependencies
  	run: |
  		npm ci
  		npm run build
  	working-directory: ./src
  ```

  `working-directory`是可选的，用于指定运行此命令的目录，不指定时将在根目录下运行。

  - shell: 指定 shell 类型，可以是`bash`、`pwsh（powershell 用于 windows server）`，甚至是你喜欢的`fish`或`zsh`，甚至是`python`环境！
  - with: 定义一系列的键值对数据作为环境变量使用，默认会添加前缀`INPUT_`，并且全部转化为大写字母。当 action 使用到 docker 的时候，可以设置 args 和 entrypoint 作为容器的输入，详情可查阅文档，此处不延伸。
  - env：env 也可以设置单独的环境变量，并且这些变量可以非常隐秘，我们可以通过设置仓库的`secret`选项来增加受保护的环境变量，例如：`GITHUB_TOKEN: ${{ secrets.TOKEN }}`可以读取`secret`中的`TOKEN`变量添加到整个项目中来 。

  - if : 添加条件，配合表达式可以实现很多功能，例如根据上一个任务是否成功而决定是否执行选定的步骤，举个例子：

  ```yaml
  steps:
    - name: My first step
      uses: octo-org/action-name@main
    - name: My backup step
      if: ${{ failure() }}
      uses: actions/heroku@1.0.0
  ```

  ​	这里就可以根据第一个步骤使用的结果来决定是否再使用另一个脚本。


### 发布一个 React 应用

现在，我的手头有一个名为`emoji_search_zh`的应用，在这个应用里我们可以通过搜索中文关键字去检索`emoji`字符，并且可以很方便的复制到剪贴板📋（听起来似乎有点鸡肋👦🏻）。

现在，一步步来部署：

#### 配置 homepage

当应用准备好部署时，将`homepage`添加到`package.json`上。

```json
"homepage": "https://<githubusername>.github.io/<app>"
```

> 注意替换掉账户名和应用名称，这个名称可以是仓库名

#### 启用 GitHub Pages

创建一个分支用于部署，例如：`gh-pages`:

`git checkout -b gh-pages`

> 创建分支有利于保持我们源代码和应用部署的独立性



#### 创建工作流 action





### 参考

- [GitHub Actions 快速入门 - GitHub Docs](https://docs.github.com/cn/actions/quickstart)
- [GitHub Actions 入门教程 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)
- 
