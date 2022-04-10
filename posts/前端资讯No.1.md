---
title: '前端资讯No.1'
date: '2022/3/29'
tags:
- 前端资讯
mainImg: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDg1NjYxNzQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDg1NjYxNzQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '2022年03月29日23:04:06 我查看邮件发现的一些资讯,在此分享给大家.'
---

`ES.Next`有自己的邮件订阅服务,感兴趣的朋友可以自行订阅.

### 主要内容

#### ECMAScript 提案

> [ECMAScript proposal: searching Arrays from end to start via `.findLast()` and `.findLastIndex()`](https://2ality.com/2022/03/array-find-last.html?utm_source=ESnextNews.com&utm_medium=Weekly+Newsletter&utm_campaign=2022-03-29)

一个新的数组方法提案: 数组反向检索.

```JavaScript
['a1', 'b', 'a2'].findLast(x => x.startsWith('a'));
// 'a2'

['a1', 'b', 'a2'].findLastIndex(x => x.startsWith('a'))
// 2
```

> [tc39/proposal-array-find-from-last: Proposal for Array.prototype.findLast and Array.prototype.findLastIndex.](https://github.com/tc39/proposal-array-find-from-last)

此提案已经进入第三阶段,极有可能在下一个版本发布时加入规范内.

诸如`lodash`此类库也提供了类似的功能,我们也可以简单实现此方法:

```JavaScript
function findLast(arr, callback, thisArg) {
  for (let index = arr.length-1; index >= 0; index--) {
    const value = arr[index];
    if (callback.call(thisArg, value, index, arr)) {
      return value;
    }
  }
  return undefined;
}

function findLastIndex(arr, callback, thisArg) {
  for (let index = arr.length-1; index >= 0; index--) {
    const value = arr[index];
    if (callback.call(thisArg, value, index, arr)) {
      return index;
    }
  }
  return -1;
}
```

#### 在 NodeJS 中导入 JSON 模块
在`NodeJS v17.5`的时候支持了`JSON`文件的`ES Module`模式导入.

> 这是一个实验性功能，可能会在未来被放弃或修改

关键在于`assert 类型声明`:

```JavaScript
import packageJsonExample1 from "./package.json" assert { type: "json" };

console.log({ packageJsonExample1 });
```

亦或是动态导入`JSON`文件:

```JavaScript
const packageJsonExample2 = await import("./package.json", {
  assert: { type: "json" },
});

console.log({ "packageJsonExample2.default": packageJsonExample2.default });
```

在这之前，我们可以用以下方式导入`json`文件：

```javascript
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("./data.json");
```

> `import.meta.url`返回当前模块的 URL 路径

总的来说，这是一个可以期待的特性，如果在未来能正式加入规范，我们就可以非常方便地导入`json`文件了。

#### 内置的异步任务终止机制

`node v17.5.0`提供了一个内置的自动取消异步操作的定时器：`AbortSignal.timeout()`，看示例：

**终止事件监听：**

```js
const signal = AbortSignal.timeout(1000);

signal.addEventListener("abort", () => {
  console.log("Signal automatically aborted.");
}, { once: true });
```

**取消异步的 HTTP 请求：**

```js
import fetch from "node-fetch";

(async () => {
  try {
    const signal = AbortSignal.timeout(200);

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/photos",
      {
        signal,
      }
    );

    const json = await response.json();

    console.log(json);
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("The HTTP request was automatically cancelled.");
    } else {
      throw error;
    }
  }
})();
```



#### Parcel 发布了 v2.4.0 版本

`Parcel`是一个开箱即用的前端项目环境部署工具，在 3 月 22 日时其发布了v2.4.0 版本。其中包含了一个性能极佳的`CSS`解析器，使用`Rust`开发且支持了诸多新特性：

- `@custom-media`语法
- 自定义属性优化
- `@layer`功能
- 支持`CSS Color Level 4/5`
- 自动提供产商标识等特性

> 笔者对`parcel`不熟，但刚刚试用了几次，开箱即用的特性确实非常好用。

### 参考

- [Automatically cancel async operations with AbortSignal.timeout() - Simon Plenderleith](https://simonplend.com/automatically-cancel-async-operations-with-abortsignal-timeout/?utm_source=ESnextNews.com&utm_medium=Weekly+Newsletter&utm_campaign=2022-03-29)
- [ECMAScript proposal: searching Arrays from end to start via `.findLast()` and `.findLastIndex()`](https://2ality.com/2022/03/array-find-last.html?utm_source=ESnextNews.com&utm_medium=Weekly+Newsletter&utm_campaign=2022-03-29)
- [Import JSON in ES modules - Simon Plenderleith](https://simonplend.com/import-json-in-es-modules/?utm_source=ESnextNews.com&utm_medium=Weekly+Newsletter&utm_campaign=2022-03-29)
- [Parcel v2.4.0: Parcel CSS becomes default CSS processor](https://u16056974.ct.sendgrid.net/ls/click?upn=cTtpYVq2RcK-2BlLRfjR0HxC817dERQWYZBBpcq-2Fle2321toIGfkc2zrRsyjypx2HZv2a94qd1WraxOzFY61VZY0aXHXShlVZylgG9NpLB0IjURo7isfNBMZ6GOt-2FrlC-2BoxMGCU4ZOWB8RWDgUvdlrUMgGTwccvRJHBEGpZ8kbkLo-3D0RP4_-2F9vN0UJhYhldgNP9gaR5K8jvv6X-2Bky-2FzJN3rsVNiZCfAL7-2FVHkD0pxVKuYmopj73OHbG-2FE7LetGmZ5wPV0NbvUMEgcImMnAf1Ew-2B-2BpovFMhrbe4oP9C8t0Kn1cPZHSumFbHgOWru9e1UJbAmPzfy4khs4dMJHH3bWZN-2BKky093kwYedbBqLoi8S-2BAkLpNqcLPsEwf6T-2B9ACqghdRcomJB3uOqiGSOUvky2rsn3MUgYK7UfVDuIC5xIxD8RfiHwIp-2F0K0T0mtpb2DIYf-2F1BbZJufTANgsXuglTDMqhJYSNp4NS8qs7WL6u5rIYbYwGCsu4-2F4AGi1rD9Jd2J3bLNfyuV-2BoN5tKR5YEz4RjBsKBT3Y6mYYfJFH3rAixx-2BMQE6O3fgY6NTZT9JJNZWTpr650N0XtPlht9KMqLfhi5l76OjVp4FQ6-2F705BvCDTEw0tyFaDw5suzDIPH8WkzHyiCAYrTI478dqYlQ8BeTBp3wcQg7myNOnVWHOI8h-2FheEd4H0s9BeeK44wCVxKx5dE0YQP-2FfVDQVfgANs3N-2FFUfYRYfXd7tvha2YrHQm-2FnnAHSVyWomjFk-2Bj93SHeRoD4TysRPCvP65GFW8ytWOvS4E9Y3138b4clv5FongqfXjMdfzrShtszHt4acROamvH-2FbVGjAqjnBND536ElG1GdQ9bRsvwnY8w3VTaUY0amESrM53MN7Aw5qkHbaw-2FEVNKw6IsKmFTkdJhkCHTuAJmgMfantKgR1Zyr5Tuh8hUi4wfdorA7h6rzDGyd-2BatT-2BG6bx4tRaWd2fVQji5oB9xBdBbDkwASfnI2i1JCRsFlsdmLxmFw4nwyHRi8YMThTygGfeN4VQDf2z2PNfRbi0VoCTWLcGzvxF6Ri0MNON1-2B9ZNvPeeY0q)
