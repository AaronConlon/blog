---
title: 'TypeScript-上卷'
date: '2022/2/26'
tags:
- 
mainImg: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDU4NzEzMDI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDU4NzEzMDI&ixlib=rb-1.2.1&q=80&w=400'
intro: '工作中日常用到 TypeScript，故在此学习并记录备忘。此为上卷，亦有中下两卷。'
---

### *.d.ts*

> [TypeScript | 黯羽轻扬](http://www.ayqy.net/blog/category/typescript/)

#### 总领

TypeScript Declaration File: 用于存放类型声明，便于编辑器的智能提示。

> 类型声明具有一个原则：`不冲突即合法`

不同的声明文件有所区别，诸如`Jquery`之类的库可以通过`global`的方式引用，也可以通过模块的方式引用。

不同的场景，可以将类库声明分为以下几类：

- global 暴露为全局变量的类库
- module 通过加载机制引用的类库
- plugin 会影响其他类库功能的插件

基于这些场景，最佳实践是将声明文件分为以下几种并统一归类：

- global.d.ts: 全局类库声明
- module-function.d.ts: 暴露为函数的 module 类库声明
- module-class.d.ts: 暴露出一个 class 的类库声明
- module.d.ts: 一般的类库（暴露的内容既不是函数也不是 class）
- module-plugin.d.ts: 模块插件类库声明
- global-plugin.d.ts: 全局插件
- global-modifying-module.d.ts: 适用于 module 形式的全局插件类库

为不同功能或类型的类库按以上分类方式进行分类声明，有利于编写整洁的代码和提升可读性。

##### 语法格式

接下来看一下各种类型声明的语法格式：

首先是全局变量声明：

```typescript
declare var foo: number;
```

如此便声明了一个全局变量`foo`，编译器就会在遇到这个变量的时候得到其类型声明，就不会出现错误提示提及此变量未定义。

> 当然也可以用`declare let`或`delare fconst`来声明只读和块级作用域

其次，来看看全局函数声明和全局对象声明：

```typescript
// 函数声明
declare function greet(name: string): void;
// 对象声明
declare namespace myLib {
  function makeGreeting(s: string): string;
  const age: number;
}
```

函数声明还很好理解，全局对象声明这里有一个`namespace`命名空间关键字，在`TypeScript Handbook`里是这么形容的：

> 命名空间是位于全局命名空间下的一个普通的带有名字的JavaScript对象。

在声明过后，就可以在全局直接使用`myLib.age`。

##### 实践规范

除了语法格式，还应该遵守规范约束：

- 用基础类型而非包装类型（string 而非 String）
- 不要使用未出现的泛型参数
- 无返回值的函数返回声明不应该用`any`，而应该用`void`
- 善用可选参数、组合类型而少用函数重载

##### 类型、值和命名空间

`TypeScript`的类型系统的基本构成即：

- 类型
- 值
- 命名空间

类型的声明，可以有以下几种方式：

```typescript
// 别名
type options = number | string;

// 接口
interface I {
  x: number
}

// 类
class C {}

// 枚举
enum Direction {Left, Right, Top, Bottom}

// 类型引用
import * as m from 'someModule';
```

值的声明，则如下：

```typescript
// 变量
let
const
var

// 模块
namespace
module

// 枚举
enum

// 类
class

// 引用
import

// 函数
function
```

而命名空间，则通常用于组织类型，例如：`const x : A.B.C`则表示`x`的类型来自于`A.B`命名空间下的`C`

`class/enum/import`既可以声明值也可以提供类型，当在同一个命名空间下存在多个不同类型却名字相同的值时，不冲突即为合法，并且最终进行合并。举个例子：

```typescript
// 类型与类型的结合
interface Foo {
  x: number;
}
class Foo {
  y: number;
}
// ... elsewhere ...
interface Foo {
  z: number;
}
let a: Foo = ...;
console.log(a.x + a.y + a.z); // OK
```



##### 自动生成

`tsc`可以为扩展名改变的`js`文件自动创建类型声明文件，并且可以识别`jsdoc`。

当我们的`js`代码提供了良好的`jsdoc`文档时，`tsc`自动生成的`d.ts`文件有时可以满足我们的需求。



##### 发布

在编写`TypeScript`库的时候将`.d.ts`文件放在根目录一同发布出去即可让用户自动获取良好的类型声明支持。

在日常工作中，有些模块库的声明需要手动下载安装，例如之前一个版本的`lodash`:

`npm i -D @types/lodash`



### 基本类型

#### 基础

`JavaScript`七种类型，在`TypeScript`中一一对应如下：

```typescript
const isDone: boolean = false; // 布尔值

const decimal: number = 1; // 数字

const color: string = 'red'; // 字符串

const n: null = null; // null

const udf: undefined = undefined; // undefined

const obj: object = {}; // Object

const s: symbol = Symbol(); // Symbol
```

此外，还有以下几种基础类型：

```typescript
const list: number[] = [1, 2]; // 数组

const x: [string, number] = ['ok', 1]; // 元组

enum Direction { left, right, bottom, top }; // 枚举

const anything: any = 1; // 任意类型
const list: any[] = ['a', 'b', 1]; // 任意数组

function foo(): void {}; // 空类型

function neverReturn(): never {throw 'error'}; // 不存在返回值

let value: unknown; // 未知类型，更安全更严格的 any，但却不可以赋值给其他已知类型
```

#### 关注点

- Array 具有两种声明格式
  - elemType[]
  - Array<elemType>
- Tuple 越界时，值为所有定义的混合类型
- void 的意义约束了返回值只能是`null/undefined`
- `null/undefined/never`是其他类型的子类型，因此可以赋值给任何其他类型的变量
- 其他任何类型都不可以赋值给`never`(any 也不行)
- `never`可以用做类型保护，例如声明`declare const name: never`可以避免隐式访问`window.name`

> 开启`--strictNullChecks`时，`null/undefined`只可以赋值给`void`和各自对应的类型

#### 类型断言

类型断言可以理解成编译时的强制类型转换，意在告诉编译器：“我你比懂类型，这就是个`type`”。

类型断言具有两种类型：

- `variable as type`: 通用
- `<type>variable`: jsx 中有语法冲突，故一般用前者

#### Interface

`TypeScript`中的接口不必显示实现，而只表示一种类型的约束。

```typescript
interface Demo {
  // 索引签名，适用于无法确定属性名的场合
  [x: string]: string
  // 只读属性
  readonly x: number;
  // 只读数组
  list: ReadonlyArray<number>;
  // 只读索引签名
  readonly [propName: string]: string
}
```

接口还可以用来表示函数类型：

```typescript
interface SearchFc {
  (source: string, subStr: string): string;
}
let mySearchFc = (source: string, subStr: string) => {
  let res = source.search(subStr);
  return res.toString();
}
```

> 函数参数检查会按顺序检查，但是不必严格限制参数名

此外，接口和类之间还有`implements`的关系：

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime: (d: Date) => void
}
class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

