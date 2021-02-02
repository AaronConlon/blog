---
title: '构建typescript练习环境'
date: '2021/1/31'
tags:
- typescript
- eslint
mainImg: 'https://images.unsplash.com/photo-1610609130068-99e276e85734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1610609130068-99e276e85734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '让我缩小处理的问题的范畴,从构建一个能将 typescript 代码转化为 JavaScript 代码的环境,并且支持 eslint 代码检查和使用 Airbnb 的风格编写代码.'
---

我试着缩小解决的问题的范围,不要考虑"太多细节",即使这些本来就没有什么细节,但是从我的水平来说,也许需要减小一些范围,以至于我能够快速处理问题,并且有一些思考和成果.

今天的问题是,如何使用`webpack`构建一个`typescript`联系环境,并且通过将`typescript`代码转为`ES6`的`JavaScript`代码,且运行环境是`node`.



# 实践

```bash
# 当前处于 test 目录
# 初始化 package.json
yarn init -y
# 创建文件和目录
mkdir src
touch src/index.ts
# 本地安装 webpack
yarn add -D webpack webpack-cli
# 安装 typescript
yarn add -D typescript
# eslint
yarn add -D eslint
# eslint init,npx 调用本地安装的 eslint
npx eslint --init
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser, node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · airbnb
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-airbnb-base@latest
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.8.0 || ^7.2.0 eslint-plugin-import@^2.22.1 @typescript-eslint/parser@latest
✔ Would you like to install them now with npm? · No / Yes
Installing @typescript-eslint/eslint-plugin@latest, eslint-config-airbnb-base@latest, eslint@^5.16.0 || ^6.8.0 || ^7.2.0, eslint-plugin-import@^2.22.1, @typescript-eslint/parser@latest

added 99 packages in 5s

29 packages are looking for funding
  run `npm fund` for details
Successfully created .eslintrc.js file in /Users/yi/test
# 现在初始化完成,自动生成了 eslint 的配置文件 .eslintrc.js
```

现在,来直接写一个`webpack` 配置文件,不使用 webpack cli 初始化配置文件是因为我想通过自己写一个来加深印象,并且不使用默认的`ts-loader`处理 `typescript`代码.

**我想用 swc-loader**.

当我开始创建并且编辑这个 js 配置文件的时候,我发现`eslint`已经开始审查这个文件了.

于是我在`package.json`里添加了`eslintIgnore`字段选项,不检查`js`文件:

```json
{
  "name": "yi",
  "version": "1.0.0",
  "description": "typescript enviroument",
  "main": "./src/index.ts",
  "license": "MIT",
  "devDependencies": {
    // something
  },
  "eslintIgnore": [
    "*.js"
  ]
}

```

继续编写`webpack`配置文件:

```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[contenthash].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        use: {
          loader: 'swc-loader',          
          options: {
            sync: true,
            jsc: {
              parser: {
                syntax: 'typescript'
              }
            }
          }
        }
      }
    ]
  }
}
```

如上配置指定`swc-loader`处理`ts`文件,并且解析语法是`typescript`.

接下来,`swc-loader`使用的是`swc`去将`ts`代码转成`JavaScript`代码,首先需要安装这些必要的库.

```bash
yarn add -D @swc/core swc-loader
```

现在,继续更新`webpack.config.js`文件内容:

```js
{
  "name": "yi",
  "version": "1.0.0",
  "description": "typescript enviroument",
  "main": "./src/index.ts",
  "license": "MIT",
  "devDependencies": {
    "@swc/core": "^1.2.47",
    "@typescript-eslint/eslint-plugin": "^4.14.1",
    "@typescript-eslint/parser": "^4.14.1",
    "typescript": "^4.1.3",
    "eslint": "^7.19.0",
    "eslint-config-airbnb-base": "^14.2.1",
    "eslint-plugin-import": "^2.22.1",
    "swc-loader": "^0.1.12",
    "webpack": "^5.19.0",
    "webpack-cli": "^4.4.0"
  },
  "scripts": {
    "dev": "webpack --config webpack.config.js"
  },
  "eslintIgnore": [
    "*.js"
  ]
}
```

