---
title: '创建一个支持commonjs和esm的混合npm包'
date: '2021/2/24'
tags:
- npm
mainImg: 'https://images.unsplash.com/photo-1613764225051-a4b7649e938c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1613764225051-a4b7649e938c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '如何创建一个同时支持 esm 和 commonjs 两种规范的混合包?'
---

我们如何能轻松地创建一个同时支持`ESM`和`Commonjs`规范进行引入的`NPM package`?

最好不需要创建两份源码,不需要使用诸如`webpack`之类的工具.

## 起始

这个问题由来已久,寻找一个使用单份源码创建一个轻松同时支持`Commonjs`和`ES Modules`的`NPM package`的解决方案可能会让人很迷惑.

> 同时支持`ESM`和`Commonjs`的`NPM Package`有时被开发者们称之为`Hybird package`,使用者可以轻松通过`import`或者`require`语法引入目标`package`.

对于这个话题,开发者们众说纷纭,我们可以在网上轻松找到众多相关话题和`"有效的解决方案"`,但是在许多场景下存在一定的缺陷.



许多方案需要使用`Webpack`或者`Rollup`等工具,甚至使用自定义脚本和其他构建工具,亦或是创建和维护使用`Commonjs`和`ES Modules`规范编写的双重源码库,然而大多数方案都无法生成高效的纯`ESM`代码.



阅读[Node documentation](https://nodejs.org/api/)的时候,文档提及我们可以使用`.mjs`和`.cjs`扩展名来标识当前文件使用的是`ES Modules`规范或者`Commonjs`规范.

### 扩展名方案的问题

在说明我们最后的方案之前,让我们先来谈谈一些备受吹捧的解决技巧.

> 为何不使用`.mjs`或者`.cjs`扩展名来表明内部代码规范?



`Node`支持源代码使用扩展名来标识源文件类型,乍一看当前特性合乎逻辑,扩展名的确通常用于标识文件类型.

但是,这个特性仅仅适用于简单或独立的非混合案例.



如果你需要编写一个`hybird`模块,并且使用了`.mjs`和`.cjs`扩展名特性,这意味着你需要编写两份针对不同规范的源代码,或者你需要使用第三方工具或者开发自己的工具去复制源码,并更改扩展名以及对不同源码进行适当的调整和修复,来满足使用此模块的开发者的引入方案.



`ESM`代码需要使用`import`关键字指明导入文件的路径.如果你从一个路径导入了具有`.mjs`扩展名的模块,那么则需要对代码进行一些微调才能在`.cjs`文件中引入此目标模块,反之亦然.

甚至,许多前端工具链之间都不能很好地支持`.mjs`文件,一些 web 服务器缺乏对`.mjs`类型文件的`MIME`类型定义.也许你喜欢的打包工具目前甚至不能识别这类扩展名文件.所以,你得编写额外的配置或者引入其他插件来管理这些文件.



### package.json type 属性的问题



> 还好,我们还有其他选择,例如设置`package.json`的`type`字段定义.



为了解析和判定`.js`文件是一个`ES Module`还是一个`Commonjs Module`,Nodejs 支持在`package.json`中设置`type`字段属性,根据此字段的值来约定`.js`文件依据的规范是什么.



如果`type`的值是`module`,则表明此项目下如若内部不包含其他层级的`package.json`,则所有的`.js`文件都遵循`ESM`规范,都是`ES Module`.

如果`type`的值是`commonjs`,则表明这些`.js`代码遵循的是`commonjs`规范.

> 通过显示设置`.cjs`或者`.mjs`后缀,可以覆盖此字段的声明.



如果你的`package`源代码始终遵循一种规范,使用此`package`的开发者只能使用此规范进行引入,则此方案将能够良好运行.

问题是当你想要开发一个`hybird`包,提供给开发者多种引入方案的选项,同时支持`ESM`和`Commonjs`规范的时候,这种方案并不不能简单满足我们的需求.

为了使用`type`特性来实现`hybird`包的开发,需要引入更多额外的工具,让整个开发过程更加的复杂.



### package.json 条件导出的问题

在`package.json`中使用`exports`条件导出可以定义一组入口点声明.

我们的目标是创建`hybird`包,则需要为`require`和`import`两种方案定义不同的入口点.

<h5 style="text-align: left;color: darkblue">package.json</h5>

```json
{
    "exports": {
        "import": "./dist/mjs/index.js",
        "require": "./dist/cjs/index.js"
    }
}
```

使用构建或者编译工具,我们使用一份源代码生成了两份打包文件来支持`ESM`和`Commonjs`引入.

上述的`exports`属性指定了不同规范的加载入口点.

