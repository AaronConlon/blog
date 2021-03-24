---
title: 'javascript语言中的类型转换'
date: '2021/3/22'
tags:
- javascript
- tc39
mainImg: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTY0MTAxMzQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTY0MTAxMzQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '你好,TC39.请问 JavaScript 世界中的对象转换是如何实现的呢?'
---

在机缘巧合之下,我看到了国外大神`Dr.Axel Rauschmayer`的博客:[2ality – JavaScript and more](https://2ality.com/index.html),其中一篇文章针对`类型转换`这个问题作了分享,本着求知的想法我静下心阅读了此文,所得所想记录于此.

**2021年03月22日18:52:54**

## 1. 起始

`JavaScript` 是优秀的动态语言,数据类型的转换在日常编程开发中十分常见.本文将结合一些实际问题和个人疑惑对`类型转换`进行学习和解析,尽量从`ECMAScript规范`出发,学习类型转换的设计理念和实现逻辑.

> 如果喜欢,不妨亲自阅读 [ECMAScript® 2022 Language Specification](https://tc39.es/ecma262/multipage/)

## 2. 何为类型转换?

首先我们要明确`JavaScript`数据分为:

- 原始数据类型(primitive)
  - undefined
  - null
  - string
  - number
  - biginit
  - boolean
  - symbol
- 对象

看看这一行代码:

```js
Number('3') * Number('2')
```

两个数字之间使用乘法操作符相乘,数字类型是明确的从字符串通过`Number()`函数`显式`转过来的.

字符串之间`"不能"`直接执行乘法.

```js
'a' * 'b' // NaN
```

也许你会举出如下可行的例子:

```js
'1' * '2' // 2
```

此时,字符串之间的乘法得出了我们想要的结果.究其实质是因为解释器对字符串进行了`隐式类型转换(coercion)`.

JavaScript 语言初期并没有设计异常捕获(`exceptions`),这也是为什么你会看到现今解释器对如下代码的解释.

```js
1 / true // 1
1 / false // Infinity , 很明显, 0 作为分母是错误的,但是解释器最后的值是 Infinity
Number('a') // NaN 
```

为了实现兼容,`ECMAScript`不得不"允许"这部分错误的设计继续存在.但是,对于一些相对较新的特性来说,修复了这个错误的设计.

例如:

```JavaScript
1 / Symbol() // except error: can not cover a symbol value to a number

1 / 2n // except error: can not mix BigInt and other types,use explicit conversions

1() // except error: 1 is not a function

new 1 // except error: 1 is not a constructor

'ab'.length = 1 // 只读属性不可改
```



## 3. ECMAScript 规范是如何定义类型转换的?

先来看看如下一个使用`Typescript`编写的函数:

```typescript
function multiply(a: number, b: number) {
  // ...
}
```

如上所示,此函数的两个参数的类型都是`number`,在转译为`JavaScript`的过程中,转译器做了什么?

为了在转译后保证参数类型正确,其过程简述为如下代码:

```JavaScript
function multiply(a, b) {
  let _a = ToNumberic(a);
  let _b = ToNumberic(b);
  /// ...
}
```

### 3.1 转换为原始数据类型或对象

当语句需要执行隐式转换的时候,如下`抽象操作`函数将目标数据转换为预期的原始数据类型或者`Object`:

- ToBoolean()
- ToNumber()
- ToBumeric(), 兼顾 number 和 BigInt
- ToBigInt()
- ToString()
- ToObject()

> [抽象操作](https://tc39.es/ecma262/#sec-abstract-operations)是在ECMAScript规范中定义的函数,它们的定义是为了简洁地编写规范.JavaScript引擎不必将它们作为单独的函数在引擎中实现.不能直接从JavaScript调用它们.但是引擎实现了类似`Number()`这样的显示转换函数.

### 3.2 转换为数字类型

对于需要被隐式转化为`numeric`类型数据的值来说,将会用到`ToNumeric`抽象操作.转换的结果可能是`number`类型或者`BigInt`类型.

如若需要将`x`转换为整形,则使用抽象操作`ToInteger`.在使用`位操作`的时候执行的隐式转换则视情形使用抽象操作`ToInt32`或者`ToUint32`.

例如:

```js
'1' >> 1 // 使用 ToInt32 抽象方法转为 32 位整数
2 >> '1' // 使用 ToUint32 抽象方法转为无符号 32 位整数
-2 >>> 0 // -2 的二进制表示属于有符号数,因此需要 ToUint32 转换,最后结果是 4294967294
```

更多细则如下表所示:

| operand        | left operand | right operand | result   |
| :------------- | :----------- | :------------ | :------- |
| `<<`           | `ToInt32()`  | `ToUint32()`  | `Int32`  |
| signed `>>`    | `ToInt32()`  | `ToUint32()`  | `Int32`  |
| unsigned `>>>` | `ToInt32()`  | `ToUint32()`  | `Uint32` |
| `&`, `^`, `|`  | `ToInt32()`  | `ToUint32()`  | `Int32`  |
| `~`            | —            | `ToInt32()`   | `Int32`  |



### 3.3 转换为属性`keys`属性

抽象操作`ToPropertyKey`返回一个字符串或者`Symbol`,常用于:

- 括号操作
- 对象字面量的计算属性
- in 操作符的`left-hand side`,用于判定`in` 的结果
- Object 的几个需要访问`value`和遍历`key`相关的函数
  - Object.fromEntries
  - Object.defineProperty
  - Object.getOwnPropertyDescriptor
  - Object.prototype.hasOwnProperty
  - Object.prototype.propertyIsEnumerable
- Reflect 对象的相关方法



### 3.4 转换为数组索引(Array indices)

- `ToLength()` 主要用于字符串索引计算
  - 此抽象方法是`ToIndex`抽象方法的辅助方法
  - 其值范围是0 ≤ ? ≤ Math.MAX_SAVE_INTEGER
- `ToIndex()` 主要用于类数组索引计算
  - 与 ToLength 主要区别在于,此抽象方法在索引越界的时候抛出异常
  - 其值范围是0 ≤ ? ≤ Math.MAX_SAVE_INTEGER
- `ToUint32()` 用于数组索引计算
  - 其值范围是0 ≤ ? < 2^32-1

### 3.5 转换为类数组对象的元素

如果你要为`类数组`对象的某个元素设置值,将可能使用如下的抽象方法:

- `ToInt8()`
- `ToUint8()`
- `ToUint8Clamp()`
- `ToInt16()`
- `ToUint16()`
- `ToInt32()`
- `ToUint32()`
- `ToBigInt64()`
- `ToBigUint64()`

例如:

```js
let uint16 = new Int16Array;
uint16 = Int16Array.from('12345');

console.log(uint16);
// expected output: Int16Array [1, 2, 3, 4, 5]
```

此处的字符串`12345`在 `from`函数内部进行迭代,并且进行隐式的类型转换,最终为`Int16Array`对象设置了 5 个元素值.

## 4. ECMAScript 规范示例解读

`ECMAScript`规范明确提供了`JavaScript`的所有实现算法详细设计.大多数的`抽象方法`并没有在`JavaScript `引擎中实现,但是依然有少数抽象方法可以近乎理解为`JavaScript`引擎中对应的部分函数实现.举个例子,如下内容是`ECMAScript`规范的一部分:

- Spec: If Type(value) is String
  - JavaScript: `if (TypeOf(value) === 'string')` (very loose translation, defined below)
- Spec: If IsCallable(method) is true
  - JavaScript: `if (IsCallable(method))` (defined below)
- Spec: Let numValue be ToNumber(value)
  - JavaScript: `let numValue = Number(value)`
- Spec: Let isArray be IsArray(O)
  - JavaScript: `let isArray = Array.isArray(O)`
- Spec: If O has a [[NumberData]] internal slot
  - JavaScript: `if ('__NumberData__' in O)`
- Spec: Let tag be Get(O, @@toStringTag)
  - JavaScript: `let tag = O[Symbol.toStringTag]`
- Spec: Return the string-concatenation of "[object ", tag, and "]".
  - JavaScript: `return '[object ' + tag + ']';`

> 一开始阅读规范文档令人感觉很痛苦,但是慢慢坚持下来便有渐入佳境的感觉.



## references

- [Type coercion in JavaScript](https://2ality.com/2019/10/type-coercion.html)
- [怎样阅读 ECMAScript 规范？ - SegmentFault 思否](https://segmentfault.com/a/1190000019240609)
- [读懂 ECMAScript 规格 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/11/ecmascript-specification.html)

