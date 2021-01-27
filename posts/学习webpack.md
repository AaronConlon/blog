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

2021年01月13日00:33:47 休息了,早起,尽量慢慢不要熬夜.

> webpack 是什么?

简单来说,webpack 是一个打包工具.

![](https://www.ma-no.org/cache/galleries/contents-1806/webpack-how-it-works.jpeg)

我们在创建为项目编写代码的时候,会用到非常多的素材和代码文件.但是类似`sass`或者`typescript`等技术需要通过一些必要的流程转化为构建项目的基础内容.

就像`sass`需要转为`css`文件,`typescript`需要转化为`js`代码,而`js`代码又遇到了新的问题.

`js`一直在不断发展,新的功能被国际化组织制定和推广开来,作为广大开发者之一,我很开心能使用`ECMAScript`的最新特性,这些特性为我提供了强力的功能,减少了我的日常开发工作量,提高效率,增强代码的`美感`和`可读性`.

举个例子,不同浏览器厂商对最新的`ECMAScript`标准支持度不同,对规范中少数并未声明的细节的技术实现也不尽相同,甚至,被广大开发者诟病的`IE`浏览器,在其`11`版本中连2015年制定的`ES6`规范都不支持(尽管有他自己的限制,我们也应该感激和尊重他),`IE 11`在今年8月份不再受微软的更新和支持,后续微软将转战`EDGE`.

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



#  LOADER

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

为了实现这一需求,我们需要三个关键`loader`:

- style-loader: 将 CSS 注入 DOM 中,详情: [style-loader | webpack](https://webpack.js.org/loaders/style-loader/)
- css-loader:  解释 `JS`中使用`esModule`的语法导入`CSS`文件的行为,支持替换`CSS`文件中的`@import`和`url()`使用`import/require()`来解析.详情:[css-loader | webpack](https://webpack.js.org/loaders/css-loader/)
- sass-loader: 转译`SASS`文件,这里提一下支持导入`node_modules`下的`CSS`文件,详情:[sass-loader | webpack](https://webpack.docschina.org/loaders/sass-loader/)

以及安装多个依赖:

```bash
npm install sass-loader sass style-loader css-loader --save-dev
```

每一个`loader`基本上都支持特定的配置,如果默认配置不支持开发者需要的功能特性,则推荐阅读`loader`官方文档寻求帮助.

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

`Sass`到`CSS`,再到`JS`,最后注入到`HTML DOM`中,添加`Style`元素,内部是样式.当然,如果想要单独打包,不注入到`head`元素内的`style`内,而是通过常见的`css link`发挥效用也是可以的.

# 缓存清理和插件

在开发的时候,如果相关资源的名字不变,浏览器端可能会直接从硬盘读取之前缓存的资源.例如,我们每次更新代码,重新构建的出口文件都是`main.js`,那么浏览器端可能会使用缓存,而不是每次都使用最新构建的版本.

在开发过程中,我们可能会经常看到一些带哈希值的文件名,例如:`main.jkdajkd2jdai2i.js`.

`webpack`支持输出大包的文件的时候,为出口文件提供随机的`hash`值,作为最终构建文件的文件名的一部分,这一现象非常常见.

让构建的输出文件名生成`hash`值并不复杂,可以直接在`webpack.conf.js`中配置.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // 入口点
  output: {
    path: path.resolve(__dirname, 'out'), // 输出目录, path库的api
    filename: 'main.[contenthash].js' // 输出构建文件名
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ]
  }
};
```

> webpack 的配置项丰富,也可以说成繁杂,仔细研究每一个配置项需要花费相应的时间和精力,必要时也许可以跳着看,看着形成一些印象,需要用的时候,再看也许能更快理解.

现在,生成的`output`文件,会自动带上`hash`值,我们不必担心浏览器的缓存问题了.

但是,看起来产生了新的问题.我们看看项目目录下的`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack learning</title>
</head>
<body>
  <h1>Start...</h1>
  <script src="./out/main.js"></script>
</body>
</html>
```

没什么问题,依然是引入了`output`打包生成的结果.只是由于我们自动生成了`hash`值,文件名变得难以记忆,且每次都不一样,这里必然是不能写死成`./out/main.js`.

`webpack`提供了`plugins`插件机制来解决这一类问题.`nodejs`可以开发一些脚本帮助开发者自动处理这些枯燥琐碎的问题.

请点开这里[Plugins | webpack](https://webpack.docschina.org/plugins/), `webpack`生态繁荣,插件繁多,这意味这绝大多数的日常开发问题,都能通过插件系统解决掉.如果你需要处理一些`webpack`构建相关的问题,不妨看看这里是否已经有了其他开发者提供的插件解决方案.

回到硬编码的`./out/main.js`的问题,插件[HtmlWebpackPlugin | webpack](https://webpack.docschina.org/plugins/html-webpack-plugin/) 为我们提供了一个解决方案.

先安装库:

```bash
npm install --save-dev html-webpack-plugin@next
```

这个插件能够很方便的创建自动链接了`bundles`的`HTML`文件.我们可以使用这个插件帮助我们自动更新具有`hash`值的`bundles`文件引用.在很多场景下都能看到例如`dist/index.html`的存在,且此文件内部`body`的最后面插入了一个`script`标签.如果你不止有一个`bunddle`,也能够都包含在`script`标签内.



并且,还可以创建一个`template`模版文件以供使用.

让我们来看看`webpack`的配置:

```js
const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // 入口点
  output: {
    path: path.resolve(__dirname, 'out'), // 输出目录, path库的api
    filename: 'main.[contenthash].js' // 输出构建文件名
  },
  plugins: [new HtmlWebpackPlugin({
    // 几乎每个插件都支持丰富的配置,默认情况下,此插件创建的index.html非常简单,对此
    // 开发者可以使用template文件代替,在template文件中添加通用代码,此插件会自动处理body最后的引入问题.
    template: "./src/template.html"
  })],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ]
  }
};
```

# 开发模式问题

切换不同的开发模式,为不同的开发模式添加不同的配置和针对性的功能非常常见.

有时候,我们创建了`webpack.dev.js`和`webpack.prod.js`以及`webpack.common.js`三个配置文件.通过名字就能理解三个文件的作用,并且通过第三方库和特定的`package.json`定制`scripts`,我们可以共用`common`的配置,并且根据不同的命令,使用不同的配置文件进行打包.

安装插件:

```bash
npm install --save-dev webpack-merge
```



现在创建这三个文件:

```js
// webpack.common.js
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 入口点
  plugins: [new HtmlWebpackPlugin({
    template: "./src/template.html"
  })],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ]
  }
};

