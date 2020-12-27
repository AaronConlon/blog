---
title: 'Javascript-理论与常识'
date: '2020/12/27'
tags:
- Javascript
mainImg: 'https://images.unsplash.com/photo-1519938504322-49904910c363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1519938504322-49904910c363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '阅读安全内参,学习 JavaScript 理论知识,加深对 JavaScript 的了解,提高熟练度,巩固基础.话说回来,本来打算接着看你不知道的 JavaScript,结果作者说写第二版,行吧,先不看,先等第二版出来再说.'
---

2020年12月27日22:46:02,ES6 看起来已经不是新知识点了,本文从新版 ECMAScript 特性开始说起.

# ES7(2018) 新特性

`Array.prototype.includes`能快速查找数组中是否包含某个元素,包括`NaN`,之前的`indexOf`方法也能检查数组中的元素,但是不支持`NaN`的检查.我们知道`NaN !== NaN`.



另外,JavaScript 支持了指数函数的`中缀表示法`

```js
let n = 2**3 
=> 2*2*2 
=> 8
let a = 2
a **= 2 // a = a * a
let b = 3
b **= 3 // b = b * b * b
```



# ES8(2019) 新特性

`Object.values`和`Object.entries`.

返回接收参数(对象或者数组)的可枚举属性的值的数组,后者是键值对数组.

```js
let obj = {x: 'xx', y: 1}
Object.values(obj) 
=> ['xx', 1]
Object.entries(obj)
=> [['x', 'xx'], ['y', 1]]
```

也算是对之前只有`Object.keys`的补全吧.

> 在 chrome 下,Object 的这三个方法都不能取得原型链上的值

`Object`还增加了`getOnwPropertyDescriptors`方法.接收一个对象作为参数,返回此对象所有自身描述符,如果没有任何自身属性,返回空对象.`IE`不支持这个特性.

```js
const obj = { 
  get es7() { return 7; },
  get es8() { return 8; }
};
Object.getOwnPropertyDescriptors(obj);
// {
//   es7: {
//     configurable: true,
//     enumerable: true,
//     get: function es7(){}, //the getter function
//     set: undefined
//   },
//   es8: {
//     configurable: true,
//     enumerable: true,
//     get: function es8(){}, //the getter function
//     set: undefined
//   }
// }
```



字符串方面,增加了两个有趣的方法:

- `String.padStart(targetLength,[padString])` *targetLength：*当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。

  *padString：*(可选)填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断，此参数的缺省值为空格。

- `String.padEnd(targetLength,padString])` 参数释义同上。

我觉得在做`cli`输出数据,或者在`table`上能用到.



现在,对象和参数,数组都支持结尾逗号了.下面的代码都不会报错.

```js
//定义参数时
function foo(
    param1,
    param2,//结尾逗号
) {}
//传参时
foo(
    'coffe',
    '1891',//结尾逗号
);
//对象中
let obj = {
    "a": 'coffe',
    "b": '1891',//结尾逗号
};
//数组中
let arr = [
    'coffe',
    '1891',//结尾逗号
];
```

如此一来有以下两个好处:

- 重新排列项目更简单,如果最后一项改变位置,则不必删除逗号.
- 帮助 git 等版本控制系统追踪实际发生的变化.

```js
[
  'coffe'
]
// 变更
[
  'coffe',
  '1995'
]
```

现在采用结尾逗号,则在变动追踪的时候只会显示`1995`的变动,减少了无用信息的上报.



支持了`异步函数`.让我们能摆脱回调地狱(callback hell).

```js
async function asyncFunc() {
    const result = await otherAsyncFunc();// otherAsyncFunc()返回一个Promise对象
    console.log(result);
}

// 等同于:
function asyncFunc() {
    return otherAsyncFunc()// otherAsyncFunc()返回一个Promise对象
    .then(result => {
        console.log(result);
    });
}
```

有一本小书专门讲解`Async Functions`,后续补看.

另外,`ES8`支持了`共享内存和原子对象`.

请移步看看这里,[A cartoon intro to ArrayBuffers and SharedArrayBuffers - Mozilla Hacks - the Web developer blog](https://hacks.mozilla.org/2017/06/a-cartoon-intro-to-arraybuffers-and-sharedarraybuffers/).

`SharedArrayBuffer`对象用来表示通用固定长度的原始二进制数据缓冲区,类似`ArrayBuffer`对象.



