> 接口即协议，接口即契约

接口可以`继承`：

```typescript
// 单继承
interface Shape {
  color: string;
}
interface Square extends Shape {
  sideLength: number;
}
// 多继承
interface PenStroke {
  penWidth: number;
}
interface Square extends Shape, PenStroke {
  sideLength: number;
}
```

此外，还支持`!后缀类型断言`：

```typescript
let x: string | undefined | null;
x!.toUpperCase();
// 相当于
(<string>x).toUpperCase();
// 或者
(x as string).toUpperCase();
// Object is possibly 'null' or 'undefined'.
x.toUpperCase();
```

#### 类

> ES3 不支持 getter/setter
>
> 只有`getter`，没有`setter`则推断为`readonly`

示例：

```typescript
class Employee {
  // 公有属性，默认
  public like: string;
  // 私有属性
  private _fullName: string;
  // 静态属性
  static ok: boolean;
  // 访问器
  get fullName(): string {
    return this._fullName;
  }
  set fullName(name: string) {
    this._fullName = name;
  }
}
// 接口继承类
interface More extends Employee {
  age: number;
}
// 继承
class B {
  // 抽象方法，子类继承则必须实现
  abstract makeSound(): void;
}
class A extends B {
  makeSound() {}
}
```

#### 函数

函数类型的组成：

