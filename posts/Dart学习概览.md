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

