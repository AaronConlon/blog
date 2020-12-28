---
title: '从ES6到ESNext'
date: '2020/12/28'
tags:
- 算法
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1605088807164-d62040fcd980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1605088807164-d62040fcd980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '回顾 ES2015(ES6),简介 ES7 到 ESNext.有趣的 JavaScript 世界,有趣的技术发展历程.'
---

`ECMA`是一个将信息标准化的组织,`JavaScript`被提交到`ECMA`后诞生了一个新的语言标准`ECMAScript`.而`JavaScript`只是该标准最流行的一个实现.浏览器厂商根据该标准实现自己浏览器版本的`JavaScript`功能,因此少数的功能,每个浏览器的实现和效果可能有所不同.

# 总览

`ES2015`就是 2015 年标准化的,但是在`ES2015`发布之前,`ES6`的名字就已经流行起来了.

2016 年6 月,`ES2016`即`ES7`.

2017 年 6 月,`ECMAScript第八版`被标准化,我们称之为`ES2017`或者`ES8`.

有些文章提到的`ESNext`,这种说法被指代下一个版本的`ECMAScript`.

在日常开发中,经常可以看到使用`babel`等转译器将新版本的代码转化为指定版本,以支持浏览器功能.

话不多说,让我们再回顾一遍`ES6`的功能.

- 使用`let`和`const`
- 模板字面量
- 解构
- 展开运算符
- 箭头函数
- 类
- 模块

当我写下上面这些功能的时候,其实已经发现这些功能已经广泛应用在我的日常开发中了.

首先,`let`和`const`声明的值,无法重复声明,`let`声明的值可以重复赋值和修改类型,而`const`则声明只读的变量.

`var`声明的变量会被提升到变量范围的顶部.坚持使用`let`和`const`则不会出现这种令人迷惑的隐式行为.作用域的行为跟`Java`和`c`等语言一致.大大减少了`var`产生的迷惑行为.

关于`模板字面量`,真的太棒了.

```js
let a = 1
console.log(`a
b
c${a}
`)
// 变量替换和换行保留
```

箭头函数,自不必说,极大的方便了简化了函数的语法.但是箭头函数的`this`跟普通函数又不太一样.

- **箭头函数中的this,使用了词法作用域去查找,而不是动态作用域**
- 不能用`call`手动修改`this`
- 不存在普通函数内的`this`,`caller`和`arguments`
- 无原型

这里摘抄一份推荐中的`面试宝典`内的解释,非常喜欢.

> 对于词法作用域而言，一旦函数定义，所有变量都是确定的，不会因执行的位置/方式而改变。但是当访问 this 的时候，情况却大不一样了。

调用一个函数有四个方式：

```js
function a() { }   // 定义
let b = { a }
let c = {}
a()                // 以函数方式调用
new a()            // 以构造函数的方式调用
b.a()              // 以对象方法的方式调用
a.apply(c)         // 通过它们的 apply/call 方法间接调用
```

在这四个方式下，this 的指向均不同。以函数方式调用，this 指向 window；以构造函数的方式调用，this 指向所构造的实例对象；以对象方法的方式调用，this 指向其所在的对象；通过它们的 apply/call 方法间接调用，this 的指向取决于传入的参数。而这就是 JavaScript 中的动态作用域。



另外,ES5 的函数支持默认值.这是从前不支持的,极大提升了灵活性.普通函数内置 `arguments`变量,保存了类数组的参数数据.可以通过下表获取参数传入的值.

话说回来,继续说展开运算符,非常有用.

```js
let params = [1,2,3]
console.log(sum(...params))
// 自动扩展,等同于ES5
console.log(sum.apply(undefined, params))

// 当做剩余参数使用
function demo(a, b, ...others) {
  // others是数组,不是类数组.可以使用Array的原型链方法
}
```

**数组和对象解构,属性方法简写,简写方法名这些语法**真的很酷.

```js
let [x, y] = ['a', 'b']
// x = a
// y = b
let demo = {c: 1, d: 2}
let {c , d} = demo
// c = 1
// d = 2
let d = {c, d}
// d = {c: 1, d: 2}
const foo = {
  name: 'aaron',
  sayHi() {
    console.log('hi')
  }
}
foo.sayHi() // 'hi'
```

另外,使用类进行编程在 JavaScript 的世界里,是从`ES6`的时候流行起来的.

```js
class MathBook extends Book {
  constructor(name) {
    super(name) // 调用父类构造函数
    this.name = name
  }
  getName() {
    return this.name
  }
}
```

**JavaScript 的 class 的实现方式依然是基于原型的**,如果你喜欢`class`,则使用`class`.我更喜欢原型.

另外,类支持属性存取器.类的属性不是私有的,建议使用下划线开头的社区命名模式.

```js
class Person {
  constructor(name){
    this._name = name
  }
  set name(v) {
    this._name = v
  }
  get name() {
    return this._name
  }
}
```

> 依然可以获取 Person 实例的 _name 属性.

**模块**已经被广泛应用了.`nodejs`开发中的`require`语句使用的是`commonJS`模块.`ES6`的模块见示例:

```js
// somename.js
const a = v => v
exports {a}

// 引用
import {a} from ./somename
// 重命名
import {a as b} from ./somename
// other style
import * as Lib from ./somename
// call a
Lib.a

// 每个 js 文件都支持一个 default 导出
export default Some;
// 引入
import Some from somename
// 或者直接导出
export const a = () => 1
```

如果想在`nodejs`中使用`ES6`模块导入导出方案,可以参考:[Using ES6 syntax “import/export” in Node js with Babel | by Josephine Gyamera | Medium](https://medium.com/@josephinegyamera/using-es6-syntax-import-export-in-node-js-with-babel-7ef48b874c52)

另外,mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置。

注意，ES6 模块与 CommonJS 模块尽量不要混用。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

# 参考

- [JS 中 lambda 表达式中的 this 到底如何理解 - 知乎](https://zhuanlan.zhihu.com/p/51205665)
- [面试宝典之箭头函数中的this - 知乎](https://zhuanlan.zhihu.com/p/47132493)
- [少年，不要滥用箭头函数啊 - jingsam](https://jingsam.github.io/2016/12/08/things-you-should-know-about-arrow-functions.html)
- [Node.js 如何处理 ES6 模块 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)