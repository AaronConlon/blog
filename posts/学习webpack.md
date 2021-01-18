---
title: '学习webpack'
date: '2021/1/13'
tags:
- webpack
- 工程化
mainImg: 'https://images.unsplash.com/photo-1605507139485-d0a835ec559d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1605507139485-d0a835ec559d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '今天,我想要学习 ESNext 的知识,并且运用到我的工具库中去,创建 GitHub repo,但我依然需要一个靶场.学习 webpack 让我能轻松写 ESNext 代码,走在前头,工程化技术受用无穷.'
---

道阻且长,唯有坚持不懈,我等凡俗才能稍微靠近那些天才们.

2021年01月13日00:33:47 休息了,早起,尽量慢慢不要熬夜.

> webpack 是什么?

简单来说,webpack 是一个大包工具.

![](https://www.ma-no.org/cache/galleries/contents-1806/webpack-how-it-works.jpeg)

我们在创建为项目编写代码的时候,会用到非常多的素材和代码文件.但是类似`sass`或者`typescript`等技术需要通过一些必要的流程转化为构建项目的基础内容.

就像`sass`需要转为`css`文件,`typescript`需要转化为`js`代码,而`js`代码又遇到了新的问题.

`js`一直在不断发展,新的功能被国际化组织制定和推广开来,作为广大开发者之一,我很开心能使用`ECMAScript`的最新特性,这些特性为我提供了强力的功能,减少了我的日常开发工作量,提高效率,增强代码的`美感`和`可读性`.

举个例子,不同浏览器厂商对最新的`ECMAScript`标准支持度不同,对规范中少数并未声明的细节的技术实现也不尽相同,甚至,被广大开发者诟病的`IE`浏览器,在其`11`版本中连2015年制定的`ES6`规范都不支持(尽管有他自己的限制,我们也应该感激和尊重他).

开发者为了满足不同用户的需要,需要为不同浏览器做兼容性开发,于是不同的`polyfill`应运而生,加载了这些补充性的代码,我们终于可以使用一套`ECMAScript`规范进行开发.

> 懒惰使人进步.

我相信那些绝顶的技术大牛都是很懒惰的,这些重复繁杂且无趣的工作,就应该交给机器自动处理.于是乎,各种开发辅助工具和库出现了.

> 在技术的圈子里,技术是开发者被人尊敬的绝对原因之一. (个人观点)

聪明的应用`webpack`的功能,定制化自己和团队的配置,能让我们减少许多枯燥的工作内容,提高效率.

正如上面的那张图一样, `webpack` 可以对不同扩展名的文件针对性的进行处理,需要转化的就使用相应默认或者指定的工具或者功能去转化.

`webpack`功能强大,从项目初始化,到开发,规范化,功能定制和测试,资源管理和构建压缩都能通过独特的配置和其生态中庞大的资源来支持我们需要的功能,处理特定问题.

最后,打包出可以用于生产环境的资源.

话不多说,让我再次一步步学习使用`webpack`构建开发工作流和熟悉其工作原理.

# 安装使用

首先,创建一个学习目录,进入并且初始化项目,这里我使用`yarn`进行初始化,并且制定依赖为`-D`,使用开发依赖,在正式构建应用的时候不需要进行依赖.

```BASH
# 初始化项目,安装依赖
$ yarn init -y
$ yarn add -D webpack webpack-cli
# 本地仓库,增加.gitignore
$ touch .gitignore
```

 接下来看看`package.json`文件的内容:

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "webpack"
  },
  "dependencies": {},
  "devDependencies": {
    "webpack": "^5.15.0",
    "webpack-cli": "^4.3.1"
  }
}
```

当前`webpack`为`5.15.0`版本,在`scripts`这里写入了一个`dev`项,于是我们便可以使用`yarn dev`调用`webpack`了.

再次重申,`webpack`并未全局安装,而是安装在本地,你可以在`node_modules`目录中看到它,通过在`scripts`中调用`webpack`,会自动使用`npx webpack`进行处理.二者本质上无太大差别.这是`yarn`或者`npm`的机制.

`webpack`作为一个`CLI`,其默认支持了许多配置项,在最简单的情况下,可以直接使用其功能.不过我觉得除了演示其基础功能这种场景外,开发者都会增强和定制其配置.

> 默认`webpack`会将项目目录下的`src`目录内的`index.js`打包到`dist`下,重命名为`main.js`.

不要在默认机制上止步不前,继续.

# 基础配置

`webpack`支持使用配置文件进行定制化功能,通常,开发者们习惯命名第一个配置文件为`webpack.conf.js`.

我们不得不说,`webpack`的一切功能,都从一个`entry`开始,这个入口点指明了`webpack`应该从哪一个模块开始构建其内部依赖图谱.如上所说,这个`entry`默认是`src/index.js`.

默认的输出目录是`dist`目录,以及更多内容待续.首先需要明确的是:

**我们能定制这一切.**

来看看一个简单的`webpack.conf.js`,这个文件将会被`node`隐式载入运行:

```js
const path = require('path');

