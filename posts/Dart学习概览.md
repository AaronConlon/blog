---
title: 'Dart学习概览'
date: '2020/11/17'
tags:
- 
mainImg: 'https://images.unsplash.com/photo-1495819903255-00fdfa38a8de?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE2NTI2Nn0'
coverImg: 'https://images.unsplash.com/photo-1495819903255-00fdfa38a8de?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE2NTI2Nn0'
intro: '一开始我打算直接学习Flutter,但是看了三章书籍之后发现自己的Dart基础不够,学习起来速度很慢,而且理解能力不够,于是我搜索了一些Flutter的学习路线图,每一个都推荐优先学习Dart,而不是学到哪看到哪.即使我有一定的JS开发经验.'
---

# 一个简单的Dart程序

```dart
printInteger(int aNumber) {
  // print to console
  print('The number is $aNumber'); 
}

main() {
  var num = 12;
  printInteger(num);
}
```

首先,类似`JS`的双斜线注释,类似`C`的函数结构调用和函数声明,数据类型.典型的`print`内置输出函数和`main`顶级函数.



# 重要概念

Dart 重要概念如下:

- 变量中保存的一切都是对象,一切对象都是实例.所有对象继承于`Object`类.
- Dart是强类型的,支持类型推断,类型注释是可选的,同于`TS`,如果明确说明不需要任何类型,则可以描述为`dynamic`类型.
- 支持泛型: `List <int>` 整数列表, `List <dynamic>`任何类型的对象列表.
- Dart支持顶级函数(main),支持静态函数和实例函数,内建嵌套函数.
- 支持顶级变量,变量绑定在类或者对象上.例如可以通过类访问的静态对象变量和通过实例访问的实例对象变量,也称为`属性`或者`字段`
- `_`下划线开头的方法为私有方法.
- 标识符支持下划线开头,数字字母组合.
- Dart语法包含`表达式`和`语句`类似`JS`.
- Dart支持编译警告和错误提示,运行时错将引发`异常`.



# 变量

看代码:

```dart
// 定义并赋值,类型推断出为String类型
var name = 'name';

// 不限制类型
dynamic name = 'Aaron'
  
// 显式类型
String name = 'Aaron'

// 未赋值,默认值为 null
int count;
assert(count == null) // true,生产环境忽略assert

// 不可变变量
// 实例变量可以是final, 不可以是const,前者表示只能设置一次,后者表示声明的时候就需要设置.前者可以在实例化之后设置初始值.
final name = "Aaron"
const name = "Aaron"
// 如果const是class级别的,需要标记为 static const
```

# 

# 内建类型

Dart 支持如下内建类型:

1. Number
2. String
3. Boolean
4. List / Array
5. Map
6. Set
7. Rune(表示Unicode字符串)
8. Symbol



> Js内建类型: null, undefined, boolean, number, string, object, symbol,除了object外,称之为基本类型



## Number

`int`和`double`是`Number`的亚类型.

`Int`整数不大于64位,编译为`JS`则范围是-2^53~2^53-1

`double`64位双精度浮点数,依据`IEEE754`标准.

如下是字符串和数字的互相转化例子:

```dart
int.parse('1') == 1
  
double.parse('1.1') == 1.1

1.toString() == '1'
  
1.1234.toStringAsFixed(2) == '1.12'
```

`int`类型支持`按位运算`.例如:

```dart
assert((3 << 1) == 6); // 0011 << 1 == 0110
assert((3 >> 1) == 1); // 0011 >> 1 == 0001
assert((3 | 4) == 7); // 0011 | 0100 == 0111
```

## String

Dart 字符串是一组`UTF-16`单元序列,通过单引号或者双引号创建.