- 参数
- 返回值

示例：

```typescript
// 具名函数
function add(x: number, y: number): number {
  return x + y;
}
// 匿名函数
const add = function(x:number,y:number):number {
  return x + y;
}
```

有时候，我们想复用特定函数的类型，可以使用类型描述：

`(x: number, y: number) => number`即函数类型描述

```typescript
const add: (x: number, y: number) => number = function(x: number, y: number): number {
  return x + y;
}
```

> 箭头（`=>`）左侧是参数及其类型，右侧是返回值类型

参数有些是可选的，可选参数只需要在参数名后加`?`号，可选参数必须在必选参数之后，默认参数则不必在乎顺序，但是在调用时需要传`undefined`作为值。



### 泛型

#### 基础

场景如下：

```typescript
function demo(arg) {
  return arg;
}
```

泛型相当于具名`any`!

```typescript
function demo<T>(arg: T): T {
  return arg;
}
```

用尖括号声明泛型，在函数参数和返回值的地方就可以用此泛型参数。

上述示例表达了函数传值和返回值类型的关系：`T => T`。

> 变量分为普通变量和类型变量，普通变量代表值，传递值。
>
> 类型变量则`搬运`类型信息。

#### 类型描述

泛型函数的类型描述和普通类型类似：

```typescript
// 普通函数
const demo: (arg: string) => string = function(arg: string): string {
  return arg;
}

// 泛型函数
const demo: <T>(arg: T) => T = function<T>(arg: T): T {
  return arg;
}
```

> 在实际开发中，依靠类型推断即可，不必要写如此多的显示类型声明

此外，还可以写成对象字面量的形式去声明类型（不够简洁）

```typescript
// 泛型函数
let myIdentity: { <T>(arg: T): T };
// 普通函数
let myIdentity: { (arg: string): string };
```

#### 泛型接口

带类型参数的接口即泛型接口。

```typescript
interface GenericIdentityFn<T> {
  isArr(...args: T[]): T[];
  id(arg: T): T;interface GenericIdentity<T> {
  id(arg: T): T;
  idArray(...args: T[]): T[];
}
let id: GenericIdentity<string> = {
    id: (s: string) => s,
    // 报错 Types of parameters 's' and 'args' are incompatible.
    idArray: (...s: number[]) => s,
  };
}
```

#### 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add:(x: T, y: T): T;
}
```

`静态成员无法使用泛型！`

```typescript
class GenericNumber<T> {
  // 报错 Static members cannot reference class type parameters.
  static zeroValue: T;
}
```

#### 泛型的约束

泛型需要约束，泛型的约束也有很多方式。

较为常见的是通过`extends`继承接口去限制泛型。

```typescript
interface Lengthwise {
  length: number;
}
function logginIdentity<T extends Lengthwise>(arg: T):T {
  console.log(arg.length);
  return arg;
}
```

另外，还可以在泛型约束中使用类型参数，即用一个类型参数的特征去约束另一个类型参数。

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

> 泛型能作用于一系列类型，是具体类型之上的`抽象`

### 枚举

常用枚举可以按值的类型分为三种：

- 数值枚举
- 字符串枚举
- 异构枚举

> 此外还有特殊的联合枚举、常量枚举、环境枚举

#### 数值枚举

示例如下：

> initializer 机制适合在不关心值的情况下

```typescript
enum Direction {
  up, // default is 0
  down,
  left,
  right,
}
// 指定开始值然后自动递增
enum Direction {
  up = 1, // default is 1
  down,
  left,
  right, // 4
}
```

此时，可以通过反向映射机制取到常量名：

> 反向映射仅限于数值枚举

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
// 正向 按名取值
console.log(Direction.Down);  // 1
// 反向 按值取名
console.log(Direction[1]);    // 'Down'
```