// webpack.dev.js
const path = require('path');
const common = require("./webpack.common");
const { merge } = require("webpack-merge")
// 直接使用merge函数,合并两个配置对象
module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'out'), // 输出目录, path库的api
    filename: 'main.[contenthash].js' // 输出构建文件名
  }
}0;

// webpack.prod.js
const path = require('path');
const common = require("./webpack.common");
const { merge } = require("webpack-merge")
module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录, path库的api
    filename: 'main.js' // 输出构建文件名
  }  
});
```

就如同插件的名字关键字一样,`merge`合并多个配置.接着,直接修改`package.json`的`scripts`:

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "webpack --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
  "dependencies": {},
  "devDependencies": {
    "css-loader": "^5.0.1",
    "html-webpack-plugin": "^4.5.1",
    "sass": "^1.32.4",
    "sass-loader": "^10.1.1",
    "style-loader": "^2.0.0",
    "webpack": "^5.15.0",
    "webpack-cli": "^4.3.1",
    "webpack-merge": "^5.7.3"
  }
}
```

现在,使用`npm run dev`和`npm run build`则能根据不同的模式进行构建了. `webpack`官方支持同时导出不同的配置,但个人看来,我更喜欢这种`merge`多文件的形式.

# 热加载和开发服务器

如果你想要在本地开发的时候使用热加载的功能,修改代码的同时,自动进行构建和浏览器端的刷新.`webpack`依然存在很多可选的方案.

现在,来看看其中一种方案:

