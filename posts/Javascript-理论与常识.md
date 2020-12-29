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

`SharedArrayBuffer`对象用来表示通用固定长度的原始二进制数据缓冲区,类似`ArrayBuffer`对象.这里涉及到浏览器端的多线程`work`处理逻辑，共享数据和原子操作。

# ES9如何？

首先，支持了异步迭代器。

```js
async function fn(arr) {
    for (let i of arr) {
        await someFn(i)
    }
}
```

上述代码依然无法让循环实现异步，而是同步执行，且在内部的异步函数得出结果之前全部调用完成。

```js

const promises = [
    new Promise(resolve => resolve(1)),
    new Promise(resolve => resolve(2)),
    new Promise(resolve => resolve(3))
]
async function foo() {
    for await (let i of promises) {        
        console.log(i)
    }
}
foo()
=> 1,2,3
```

如果我们可能需要用到异步循环，注意引入`ES9`的支持。

**ES9**支持了 `promise`在最后时刻执行`finally`函数.

**并且重新修订了字面量的转义**,终于支持了`String.raw`.后续的字符串模版全部不会被转义.

```js
let s = `\u{54}` //会转义成unicode "T"
console.log(s);//>> T

let str = String.raw`\u{54}`; //不会被转义
console.log(str);//>> \u{54}
```

关于扩展运算符,`ES6`只支持数组的扩展.现在终于能操作对象了.

```js
const obj = {
  a: 1,
  b: 2,
  c: 3
};
const { a, ...param } = obj; //这里...是rest
console.log(a); //>> 1
console.log(param); //>> {b: 2, c: 3}

function foo({ a, ...param }) {//这里...还是rest
  console.log(a); //>> 1
  console.log(param); //>> {b: 2, c: 3}
}

const param = { b: 2, c: 3 };
foo({ a: 1, ...param });  //此处...为spread
```

`ES9`还对正则表达式提供了非常给力的支持.例如之前`.`能匹配除了`回车`外的所有字符,现在添加`flag`标志`s`,就可以匹配回车了.

```js
/hello.world/s.test('hello\nworld') 
=> true
/a.b/s.text(`a
b`)
=> true
```

另外,对正则表达式命名捕获组也进行了支持:

```js
const reDate = /(\d{4})-(\d{2})-(\d{2})/,
  match = reDate.exec("2018-08-06");
console.log(match);//>> [2018-08-06, 2018, 08, 06]

//这样就可以直接用索引来获取年月日：
let year = match[1]; //>> 2018
let month = match[2]; //>> 08
let day = match[3]; //>> 06
// 一旦字符串顺序变化,则除了要修改正则表达式之外,还需要修改上面三行取值的代码.
```

`ES9`支持对匹配组进行命名,获取匹配结果的时候可以通过分组的名字获取.

```js
const reDate = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  match = reDate.exec("2018-08-06");
console.log(match);
//>> [2018-08-06, 08, 06, 2018, groups: {day: 06, month: 08, year: 2018}]

//此时用groups对象来获取年月日，无论正则表达式怎么变换，这下面三行不用改了，省事！
let year = match.groups.year; //>> 2018
let month = match.groups.month; //>> 08
let day = match.groups.day; //>> 06
```

正则表达式的进阶小书里提及的断言,之前只支持正向现行断言,`ES9`支持了后行断言.































