---
title: '测试-Jest测试环境配置'
date: '2020/12/9'
tags:
- Jest
- Test
- Configuration
mainImg: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '在学习TS的过程中,我经常需要对一些函数和代码段进行测试,一开始是直接运行测试,后来打算使用正经的测试框架进行测试,于是选择了Jest.即使有些函数和代码段并不正经.新的 Apple Mini 到货之后,我开始了环境配置,在此记录这个过程.'
---



在一切开始之前,我已经全局安装了`eslint`和`jest`.那么直入正题,上代码:

```shell
mkdir Demo && cd Demo
# 初始化
npm init -y
jest --init
# eslint 这里,选择了检查语法和修复,并且遵循 standard 的规范进行编码
eslint --init
```

> 如果需要显示覆盖率，则修改 package.json 的 test script,修改为: "test": "jest --coverage"

接着便按照`jest` 的文档,试着写一个用例.在`vscode`中出现了诸如 `describ` 和`test`等未定义的`eslint`警告.

接着,需要安装一款插件:[eslint-plugin-jest - npm](https://www.npmjs.com/package/eslint-plugin-jest),并且按官方文档进行配置,在 eslint 的配置文件这里增加插件项目:

```json
{
  "plugins": ["jest"]
}
```

以及添加规则,避免没必要的警告.

```json
{
  "rules": {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
}
```

其实也可以通过配置环境变量项目告知 eslint 部分变量已经由`jest`提供.依然是编辑`eslint`的配置文件.

```json
{
  "env": {
    "jest/globals": true
  }
}
```

> 可以通过修改 jest 的配置文件,自动生成 web 的测试覆盖率文档和详解.

接着,还需要支持`typescript`.

```shell
# 安装 ts 依赖和插件
npm i ts-jest @types/jest typescript @types/node --save-dev
# init ts config
touch tsconfig.json
# 如果全局安装了 tsc 则直接 tsc --init 即可创建初始化的 ts 配置文件
```

编辑配置文件 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": [
      "es2015"
    ],
    "strict": true,
    "declaration": true,
    "outDir": "build",
    "sourceMap": true
  },
  "include": [
    "src/**/*",
    "__test__/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

接下来这部分是我从`图雀社区`复制过来的.修改 `jest.config.js` 配置

添加如下配置项：

```
// An array of file extensions your modules use
moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
],
// A preset that is used as a base for Jest's configuration
preset: "ts-jest",
```

简单来说就是方便不用写引入的扩展名,以及为`ts`代码设置一个`preset`预处理,最后执行的是`js`代码.

自此,基础的`jest`测试环境配置完成,已经满足我小范围函数测试的需求了.