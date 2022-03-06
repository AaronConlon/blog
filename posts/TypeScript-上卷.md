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
