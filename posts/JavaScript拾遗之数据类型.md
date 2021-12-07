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

- isNaN: `NaN`是全局属性，但`NaN`不等于`NaN`，判断目标是否不是一个数，在不进行类型转换的前提下，最好的方法就是使用`Number.isNaN()`方法。全局的`isNaN()`会对`'NaN'`这样的字符串进行转化，并认为这是一个`NaN`。
- isFinite: 判断目标是否为有限的数，全局的`isFinite()`函数会将字符串转化为数字，再判断是否是一个有限的数，`Number.isFinite`不会，当你不需要自动类型转换的时候，务必使用`Number.isFinite()`
- isInteger: 判断目标类型是否是`number`，并且是整数！同样需要注意，这个方法不会自动转换类型！
- parseFloat: 将目标字符串转化为浮点数，其中的关键在于在解析的过程中遇到`+、v、0-9、.、科学计数法e`之外的字符时，将会直接忽略该字符和以后的字符。并且第二个小数点也会使得解析终止，另外`空白符`在首尾时将会被忽略。如果无法解析，则返回`NaN`。如果一个目标是具有`toString`或`valueOf`方法的对象，则会将这些方法返回的内容作为目标进行解析。目标是`BigInt`则会丢失精度。
- parseInt: 此方法解析一个字符串（如果不是字符串，将先使用`toString()`进行自动转换），并且返回指定`基数(radix)`的十进制整数。基数是`2~36`之间的整数。尽管基数在规范中是可选参数，但是在不同浏览器之间对于不指定基数情况下的实现结果不相同，因此强烈建议指定基数！同样类似于`parseFloat`，对特殊字符将会终止转化，忽略首尾空白字符，转换`BigInt`会丢失精度！

> 要将一个数字转换为特定 radix 中的字符串字段，请使用 `thatNumber.toString(radix)`函数!

### Number 对象上的额外属性

- toFixed(digits): 使用定点表示法来格式化一个数字，不足个数的使用 0 来补全，返回数字字符串（该数字会在必要时被`四舍五入`）。
- toExponential(digits): 将数字转化为指定具有小数点后若干位的指数形式。
- toLocaleString: 在需要将数字显示国际化的时候可查。
- toPrecision: 返回指定精度的字符串表示（如果需要保持整体的有效个数长度，可以使用此方法。）
- toString([radix]): 常用于转换数字为指定进制的数字字符串（2~36）
- valueOf: 返回一个被 Number 对象包装的原始值！

### Number 应用

- 使用 Number 对象的属性给变量赋值，用以得到特殊数字
- 检查是否超过可以精确表示的数的范围，利用`MAX_SAFE_INTEGER`
- 使用`Number(new Date())`获得某个日期对象的`valueOf()`函数结果，也等于`getTime()`的结果。
- 使用`Number(str)`将字符串表示的数转化为数字类型，例如这个离谱的`Number('') === 0`，或者转化 null 等于 0。
- 数字转特定进制的字符串，使用数字的`toString`方法并且指定基数参数即可。

## String











# 判断类型