`webpack-dev-server`.

> 如果你有什么异常，请查看版本和官网说明，不同时间也许会有一定的差异。

我没看过这个库的源码,不过这个库需要做的配置非常简单,效果却出奇的好.

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "webpack serve --config webpack.dev.js --open", // 调用webpack-dev-server 打开浏览器
    "build": "webpack --config webpack.prod.js"
  },
  "dependencies": {},
  "devDependencies": {
    "css-loader": "^5.0.1",
    "html-webpack-plugin": "^4.5.1",
    "sass": "^1.32.4",
    "sass-loader": "^10.1.1",
    "style-loader": "^2.0.0",
    "webpack": "^5.15.0",
    "webpack-cli": "^4.3.1",
    "webpack-dev-server": "^3.11.2",
    "webpack-merge": "^5.7.3"
  }
}
```

此时，修改`./src/index.js`立刻就能看到浏览器刷新，终端也会提示重新构建消息。

# 处理图片

`webpack`只能识别`json和JavaScript`,我们经常使用的图片,无法通过默认功能进行打包和对`output`文件进行跟进处理,例如无法自动转换打包后的`index.html`中的图片属性的地址.

接下来使用的`loader`分别是:

- html-loader
- file-loader或者url-loader

依然是使用`npm`进行安装,编辑`webpack.common.js`配置文件:

```js
const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 入口点
  plugins: [new HtmlWebpackPlugin({
    template: "./src/template.html"
  })],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      },
      {
        test: /\.html$/i,
        // html文件只配置一个loader
        loader: 'html-loader'
      },
      {
        test: /\.(jpg|png|gif|jpeg|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'imgs',
            publicPath: 'cdn.example.com/static/imgs'
          }
        }
      }
    ]
  }
};
```

针对`html`文件,使用`html-loader`进行处理,这个`loader`能对`html`中的资源进行自动化的处理,使得`js`注入的图片资源,`html-loader`将`img`中的`src`属性值,通过导入资源的方式引入.

然后,我们需要配置一个新的`loader`去处理这些引入的资源.

针对不同图片资源,使用`file-loader`进行处理,使用这个`loader`能让我们可以在`module`中使用`esModule`或者`commonjs`的方式导入图片资源,然后通过`js`注入到`html`文件中.

针对性的`options`配置,可以实现开发者需要的效果,默认打包之后的资源名变成`hash`值,扩展名不变.我们可以设置增加一些名字,虽然上述配置中没有.

上述配置中,配置了打包之后,保存资源的输出目录的名字,和注入到最终`html`文件中.

> 每一个`loader`都有很多额外的可选配置,可以实现更多需求.

有时候,你可能会听到将图片资源转为`base64`编码字符串,直接写入`html`中去的说法.

> 将图片转成`base64`可以减少总体图片资源单独的`http`请求,这是一种优化速度的方式.

这个时候,则可以使用`url-loader`.安装之后,可以直接配置`webpack.common.js`:

```js
const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 入口点
  plugins: [new HtmlWebpackPlugin({
    template: "./src/template.html"
  })],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      },
      {
        test: /\.html$/i,
        // html文件只配置一个loader
        loader: 'html-loader'
      },
      {
        test: /\.(jpg|png|gif|jpeg|svg|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'imgs',
            publicPath: 'cdn.example.com/static/imgs'
          }
        }
      }
    ]
  }
};
```

将`file-loader`直接替换成`url-loader`,唯一需要在意的是资源大小`limit`的设置,默认`fallback`是让超过`limit`的资源,使用`file-loader`处理,且配置可以传递过去,上面的`outputPath`等依然对`file-loader`生效.

`url-loader`还可以单独指定回调的`loader`,如果你不想用`file-loader`,想用例如`responsive-loader`的话也是可以的.

# 多入口设置

之前谈论的配置中,一直使用单一的`entry point`,默认从`src/index.js`作为起点.

某些场景下,如果你需要多个`entry point`也是可以的 .

```js
// webpack.common.js
const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    // 多个,每个都让key作为最后打包注入的变量name
    main: './src/index.js',
    other: './src/other.js'
  }, // 入口点
  // ...other
};
// 修改 webpack.dev.js
const path = require('path');
const common = require("./webpack.common");
const {merge} = require("webpack-merge")

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'out'), // 输出目录, path库的api
    filename: '[name].[contenthash].js' // 输出构建文件名
  }
});
```

现在,打包的`index.html`内:

```html
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack learning</title>
  </head>

  <body>
    <h1>Start......</h1>
    <script src="main.3566bb7a2fe712fb86ed.js"></script>
    <script src="other.5cb71429ff79cddc2f96.js"></script>
  </body>