#### 字符串枚举

字符串枚举必须要求成员具有显式的初始化值，并且不支持反向映射，其优势在于保留了值的含义。

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

#### 异构枚举

枚举值中同时包含数值和字符串，但我们很少这样做。

```typescript
enum mixEnum {
  S = 'S',
  A = 1,
  B,
  C = 'C'
}
```

其他几种枚举，工作中接触不多而网上说明也足够，故不再赘述。

### 类型推断

#### 赋值推断

编译器提供了强大的类型推断支持，帮了我们大忙。编译器可以根据目标值来确定类型，具体如下：

- 变量或成员初始值
- 参数默认值
- 函数返回值

还有以下一些隐式的类型推断示例：

```typescript
let x = [1, null];
```

数组元素中包含`number`和`null`，而`null/undefined/never`是其他任何类型的子类型，可以赋值给其他类型变量。

因此，`x`被推断为`number[]`。

> 要确定数组类型的话，先要确定每个元素的类型，再考虑其兼容关系，最终确定一个最“宽”的类型（包容数组中所有其它类型，称为best common type）作为数组类型
>
> ------黯羽轻扬

#### 上下文推断

根据已知的类型，推断变量的类型。

```typescript
window.onmousedown = function(mouseEvent) {}
```

右侧匿名函数作为`mousedown`事件处理器，其参数类型按`DOM API`的规范来推断即可得出类型，如果脱离了事件处理器上下文，则参数是`any`类型。

还有一些场景会根据上下文进行类型推断：

- 类型断言
- return 语句
- 对象成员和数组字面量

> 补充一下子类型兼容性图

![](mdImgs/ts-subtype-1024x438.png)

如上所示：

- `any`兼容所有类型。

- `never`不兼容任何类型。
- `void`兼容`undefined`和`null`

> 我们说的兼容，指的是被兼容的类型可以赋值给兼容者类型的变量。如果不希望如此，则需要开启`--strictNullChecks`选项来严格限制。

```typescript
let x: any;
let y: number;
let z: null;

// Any兼容Number
x = y;
// Number兼容Null
y = z;
// Null不兼容Number
// 错误 Type 'number' is not assignable to type 'null'.
z = y;
```

但是，有些时候类型推断并不如人意。

```typescript
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let s = Status.Ready;
// Type 'Color.Green' is not assignable to type 'Status'.
s = Color.Green;  // Error 不同枚举类型的枚举值不兼容
```

但是，如果你认为数值枚举和数字类型不兼容，那就错了。

而字符串枚举却又不兼容字符串类型。

我们致力于写清晰的代码，因此不推荐过渡依赖于类型上下文推断。

### 组合类型

#### 交叉类型

```typescript
interface A {
  a: string;
}
interface B {
  b: number
}

let x: A & B;
// 都是合法的
x.a;
x.b;
```

#### 联合类型

```typescript
// 示例 1
interface DateConstructor {
  new (value: number | string | Date): Date;
}
// 示例 2
interface A {
  id: 'a';
  a: string;
}
interface B {
  id: 'b';
  b: number
}

let x: A | B;
// 只能访问公共成员
x.id; // ok
// 错误 Property 'a' does not exist on type 'A | B'.
x.a;
// 错误 Property 'b' does not exist on type 'A | B'.
x.b;
```

正因为想要访问某些可能存在的成员，有时候需要用`类型保护`机制。

举个例子：

```typescript
let x: number | string;
if (typeof x === 'string') {
  // 正确 typeof类型保护，自动缩窄到string
  x.toUpperCase();
}
```