当我构建的时候发现没有清除旧的打包文件,于是想到两个办法:

- 在 scripts 中使用 `rm -rf dist`作为`webpack`命令前置命令,删掉`dist`目录
- 使用 `clean-webpack-plugin`插件.

于是选用插件方案,因为`windows`下无法使用 shell 命令删除`dist`目录,`scripts`是为`Unix`系统准备的.

```bash
yarn add -D clean-webpack-plugin
```

接着,修改`webpack.config.js`文件:

```js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[contenthash].bundle.js',
  },
  devtool: "source-map", // 还加了 source-map,不过也许用不上
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        use: {
          loader: 'swc-loader',          
          options: {
            sync: true,
            jsc: {
              parser: {
                syntax: 'typescript'
              }
            }
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
}
```

现在,已经可以将`ts`文件打包成`js`文件了,但是还有几个问题需要解决:

- typescript 代码的配置,我想使用`ECMAScript`比较新的语法,编辑器无法给出提示,并且报错指出方法不存在.
- typescript 代码提示语法风格问题,有一些是我不想遵循 Airbnb 的风格的部分.
- 我想在保存的时候,编辑器自动格式化并且修复代码风格的问题.
- swc编译的JavaScript 文件是 es5 的内容,我不管 IE 浏览器是什么东西,只要能在新版的chrome 浏览器上运行就好,或者在较新的 nodejs 上运行良好就行.

# 解疑

> `tsconfig.json`文件中指定了用来编译这个项目的根文件和编译选项。

第一个问题,直接在根目录创建`tsconfig.json`文件,作为 typescript 的配置文件,增加指定 `target`的配置项.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "removeComments": true
  },
  "exclude": [
    "node_modules"
  ],
  "include": ["src/*.ts"]
}
```

关于`typescript`代码的针对性配置都在这里.这个知识点真的非常复杂的感觉,想要深入了解需要时间.

我看到`swc`核心开发者大佬说移植了`tsc`,因为原来的`tsc`太慢.所以,具体如何编译`ts`代码,是否沿用`tsconfig.json`的所有配置,我不清楚,如果你知道的话,请告诉我,非常感谢.

第二个问题比较简单,来看看`.eslintrc.js`:

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "no-console": 0
  },
};
```

这是我根据`eslint init`生成的,话说回来,想要使用自定义的额外规则,只需要在`rules`内逐一添加即可.

例如,默认 Airbnb 对 console.log 代码会警告,可以如上所述,取消警告.



第三个问题,首先要理解编辑器插件:`ESLint`插件的作用是让开发者在编码的过程中发现问题,而不是在执行中发现问题,`eslint`包如果不执行`cli`命令,是无法报告和修复不合规范的代码的.

`ESLint`插件可以.

首先保证安装好`ESLint`插件,并且安装好`ESLint`包,无论是本地还是全局,插件通过`eslint`包和配置文件去调用`cli`进行代码规范设置和修复.

