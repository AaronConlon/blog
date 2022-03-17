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

