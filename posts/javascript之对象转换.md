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

👆上面的代码用到了属性 `key` 值,上述三个关键的属性 `key`在原始类型转换的时候用得很多.分别是:

- toString
- valueOf
- Symbol.toPrimitive(默认只有 Symbol 和 Date 对象有此方法)

从`hint`参数可知, 期望转换结果类型和调用的对象方法有直接关系.所以,标准库中`Number()`和`String()`函数在实现上都是按抽象方法`ToPrimitive`去执行,且设置`hint`为`number`或者`string`.

**那么, 何种情况下使用哪一个`hint`值呢?**

在隐式转换的时候,设定`hint`为`number`的情况有以下几个抽象方法:

- toNumeric
- toNumber
- toBigInt / BigInt
- < 或者 > 抽象关系比较

设定`hint`为`string`的则是:

- toString
- toPropertyKey

最后则是`hint`为`default`:

- 抽象相等性比较( == )
- 加操作(+)
- new Date(value), value 可以是字符串或者 number

但我们可以发现,`default`和`number`作为`hint`的值时,几乎没有差别,二者可以视为一致.

在标准库中,只有`Date`和`Symbol`的实例重写了它们的默认行为.

让我们来看看`Date`是如何重写的:

```js
Date.prototype[Symbol.toPrimitive] = function (
  hint: 'default' | 'string' | 'number') {
    let O = this;
    if (TypeOf(O) !== 'object') {
      throw new TypeError();
    }
    let tryFirst;
    if (hint === 'string' || hint === 'default') {
      tryFirst = 'string';
    } else if (hint === 'number') {
      tryFirst = 'number';
    } else {
      throw new TypeError();
    }
    return OrdinaryToPrimitive(O, tryFirst);
  };
```

`tryFirst`首选项设置成了`string`,而不是默认的`default`等同于`number`,在日常的开发中我们也可以看到如下示例:

```js
const d = new Date('2222-03-27')
d == 'Wed Mar 27 2222 08:00:00 GMT+0800 (中国标准时间)' // true
> 1 + d // '1Wed Mar 27 2222 08:00:00 GMT+0800 (中国标准时间)'
```

日期示例同时具有`toString()`和`valueOf()`方法,于此可以理解其重写逻辑是偏向`string`的.

### 5.2 ToString()

接下来我们来看看`toString()`方法的`JavaScript`版本实现:

```js
function ToString(argument) {
  if (argument === undefined) {
    return 'undefined';
  } else if (argument === null) {
    return 'null';
  } else if (argument === true) {
    return 'true';
  } else if (argument === false) {
    return 'false';
  } else if (TypeOf(argument) === 'number') {
    return Number.toString(argument);
  } else if (TypeOf(argument) === 'string') {
    return argument;
  } else if (TypeOf(argument) === 'symbol') {
    throw new TypeError();
  } else if (TypeOf(argument) === 'bigint') {
    return BigInt.toString(argument);
  } else {
    // argument is an object
    let primValue = ToPrimitive(argument, 'string'); // (A)
    return ToString(primValue);
  }
}
```

简洁明了, 在将原始值转换为`string`的中间,使用了`ToPrimitive`函数作为过渡.并且对于各种`type`的值有不同的处理.需要注意的是,对于`Symbol`是抛出异常.但这并不意味着`Symbol`对象无法转换为`string`.

`Symbol.prototype.toString()`和`String()`都被重写了.我们不妨看看如下示例:

```js
> const sym = Symbol('sym')
undefined
> ''+sym
Uncaught TypeError: Cannot convert a Symbol value to a string
> `${sym}`
Uncaught TypeError: Cannot convert a Symbol value to a string
```

隐式转换和模板字符串都会抛出异常.但是显示转换和调用`toString`方法都可以执行.

```js
> String(sym)
'Symbol(sym)'
> sym.toString()
'Symbol(sym)'
```

> 由此看来,`Symbol`实例的这两个方法确实与众不同.

**让我们将目光转到`String()`和`Symbol.prototype.toString()`的实现逻辑:**

- `String()`

