---
title: "Babel 7: polyfill方案浅解 "
date: "2021/7/11"
tags:
  - Babel
mainImg: "https://images.unsplash.com/photo-1550482781-48d477e61c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYwMTE2Mzg&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1550482781-48d477e61c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYwMTE2Mzg&ixlib=rb-1.2.1&q=80&w=400"
intro: "前端工程化中，使用 babel 对新语法和 API 预置 polyfill 是非常流行的做法之一，但之前笔者对这个过程和其中使用到的插件不够了解，因此在网上搜寻了一些博客和知识分享，学习一番，再次总结一下。"
---

## 前言

本文将对`babel7`的语法转换和`polyfill`的相关知识进行分析，主要内容为`@babel/preset-env`和`plugin-transform-runtime`，Babel 7.4 之后不再推荐使用`@babel/polyfill`。

## Preset-env

> Preset-env 会污染全局环境。

babel 7 版本推荐使用`@babel/preset-env`代替以往的诸多`polyfill`方案，现今我们可以使用`preset-env`简单地实现语法和功能特性的需求。

> @babel/preset-env is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s).

可知，`preset-env`可以转换新语法，甚至可以配置转换新的`API`，通过配置其可选项来实现功能支持。

`@babel/preset-env`有三个常用的关键可选项:

- targets

- useBuiltIns
- corejs

### target

首先是`targets`，这个字段可以填写`browserslist`的查询字符串，官方推荐使用`.browserslistrc`文件去指明编译的`target`，这个配置文件还可以和`autoprefixer`、`stylelint`等工具一起共享配置。

所以某种程度上不推荐在`.babelrc`的`preset-env`配置中直接使用`targets`进行配置。

> 如果`preset-env`中指明`ignoreBrowserslistConfig`，则忽略`.browserslistrc`的配置项。

### useBuiltIns

其次是用于指定`polyfill`方案的`useBuiltIns`，其默认值是`false`，在不主动`import`的情况下不使用`preset-env`来实现`polyfills`，只使用其默认的语法转换功能。

> 如果使用默认值`false`，则应该避免在入口文件引入`polyfill`，使得打包体积过大。

但是如果我们需要使用其`polyfill`功能，则可以选择两种方式：

- entry
- usage

`entry`指的是将会根据浏览器目标环境(`targets`)的配置，引入全部浏览器暂未支持的`polyfill`模块，无论在项目中是否使用到。

先安装两个包：

```bash
yarn add core-js@3 regenerator-runtime
```

我们需要做的就是在入口处引入`polyfill`（或者在 webpack 配置文件中新增这两个包作为额外的入口）:

```js
import "core-js/stable";
import "regenerator-runtime/runtime";
```

对于项目开发来说，这种方案较为稳妥。尽管将浏览器暂不支持的模块全部引入可能会让某些项目中未使用的模块占据一定的额外体积，但是可以避免项目中引入的第三方库`polyfill`处理不当，导致引用异常。

其次，设置`useBuiltIns`的值为`usage`时，我们不需要手动在入口文件引入`polyfill`，`Babel`将会根据我们的代码使用情况自动注入`polyfill`，如此一来在打包的时候将会相对地减少打包体积。

`唯一的问题`:当项目中引入的第三方库有`polyfill`处理不当的情况下，将会出现引用异常的问题，使用社区广泛使用的流行库能降低这个风险。

### corejs

core-js 是完全模块化的 javascript 标准库。

推荐让浏览器的`polyfill`统一由`corejs`来管理。

> core-js v2 已经不再维护，推荐一致使用 v3 版本

我们来看一个使用`entry`的整体`preset-env`配置示例：

```js
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "80" // 推荐使用 .browserslistrc
        },
        "useBuiltIns": "entry",
        "corejs": {
          "version": 3, // 2 和 3 版本都需要手动安装库：yarn add core-js@3
          "proposals": false
        }
      }
    ]
  ],
  "plugins": []
}
```

> 笔者个人而言，不推荐使用 proposals 功能，只使用最新规范中的特性。

之后再在入口文件手动引入`polyfill`:

```js
import "core-js/stable";
import "regenerator-runtime/runtime";
// other code
```

## Plugin-transform-runtime

使用之前请安装库:

```bash
yarn add @babel/runtime //默认 corejs为 false，如果使用 core-js v3 的 runtime，则需要安装 @babel/runtime-corejs3
yarn add -D babel-plugin-transform-runtime
```

之前提过`preset-env`的`polyfill`会污染全局，作为项目开发无可厚非，但是如果我们在开发提供给其他开发者使用的`library`，我想我们不应该污染全局，并且应该提供更好的打包体积和效率。

> A plugin that enables the re-use of Babel's injected helper code to save on codesize.

`plugin-transform-runtime`可以主要做了三件事：

- 当开发者使用异步或生成器的时候，自动引入`@babel/runtime/regenerator`，开发者不必在入口文件做额外引入
- 提供沙盒环境，避免全局环境的污染
- 移除`babel`内联的`helpers`，统一使用`@babel/runtime/helpers`代替，减小打包体积

当使用此方案时，不需要在入口文件处手动引入`core-js`和`regenerator-runtime`。详细的配置项建议在需要用的时候查看官方文档。

## 总结

`@babel/preset-env`和`plugin-transform-runtime`二者都可以设置使用`corejs`来处理`polyfill`，二者各有使用场景，在项目开发和类库开发的时候可以使用不同的配置。

`不要同时为二者配置core-js的功能`，以免产生复杂的不良后果。

最后，让我们来看看两个场景下的`babel`配置项：

### 项目开发

`useBuiltIns`使用`usage`，尽量使用社区广泛使用的优质库以优化打包体积，不使用暂未进入规范的特性。`plugin-transform-runtime`只使用其移除内联复用的辅助函数的特性，减小打包体积。

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        // targets 官方推荐使用 .browserslistrc 配置
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3,
          "proposals": false
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false // 默认值，即使如此依然需要 yarn add @babel/runtime
      }
    ]
  ]
}
```

### 类库开发

类库开发尽量不使用污染全局环境的`polyfill`，因此`@babel/preset-env`只发挥语法转换的功能，`polyfill`由`plugin-transform-runtime`来处理，推荐使用`core-js@3`，并且不使用未进入规范的特性。

```js
{
  "presets": [
    [
      "@babel/preset-env",
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        },
        "useESModules": true
      }
    ]
  ]
}
```

总的来说，在配置开发环境的时候还是要参考官方文档的说明，这样才能减少出错的可能。

## 参考

- [@babel/preset-env · Babel](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)

- [@babel/plugin-transform-runtime · Babel](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)

- [吃一堑长一智系列: 99% 开发者没弄明白的 babel 知识](https://zhuanlan.zhihu.com/p/361874935)