使用类型判断去确定其拥有的方法即可，此之谓类型缩紧。与`typeof`相对的，也常用`instanceof`来检查实例和类的所属关系。

### 类型别名

`type`关键字可以为现有类型创建一个具有更好的可读性的`别名`。

举个例子:

```typescript
// demo 1
type TStringArray = string[];
// demo 2
type PersonName = string;
type PhoneNumber = string;
type PhoneBookItem = [PersonName, PhoneNumber];
type PhoneBook = PhoneBookItem[];

let book: PhoneBook = [
  ['Lily', '1234'],
  ['Jean', '1234']
];
```

并且，类型形式与接口类似，都支持类型参数，且可以引用自身：

```typescript
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}

interface ITree<T> { 
  value: T;
  left: ITree<T>;
  right: ITree<T>;
}
```

### 索引类型

索引类型能让静态检查覆盖到类型不确定的动态场景。

```typescript
interface pluck {
  <T, K extends keyof T>(o: T, names: K[]): T[K][]
}

let obj = { a: 1, b: '2', c: false };
// 参数检查
// 错误 Type 'string' is not assignable to type '"a" | "b" | "c"'.
pluck(obj, ['n']);
// 返回类型推断
let xs: (string | number)[] = pluck(obj, ['a', 'b']);
```

上述内容中有两个点：

- `keyof`：索引类型`查询`操作符
- `T[K]`：索引`访问`操作符

永远记住，`keyof`是针对类型的，如果`obj`是一个值，则使用`keyof obj`是不合法的。

`T[K]`则属于类型层面的属性访问操作。举个例子，如果`t`和`k`是变量，其类型分别是`T`和`K`，那么`t[k]`可用时，其类型为`T[K]`。

### 映射类型

想从现有类型衍生出新类型，可以使用映射类型。

```typescript
// 找一个“类型集”
type Keys = 'a' | 'b';
// 通过类型映射得到新类型 { a: boolean, b: boolean }
type Flags = { [K in Keys]: boolean };
```

关键字：`[K in Keys]` 在形式上类似于索引签名，也能得到新的类型。

### 模板

`TypeScript`兼容`ES Module`规范，文件即模块。在文件中包含合法的`import/export`语句即可视为模块，否则将运行在全局作用域下。

```typescript
let x = 1
function f() { }
// 会被编译成
var x = 1;
function f() { }

// 而
let x = 1
export function f() { }
// 会被编译成（以 AMD 形式为例）
define(["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var x = 1;
  function f() { }
  exports.f = f;
});
```

有时，我们可能会看到这样的代码：

```typescript
export = something;
```

这是为了支持`CommonJS`和`AMD`模块而提供的特殊语法，类似于：

```typescript
// NodeJS CommonJS
let x = {a: 1};
export.x = x;
module.exports = x;
```

这种特殊语法，其模块引入语法也比较特殊：

```typescript
import module = require('myModule')
```

在编译的时候，可以指定`-m`来选择需要的模块格式：

```bash
 // tsc -m xxx
 'commonjs' # NodeJS模块定义
 'amd'      # AMD
 'system'   # SystemJS
 'umd'      # UMD
 'es6'      # ES Module
 'es2015'   # 等价于es6
 'esnext'   # 尚未收入ES规范的前沿模块定义，如`import(), import.meta`等
 'none'     # 禁用所有模块定义，如import, export等（用到的话会报错）
```

默认为`--target`选项有关，`target === "ES3" or "ES5" ? "CommonJS" : "ES6"`!

> `-lib`表示源代码特性，指定`ES 版本`可以让我们在写代码的时候使用更多新特性。

#### 模块声明

对于缺少类型的第三方模块，可以通过声明文件`(d.ts)`为其补充类型声明。

```typescript
// types.d.ts
declare module "my-module";

// index.ts
import x, {y} from "my-module";
x(y);
```

如此可以快速使用第三方模块，所有成员都具有`any`类型。

#### 模块解析

