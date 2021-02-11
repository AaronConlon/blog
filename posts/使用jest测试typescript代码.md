---
title: '使用jest测试typescript代码'
date: '2021/2/11'
tags:
- jest
- typescript
mainImg: 'https://images.unsplash.com/photo-1579154392429-0e6b4e850ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1579154392429-0e6b4e850ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '由于在学习数据结构与算法,直接使用不开会员的 leetcode 已经没法满足我了,使用 JavaScript 代码进行编码似乎不如使用 typescript 更好,于是转用 typescript,并且此时需要一个测试框架对象代码进行测试,以此印证算法是否可行.于是我选择了 Jest.'
---

首先,这是一篇对构建 `typescript+jest` 代码环境的简单介绍,并不是进阶版本,如果你对`ts+jest`的测试知识已经有所了解,则不需在此花费时间.

让我们开始吧.

### 工具

- Nodejs
- yarn
- vscode

### 创建项目

`show me the code.`:

```bash
mkdir ts-jest-example
cd ts-jest-example
# 初始化 package.json
yarn init -y
# 安装依赖
yarn add -D typescript
# 配置 tsconfig.json 的 typescript 代码编译选项
npx tsc --init
```

然后可以使用`vscode`对`tsconfig.json`进行微调.

首先建议按`typescript`官方的建议,设置`include`和`exclude`目录,指定是否需要编译的部分代码.

创建输出目录`outDir`, 指定`rootDir`.

```json
{
  "compilerOptions": {
    "include": ["./src/**/*"],
    "exclude": ["node_modules"],
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "outDir": "./out",                        /* Redirect output structure to the directory. */
    "rootDir": "./src",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    "strict": true,                           /* Enable all strict type-checking options. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

接下来在`package.json`添加两个命令:

```json
...
"scripts": {
  "build": "tsc",
  "test": "jest"
}
...
```

### 编写案例

创建`./src/index.ts`文件并且导出`add`函数:

```typescript
export default function add(a: number, b: number): number {
  return a + b;
}
```

在日常的`webpack`构建流程中,并不是去测试构建的最终`js`代码,我们可以对未`build`的`typescript`代码进行测试,使用`jest`进行测试之前仍然需要一些基础配置.

针对`typescript`代码,我们使用`ts-jest`作为预处理器,让`jest`能测试使用`typescript`编写的项目.

```bash
# 安装
yarn add -D jest @types/jest ts-jest
# 创建 jest 配置文件
npx ts-jest config:init
```

现在,可以看到`jest.config.js`文件里的配置项如下:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

最简单版本,如果需要更多定制化的`jest`配置,建议查阅官方文档.

最后,针对上述的`add`函数编写简单测试用例,在根目录创建`test`文件夹,默认执行的是此文件夹下所有`*.test.ts`文件的测试内容.

```typescript
import add from "../src/index"

describe("test add function", () => {
  it("should equal 2 for add(1, 1)", () => {
    expect(add(1,1)).toBe(5)
  })
})
```

执行测试:`yarn test`即可在终端得到反馈信息.

> 函数式编程便于测试

反馈信息丰富,包括错误内容,错误位置和返回结果对比,耗时数据和通过条目展示等等.

> vscode eslint 对 describe 等变量告警提示未定义的解决方法.

安装 `eslint-plugin-jest`依赖,微调`eslint.config.js`:

```json
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:jest/recommended", // 使用推荐的设置
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": 0,
    "import/extensions": "off",
    "no-irregular-whitespace": ["error", { skipComments: true }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts"],
        moduleDirectory: ["src", "node_modules", "test"],
      },
    },
  },
};
```



### 总结

这是一篇非常简单的使用`jest`设置`typescript`代码测试环境的简介文章,针对`jest `的配置还有很多内容可以深入学习,今天除夕,就到此为止吧.

新年快乐,心想事成.