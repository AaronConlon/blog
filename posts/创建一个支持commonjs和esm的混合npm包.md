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

但是,如果我们在`package.json`中指定了`type`的值为`module`,并且为`ESM`和`Commonjs`定义不同的入口点,并且入口点代码中使用了`require`引入其他的模块,则将会失败,因为子模块是根据`type`的值来约定文件内部规范的.



换句话说,如果一个`Commonjs`包从`./dist/cjs/index.js`引入了此模块,但是`./dist/cjs/index.js`却通过`require`引入其他模块,如此一来下一级的子模块引入的内容将根据`package.json`的`type`值进行判定模块所遵循的规范是什么.

显而易见,当前`type`等于`module`,则下一层级是无法使用`ESM`禁止的`require`字段,最终引起错误.



### 最终方案

ok,让我们重新捋一遍目标需求:

- 仅使用一份基础源码
- 易于构建
- 生成原生的 ESM 代码
- 在不需要更多额外工具的情况下使用
- 生成同时支持`ESM`和`Commonjs`规范的`hybird`包



👇 下面进行实践演示:

以下是项目结构:

```bash
.
├── clear.js
├── dist
│   ├── cjs
│   └── mjs
├── fixup.js
├── jest.config.js
├── package-lock.json
├── package.json
├── readme.md
├── src
│   └── index.ts
├── test
│   └── example.test.ts
├── tsconfig-base.json
├── tsconfig-cjs.json
└── tsconfig.json
```

由于源码使用`typescript`进行编写,这里简述`typescript`的配置文件:

- tsconfig.json
- tsconfig-base.json
- tsconfig-cjs.json

```json
// tsconfig.json, 针对 esm 规范
{
  "extends": "./tsconfig-base.json", 
  "compilerOptions": {
    "target": "ESNext",
    "module": "esnext",
    "outDir": "dist/mjs"
  }
}
// tsconfig-cjs.json, 针对 Commonjs
{
  "extends": "./tsconfig-base.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist/cjs",
    "target": "ES6"
  }
}
// tsconfig-base.json 共享配置
{
  ...
}
```



**核心代码**为: `src/index.ts`:

```typescript
function arrayShuffle(params: any[]) {
  let len = params.length;
  while (len > 1) {
    const index = Math.floor(Math.random() * len--);
    // eslint-disable-next-line no-param-reassign
    [params[len], params[index]] = [params[index], params[len]];
  }
  return params;
}

export { arrayShuffle };
```

简单导出了一个数组的工具函数,对数组元素进行重新排序.

对这份源码进行编译构建,一份构建为`ESM`模块,一份构建为`Commonjs`模块.以下是`package.json`中关键的构建`scripts`:

```json
{
    "scripts": {
        "build": "node clear.js && tsc -p tsconfig.json && tsc -p tsconfig-cjs.json && node fixup.js"
    }
}
```

为了让`windows`用户获得一致性体验,这里不使用`rm`命令对`dist`进行清理.

以下是上述内容提及的两个脚本:

- clear.js: 清理`dist`内部文件
- fixup.js: 为构建好的`dist`内不同目录下的`package.json`设置不同的`type`属性值.

`fixup.js` 的作用是创建`dist/cjs/package.json`和`dist/mjs/package.json`文件,为两种引入方案定义内部`type`.

```json
// dist/cjs/package.json
{
    "type": "commonjs"
}
// dist/mjs/package.json`
{
    "type": "module"
}
```

关于`package.json`文件:

```json
{	
  ...
  "scripts": {
    "test": "jest",
    "build": "node clear.js && tsc -p tsconfig.json && tsc -p tsconfig-cjs.json && node fixup.js",
    "lint": "eslint ./src/*"
  },
 	...
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js",
      "import": "./dist/mjs/index.js"
    }
  }
}

```

不必添加`type`属性,在使用`fixup`脚本的时候,我们将它写入了不同目标规范的子目录内的`package.json`中了,另外还定义了一个导出映射对象:

```json
"exports": {
    ".": {
        "import": "./dist/mjs/index.js",  // ESM 
        "require": "./dist/cjs/index.js"	// Commonjs
    }
}
```

## 总结

综上所述,我们最终构建了一个`hybird`包,同时支持不同开发者的不同引入方案.

开发者可以选择`import`或者`require`两种方案引入我们的包.

```js
// ESM
import { arrayShuffle } from 'shuffle-my-array';
// 或者
// commonjs
const { arrayShuffle } = require('shuffle-my-array);
```

参考此方案,你可以轻松使用`ESNext`或者`Typescript`进行开发编写一份源码,最终构建特定的`hybird package`.



## 参考文章

- [How to Create a Hybrid NPM Module for ESM and CommonJS. | SenseDeep](https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
- [Get Ready For ESM. JavaScript Modules will soon be a… | by Sindre Sorhus | Jan, 2021 | 🦄 Sindre Sorhus’ blog](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77)
- [Hybrid npm packages (ESM and CommonJS)](https://2ality.com/2019/10/hybrid-npm-packages.html)
- 源码: [youyiqin/array_shuffle: It's a awesome function to help you to reorder your array elements.](https://github.com/youyiqin/array_shuffle)