module.exports = {
  entry: './src/index.js', // 入口点
  output: {
    path: path.resolve(__dirname, 'out'), // 输出目录, path库的api
    filename: 'my-first-webpack.bundle.js' // 输出构建文件名
  }
};
```

接着,修改`package.json`的配置项:

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "webpack --config webpack.conf.js" // 指定了配置文件
  },
  "dependencies": {},
  "devDependencies": {
    "webpack": "^5.15.0",
    "webpack-cli": "^4.3.1"
  }
}
```

现在,进行构建:

```powershell
PS C:\Users\yy\test\webpack> yarn dev
yarn run v1.22.10
$ webpack --config webpack.conf.js
asset my-first-webpack.bundle.js 811 bytes [emitted] (name: main)
./src/index.js 49 bytes [built] [code generated]
webpack 5.15.0 compiled successfully in 75 ms
Done in 1.01s.

PS C:\Users\yy\test\webpack> ls .\out\

    Directory: C:\Users\yy\test\webpack\out

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           2021/1/17    15:13            811 my-first-webpack.bundle.js
```

现在,构建输出的到了目录`out`.命名也从`main.js`变成了我们指定的`my-first-webpack.bundle.js`.

想看看构建结果?

```js
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
eval("const a = () => console.log('a')\r\nconsole.log(a);\n\n//# sourceURL=webpack://webpack/./src/index.js?");
/******/ })()
;
```

入口点的代码非常简单,我定义了一个简单函数而已.`通常情况下`,你可能并不需要阅读构建之后的代码,并且构建之后的代码可读性实在是没法跟源码相比,上述构建内容还没压缩,压缩之后就更没法看了.



> webpack 默认只能识别`json`和`JavaScript`格式的文件.



#  Loader

为了对其他类型的文件进行处理和大包,`webpack`提供了`loader`功能.关于`loader`: 

loader 能将所有类型的文件通过特定插件和功能,将其转化为`webpack`能有效处理的模块,然后开发者就可以利用其大包功能进行打包.

`loader`有两个关键选项:

- test: 标识 loader 转换的目标文件,通常用正则表达式进行类型说明
- use: 使用哪个或者哪些`loader`

继续,那么如何处理我们前端开发绕不开的`CSS`问题?`webpack`如何处理这一切?`loader`可以吗?

# CSS & SASS

我个人喜欢`Sass`, 这项技术让我编写`css`的时候更轻松愉快.为了让`Sass`文件产生效果,需要做三件事:

- sass转译成css
- css转换成js
- js注入页面DOM,构建style

为了实现这一需求,我们需要三个`loader`:

- style-loader: 将 CSS 注入 DOM 中,详情: [style-loader | webpack](https://webpack.js.org/loaders/style-loader/)
- css-loader:  解释 `JS`中使用`esModule`的语法导入`CSS`文件的行为,支持替换`CSS`文件中的`@import`和`url()`使用`import/require()`来解析.
- sass-loader

以开发模式安装三个库之后,进行`webpack`配置:

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // 入口点
  output: {
    path: path.resolve(__dirname, 'out'), // 输出目录, path库的api
    filename: 'my-first-webpack.bundle.js' // 输出构建文件名
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader' // 注意顺序,后者先进行处理
        ]
      }
    ]
  }
};
```







# 



