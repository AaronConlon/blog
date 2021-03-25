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

**The `typeof` Operator**

1.  Let val be the result of evaluating [UnaryExpression](https://tc39.es/ecma262/#prod-UnaryExpression). 让 val 作为评估此一元表达式的结果.

2. If val is a [Reference Record](https://tc39.es/ecma262/#sec-reference-record-specification-type), then

   a. If [IsUnresolvableReference](https://tc39.es/ecma262/#sec-isunresolvablereference)(val) is true, return "undefined". 如果这个值是一个引用记录(仅存于规范中的类型),并且是一个不可解析的引用(比如声明却未初始化的变量),则返回 `undefined`.

3. Set val to ? [GetValue](https://tc39.es/ecma262/#sec-getvalue)(val). 令 val 等于 GetValue(val) 抽象操作的结果.如有异常则抛出.

4. Return a String according to [Table 38](https://tc39.es/ecma262/#table-typeof-operator-results). 按`val`的类型选择下表中一个字符串结果.

<h5 style="text-align:center">Table 38: typeof Operator Results</h5>

| Type of val                                                  | Result      |
| ------------------------------------------------------------ | ----------- |
| Undefined                                                    | "undefined" |
| Null                                                         | "object"    |
| Boolean                                                      | "boolean"   |
| Number                                                       | "number"    |
| String                                                       | "string"    |
| Symbol                                                       | "symbol"    |
| BigInt                                                       | "bigint"    |
| Object (does not implement [[Call]]) `不可调用的对象返回 object` | "object"    |
| Object (implements [[Call]])                                 | "function"  |

> ECMAScript 规范中为了方便描述算法和设计逻辑,设定了很多抽象操作和规范中的类型,定义了许多简写方式,类似: ? 和 ! 等.

## 5. 隐式转换抽象方法示例

### 5.1 ToPrimitive()

这个抽象方法在许多隐式转换算法中被使用到,它可以把任意值转换为原始类型值.由于许多操作只接受原始类型数据(或最终将使用原始类型数据),此抽象方法在`ECMAScript`规范中被广泛调用.

接下来我们来看看一个 JavaScript 版本的 `ToPrimitive`函数.

```js
function ToPrimitive(input: any, hint: 'default' | 'string' | 'number' = 'default') {
  if (Typeof(input) === 'object') {
    let exoticToPrim = input[Symbol.toPrimitive];
    if (exoticToPrim !== undefined) {
      let result = exoticToPrim.call(input, hint);
      if(Typeof(result) !== 'object') {
        return result;
      }
      throw new TypeError();
    }
    if (hint === 'default') {
      hint = 'number'
    }
    return OrdinaryToPrimitive(input, hint);
  } else {
    // input 是原始数据类型
    return input
  }
}
```

要理解这个函数,需要了解一些前置知识.

首先, `hint`参数表示要转换到原始值的预期类型,默认是`number`.

.其次,此函数的目的是为了将某个值转为原始类型数据,如此一来对于本身就是原始类型的数据来说直接返回即可.

对于对象来说,则需要检查此对象是否重写了`Symbol.toPrimitive`方法.

> `Symbol.toPrimitive` 是一个内置的 Symbol 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。

如果目标对象重写了方法,则将`hint`和`input`作为参数按重写的逻辑进行转换,出现异常则抛出.

如果此对象没有`Symbol.toPrimitive`函数,则按常规抽象方法[OrdinaryToPrimitive](https://tc39.es/ecma262/#sec-ordinarytoprimitive)进行转换.

接下来看看 `OrdinaryToPrimitive`的 JavaScript 函数可以如何实现.

```js
function OrdinaryToPrimitive(O: object, hint: 'string' | 'number') {
  let methodNames;
  if (hint === 'string') {
    methodNames = ['toString', 'valueOf'];
  } else {
    methodNames = ['valueOf', 'toString'];
  }
  for (let name of methodNames) {
    let method = O[name];
    if (IsCallable(method)) {
      let result = method.call(O);
      if (TypeOf(result) !== 'object') {
        return result;
      }
    }
  }
  throw new TypeError();
}
```



## references

- [Type coercion in JavaScript](https://2ality.com/2019/10/type-coercion.html)
- [How to Read the ECMAScript Specification](https://timothygu.me/es-howto/)
- [怎样阅读 ECMAScript 规范？ - SegmentFault 思否](https://segmentfault.com/a/1190000019240609)
- [读懂 ECMAScript 规格 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/11/ecmascript-specification.html)