```dart
var s1 = 'Single quotes work well for string literals.';
var s2 = "Double quotes work just as well.";
var s3 = 'It\'s easy to escape the string delimiter.';
var s4 = "It's even easier to use the other delimiter.";
// 支持内嵌,直接使用变量不需要加 {},否则可以加 {}
var s = 'string interpolation';

assert('Dart has $s, which is very handy.' ==
    'Dart has string interpolation, ' +
        'which is very handy.');
assert('That deserves all caps. ' +
        '${s.toUpperCase()} is very handy!' ==
    'That deserves all caps. ' +
        'STRING INTERPOLATION is very handy!');
// 支持多行字符串,类似 python
var s1 = '''
You can create
multi-line strings like this one.
''';
// 支持 raw 字符串,类似 Python
var s = r"In a raw string, even \n isn't special.";
// 超强的Runes对Unicode字符的支持
// 略
```

## Boolean

Dart boolean 只有 `true` 和 `false`.Dart 类型安全意味着不能使用类似`JS` 的类型转换机制去进行条件判断.

`if (nonBooleanValue)`这种写法是错误的.

## List

> JS 说 array, Python 说 list

Dart 中的 Array 就是 `List`对象.几乎跟`JS`没什么差别.

``` dart
var l = [1,2] // 类型推断,l为List<int>,添加其他类型作为值是错误的.
  
l.length == 2
l[0] == 1
  
// 编译时常量
var constList = const [1,2,3]
// 现在不能改变了
constList[1] = 3 // error!
```

`List`类型包含了很多数据处理的函数.以及支持泛型.



## Set

无序且唯一的元素集合.可以通过类型实例化和字面量创建`Set`类型的数据.

```dart
var mySet = {'Aaron', 'Lisa'}; // <String>Set 类型
var mySet = <String>{}; // 设置空的Set
// 这样不是Set
var isMap = {};

// add element
mySet.add('Rain');
var otherSet = {'a', 'b'};
mySet.addAll(otherSet);
// 获取长度
mySet.length
  
// 创建编译时Set常量
final constSet = const {
  'Aaron',
  'Lisa'
};
```

## Map

Map多用于关联`keys`和`values`.二者可以是任何类型的对象,只是大多数情况下开发者使用`String`类型的`Key`而已.每个`Key`可以出现一次,如下代码所示创建简单`Map`:

```dart
var gifts = {
  // Key:    Value
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};

var nobleGases = {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};

// or
var gifts = Map();
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';

var nobleGases = Map();
nobleGases[2] = 'helium';
nobleGases[10] = 'neon';
nobleGases[18] = 'argon';

// 创建运行时常量
var constMap = const {
  1: 'a',
  2: 'b',
};
```

如上所示,`Dart`将会自动推断类型分别为:

- Map<String, String>
- Map<int, String>

这意味着如果你后续添加错误的类型数据,将会引发异常.

> Dart v2 中, new关键字是可选的.实例化不一定需要用new开头.



类似 JavaScript ，添加 key-value 对到已有的 Map 中：

```dart
var gifts = {'first': 'partridge'};
gifts['fourth'] = 'calling birds'; // Add a key-value pair
```

类似 JavaScript ，从一个 Map 中获取一个 value：

```dart
var gifts = {'first': 'partridge'};
assert(gifts['first'] == 'partridge');
```

如果 Map 中不包含所要查找的 key，那么 Map 返回 null：

```dart
var gifts = {'first': 'partridge'};
assert(gifts['fifth'] == null);
```



## Rune

有很多平常用不到的`Unicode`字符,在Dart中`Rune`支持表示`utf-32`编码的字符.

> Unicode 定义了一个全球的书写系统编码， 系统中使用的所有字母，数字和符号都对应唯一的数值编码。 

如果我需要使用`utf-32`位的字符,则务必想起`Rune`.

## Symbol

使用一个Symbol对象表示Dart程序中声明的`运算符`或者`标识符`.代码压缩后会改变标识符的名称,不会改变标识符的`Symbol`.



## 函数

函数是对象,类型为`Function`.举例:

```dart
// 声明了返回类型和变量类型
bool isNoble(int atomicNumber) {
  return _noBoleGases[atomicNumber] != number;
}

// 简写的箭头函数
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

函数参数有`可选参数`和`必选参数`的区别.

```dart
// 函数的参数具有名字和类型
void demoFunc(bold: true, hidden: false)
// 函数的参数被指定为必选
const Scrollbar({Key key, @required Widget child})
// 当child参数并未提供的时候,分析器报错
```

使用`required`的前置条件是直接或者间接引入了核心`package`即可,例如直接引入`package:meta/meta.dart`,或者引入了其他`package`,这个`package`export了`meta`即可.

> 如果解析器报错提示未引入meta,则可以从直接或者间接引入找解决方案

将参数放到 `[]` 中来标记参数是可选的, 使用`=`设置默认值：

```dart
String say(String from = 'root', String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
```

​	每个函数都有返回值,默认返回隐式的`null`.

### main函数

每个应用都具有的顶级`main`函数,作为应用服务的入口,其返回值为空,参数默认为可选的`List<String>`.

### 匿名函数

匿名函数也常常被称为`lambda`或者`closure`.

```dart
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
  print('${list.indexOf(item)}: $item');
});
```

跟`js`有点像,也可以是箭头匿名函数,上述实例中跟`js`有差的地方在于显示的`function`关键字.

### 词法作用域

变量的作用域在编写代码的时候确定,或括号内是变量可见的作用域.

### 闭包

`闭包`即一个`函数对象`,即使函数对象的调用对象在原始作用域之外,也可以访问它的词法作用域内的变量.

### 运算符

运算符是可以被重载的.但是多数情况下并没有必要重载.

> [重写运算符](https://www.dartcn.com/guides/language/language-tour#%E9%87%8D%E5%86%99%E8%BF%90%E7%AE%97%E7%AC%A6)

| Description              | Operator                                                |
| ------------------------ | ------------------------------------------------------- |
| unary postfix            | `*expr*++`  `*expr*--`  `()`  `[]`  `.`  `?.`           |
| unary prefix             | `-*expr*`  `!*expr*`  `~*expr*`  `++*expr*`  `--*expr*` |
| multiplicative           | `*`  `/`  `%` `~/`                                      |
| additive                 | `+`  `-`                                                |
| shift                    | `<<`  `>>`  `>>>`                                       |
| bitwise AND              | `&`                                                     |
| bitwise XOR              | `^`                                                     |
| bitwise OR               | `|`                                                     |
| relational and type test | `>=`  `>`  `<=`  `<`  `as`  `is`  `is!`                 |
| equality                 | `==`  `!=`                                              |
| logical AND              | `&&`                                                    |
| logical OR               | `||`                                                    |
| if null                  | `??`                                                    |
| conditional              | `*expr1* ? *expr2* : *expr3*`                           |
| cascade                  | `..`                                                    |
| assignment               | `=`  `*=`  `/=`  `+=`  `-=`  `&=`  `^=`  *etc.*         |

运算符具有优先级,使用括号有利于提高可读性.

| Operator  | Meaning                                                      |
| --------- | ------------------------------------------------------------ |
| `+`       | Add                                                          |
| `–`       | Subtract                                                     |
| `-*expr*` | Unary minus, also known as negation (reverse the sign of the expression) |
| `*`       | Multiply                                                     |
| `/`       | Divide                                                       |
| `~/`      | Divide, returning an integer result, `有趣`                  |
| `%`       | Get the remainder of an integer division (modulo)            |

```dart
assert(2 + 3 == 5);
assert(2 - 3 == -1);
assert(2 * 3 == 6);
assert(5 / 2 == 2.5); // 结果是双浮点型
assert(5 ~/ 2 == 2); // 结果是整型
assert(5 % 2 == 1); // 余数