```js
function String(value) {
  let s;
  if (value === undefined) {
    s = '';
  } else {
    // new.target: 检测是否通过 new 实例化,如果不是则为 undefined,是则指向构造方法或函数
    if (new.target === undefined && TypeOf(value) === 'symbol') {
      // 如果 value 是 symbol,并且不是通过 new String 调用,则返回 Symbol 的描述符函数执行结果
      return SymbolDescriptiveString(value);
    }
    s = ToString(value);
  }
  if (new.target === undefined) {
    // Function call
    return s;
  }
  // New call
  return StringCreate(s, new.target.prototype); // simplified!
}

function StringCreate(value, prototype) {
  // Create a new String instance that has the given prototype
}
function SymbolDescriptiveString(sym) {
  assert.equal(TypeOf(sym), 'symbol');
  let desc = sym.description;
  if (desc === undefined) {
    desc = '';
  }
  assert.equal(TypeOf(desc), 'string');
  return 'Symbol('+desc+')';
}
```

我们知道,`String`可以直接调用,也可以使用`new`实例化一个`string object`.

> new String(1) // 实例化结果是一个对象,而不是 string 类型值,可以使用 `valueOf`方法获取其 string 类型值.字面量定义的字符串在使用的时候看起来似乎拥有`String`实例的方法,其实质是先转为`String`实例,再调用方法.详情可见:[基本字符串和字符串对象的区别.](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#%E5%9F%BA%E6%9C%AC%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%8C%BA%E5%88%AB)

如上所示,`String`构造函数将`Symbol`单独拎出来处理,针对`Symbol`返回其描述符字符串.

- `Symbol.prototype.toString()`

`Symbol`也可以直接使用`ToString`方法转换为字符串,其实现逻辑大致如下:

```js
Symbol.prototype.toString = function () {
  let sym = thisSymbolValue(this);
  return SymbolDescriptiveString(sym);
};
function thisSymbolValue(value) {
  if (TypeOf(value) === 'symbol') {
    return value;
  }
  if (TypeOf(value) === 'object' && '__SymbolData__' in value) {
    let s = value.__SymbolData__;
    assert.equal(TypeOf(s), 'symbol');
    return s;
  }
}
```