当我们将代码拆分为多个模块之后并且引入，在编译时编译器需要知道依赖的模块的确切信息。即建立模块名到模块文件路径的映射。

在`TypeScript`里，一个模块可以是`.ts/.tsx/.d.ts`文件，开启`--allowJs`的话，还可以对应`.js/.jsx`文件。

在寻找模块的时候，先找模块对应的文件（`.ts/.tsx`），没找到且不是相对模块则寻找外部声明（`.d.ts`），再没找到则报错`Can not find module 'xxx'`。

在引入代码中，相对和非相对模块的区别非常明显：

```typescript
// 相对
import Entry from "./components/Entry";
import { DefaultHeaders } from "../constants/http";
import "/mod";
// 非相对
import * as $ from "jquery";
import { Component } from "@angular/core";
```

模块的解析分为两种策略：

- `Classic`
- `Node`

在`--mooduleResolution`编译选项为`AMD/System/ES6`时为前者，否则采用和`NodeJS`模块机制一致的解析策略。



##### Classic

在 Classic 策略下，相对模块引入会相对于要引入的文件来解析，例如：

```typescript
// 源码文件 /root/src/folder/A.ts
import { b } from "./moduleB"
```

会尝试查找：

```typescript
/root/src/folder/moduleB.ts
/root/src/folder/moduleB.d.ts
```

而对于非相对模块引入，从包含要引入的文件的目录开始向上遍历目录树，试图找到匹配的定义文件，例如：

```typescript
// 源码文件 /root/src/folder/A.ts
import { b } from "moduleB"
```

会尝试查找以下文件：

```typescript
/root/src/folder/moduleB.ts
/root/src/folder/moduleB.d.ts
/root/src/moduleB.ts
/root/src/moduleB.d.ts
/root/moduleB.ts
/root/moduleB.d.ts
/moduleB.ts
/moduleB.d.ts
```

##### NodeJS 模块解析

NodeJS 中通过`require`来引入模块，模块解析的具体行为取决于参数是相对路径还是非相对路径

相对路径的处理策略相当简单，对于：

```typescript
// 源码文件 /root/src/moduleA.js
var x = require("./moduleB");
```

匹配顺序如下：

1. 尝试匹配`/root/src/moduleB.js`
2. 再尝试匹配`/root/src/moduleB/package.json`，接着寻找主模块（例如指定了`{ "main": "lib/mainModule.js" }`的话，就引入`/root/src/moduleB/lib/mainModule.js`）
3. 否则尝试匹配`/root/src/moduleB/index.js`，因为`index.js`会被隐式地当作该目录下的主模块

非相对模块引入会从`node_modules`里找（`node_modules`可能位于当前文件的平级目录，也可能在祖先目录），NodeJS 会向上查找每个`node_modules`，寻找要引入的模块，例如：

```typescript
// 源码文件 /root/src/moduleA.js
var x = require("moduleB");
```

NodeJS 会依次尝试匹配：

```typescript
/root/src/node_modules/moduleB.js
/root/src/node_modules/moduleB/package.json
/root/src/node_modules/moduleB/index.js

/root/node_modules/moduleB.js
/root/node_modules/moduleB/package.json
/root/node_modules/moduleB/index.js

/node_modules/moduleB.js
/node_modules/moduleB/package.json
/node_modules/moduleB/index.js
```

P.S.对于`package.json`，实际上是加载其`main`字段指向的模块。

`TypeScript`使用`NodeJS`策略时，会额外查找`.d.ts`声明。

> `exclude`配置项能排除一系列文件，以免将不需要的文件加入到编译过程中来。

### 命名空间

源自`JavaScript`中的模块模式，不建议使用此旧时代产物。

### 声明合并

类似于`CSS`中的同类样式的合并，`TypeScript`也会合并同类声明。

```typescript
interface IPerson {
  name: string;
}
interface IPerson {
  age: number;
}

// 等价于
interface IPerson {
  name: string;
  age: number;
}
```