assert('5/2 = ${5 ~/ 2} r ${5 % 2}' == '5/2 = 2 r 1');
```

Dart 还支持前缀和后缀，自增和自减运算符。

| Operator  | Meaning                                               |
| --------- | ----------------------------------------------------- |
| `++*var*` | `*var* = *var* + 1` (expression value is `*var* + 1`) |
| `*var*++` | `*var* = *var* + 1` (expression value is `*var*`)     |
| `--*var*` | `*var* = *var* – 1` (expression value is `*var* – 1`) |
| `*var*--` | `*var* = *var* – 1` (expression value is `*var*`)     |

### 类型判定运算符

`as`， `is`， 和 `is!` 运算符用于在运行时处理类型检查：

| Operator | Meaning                                                      |
| -------- | ------------------------------------------------------------ |
| `as`     | Typecast (也被用于[指定库前缀](https://www.dartcn.com/guides/language/language-tour#指定库前缀)) |
| `is`     | True if the object has the specified type                    |
| `is!`    | False if the object has the specified type                   |

例如， `obj is Object` 总是 true。 但是只有 `obj` 实现了 `T` 的接口时， `obj is T` 才是 true。

使用 `as` 运算符将对象强制转换为特定类型。 通常，可以认为是 `is` 类型判定后，被判定对象调用函数的一种缩写形式。 请考虑以下代码：

```dart
if (emp is Person) {
  // Type check
  emp.firstName = 'Bob';
}
```

使用 `as` 运算符进行缩写：

```dart
(emp as Person).firstName = 'Bob';
```

**提示：** 以上代码并不是等价的。 如果 `emp` 为 null 或者不是 Person 对象， 那么第一个 `is` 的示例，后面将不回执行； 第二个 `as` 的示例会抛出异常。

> 跟TS区别不大

### 赋值运算符

使用 `=` 为变量赋值。 使用 `??=` 运算符时，只有当被赋值的变量为 null 时才会赋值给它。

```dart
// 将值赋值给变量a
a = value;
// 如果b为空时，将变量赋值给b，否则，b的值保持不变。
b ??= value;
// 有趣
```

复合赋值运算符（如 `+=` ）将算术运算符和赋值运算符组合在了一起。

| `=`  | `–=` | `/=`  | `%=`  | `>>=` | `^=` |
| ---- | ---- | ----- | ----- | ----- | ---- |
| `+=` | `*=` | `~/=` | `<<=` | `&=`  | `|=` |

以下说明复合赋值运算符的作用：

|                             | Compound assignment | Equivalent expression |
| --------------------------- | ------------------- | --------------------- |
| **For an operator \*op\*:** | `a *op*= b`         | `a = a *op* b`        |
| **Example:**                | `a += b`            | `a = a + b`           |

以下示例使用赋值和复合赋值运算符：

```dart
var a = 2; // 使用 = 复制
a *= 3; // 复制并做乘法运算： a = a * 3
assert(a == 6);
```



### 级联运算符 (..)

级联运算符 (`..`) 可以实现对同一个对像进行一系列的操作。 除了调用函数， 还可以访问同一对象上的字段属性。 这通常可以节省创建临时变量的步骤， 同时编写出更流畅的代码。

> 比较特殊的一种`dart`语法

考虑一下代码：

```dart
querySelector('#confirm') // 获取对象。
  ..text = 'Confirm' // 调用成员变量。
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
```

第一句调用函数 `querySelector()` ， 返回获取到的对象。 获取的对象依次执行级联运算符后面的代码， 代码执行后的返回值会被忽略。

上面的代码等价于：

```dart
var button = querySelector('#confirm');
button.text = 'Confirm';
button.classes.add('important');
button.onClick.listen((e) => window.alert('Confirmed!'));
```

级联运算符可以嵌套，例如：

```dart
final addressBook = (AddressBookBuilder()
      ..name = 'jenny'
      ..email = 'jenny@example.com'
      ..phone = (PhoneNumberBuilder()
            ..number = '415-555-0100'
            ..label = 'home')
          .build())
    .build();
