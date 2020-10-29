---
date: "2020/7/2"
title: "Nodejs学习基础 - 1"
tags:
  - Nodejs
  - Javascript
author:
  name: Tim Neutkens
ogImage:
coverImg: "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2378&q=80"
intro: "首先,可以使用`writeHead`设置响应头部,然后根据请求信息,可以读取数据库或者本地文件,获取资源并且设置相关的逻辑代码,返回不同类型的数据.并且,可以在做相关操作之前,记录相关信息,也许这就是中间件的来源."
---

起源于晨读: [Koa.js 设计模式-学习笔记 · GitBook](https://chenshenhai.github.io/koajs-design-note/)

Koa.js 是极简风的 node web 框架,提供了以下服务:

- HTTP 服务
  - 处理 Request
  - 处理 Response
- 中间件容器
  - 中间件加载
  - 中间件执行

其他的 web 服务的功能由开发者自由开发.

首先,学习 Koa.js 的原理.

### 学习准备

- nodejs 基础
  - http/2 模块
  - fs 模块
  - path 模块
  - buffer 类型
- ES 的 Promise 和 async/await
- HTTP 协议
- Cookie 和 session/jwt

#### Nodejs 基础

##### http/2 模块

 本来打算学习 http.js,但是在官网看到 v2 版本已经出现,并且支持 push 资源的刚需,浏览器方面 ie11 的支持度只限制为 windows10,其他浏览器全面支持,基于时间和精力的关系,决定从[http2 | Node.js API 文档](http://nodejs.cn/api/http2.html)学习 http/2.js.

`nodejs`官方说没有已知的浏览器支持非加密 http/2,指的是 http/2 必须使用 https 协议传输.

初次学习 http/2 模块,一头雾水,还是直接记录下简单的 server / client code 吧.

```js
// server
const http2 = require("http2");
const fs = require("fs");

const server = http2.createSecureServer({
  key: fs.readFileSync("localhost-privkey.pem"),
  cert: fs.readFileSync("localhost-cert.pem"),
});
server.on("error", (err) => console.error(err));

server.on("stream", (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    "content-type": "",
    ":status": 200,
  });
  stream.end("<h1>Hello World, from youyi</h1>");
});

server.listen(8443);

// client

const http2 = require("http2");
const fs = require("fs");
const client = http2.connect("https://localhost:8443", {
  ca: fs.readFileSync("localhost-cert.pem"),
});
client.on("error", (err) => console.error(err));

const req = client.request({ ":path": "/" });

req.on("response", (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding("utf8");
let data = "";
req.on("data", (chunk) => {
  data += chunk;
});
req.on("end", () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

对于`服务端`来说,HTTP2 需要使用证书以支持 https 协议,所以在创建实例的时候需要使用`createSecureServer`方法,并且制定 openssl 生成的 key 和 cert 文件.并且对错误进行监听,对数据流进行监听.

`客户端`这边则指定了 ca 公钥证书.并且通过 client 实例建立 request,监听响应并且输出.

另外,阅读了[molnarg/node-http2: An HTTP/2 client and server implementation for node.js](https://github.com/molnarg/node-http2)的代码.

###### 资源

- [Node HTTP tutorial - creating HTTP server and client applications in JavaScript with HTTP module](http://zetcode.com/javascript/http/) 墙裂推荐
- [Node.js 之 HTTP/2 服务器推送](https://blog.fundebug.com/2018/03/27/nodejs-and-http/)
- [深入学习 Node.js Http | 全栈修仙之路](https://semlinker.com/node-http/)
- [HTTP 传输解析 | Node.js](https://nodejs.org/zh-cn/docs/guides/anatomy-of-an-http-transaction/)

##### http

但是看了上面墙裂推荐的文章之后,还是决定写一篇 http 的笔记.

```js
const http = require("http");
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ now: new Date() }));
    res.end();
  })
  .listen(8000);
console.log("监听8000端口");
```

首先引入 http 库,创建 server 的实例,通过传入一个函数作为参数,内部会调用 Server 构造函数处理,详细内容暂时理解不深不写.

`res`就是响应对象,可以写入头部`writeHead`或者使用`write`写入 body.通过`end()`把响应发送到客户端.

这里有两个非常重要的参数,`req`和`res`.通过设置属性,解析属性,我们可以得到请求和响应的数据.

###### request

可以使用`url`这个库解析请求的 url,详情 api 见[defunctzombie/node-url: node.js core url module as a module](https://github.com/defunctzombie/node-url),示例代码如下:

```js
const url = require("url");
const query = url.parse(req.url, true).query;
```

服务端可以根据`request url`的不同,做不同的响应.

###### response

首先,可以使用`writeHead`设置响应头部,然后根据请求信息,可以读取数据库或者本地文件,获取资源并且设置相关的逻辑代码,返回不同类型的数据.并且,可以在做相关操作之前,记录相关信息,也许这就是中间件的来源.

除了设置服务器相关逻辑,`http`包也可以当客户端使用,例如:

```js
const https = require("https");