</html>
```

有时候,并不想让所有内容都写入`main.balabala.js`中,可以将独立的一部分打包到另一个入口文件,这也是一种需求衍生的解决方案.

> 多个单独的`link`或者`script`标签下,浏览器并行下载多个文件,时间取决于最大的那个文件,有时候可以对此进行优化速度.后续优化部分再提.

# 优化 CSS 引入方案

之前我们通过`import`或者`require`的方式引入`css`,并且用`js`的方式注入到最终`DOM`中去,创建`style`的`tag`.

有一个问题.

打包的`js`文件放在`body`的底部,那么`css`效果势必在最后才体现出来.并且`css`文件可以缓存,既减小了`bundle`的大小,又提高页面渲染的速度.

让我们回顾一下直接通过`link`引入单独的`css`的流程.

哦不,是来回顾一下浏览器渲染原理,我找了一篇非常好的博客文章.

[深入浅出浏览器渲染原理 · Issue #51 · ljianshu/Blog](https://github.com/ljianshu/Blog/issues/51)

现在,我们知道了,如果你的`css`不是非常小部分的内容的话,单独引入的优势`css`脱离整体,单独下载,能利用到浏览器多线程的优势,减少资源拉取的时间.

```js
// webpack.prod.js
// 生产模式,打包成单独的css文件
const path = require('path');
const common = require("./webpack.common");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require("webpack-merge")

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录, path库的api
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader, // 3. extract css into files
          'css-loader', // 2. turns css into commonjs
          'sass-loader' // 1. turns sass into css
        ]
      }
    ]
  }
});
```

可能会引发一些问题,例如单独的`css`文件太多,浏览器产生很多`http`请求,服务器方面需要做出非常多的响应,在用户量很大的情况下,也许不是一个良好的选择.

这个时候,合并一些`css`到一个`css`文件,让整体文件数量减少,单文件变大,只要比`chunk`包小,加载时间一般就不会超过主要的`js`文件.



> production 模式默认对构建内容进行压缩,开发模式则无所谓,一般不压缩.



# 兼容性选择

**兼容CSS**:

针对不同浏览器厂商的实现,我们可以用`postcss-loader`和`autoprefixer`增加样式前缀来实现一定程度的兼容.

```bash
# 安装
$ npm install --save-dev postcss-loader autoprefixer
```

配置`webpack.prod.js`:

```js
const path = require('path');
const common = require("./webpack.common");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require("webpack-merge")

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录, path库的api
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader, // 4. extract css into files
          'css-loader', // 3. turns css into commonjs
          'postcss-loader', // 2. autoprefixer
          'sass-loader' // 1. turns sass into css
        ]
      }
    ]
  }
});
```

先将`sass`转译,再用`postcss-loader`增加前缀.

另外创建`postcss.conf.js`指定插件为`autoprefixer`:

```js
// postcss.conf.js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

再修改`package.json`,增加浏览器支持度配置:

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "sideEffects": [
    "*.css",
    "*.sass"
  ],
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ],
  "scripts": {
    // 这里插一嘴,windows下不支持直接使用 rm 命令,因为scripts部分是给 Unix 系统写的,删除文件夹我使用了rimraf,先用npm install --save-dev rimraf安装. 
    "start": "webpack serve --config webpack.dev.js",
    "dev": "rimraf out && webpack --config webpack.dev.js",
    "build": "rimraf dist && webpack --config webpack.prod.js",
    "clean": "rimraf dist && rimraf out"
  }  
}

