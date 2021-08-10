---
title: 'webpack-react-环境配置'
date: '8/8/2021'
tags:
- 工程化
mainImg: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mjg0MTc2NjE&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mjg0MTc2NjE&ixlib=rb-1.2.1&q=80&w=400'
intro: '一份手动配置的 react 开发环境配置记录📝。'
---

这份配置包括以下几点：

- babel presets
- webpack dev server
- Hot module replacement
- miniCssExtractPlugin
- postCss
- Eslint autofix + Prettier

## 初始化

```bash
yarn init -y
yarn add react react-dom
yarn add -D webpack webpack-cli webpack-dev-server@next
// init webpack config
npx webpack init
```

根据需求填写交互，最后得到配置文件`webpack.config.js`:

```js
// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;
const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: "css/[name].[hash].css",
      })
    );
  } else {
    config.mode = "development";
  }
  return config;
};

```

顺利安装后，我们就实现了需求，来分析分析这份配置文件：

- 根据 node 环境设置开发模式
- 使用`miniCssExtractPlugin`来单独提取`css`文件
- 使用`babel`处理`js`文件
- 自动配置`postCss`支持厂商前缀自动修复
- 安装`prettier`格式化代码，保证代码风格
- 默认初始化`scripts`，支持开发模式切换
- 支持`sass`的开发和编译

这是最基础的功能，`webpack-cli`就能很好的支持到。

接下来就是配置`babel`相关的特性，为了支持`react`的`jsx`写法，需要使用`@babel/preset-react`的功能：

首先务必安装`balel`一系列的包，并且配置好`.babelrc`:

```bash
yarn add @babel/core @babel/preset-env @babel/preset-react babel-loader
```

`.babelrc`:

```js
{
    "plugins": ["@babel/syntax-dynamic-import"],
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": {
                  "version": "3.16",
                  "proposals": false,
                },
            }
        ],
        "@babel/preset-react"
    ]
}
```

`@babel/preset-env`还要注意的一个点是代码预置需要一个`targets`，用于指定代码预置的目标，例如我们只需要支持到最新版本的`chrome`，我们可以通过`.browserslistrc`配置文件设置，`webpack-cli`会读取这个文件的配置，并且此文件还可以和多个库协作，例如`postcss`等第三方库都能无缝使用其配置。

如果不配置，则使用默认值。`npx browserslist 'default'`能够查看当前版本的默认值：

```bash
and_chr 92
and_ff 90
and_qq 10.4
and_uc 12.12
android 92
baidu 7.12
chrome 92
chrome 91
chrome 90
edge 92
edge 91
firefox 90
firefox 89
firefox 78
ie 11
ios_saf 14.5-14.7
ios_saf 14.0-14.4
kaios 2.5
op_mini all
op_mob 64
opera 77
opera 76
safari 14.1
safari 14
safari 13.1
samsung 14.0
samsung 13.0
```

详情可查看[browserslist/browserslist: Share target browsers ... - GitHubhttps://github.com › browserslist › browserslist](https://github.com/browserslist/browserslist)。

如此一来，我们便将代码预置环境和`polyfill`配置好了。

`@babel/preset-env`的`polyfill`方案会污染全局环境，并且相关的`helper`函数复用较差导致打包体积较大，但是由于目前并不需要开发库，因此在这里就不细究`@babel/plugin-transform-runtime`了。

## 代码检查

代码检查包括语法检查和代码风格检查，`eslint`负责主要语法检查，并且在代码风格方面使用`airbnb`的规范的同时，与`prettier`冲突的部分由`prettier`的规则决定。

最后，在代码提交之前进行`prettier`代码格式化。

首先来看看`prettier`和`eslint`的配置文件：

```js
// prettier
module.exports = {
  semi: true,
  singleQuote: true,
};

// eslint
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-console': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};
```

`.eslintrc.js`是通过`npx eslint --init`创建的，只是添加了`eslint-config-prettier`来消除`eslint`和`prettier`的冲突。

如此一来，代码在编辑的时候就能够支持到自动格式化和错误提示了。

补充一点，使用`stylelint`来规范我们的`sass`样式表。

首先需要安装：

`yarn add -D stylelint stylelint-scss`

针对性的，目前我只需要写一些单独的`sass`文件，因此只需要使用此插件来实现代码风格检查，如果后续需要写`styled-component`，则可以寻找其扩展。

另外，依然推荐使用[hudochenkov/stylelint-order: A plugin pack of order related linting rules for stylelint.](https://github.com/hudochenkov/stylelint-order)这个语法排序的插件，能够让我们的代码保持顺序和提高可读性，另外顺序的规则最好配合[ream88/stylelint-config-idiomatic-order: stylelint + idiomatic-css = ❤️](https://github.com/ream88/stylelint-config-idiomatic-order)使用。

最后，为了让`prettier`格式化的时候不跟`stylelint`冲突，我们需要：[prettier/stylelint-config-prettier: Turns off all rules that are unnecessary or might conflict with prettier.](https://github.com/prettier/stylelint-config-prettier)的支持，在`.stylelintrc`中添加最后一个扩展配置。

## Git 提交

最后是`在 git 提交之前格式化代码，并且规范化 git info body`。

我们将使用`lint-staged`和`husky`来实现这个需求。

一把梭：

`npx mrm@2 lint-staged`可以根据我们已经配置好的各种`linter`的配置，生成`package.json`中的`lint-staged`配置，调用各种`linter`去处理目标文件。

最后，还需要引入`commitlint`来规范提交的`git`信息。

全局安装好这个非常有用的工具，并且初始化一份简单的配置文件：

```bash
// install package
npm install -g @commitlint/cli @commitlint/config-conventional
// init config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

最后，我们手动添加一个`commitlint`的`hooks`:

```bash
# Add hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
# or
yarn husky add .husky/commit-msg 'yarn commitlint --edit $1'
```

## 优化

- Friendly-errors-webpack-plugin 优化输出信息
- [gitignore.io - 为你的项目创建必要的 .gitignore 文件](https://www.toptal.com/developers/gitignore)
- 其他