let payload = JSON.stringify({
  name: "Peter",
  age: 34,
});

let headers = {
  "Content-Type": "application/json",
  "Content-Length": Buffer.byteLength(payload, "utf8"),
};

let options = {
  host: "httpbin.org",
  port: 443,
  path: "/post",
  method: "POST",
  headers: headers,
};

let reqPost = https.request(options, (res) => {
  console.log("status code: ", res.statusCode);

  res.on("data", (chunks) => {
    process.stdout.write(chunks);
  });
});

reqPost.write(payload);
reqPost.end();

reqPost.on("error", (err) => {
  console.error(err);
});
```

通过设置请求头/payload 数据/options 等,发送常见类型的 http 请求并且监听响应和 error.响应数据如下:

```js
status code:  200
{
  "args": {},
  "data": "{\"name\":\"Peter\",\"age\":34}",
  "files": {},
  "form": {},
  "headers": {
    "Content-Length": "25",
    "Content-Type": "application/json",
    "Host": "httpbin.org",
    "X-Amzn-Trace-Id": "Root=1-5f026c2d-18bf347276986d1cddfb0eba"
  },
  "json": {
    "age": 34,
    "name": "Peter"
  },
  "origin": "113.92.75.186",
  "url": "https://httpbin.org/post"
}
```

###### EventsEmittes

nodejs 核心 api 常用于构建异步事件驱动框架,触发器`emitter`触发后调用监听函数`listener`.

所有能触发事件的对象都是`eventEmitter`类的实例.都有一个`eventEmitter.on()`函数,用于绑定`listener函数`到事件上.当`eventEmitter`对象触发一个事件的时候,同步调用该事件上所有的`listener`函数.但是`listener`函数的返回值是会被丢弃的.

举个例子:

```js
const EventEmitter = require('events');
const shortid = require('shortid');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发事件, 生产随机数', shortid.generate());
});
myEmitter.setMaxListeners(10)
myEmitter.emit('event');
setInterval(() => myEmitter.emit('event'), 500);

// 输出
触发事件, 生产随机数 mo3lJdk6M
触发事件, 生产随机数 3MRZ1a7H6r
触发事件, 生产随机数 HRKu7R-OC
触发事件, 生产随机数 fqKieIMqvq
触发事件, 生产随机数 Y7ZfEnLpw
触发事件, 生产随机数 l0j4RF6R9s
触发事件, 生产随机数 FZpfibLHc
触发事件, 生产随机数 zun0MU-iqj
触发事件, 生产随机数 xBdd3F3R9
```

并且,可以传参数给`listener`,listener 如果不是箭头函数,则内部的`this`指向触发器的实例.

`listener`函数支持异步和处理一次性事件,举例:

```js
const myEmitter = new MyEmitter();
myEmitter.on("event", (a, b) => {
  setImmediate(() => {
    console.log("异步地发生");
  });
});
myEmitter.emit("event", "a", "b");

// 一次性事件
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once("event", () => {
  console.log(++m);
});
myEmitter.emit("event");
// 打印: 1
myEmitter.emit("event");
// 不触发
```

当然,也支持处理错误事件:

```js
const myEmitter = new MyEmitter();
myEmitter.on("error", (err) => {
  console.error("错误信息");
});
myEmitter.emit("error", new Error("错误"));
// 打印: 错误信息
```

错误打出之后,nodejs 就崩了.

对于异步的`listener`,需要在初始化 Emitter 的时候添加 options 对象:

```js
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on("something", async (value) => {
  throw new Error("kaboom");
});