```



> 更多运算符暂时略过,已阅读文档

## 控制流程语句

你可以通过下面任意一种方式来控制 Dart 程序流程：

- `if` and `else`
- `for` loops
- `while` and `do`-`while` loops
- `break` and `continue`
- `switch` and `case`
- `assert`

使用 `try-catch` 和 `throw` 也可以改变程序流程

其中,`if`条件不会进行类型隐式转换,因此必须提供`boolean`值作为条件.

### for 循环

进行迭代操作，可以使用标准 `for` 语句。 例如：

```dart
var message = StringBuffer('Dart is fun');
for (var i = 0; i < 5; i++) {
  message.write('!');
}
```

闭包在 Dart 的 `for` 循环中会捕获循环的 index 索引值， 来避免 JavaScript 中常见的陷阱。

```dart
var callbacks = [];
for (var i = 0; i < 2; i++) {
  callbacks.add(() => print(i));
}
callbacks.forEach((c) => c());
```

和期望一样，输出的是 `0` 和 `1`。 但是示例中的代码在 JavaScript 中会连续输出两个 `2` 。

实现了`iterable`的类,例如`List`和`Set`支持使用`for-in`进行迭代.

### switch 和 case

在 Dart 中 switch 语句使用 `==` 比较整数，字符串，或者编译时常量。 比较的对象必须都是同一个类的实例（并且不可以是子类）， 类必须没有对 `==` 重写。

在 `case` 语句中，每个非空的 `case` 语句结尾需要跟一个 `break` 语句。 除 `break` 以外，还有可以使用 `continue`, `throw`，者 `return`。

下面的 `case` 程序示例中缺省了 `break` 语句，导致错误：

```dart
var command = 'OPEN';
switch (command) {
  case 'OPEN':
    executeOpen();
    // ERROR: 丢失 break

  case 'CLOSED':
    executeClosed();
    break;
}
```

但是， Dart 支持空 `case` 语句， 允许程序以 fall-through 的形式执行。

```dart
var command = 'CLOSED';
switch (command) {
  case 'CLOSED': // Empty case falls through.
  case 'NOW_CLOSED':
    // Runs for both CLOSED and NOW_CLOSED.
    executeNowClosed();
    break;
}
```

在非空 `case` 中实现 fall-through 形式， 可以使用 `continue` 语句结合 `lable` 的方式实现:

```dart
var command = 'CLOSED';
switch (command) {
  case 'CLOSED':
    executeClosed();
    continue nowClosed;
  // Continues executing at the nowClosed label.

  nowClosed:
  case 'NOW_CLOSED':
    // Runs for both CLOSED and NOW_CLOSED.
    executeNowClosed();
    break;
}
```

### assert

如果 `assert` 语句中的布尔条件为 false ， 那么正常的程序执行流程会被中断。 在本章中包含部分 assert 的使用， 下面是一些示例：

```dart
// 确认变量值不为空。
assert(text != null);

// 确认变量值小于100。
assert(number < 100);

// 确认 URL 是否是 https 类型。
assert(urlString.startsWith('https'));
```

> **提示：** assert 语句只在开发环境中有效， 在生产环境是无效的； Flutter 中的 assert 只在 [debug 模式](https://flutter.io/debugging/#debug-mode-assertions) 中有效。 开发用的工具，例如 [dartdevc](https://webdev.dartlang.org/tools/dartdevc) 默认是开启 assert 功能。 其他的一些工具， 例如 [dart](https://www.dartcn.com/server/tools/dart-vm) 和 [dart2js,](https://webdev.dartlang.org/tools/dart2js) 支持通过命令行开启 assert ： `--enable-asserts`。

assert 的第二个参数可以为其添加一个字符串消息。

```dart
assert(urlString.startsWith('https'),
    'URL ($urlString) should start with "https".');