> Integrates [ESLint](http://eslint.org/) into VS Code. If you are new to ESLint check the [documentation](http://eslint.org/).
>
> The extension uses the ESLint library installed in the opened workspace folder. If the folder doesn't provide one the extension looks for a global install version. If you haven't installed ESLint either locally or globally do so by running `npm install eslint` in the workspace folder for a local install or `npm install -g eslint` for a global install.
>
> On new folders you might also need to create a `.eslintrc` configuration file. You can do this by either using the VS Code command `Create ESLint configuration` or by running the `eslint` command in a terminal. If you have installed ESLint globally (see above) then run [`eslint --init`](http://eslint.org/docs/user-guide/command-line-interface) in a terminal. If you have installed ESLint locally then run [`.\node_modules\.bin\eslint --init`](http://eslint.org/docs/user-guide/command-line-interface) under Windows and [`./node_modules/.bin/eslint --init`](http://eslint.org/docs/user-guide/command-line-interface) under Linux and Mac.

上述文章中已经安装了`package`,设置了`.eslintrc.js`配置文件,接着需要打开`vscode`的个人`settings.json`配置文件,添加一下配置:

```json
{
    "[typescript]": {
    "editor.formatOnSave": true, // 保存后格式化
    "editor.autoIndent": "full",
    "editor.codeActionsOnSave": {
      "source.fixAll": true // 全局修复
    },
    // 默认格式化工具
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
}
```

自此,保存代码后就能根据`eslint`配置文件进行格式化和修复,对于懒癌晚期开发者来说实在是太有用了.

> 对于部分不想要使用 eslint 配置的代码,可以使用 eslint 的注释指明不需要 eslint 规范化.

例如:

```typescript
let a = 1 // eslint-disable-line
```

上述配置则不会强制以分号结尾,如果你的配置是必须分号结尾的话.更多注释看这里: [Configuration Files - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-file-formats).

最后一个问题是我觉得对新手朋友来说非常迷惑的一个问题.

为了前端兼容环境,我们经常需要做非常多的配置,自动添加`polyfill`代码来让不支持新方法和通用规范的部分环境(浏览器)在一份源码下有一致的表现.

拿`css`举例,由于老旧浏览器不支持一些新的`css`方法,之前我们需要手动添加浏览器前缀,于是我们可能会使用`postcss`和`autoprefixer`等方案去自动化实现一些需求.

而`JavaScript`方面,臭名昭著的`IE`浏览器,尤其是旧版本的`IE`浏览器对许多新规范并不支持,或者说根本就不打算支持.

> 无所谓.
>
> 微软服务将告别其古老的IE浏览器，在2021年8月17日停止对其365个应用程序的IE 11支持，同时也将在2021年3月9日结束对其legacy Edge浏览器的支持。

[browserslist/browserslist: 🦔 Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env](https://github.com/browserslist/browserslist)是一个解决方案.

可以创建其配置文件,或者在`package.json`中添加`browerslist`字段去设定支持范围,前端工具链大多数都愿意直接使用这里的指定环境去做一些自定义的代码注入和设置修改.

关键还是看各个开发者是如何规范自己的行为.

`swc`这里遵循`babel`的方案,实现了可以用来对比的效果.

但是在根据使用的新语法进行自动导入`polyfill`方面依然有待加强,目前需要开发者手动根据使用的新语法在入口文件处统一导入`polyfill`,依然不够.

当前任务只是设置目标环境为`ES6`,因此设置 `target`为新版本即可.

# Prettier 增强

由于`Airbnb JavaScript style guide`重点关注代码质量,而在代码风格方面关注度就降低了,于是`Prettier`趁虚而入说了句"这个我擅长".

二者其实依然有重合冲突的部分,为了让二者协调规范,需要使用`eslint-config-prettier`禁用掉跟`prettier`冲突的部分.

安装`package`:

```bash
yarn add -D eslint-plugin-perttier
```



只需要让`eslint-config-prettier`放在`extends`的末尾,由于执行顺序的关系就可以实现禁用冲突的部分.

看看`eslintrc.js`:

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "no-console": 0
  },
};
```



# 参考阅读

- [vscode中的 jsconfig.json - SegmentFault 思否](https://segmentfault.com/a/1190000018013282)
- [使用 VSCode + ESLint 实践前端编码规范 - SegmentFault 思否](https://segmentfault.com/a/1190000009077086)
- [browserslist/browserslist: 🦔 Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env](https://github.com/browserslist/browserslist)
- [Getting Started with ESLint - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/user-guide/getting-started)
- [Configuring swc | swc](https://swc.rs/)
- [@babel/preset-env · Babel](https://babeljs.io/docs/en/babel-preset-env#corejs)
- [搞懂 ESLint 和 Prettier - 知乎](https://zhuanlan.zhihu.com/p/80574300)

