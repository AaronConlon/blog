---
title: 'JavaScript拾遗之数据类型'
date: '12/2/2021'
tags:
- JavaScript
mainImg: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzg0NDY2MzY&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzg0NDY2MzY&ixlib=rb-1.2.1&q=80&w=400'
intro: '上次面试的时候，面试官让我说一说 JavaScript 的数据类型，我说完之后感觉不太好，基础知识掌握得还是不够牢靠，今天来巩固一下 JavaScript 中的数据类型！'
---

# 前言提要

上次面试的时候，面试官让我说一说 JavaScript 的数据类型，我说完之后感觉不太好，基础知识掌握得还是不够牢靠，今天来巩固一下 JavaScript 中的数据类型！

# 概述

在脑海里构建一个图谱，JavaScript 标准至今的数据类型包括：

* [Primitive values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values) (immutable datum represented directly at the lowest level of the language)
  
  * [Boolean type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#boolean_type)
  * [Null type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#null_type)
  * [Undefined type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#undefined_type)
  * [Number type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type)
  * [BigInt type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#bigint_type)
  * [String type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type)
  * [Symbol type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#symbol_type)

* [Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects) (collections of properties)
  
  `7 种原始数据类型和一种引用类型`！复杂的数据结构都是由基础类型的数据构成的，对基础数据理解和熟悉程度越高，越有助于我们编写高效代码，提高效率和代码可读性。
  
  每一年**TC39**都会出现一些提案，每一年都有新的方法添加到标准中来，对这些方法了解越深，我们处理问题的思路越广，效率越高。

# 详解类型

## Number

### Number 基础

**Number**包含了整数和浮点数，在常规的数值之外，还需要注意以下几个特殊的数：

- Infinity
- -Infinity
- NaN (Not a number）

顾名思义，无穷大和不是一个数(NaN)都是 number ！在类型转换为 number 的时候可能会出现 NaN!
当我们需要使用一个始终是最大的数时，`Infinity`会非常有用，正负无穷都可以保证能够覆盖我们设置的某个正常值的表示范围。

> JavaScript 中的数学运算，使用`0`作为分母是不会报错的，例如正数除以 0 等于正无穷，负数则为负无穷，0除以 0 等于 NaN

举个例子：
在某些算法题中需要寻找数组中的最小值，我们可以初始化一个用于比较的值为`Infinity`，然后使用`Math.min()`函数来比较数据，利用的就是这个值是正无穷的特性，让代码可读性更好。

还有什么地方用到这个知识点吗？
有，还真有！例如我们在通过 JSON 序列化数据的时候，无穷大将序列化为`null`，注意这个问题📢，别让 bug 出现！另外，如果想通过字符串解析到无穷大的数，可以使用`parseFloat('Infinity')`或`Number('Infinity')`来处理，使用`parseInt`将会得到`NaN`!

> new Number() vs Number() ?

使用 new 去初始化对象将会得到一个 Object 而不是一个原始数据类型，使用 Number() 则意味着强制类型转换为 Number 类型，如果无法转换为为数字则返回 NaN！

> 0.1 + 0.2 ?

两数相加时，二者转为二进制再对阶运算时尾数无限循环，引擎阶段造成精读丢失。

### Number 静态属性

> 你可以在很多地方轻松查看文档，因此我将挑重点来学习。

- EPSILON: 数之间的最小间隔，可以用于检查 0.1 + 0.2 等于 0.3 的相等性，IE11 不支持，可以用 Math.pow(2, -52)来模拟！
- MAX_SAFE_INTEGER 和 MIN_SAFE_INTEGER: JavaScript Number使用IEEE754 标准的 64 位来表示一个数，因此为了方便获取最大的安全数 Math.pow(2, 53) - 1 和最小的安全数，为 Number 增加了这两个属性。这个属性可以用于判断某些传递的数是否可以安全地计算而不丢失精读，多用于前后端数据传递的处理，对超过安全范围的数进行判断。
- MAX_VALUE 和 MIN_VALUE: JavaScript 中能呈现的最大的正数和最小的正数，为这些数设置专属的具名属性有利于语言底层操作这些数，提升可读性。当我们发现某些数过大的时候，还是得了解原因，选择针对性的库去处理这些问题。
- POSITIVE_INFINITY 和 NEGATIVE_INFINITY 分别为正负无穷大，这一块唯一需要注意的是`这些特殊的值之间的逻辑运算`。



### Number 方法

当我们需要对数进行处理时，熟悉这些方法非常有用。

#### isNaN

`NaN`是全局属性，但`NaN`不等于`NaN`，判断目标是否不是一个数，在不进行类型转换的前提下，最好的方法就是使用`Number.isNaN()`方法。全局的`isNaN()`会对`'NaN'`这样的字符串进行转化，并认为这是一个`NaN`。

#### isFinite

判断目标是否为有限的数，全局的`isFinite()`函数会将字符串转化为数字，再判断是否是一个有限的数，`Number.isFinite`不会，当你不需要自动类型转换的时候，务必使用`Number.isFinite()`

#### isInteger

判断目标类型是否是`number`，并且是整数！同样需要注意，这个方法不会自动转换类型！

#### parseFloat

将目标字符串转化为浮点数，其中的关键在于在解析的过程中遇到`+、v、0-9、.、科学计数法e`之外的字符时，将会直接忽略该字符和以后的字符。并且第二个小数点也会使得解析终止，另外`空白符`在首尾时将会被忽略。如果无法解析，则返回`NaN`。如果一个目标是具有`toString`或`valueOf`方法的对象，则会将这些方法返回的内容作为目标进行解析。目标是`BigInt`则会丢失精度。

#### parseInt

此方法解析一个字符串（如果不是字符串，将先使用`toString()`进行自动转换），并且返回指定`基数(radix)`的十进制整数。基数是`2~36`之间的整数。尽管基数在规范中是可选参数，但是在不同浏览器之间对于不指定基数情况下的实现结果不相同，因此强烈建议指定基数！同样类似于`parseFloat`，对特殊字符将会终止转化，忽略首尾空白字符，转换`BigInt`会丢失精度！

> 要将一个数字转换为特定 radix 中的字符串字段，请使用 `thatNumber.toString(radix)`函数!

### Number 对象上的额外属性

#### toFixed(digits)

使用定点表示法来格式化一个数字，不足个数的使用 0 来补全，返回数字字符串（该数字会在必要时被`四舍五入`）。

#### toExponential(digits)

将数字转化为指定具有小数点后若干位的指数形式。

#### toLocaleString

 在需要将数字显示国际化的时候可查。

#### toPrecision

返回指定精度的字符串表示（如果需要保持整体的有效个数长度，可以使用此方法。）

#### toString([radix])

常用于转换数字为指定进制的数字字符串（2~36）

#### valueOf

返回一个被 Number 对象包装的原始值！

### Number 应用

- 使用 Number 对象的属性给变量赋值，用以得到特殊数字
- 检查是否超过可以精确表示的数的范围，利用`MAX_SAFE_INTEGER`
- 使用`Number(new Date())`获得某个日期对象的`valueOf()`函数结果，也等于`getTime()`的结果。
- 使用`Number(str)`将字符串表示的数转化为数字类型，例如这个离谱的`Number('') === 0`，或者转化 null 等于 0。
- 数字转特定进制的字符串，使用数字的`toString`方法并且指定基数参数即可。

## String

### String 基础

**String**全局对象是一个用于字符串或一个字符序列的构造函数。使用跨行长字符串时，可以使用斜杠字符表示字符串在下一行继续。

> String 表示零或多个 16 位 Unicode 字符序列！

也许你曾见过以下两种生成字符串的方式：

1. String(thing)
2. new String(thing)

二者的区别在于生成的是原始数据类型字符串，还是字符串对象。

如果想从字符串中获取单个字符，可以使用`charAt`方法或者将字符串当做类似数组的对象，按索引获取。

二者的区别在于，`charAt`将会在获取超过索引范围的时候返回空字符，而使用数组下标会返回`undefield`。

在很多时候，我们需要对某些字符串进行比较，其原理是将其字符转化为`ASCII码`进行再比较，并且`String`具有好几个很方便获取码值的方法提供给开发者使用。

另外，几乎所有数据都有`toString`方法，除了`null`和`undefield`，当你不确定调用此方法的变量是否是二者时，可以使用`String(target)`将`null`或`undefield`转化为字符串`"null"`和`"undefield"`。



### String 方法

#### fromCharCode(num1[,...[, numN]])

接收一系列`UTF-16`代码单元的数字，范围在`0~0xFFFF`之间，超过将被截断，最后返回长度为参数个数的字符串，此方法基于字符都是 16 位表示的，当我们需要使用更多的字符时，就力有未逮了。

#### fromCodePoint

ES6 新增了此方法以弥补 fromCharCode 在处理 Unicode 字符方面的缺陷，Unicode 为了支持更多字符，提供了`基本多语言平面（BMP）`机制，对每一个字符使用额外的 16 位来选择一个增补平面，这种字符使用一对 16 位的码元策略被称为`代理对`，迭代字符串可以智能识别代理对，而按索引访问这些字符时则无法获得预期的值。

#### charCodeAt

返回 0~63355 之间的整数，代表索引处的`UTF-16`码元，超过索引位置时返回 `NaN`

#### codePointAt

返回一个 Unicode 编码点值的非负整数或超过索引位置时返回`undefield`

#### normalize

有些字符可以由单个`BMP`字符表示，也可以由代理对表示，为了方便的比较字符串是否一致，需要将之按某种规范进行序列化，然后再对比结果，这方面所用极少，可用时查看。

#### concat

将字符串和参数进行拼接，返回新的字符串，参数可以是多个。

#### raw

此方法将会忽略转义符，在某些情况下可用，但是兼容性不佳，可以使用第三方库`string.raw`代替。

#### 提取字符串

三者区别在于对负数参数的处理，返回副本

- slice(beginIndex, endIndex): 负数下标会加字符串长度，异常的范围则返回空字符串，当想要获取倒数若干个元素时使用负数很方便。
- substr: 预计被移除
- substring: 代替`substr`，取参数范围，即使第二个参数大于第一个参数，内部自动按大小处理参数顺序，任意参数小于 0 或为`NaN`，视为 0。

#### 判断开头或结尾

- startsWith: 支持搜索长度，默认为字符串的 length
- endsWith
- 使用正则表达式来 test

#### includes

检查字符串是否包含另一个字符串，可以指定起始位置，默认为 0

#### 字符串位置检索

没找到返回 -1 ，同样支持设置起始位置，默认为 0，负数亦为 0。

- indexOf: 默认搜索字符串`undefield`
- lastIndexOf: 默认搜索字符串`undefield`
- search: 参数是正则表达式

#### 清理前后空格

返回清理后的副本

- trim
- trimLeft
- trimRight



#### 正则表达式匹配

- match: 通过匹配正则表达式，返回一个结果数组，默认返回空数组
- matchAll: 参数是正则表达式，否则将会隐式通过字符串创建正则表达式，正则表达式必须设置全局模式，否则抛出类型错误异常，全部匹配有利于获取可读性更高的正则表达式捕获组，MDN 上的解释和示例非常好，但是迭代匹配对象的时候结果缺少`groups`对象，这个对象会让我们在写正则表达式的时候设置了具名捕获组时，将匹配名和值保存在`groups`中，示例也可以参考[Javascript String matchAll()](https://www.programiz.com/javascript/library/string/matchall)。

#### 字符填充和替换

- 字符补充

  - padEnd(targetLength, padString = ' ')
  - padStart(targetLength, padString = ' ')

- repeat: 重复字符串若干次(次数自动转化为整数，负数则报错，0 则返回空字符串)，返回新的字符串

- 字符串替换，支持正则表达式，第二个参数可以是一个具有返回值的函数，返回的内容用于替换。

  - replace
  - replaceAll

  

#### split([separator[, limit]])

  不指定分隔符时，返回一个包含此字符串的数组。分隔符为空字符串时，切割整个字符串，每一个字符作为一个元素返回此数组，指定`limit`时，限定返回数组的长度。



#### 大小写转换

- toLowerCase
- toUpperCase



## Boolean

### Boolean 基础

`Boolean`对象是一个布尔值的对象包装器，只有俩值：

- true
- false

看看若干自动转化为布尔值的其他值的转换结果示例：

**以下都转化为 false**

- 0
- -0
- null
- false
- NaN
- undefield

**其他都转化为 true**，包括`[]、字符串'false'`。

不要将值为`false`的布尔对象在条件判断时视为`false`!例如：

```js
const x = new Boolean(false);
// x 在条件判断时视为 true
if(x) {
  // code will exec
}
```



## Null 和 Undefined

### 基础

`null`是一个特殊的值，当你认为某个变量或属性需要一个值，却打算暂时不为其分配值的时候，可以选择`null`，用于代表其为`空`或`未知的值`。

`undefield`通常用于表示一个变量被声明了，但是还未定义或分配值。

补充一点：

二者都是`falsy`的值之一，另外还有其他四个：

- false
- 0 、 -0
- ""
- NaN

其他都是`truthy`的值。

> 在 JSON 数据转换中，对象值为 undefined  的将会被忽略

另外，二者都是原始数据类型。

需要注意的是，`typeof null`的结果是`object`，而`undefield`则是`undefield`。

再谈二者区别，在作为参数传递时，`null`是一个值传递，而`undefield`将被忽略。

> 更多比较请点击查看[`undefined` vs. `null` revisited](https://2ality.com/2021/01/undefined-null-revisited.html)



## Symbol

### Symbol 基础

`symbol`是唯一且不可变的原始数据类型，其用途是确保对象具有唯一的非字符串形式的属性。切记，`Symbol`不支持语法`new Symbol()`，使用时将会报错 Symbol 不是一个构造器。

我们可以直接使用`symbol()`函数来根据传参创建一个`Symbol`类型的值，其语法为：

`Symbol([description])`

描述字段仅供调试，不可用于访问 symbol 本身。

> 具有相同 description 的 symbol 是不相等的。

`symbols`还具有若干没有暴露给开发者的属性，用于辅助实现众多的数据类型方法。

### Symbol 方法

- Symbol.for(key): 使用给定的字符串`key`（不是字符串将会转化为字符串）搜索全局符号注册表是否具有某个`key`的`symbol`，如果没有则创建一个，后续在检索的时候将返回此已存在的实例。注意，使用`Symbol(x)`定义的符号与使用此 description 来创建的全局符号(`Symbol.for(x)`)是不等的。
- Symbol.keyFor(sym): 使用符号实例`sym`在全局注册表中检索其可能存在的`key`!使用`Symbol(description)`创建的普通符号的`key`为`undefield`。当`sym`不是符号时，抛出类型异常。

### Symbol 其他

当使用 symbol 实例作为对象的属性时，这些属性默认是`可枚举`的，但不会被`Object.keys()`、`Object.getOwnPropertyNames()`返回，在`JSON.stringify`中会被忽略。

> Reflect.ownKeys 可以获取目标对象自身的所有属性组成的数组

来看看如下几个方法：

- Object.getOwnPropertyNames 返回常规属性数组
- Object.getOwnPropertySymbols 返回符号属性数组
- Object.getOwnPropertyDescriptors 返回描述符数组，包含符号属性和常规属性

另外，符号属性是对内存中符号的一个引用，开发者需要显示的保存这些符号，以免在后续需要直接使用时需要麻烦地遍历其符号属性来获取引用。

此外，ES6 引入了众多内置符号，例如：

- Symbol.iterator
- Symbol.asyncIterator
- ...

当真的需要为对象或某些数据提供可迭代的特性时，可以重载或实现这些内置符号的属性方法。

## BigInt

### BigInt 基础

> 只有在特定领域需要用此数据类型，日常开发中极少接触到。

`BigInt`用于表示任意大的整数，以此弥补`Number`表示范围的缺失。可以在一个数字字面量后面加一个`n`的方式来定义一个`BigInt`，例如：`100n`，或者调用函数`BigInt(11)`得到`11n`。

默认情况下，`JSON`在处理`BigInt`时需要实现`toJSON`方法，默认会引发类型错误。

需要注意的是，`Number`和`BigInt`之间无法进行混合逻辑运算，在处理这个问题之前需要进行类型转换，这个过程容易丢失精度。这两种类型可以进行宽松的相等比较，也可以在一个数组中进行排序。

## Object

### Object 基础

`Object`在 JavaScript 中用于存储各种键值集合和更复杂的实体。我们可以通过`Object()`构造函数或`对象字面量`的方式来创建`Object`。

> JavaScript 的一切都是对象？

上述其中原始数据类型就不是对象，但是我们可以调用他们的方法，其原理是在调用之前，创建了`Wrapper Object`。

JavaScript 将基本类型的值（除了 null/undefield/symbol/bigInt）使用构造器函数创建临时对象，这个临时对象就是我们所谈论的包装对象 `Wrapper Object`。

### Object 静态方法

#### Object.assign

> Object.assign(target, ...sources)

将所有源自身`可枚举`属性(包括`符号属性`)的值从一个或多个源对象分配到目标对象，按源对象参数的顺序，后续的对象属性值会覆盖同名的属性值，并且返回此目标对象。如果是简单的复制对象的值，且值为原始数据类型，我们称之为`浅克隆`。

该方法使用源对象的`[[Get]]`和目标对象的`[[Set]]`，所以它会调用相关 getter 和 setter。

举个例子：

```js
const obj = {
  foo: 1,
  get bar() {
    return 2;
  }
};

let copy = Object.assign({}, obj);
console.log(copy); // { foo: 1, bar: 2 } copy.bar的值来自obj.bar的getter函数的返回值
```



在出现错误的情况下，例如，如果属性不可写，会引发[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)，如果在引发错误之前添加了任何属性，则可以更改`target`对象。

看这个例子：

```js
const target = Object.defineProperty({}, "foo", {
    value: 1,
    writable: false
}); // target 的 foo 属性是个只读属性。

Object.assign(target, {bar: 2}, {foo2: 3, foo: 3, foo3: 3}, {baz: 4});
// TypeError: "foo" is read-only
// 注意这个异常是在拷贝第二个源对象的第二个属性时发生的。

console.log(target.bar);  // 2，说明第一个源对象拷贝成功了。
console.log(target.foo2); // 3，说明第二个源对象的第一个属性也拷贝成功了。
console.log(target.foo);  // 1，只读属性不能被覆盖，所以第二个源对象的第二个属性拷贝失败了。
console.log(target.foo3); // undefined，异常之后 assign 方法就退出了，第三个属性是不会被拷贝到的。
console.log(target.baz);  // undefined，第三个源对象更是不会被拷贝到的。
```



> `Object.assign` 会尝试将`target`转换为对象，例如传入`null`或`undefined`，将会报错。如若 sources 中包含 `null`或`undefined`，则忽略这两个源。

假如源值是一个对象的引用，它仅仅会复制其引用。

> Object.assign([1,2], [3,4,5]) 枚举数组，最后得出`[4,5,3]`

还有几点徐亚补充：

- assign 可以拷贝 Symbol 属性
- 继承属性和不可枚举属性`无法拷贝`
- 原始类型会被包装成对象

最后一点举个例子：

```js
const v1 = "abc";
const v2 = true;
const v3 = 10;
const v4 = Symbol("foo")

const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
// 原始类型会被包装，null 和 undefined 会被忽略。
// 注意，只有字符串的包装对象才可能有自身可枚举属性。
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```



#### Object.create

> Object.create(proto，[propertiesObject])

此方法创建一个新对象，并且使用指定的对象来提供创建对象的原型。

> 在 Vue 的源代码中，作者使用过 Object.create(null) 来创建空对象。

相较于`{}`对象来说，`Object.create(null)`或`Object.defineProperties(null)`返回的对象都不具有`原型`对象。

`{}`具有`Object`对象的一系列属性，如果我们只需要一个纯粹的字典，其实我们可以使用`Object.create(null)`，如果需要扩展一些功能，再额外添加即可。

`create`方法还可以用于兼容所有版本 JavaScript 的类式继承，但笔者认为`ES6`支持的`Class`的可读性更好一些，兼容性方面我们有`Babel`。

#### 定义属性

通过`Object`构造器对象来定义属性，可以有两种方式：

- defineProperty
- defineProperties

前者是对单个属性进行定义，后者支持传入一个数组，同时对多个属性进行定义。

无论是单个属性或多个属性，都由以下几个部分组成：

- prop 属性名
- descriptor 描述符
  - 数据描述符:
  - 存取描述符

> 如果一个描述符不具有 `value`、`writable`、`get` 和 `set` 中的任意一个键，那么它将被认为是一个数据描述符。如果一个描述符同时拥有 `value` 或 `writable` 和 `get` 或 `set` 键，则会产生一个异常。

提供描述符的时候，只能选择一种描述符来使用，否则将会抛出异常。

描述符可以拥有的键值如下表所示：

|| `configurable` | `enumerable` | `value` | `writable` | `get`  | `set`  |
| -------------- | ------------ | ------- | ---------- | ------ | ------ | ------ |
| 数据描述符     | 可以         | 可以    | 可以       | 可以   | 不可以 | 不可以 |
| 存取描述符     | 可以         | 可以    | 不可以     | 不可以 | 可以   | 可以   |

各键的含义如字面所示，用于控制属性的操作性。