```

assert 的第一个参数可以是解析为布尔值的任何表达式。 如果表达式结果为 true ， 则断言成功，并继续执行。 如果表达式结果为 false ， 则断言失败，并抛出异常 ([AssertionError](https://api.dartlang.org/stable/dart-core/AssertionError-class.html)) 。

> 更多内容已阅且省略

## 类

Dart 是一种基于类和 mixin 继承机制的面向对象的语言。 每个对象都是一个类的实例，所有的类都继承于 [Object.](https://api.dartlang.org/stable/dart-core/Object-class.html) 。 基于 * Mixin 继承* 意味着每个类（除 Object 外） 都只有一个超类， 一个类中的代码可以在其他多个继承类中重复使用。

### 使用类的成员变量

对象的由函数和数据（即方法和实例变量）组成。 方法的调用要通过对象来完成： 调用的方法可以访问其对象的其他函数和数据。

使用 `?.` 来代替 `.` ， 可以避免因为左边对象可能为 null ， 导致的异常：

```dart
// 如果 p 为 non-null，设置它变量 y 的值为 4。
p?.y = 4;
```

### 使用构造函数

通过 *构造函数* 创建对象。 构造函数的名字可以是 `*ClassName*` 或者 `*ClassName*.*identifier*`。

> **版本提示：** 在 Dart 2 中 `new` 关键字变成了可选的。

一些类提供了[常量构造函数](https://www.dartcn.com/guides/language/language-tour#常量构造函数)。 使用常量构造函数，在构造函数名之前加 `const` 关键字，来创建编译时常量时：

```dart
var p = const ImmutablePoint(2, 2);
```

构造两个相同的编译时常量会产生一个唯一的， 标准的实例：

```dart
var a = const ImmutablePoint(1, 1);
var b = const ImmutablePoint(1, 1);

assert(identical(a, b)); // 它们是同一个实例。
```

如果常量构造函数在常量上下文之外， 且省略了 `const` 关键字， 此时创建的对象是非常量对象：

```dart
var a = const ImmutablePoint(1, 1); // 创建一个常量对象
var b = ImmutablePoint(1, 1); // 创建一个非常量对象

assert(!identical(a, b)); // 两者不是同一个实例!
```

###  获取对象的类型

使用对象的 `runtimeType` 属性， 可以在运行时获取对象的类型， `runtimeType` 属性回返回一个 [Type](https://api.dartlang.org/stable/dart-core/Type-class.html) 对象。

```dart
print('The type of a is ${a.runtimeType}');
```

### 实例变量

下面是声明实例变量的示例：

```dart
class Point {
  num x; // 声明示例变量 x，初始值为 null 。
  num y; // 声明示例变量 y，初始值为 null 。
  num z = 0; // 声明示例变量 z，初始值为 0 。
}
```

未初始化实例变量的默认人值为 “null” 。

所有实例变量都生成隐式 *getter* 方法。 非 final 的实例变量同样会生成隐式 *setter* 方法。

### 构造函数

通过创建一个与其类同名的函数来声明构造函数.

```dart
class Point {
  num x, y;

  Point(num x, num y) {
    // 还有更好的方式来实现下面代码，敬请关注。
    this.x = x;
    this.y = y;
  }
}
```

> **提示：** 近当存在命名冲突时，使用 `this` 关键字。 否则，按照 Dart 风格应该省略 `this` 。

通常模式下，会将构造函数传入的参数的值赋值给对应的实例变量， Dart 自身的语法糖精简了这些代码：

```dart
class Point {
  num x, y;

  // 在构造函数体执行前，
  // 语法糖已经设置了变量 x 和 y。
  Point(this.x, this.y);
}
```

#### 命名构造函数

使用命名构造函数可为一个类实现多个构造函数， 也可以使用命名构造函数来更清晰的表明函数意图：

```dart
class Point {
  num x, y;

  Point(this.x, this.y);

  // 命名构造函数
  Point.origin() {
    x = 0;
    y = 0;
  }
}
```

切记，构造函数不能够被继承， 这意味着父类的命名构造函数不会被子类继承。 如果希望使用父类中定义的命名构造函数创建子类， 就必须在子类中实现该构造函数。