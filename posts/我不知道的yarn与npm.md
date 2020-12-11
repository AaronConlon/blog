---
title: '我不知道的yarn与npm'
date: '2020/12/12'
tags:
- yarn
- npm
mainImg: 'https://images.unsplash.com/photo-1575325345079-cce3a789be43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1575325345079-cce3a789be43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: 'Js开发避不开的包管理工具选择,谁能更胜一筹?2020年都快结束了我是否还对包管理工具一无所知,不好意思,接下来我选择坚持使用...'
---

前几天我的 apple mini 到了,开箱愉快,对着 m1 架构的新设备,一顿操作和配置,其中过程不再细说.在我准备学习`electron`的时候,我发现我根本不懂`npm`和`yarn`,我只是在简单的使用着这哥俩.

> 这是不行的.

`npm`和`yarn`都是前端的包管理工具,二者的区别毫无意义,总之一句话"选择其一作为你的包管理工具".

### 启程

`npm/yarn init -y` 二者都会构建默认的`package.json`文件,区别在于:

```shell
# npm
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
# yarn
{
  "name": "test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

### 提速

`npm`和`yarn`默认都使用官方的源,服务器在国外,速度肯定慢,而且时不时被墙,让人恼火却又无可奈何.如果你善用梯子且梯子牢固稳定当我没说.

> 国内源:一般是间隔十分钟同步一次国外的源的数据,不支持发布自己的包.

为了提速,有很多方法,比如:

- 临时提速

- 全局提速

  

#### 临时提速

```shell
npm install axios --registry=https://registry.npm.taobao.org
```

#### 全局提速

可以全局安装`yrm`来管理包的源配置.

```shell
npm i -g yrm
```

> [i5ting/yrm: YARN registry manager, fast switch between different registries: npm, cnpm, nj, taobao](https://github.com/i5ting/yrm)

行吧,`yrm`居然是[i5ting (狼叔)](https://github.com/i5ting)写的...腾讯开发者大会上聊过,多希望能...停停停.

`yrm`可以快速切换`registry`,还能测试各个仓库源的大致速度.

```shell
 ~/p/test yrm test

  npm ---- 5264ms
  cnpm --- 893ms
* taobao - 597ms
  nj ----- Fetch Error
  rednpm - Fetch Error
  npmMirror  Fetch Error
  edunpm - Fetch Error
  yarn --- Fetch Error

 ~/p/test 
```

> 不太推荐 yrm,只因这货会直接重写当前用户目录下的.yarnrc 和 .npmrc 配置文件.

如果仅仅需要快速换源,确实有用.但是当你用户目录下的配置文件有多个自己常用的配置的时候,就不合适了,毕竟一把梭重写配置文件.



### 纠错

`npm`和`yarn`都支持`--verbose`输出详细信息,可以发现许多错误.

这里提一下,有些情况下使用国内的源依然会出现部分下载 404 的情况.当你下载的模块依赖于`C++`模块需要编译,这时候通过`node-gyp`来编译,这货第一次编译依赖`node`源码,默认去`nodejs.org/dist`下载,一旦你的网络不稳定,还是凉凉.所以,可以在安装的时候指定`--disturl`,或者在配置文件里配好`disturl`即可.

### 配置

> tip: 命令行配置默认写入到~/.npmrc

可以直接从`cli`命令行配置,例如上述的`disturl`:

```shell
npm config set disturl https://npm.taobao.org/mirrors/node
```



命令行配置有一个问题,举例:

```shell
npm config set aaa bbb
```

照样直接写入配置文件并输出设置成功信息...惊了.所以当你把`disturl`写成`disurl`,出错也是必然的.



也可以直接编辑配置文件,配置文件则有多个可以生效.跟很多`unix`的配置文件的一贯作风一样.如下层级依次生效:

- 工程内配置文件: `/path/to/my/project/.npmrc`

- 用户级配置文件: `~/.npmrc`

- 全局配置文件: `$PREFIX/etc/npmrc` (即`npm config get globalconfig` 输出的路径)

- npm内置配置文件: `/path/to/npm/npmrc`

我个人用户级配置文件用得多一点,上面提到的`yrm`也是直接改这个文件的配置.

### 代理

不谈代理,建议肉身翻走.

### 缓存

我使用`npm 7.0.15`和`yarn 1.22.10`,安装模块默认就缓存模块到相关的目录下了,下次安装的时候也...默认不会管你的缓存.

`npm`的缓存机制支持`add`,`clean`和`verify`,前者用于添加和清理缓存,最后用于验证数据有效性,顺便清理垃圾数据.



> npm cache add: This command is primarily intended to be used internally by npm, but it can provide a way to add data to the local installation cache explicitly.



即使可以通过`npm config get cache`得知缓存存放地址(大概位置,内部_cacache 目录一言难尽),也没法看缓存了那些包和版本号等信息,如果你知道请告诉我,多谢.

于是,我打算以后都用`yarn`了...

`yarn`支持:

```shell
yarn cache dir/list/clean
```

可以看缓存的位置和直接 `list`包,还能看到版本信息,比较方便.

利用缓存数据牵扯到包管理的其中一个功能:`离线安装`.离线安装支持三个选项:

- --prefer-online (default)
- --prefer-offline
- --offline

如果你之前缓存了部分包,后续还需要在别的`project`下安装依赖的话.默认走线上优先.三个选项无需解释,如果不指定版本,默认安装最新版.`offline`选项本地无缓存直接显示失败.

### 发布

如果要发布自己的包,则需要注册`npmjs`账号,并修改`registry`为默认源.

如果你发布之后发现有一些细微的修改,需要单独提交单个文件,不好意思不行,只能版本升级:

```bash
#小版本号升级一个版本
npm version patch
#中版号升级一个版本
npm version minor
#大版本号升级一个版本
npm version major
```

最后再`npm publish`.



### 更多参考

- [2018 年了，你还是只会 npm install 吗？](https://juejin.cn/post/6844903582337237006#heading-22)

- [npm 模块安装机制简介 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2016/01/npm-install.html)