ee1.on("error", console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on("something", async (value) => {
  throw new Error("kaboom");
});

ee2[Symbol.for("nodejs.rejection")] = console.log;
```

也就是说,如果为异步补货添加了`ee2[Symbol.for('nodejs.rejection')]`函数,当收到一个 reject 的 promise 的时候就调用这个函数,否则就调用 error 事件处理函数.event 模块后续单独学习.

##### fs 模块

我认为是`file system`,这样好记一些.`fs`模块负责同步和异步的文件 IO 操作.其中有一些常用 API 需要学习:

- fs.readFile
- fs.writeFile

###### 读与写

首先介绍`老方法`:

`fs.readFile`是异步读取文件内容,其语法如下:

```js
fs.readFile(fileName, [, option], callbackFunc);

// 实例
const fs = require("fs");
fs.readFile("package.json", { encoding: "utf8", flag: "r" }, (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

由于是异步操作,回调函数内如果做一些副作用的操作,则有影响.毕竟无法简单的在回调的异步函数中返回值.第二个参数默认是一个对象,如上所示.在一些特殊情况下可以替换`encoding`来处理乱码问题.如果第一个参数是个目录,在 windows\macOs\Linux 上返回`error`,FreeBSD 则不同,依然能得到一个关于目录的数据内容.如果在开发上要实现跨平台,则应该考虑到这一点.

> fs.readFile 缓冲整个文件内容到内存,如果文件较大,则使用 fs.createReadStream 流式传输的方案更好一点.

`fs.writeFile`则是异步写入文件,如下所示:

```js
const fs = require("fs");

const data = "keep learning......\n";
fs.writeFile(
  "result.txt",
  data,
  {
    encoding: "ucs2",
    flag: "a+",
    mode: 0o666,
  },
  (err) => {
    if (err) throw err;
    console.log("写入成功");
  }
);
```

`encoding`支持列表如下:

- ascii
- base64
- hex
- ucs2/ucs-2/utf16le/utf-16le
- utf8/utf-8
- binary/latin1 (ISO8859-1, latin1 only in node 6.4.0+)

`mode`必须是 32 位无符号数.

关于系统读写,总是跟写入`权限`,`编码`,`读写模式`有关,不同系统的权限设计不同,但如果想设计针对性的读写逻辑,就必须考虑这些问题,做好足够的异常处理和错误日志记录,便于事后分析和达成警示效果.

还有一种情况,如果写入的内容不是字符串,而是字节流,则`忽略编码`.

```js
const data = new Uint8Array(Buffer.from("js is cool."));
fs.writeFile("result.txt", data, (err) => {
  if (err) throw err;
  console.log("写入成功");
});
```

回过头来说写入的内容,可以是以下几种:

- string
- Buffer
- TypeArray
- DataView

后三种甚至可以单独列出来说.这里提及`二进制数组`.例如,js 如果要跟显卡通信,实时数据交互非常大,文本格式的交互在速度上远远不如二进制直接交互.`二进制数组`可以由三类对象组成:

- ArrayBuffer
- TypeArray
- DataView

于是又回到上述写入的 data 选项上去了.

###### ArrayBuffer

指的是内存之中的一段二进制数据,这段数据通过`视图 view`操作内存.

###### TypeArray

包括 9 种类型的视图: [TypedArray - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

```js
// 下面代码是语法格式，不能直接运行，
// TypedArray 关键字需要替换为底部列出的构造函数。
new TypedArray(); // ES2017中新增
new TypedArray(length);
new TypedArray(typedArray);
new TypedArray(object);
new TypedArray(buffer [, byteOffset [, length]]);

// TypedArray 指的是以下的其中之一：

Int8Array();
Uint8Array();
Uint8ClampedArray();
Int16Array();
Uint16Array();
Int32Array();
Uint32Array();
Float32Array();
Float64Array();
```

具有相同类型的视图读写简单的二进制数据.

###### DataView

dataView 则是复杂的 typeArray,可以定义多种类型的复合视图,操作复杂的二进制数据.

这三个对象的实际应用,先在此按下不表.

> nodejs 中的 Buffer 类是 TypeArray(Unit8Array)的 nodejs 实现

###### fs 异步 api

`nodejs v10以上版本支持`

首先导入`promise`,并且通过 promise 的 open 方法创建`fileHandle`,最后必须手动`close`.

```js
const fs = require("fs").promises;

(async () => {
  try {
    const data = await fs.readFile("yarn.lock", {
      encoding: "utf8",
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
})();
```

###### 资源

- [FS 文件系统 - 掘金](https://juejin.im/post/5ee86cb8f265da76f9172ded)
- [Read/Write a file with Node.js in 2019 | by Hugo Larrousse | Medium](https://medium.com/@hugolarrousse/read-write-a-file-node-js-2019-fs-promises-d234ca00f851)
- [Tricks on writing & appending to a file in Node.js - DEV Community 👩‍💻👨‍💻](https://dev.to/sergchr/tricks-on-writing-appending-to-a-file-in-node-1hik)
- [Node.js FS Module — Write Streams | by John Au-Yeung | codeburst](https://codeburst.io/node-js-fs-module-write-streams-657cdbcc3f47)
- [Node.js 中的一股清流：理解 Stream（流）的基本概念 - 掘金](https://juejin.im/post/5de9f4fa6fb9a016323d6f50)
- [通过异步迭代简化 Node.js 流 | WenJun](https://wenjun.me/2019/11/nodejs-streams-async-iteration.html)

##### path

`Windows vs Posix`之间对 path 的设计逻辑不同,为了让 path.basename 获取到意料之中的文件名,如下所示:

```js
const path = require("path");
// path字符串是从windows上得到的
const pathStr = "c:\\dddd\\index.js";
// path字符串是从POSIX系统上得到的
const posixPathStr = "/tmp/index.js";

console.log(path.basename(pathStr));
console.log(path.win32.basename(pathStr));
console.log(path.posix.basename(posixPathStr));
// output:
// c:\dddd\index.js
// index.js
// index.js
```

按 path 的来源,使用不同的函数来获取 basename.还有一些有用的路径处理函数:

- path.delimiter: 平台路径分隔符,例如 posix 系统中系统变量用`:`分隔,windows 用`;`
- path.dirname: 获取目录名,但是并不会确定 path 参数中最后一个字符串是文件还是目录.
- path.extname: 扩展名
- path.format: 通过对象去解析 path
- path.isAbsolute: 依然是看路径的完整性,不是相对属性
- path.join:
  - 最常用的方法之一
  - 参数是字符串,通过当前系统的路径分隔符隔离,如果出现`..`字符串,则往后退一个目录,非常灵活
- path.parse: 解析一个字符串,返回一个 path 对象.不同系统类型对象不同.
- path.relative: 通过比较 currentDir 和 toDir 两个参数,返回一个表示`相对于当前路径位置等于目的路径的`字符串,简单说就是通过 cd 此想对路径字符串,可以切换目录到 toDir 参数的路径下.
- path.resolve: 通过解析一系列的字符串参数 path,得出一个绝对路径.
- path.sep: 这是一个属性值,等于平台特定的 path 分隔符.
- path.toNamespacedPath: 只在 windows 上有效,返回系统给定 path 的命名空间前缀,我不知道有啥用,但是看起来似乎可以区分当前系统提供 POSIX 标准还是 Windows 标准.

##### Buffer

他山之石: [Node.js Buffer 笔记 - 掘金](https://juejin.im/post/5d53d9e1f265da03b46be5e6)

`Buffer`对象用于以字节序的形式表示二进制数据,是许多二进制数据交互的基石.Buffer 类在全局作用域中,无需引入.`Buffer`可以将字符串或者数组数据转为二进制数据,默认使用`utf-8`编码.

```js
const buf = Buffer.from("hello world", "utf8");

console.log(buf.toString("hex"));
// 打印: 68656c6c6f20776f726c64
console.log(buf.toString("base64"));
// 打印: aGVsbG8gd29ybGQ=

console.log(Buffer.from("fhqwhgads", "utf8"));
// 打印: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from("fhqwhgads", "utf16le"));
// 打印: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

如果需要将二进制转为字符串,则支持`base64`和`hex`,所以在 node 端对 base64 的处理很常见:

```js
let buf = Buffer.from("aGFwcHkgYmlydGhkYXkgdG8gbXlzZWxm", "base64");
console.log(buf.toString());

let newBuf = Buffer.from("hello");
console.log(newBuf.toString("base64"));
```

`Buffer`实例也是`TypeArray`的实例,且可以通过`for..of`语法迭代,使用`keys(),values(),entries()`方法创建迭代器.

`Buffer`可以申请内存空间,不占 V8 引擎的内存.字符串转为二进制在传输上有更快的速度.暂未实际应用 Buffer,详细 api 按下不表.

##### Async / await 的使用

async 函数和 await 语法,是为了解决`回调嵌套`操作繁琐和可读性查的问题.前者声明回调环境函数,内部可以使用 await.而 await 声明运行于等待回调结果的过程,保证了异步的顺序行.

`async`函数返回一个`promise`对象,async 函数内部返回的值,成为 then 方法回调函数的参数.这个 promise 对象可以是隐式的,也可以是显式的.

也就是说,可以声明一个`new Promise`并且做 resolve 或者 reject 返回 promise.也可以直接返回值或者抛出异常.

```js
async function e() {
  throw new Error("error");
}
e()
  .then((v) => console.log(v))
  .catch((e) => console.log(e)); //Error: error

async function f() {
  return new Promise((resolve, reject) => {
    // resolve(1)
    reject(2);
  });
}

f()
  .then((r) => console.log(r))
  .catch((error) => console.log("error"));
```

`async`返回的`Promise`对象需要等到内部异步操作都执行完成,才执行 then 的回调.除非提前转为 reject 状态.因此,我们可以放心在内部执行一些异步函数.这时候,可能会需要使用 trycatch 处理内部的回调问题,避免出错导致部分逻辑代码不执行就返回 reject.

##### HTTP 协议

[前端基础篇之 HTTP 协议 - 掘金](https://juejin.im/post/5cd0438c6fb9a031ec6d3ab2#heading-8)

讲得很清楚了

##### Cookies 和 JWT

[聊一聊 session 和 cookie - 掘金](https://juejin.im/post/5aede266f265da0ba266e0ef)

现如今,我们可以很轻松获取到非常多的知识,是的,很轻松的获取到.