```

**兼容JS**:

还是因为不同浏览器厂商的支持度和实现不一的问题,且如果你想使用`ECMAScript`比较新的语法,而类似`IE`浏览器不支持,或者其他浏览器暂时不支持.

这时候需要使用类似`babel`这些工具对我们的`js`代码进行处理,增加`polyfill`.

**babel**转换的是语法,而不是`API`,只有引入了语法`polyfill`才能将新的`API`代码进行转换,让指定范围的运行环境稳定运行我们的代码.

> [Babel Doc](https://www.babeljs.cn/docs/): Babel 是一个工具链，主要用于将 `ECMAScript 2015+`版本的代码转换为向后兼容的JavaScript 语法，以便能够运行在当前和旧版本的浏览器和其他环境中.

安装`babel`依赖:

```bash
$ npm install --save-dev @babel/core @babel/preset-env @babel/plugin-transform-runtime babel-loader
$ npm install @babel/runtime @babel/runtime-corejs3
```

`babel7`支持多种配置类型,比如:

- babel.config.js

- .babelrc
- .babelrc.js
- .babelrc.json
- ...

`@babel/preset-env`是`babel`推荐的预设功能,内置了常用插件来支持`polyfill`,用户可以根据`target`指定环境去使用对应的插件.

`core.js`是一个`JavaScript标准库`的`polyfill`.`@babel/preset-env`依赖于`core.js`.

推荐单独创建一个`.babel.config.js`文件.

```json
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // 按需引入
        "useBuiltIns": "usage",
        // "targets": "defaults",  建议关于targets都使用package.json 中的browserslist配置.可以共用给postcss的插件.
        "corejs": 3 // version 3, 默认填充规范,可以开启填充提案.建议不优先使用体验语法,毕竟提案始终存在被放弃的可能性,这些提案依然需要时间和考验.
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime" // 用于减少代码体积,babel-loader的文档有介绍如何解决关键的两个问题,这是其中之一.使用此插件,预设polyfill不会直接注入到全局变量中.
    ]
  ]
}
```

`webpack`方面的配置:

```json
const path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    other: './src/other.js'
  }, // 入口点
  output: {
    filename: 'js/[name].[contenthash].js' // 输出构建文件名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        // html文件只配置一个loader
        loader: 'html-loader'
      },
      {
        test: /\.(jpg|png|gif|jpeg|svg|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'imgs',
            publicPath: 'cdn.example.com/static/imgs'
          }
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/, // 排除部分,提高速度
        use: {
          loader: 'babel-loader' // 指定loader,配置通过babel.config.js去设置
        },
      }
    ]
  }
};
```



也许你听过`babel`针对`stage-x`的支持度设置,但是在`babel7`后`preset-env`已经支持完全替换`babel-preset-es2015`~`babel-preset-latest`.

> 我觉得团队开发只应该使用纳入年度版本中的提案,暂未纳入年度版本中的特性存在着不会成为`js`一部分的可能性.



# 最后...

暂时写到这里,后续再根据项目进行分析和深入学习.



# 优化

这是一个很有意义的问题,需要我进一步配合项目进行深入学习,以下是我想到的一些知识点.

- 使用`ParallelUglifyPlugin`代替默认压缩插件
- 使用`swc`代替`babel`进行编译
- 使用`cdn`对部分资源进行引用,减小打包的大小.
- 使用缓存插件,减少不必要的重复打包.
- 使用动态导入机制,减小打包大小.



# 参考

- [What is Babel? · Babel](https://babeljs.io/docs/en/)

- [带你一步一步配置Babel7](https://juejin.cn/post/6844904132294213639)
- [browserslist/browserslist: 🦔 Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env](https://github.com/browserslist/browserslist)
- [[译]Babel文档之@babel/preset-env](https://juejin.cn/post/6844903937900822536)
- [一文搞懂Babel配置 - SegmentFault 思否](https://segmentfault.com/a/1190000038324347#)
- [babel 7：不仅是会用 - 知乎](https://zhuanlan.zhihu.com/p/131566326)