> [官方描述: ECMAScript® 2022 Language Specification - Object.prototype.toString](https://tc39.es/ecma262/#sec-object.prototype.tostring)

`Object.prototype.toString`的实现规范用代码来描述:

```js
Object.prototype.toString = function () {
  if (this === undefined) {
    return '[object Undefined]';
  }
  if (this === null) {
    return '[object Null]';
  }
  let O = ToObject(this);
  let isArray = Array.isArray(O);
  let builtinTag;
  if (isArray) {
    builtinTag = 'Array';
  } else if ('__ParameterMap__' in O) {
    builtinTag = 'Arguments';
  } else if ('__Call__' in O) {
    builtinTag = 'Function';
  } else if ('__ErrorData__' in O) {
    builtinTag = 'Error';
  } else if ('__BooleanData__' in O) {
    builtinTag = 'Boolean';
  } else if ('__NumberData__' in O) {
    builtinTag = 'Number';
  } else if ('__StringData__' in O) {
    builtinTag = 'String';
  } else if ('__DateValue__' in O) {
    builtinTag = 'Date';
  } else if ('__RegExpMatcher__' in O) {
    builtinTag = 'RegExp';
  } else {
    builtinTag = 'Object';
  }
  let tag = O[Symbol.toStringTag];
  if (TypeOf(tag) !== 'string') {
    tag = builtinTag;
  }
  return '[object ' + tag + ']';
};
```

首先将`undefined`和`null`进行严格比较判断,然后将之转化为一个`Object`,再针对其内部`插槽属性`(如上所示, if else 的双下划线开始和结束的字符串判断条件,就是检查对象内部的`插槽属性`)定义一个`内建标签`,最后根据`JS 引擎`提供的`Symbol.toStringTag`属性值来设定最终的返回字符串内容.

如果是自定义的类,可以根据`Symbol.toStringTag`这个 API 来实现类型检出:

```js
class Yo {}
Yo.prototype[Symbol.toStringTag] = 'Yo'
String(new Yo()) // '[object Yo]'
```

> 开发者可以根据需要重写其实现,但不重写也依然无碍,毕竟有 Object 对象的原型实现兜底.



### 5.3 ToPropertyKey()

`ToPropertyKey`在规范中常用于括号操作相关的逻辑描述步骤,其工作方式如下:

```js
function ToPropertyKey (argument) {
  let key = ToPrimitive(argument, 'string'); // 预期值类型为 string
  // 针对 symbol 作为 key 类型的特殊设计
  if(TypeOf(key) === 'symbol') {
    return key;
  }
  return ToString(key);
}
```

### 5.4 ToNumeric()

当`number`体系中增加了`BigInt`之后,此方法也针对`BigInt`做了设计:

```js
function ToNumeric(value) {
  let primValue = ToPrimitive(value, 'number');
  if (TypeOf(primValue) === 'bigint') {
    return primValue;
  }
  return ToNumber(primValue);
}
```

如果将其转化为原始数据类型之后是`BigInt`,则直接返回,否则将使用`ToNumber`抽象操作:

```js
function ToNumber(argument) {
  if (argument === undefined) {
    return NaN;
  } else if (argument === null) {
    return +0;
  } else if (argument === true) {
    return 1;
  } else if (argument === false) {
    return +0;
  } else if (TypeOf(argument) === 'number') {
    return argument;
  } else if (TypeOf(argument) === 'string') {
    return parseTheString(argument); // 此函数略
  } else if (TypeOf(argument) === 'symbol') {
    throw new TypeError(); // symbol 和 bigint 将引发类型错误异常
  } else if (TypeOf(argument) === 'bigint') {
    throw new TypeError();
  } else {
    // argument is an object
    let primValue = ToPrimitive(argument, 'number');
    return ToNumber(primValue);
  }
}
```

从上述实现我们可以很清楚理解到日常工作中可能用到的变量类型隐式转换是如何实现的,以及出现`TypeError`的原因.



## 6. 隐式转换范例

### 6.1 Addition operator(+)

> 此加法运算需要和一元运算符 `+`区分开来.一元运算符使用的是`ToNumber`抽象操作.

`JavaScript`中加法运算符的规定代码实现如下:

```js
function Addition(leftHandSide, rightHandSide) {
  let lprim = ToPrimitive(leftHandSide);
  let rprim = ToPrimitive(rightHandSide);
  if (TypeOf(lprim) === 'string' || TypeOf(rprim) === 'string') {
    return ToString(lprim) + ToString(rprim);
  }
  let lnum = ToNumeric(lprim);
  let rnum = ToNumeric(rprim);
  if (TypeOf(lnum) !== TypeOf(rnum)) {
    throw new TypeError();
  }
  let T = Type(lnum);
  return T.add(lnum, rnum);
}
```

算法步骤:

- 将左右操作数转化为原始数据类型
- 如果其中一个是字符串,则都转为字符串
- 如果二者的原始数据类型分别是`BigInt`和`Number`,则报类型异常错误
- 否则执行`numeric`类型的相加操作.

示例:

```js
> 1 + 2n
Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions
> 1n + 1n
2n
> [1] + 2  // 数组转原始数据类型,优先转 string
'12'
> 1 + true
2
> 1 + {}
'1[object Object]'
```

### 6.2 Abstract Equality Comparison (==)

抽象相等性比较,且允许我如此翻译,其代码实现如下,一些实现细节的体会直接写在注释中.

```js
/** Loose equality (==) */
function abstractEqualityComparison(x, y) {
  // 对于类型一致的使用严格相等性比较
  if (TypeOf(x) === TypeOf(y)) {
    // Use strict equality (===)
    return strictEqualityComparison(x, y);
  }

  // Comparing null with undefined
  if (x === null && y === undefined) {
    return true;
  }
  if (x === undefined && y === null) {
    return true;
  }

  // Comparing a number and a string
  // 有趣的数字和字符串比较,都转为了数字.
  if (TypeOf(x) === 'number' && TypeOf(y) === 'string') {
    return abstractEqualityComparison(x, Number(y));
  }
  if (TypeOf(x) === 'string' && TypeOf(y) === 'number') {
    return abstractEqualityComparison(Number(x), y);
  }

  // Comparing a bigint and a string
  // 字符串和 BigInt 的比较,将字符串转为 BigInt
  if (TypeOf(x) === 'bigint' && TypeOf(y) === 'string') {
    let n = StringToBigInt(y);
    if (Number.isNaN(n)) {
      return false;
    }
    return abstractEqualityComparison(x, n);
  }
  if (TypeOf(x) === 'string' && TypeOf(y) === 'bigint') {
    return abstractEqualityComparison(y, x);
  }

  // Comparing a boolean with a non-boolean
  // 转为数字进行比较
  if (TypeOf(x) === 'boolean') {
    return abstractEqualityComparison(Number(x), y);
  }
  if (TypeOf(y) === 'boolean') {
    return abstractEqualityComparison(x, Number(y));
  }

  // Comparing an object with a primitive
  // (other than undefined, null, a boolean)
  // 对象和四大原始数据类型的比较,将对象转为原始数据类型
  if (['string', 'number', 'bigint', 'symbol'].includes(TypeOf(x))
    && TypeOf(y) === 'object') {
      return abstractEqualityComparison(x, ToPrimitive(y));
    }
  if (TypeOf(x) === 'object'
    && ['string', 'number', 'bigint', 'symbol'].includes(TypeOf(y)) {
      return abstractEqualityComparison(ToPrimitive(x), y);
    }
  
  // Comparing a bigint with a number
	// bigint 和数字的比较,则判定正负无穷性和 NaN,这几个类型无法比较,一律返回 false
  if ((TypeOf(x) === 'bigint' && TypeOf(y) === 'number')
    || (TypeOf(x) === 'number' && TypeOf(y) === 'bigint')) {
      if ([NaN, +Infinity, -Infinity].includes(x)
        || [NaN, +Infinity, -Infinity].includes(y)) {
          return false;
        }
    	// 否则按数学性值的相等比较, 1 == 1n 为 true
      if (isSameMathematicalValue(x, y)) {
        return true;
      } else {
        return false;
      }
    }  
  return false;
}
```

部分抽象操作可以查看`ECMAScript 文档`.

## 7. 术语补充

本文到此即将结束,我们在类型转换的规范描述中经常看到如下几个术语,加深其理解对于我们理解`ECMAScript 规范`有一定的帮助.

- *type conversion*: 我们希望输出的值具备指定的类型,如果输入已经由类型,通常类型转换只是简单的返回其类型,否则将其值转换为`hint`预期类型.
- *Explicit type conversion*: 显示类型转换指的是语言方面通过支持一些操作或者函数出发类型转换,类似`JavaScript`中的`Number()/String()/Boolean()`等等,显示的类型转换易于阅读和理解,故社区中常有`显示大于隐式`的说法,其支持者甚多.在`JavaScript`中显示转换会对值做两种类型的操作:
  - Checked: 检查是否可以转换,如果不行则抛出异常
  - Unchecked: 返回一个设计性错误的值,如本文开头所述`1 / false` 返回 `Infinity`.
- *type casting*: 类型定义,类似于`Java`中,在一个范围内,不可以将不同类型的值赋值给一个变量.按编程语言的设计而定, 其实质是明确的类型检查.
- *Type coercion*: 隐式类型转换, 弱类型语言的特征之一.

## references

- [Type coercion in JavaScript](https://2ality.com/2019/10/type-coercion.html)
- [How to Read the ECMAScript Specification](https://timothygu.me/es-howto/)
- [怎样阅读 ECMAScript 规范？ - SegmentFault 思否](https://segmentfault.com/a/1190000019240609)
- [读懂 ECMAScript 规格 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/11/ecmascript-specification.html)
- [js隐式装箱-ToPrimitive | {XFE}](https://sinaad.github.io/xfe/2016/04/15/ToPrimitive/)
- [【译】如何阅读ECMAScript规范(一) | 李冬琳的博客](http://ldllidonglin.github.io/blog/2020/03/10/2020-03-10-%E3%80%90%E8%AF%91%E3%80%91%E5%A6%82%E4%BD%95%E9%98%85%E8%AF%BBECMAScript%E8%A7%84%E8%8C%83(%E4%B8%80)/)
- [Cast to Number in Javascript using the Unary (+) Operator | by Nikhil John | Medium](https://medium.com/@nikjohn/cast-to-number-in-javascript-using-the-unary-operator-f4ca67c792ce)
