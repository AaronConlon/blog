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
在`NodeJS v17`的时候支持了`JSON`文件的`ES Module`模式导入.

> 在`v16.14`后也加入了补丁,如果你使用此版本也是可用的

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

