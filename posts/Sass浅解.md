---
title: "Sass浅解"
date: "2021/12/16"
tags:
  - Sass
mainImg: "https://images.unsplash.com/photo-1569748130764-3fed0c102c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzk2NDQzMjM&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1569748130764-3fed0c102c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzk2NDQzMjM&ixlib=rb-1.2.1&q=80&w=400"
intro: "目前对 sass 编写样式表一知半解，在写手头的项目时十分不顺，效率低下，因此打算花两个小时重学 sass"
---

# 前言

时至今日，`Sass`已经可以视为一门编程语言了。笔者目前对 sass 编写样式表一知半解，在写手头的项目时十分不顺，效率低下，因此打算花两个小时重学 sass。

某种意义上而言本文仅仅是笔者对于文档的学习和思索，更好的学习方法依然是阅读文档，但是于我于有兴趣阅读此文的朋友而言都一样，我都希望我们能够有所得。

# 大纲

- 语法
- 样式规则
- 变量
- 操作
- 模块
- 断点和混入

## 语法

### 基础

sass 支持两种语法，二者可以互相载入，分别是：

- scss
- sass

二者的区别从扩展名开始，`scss`对`css`的兼容性是最好的，几乎所有的`css`都是有效的`scss`写法（除了错误的语法被忽略的那部分），正因如此，此语法广受推崇。

> 当你 copy 一段让人拍案叫绝的代码到自己的样式表中时，你什么都不需要做

笔者喜欢`.sass`第二种语法，本文内容建议使用`.sass`来理解。笔者很懒，`.sass`可以少写些许花括号和分号，唯一需要注意的是`.sass`对缩进的写法非常严格，不过这不是什么大问题。

### 解析样式表

> A Sass stylesheet is parsed from a sequence of Unicode code points. It's parsed directly, without first being converted to a token stream.

`sass`需要通过编译器去编译成`css`，流行的编译器如下：

- Dart Sass
- LibSass
- Ruby Sass

通常我们写样式都用不上除了英文和数字外的字符，上述编译器`Dart Sass`只支持`UTF-8`字符，只有当我们需要用超过`UTF-8`字符集的字符来写样式时，才需要考虑不使用`Dart Sass`。

当编译器遇到无效的语法时，解析会失败并且提供错误信息以便开发者修正错误语法。

### 样式表结构

除了和`css`类似的样式属性声明外，`sass`还支持许多增强型特性。

`sass`由一系列的语句块组成，语句块之间可以嵌套其他语句块。

#### 语句

我们可以将语句分为四种：

- css 语句
  - 样式规则
  - css @规则，例如 `@media`
  - Mixin
  - @at-root
- 普通语句
  - 变量声明 `$var: value`
  - 流程控制 `@if`
  - 规则控制 `@error`、`@debug`等
- 顶层语句(样式表顶层或嵌套的 css 顶层)
  - 文件引入 `@import`
  - 混入 `@minxin`
  - 函数定义 `@function`
- 其他语句
  - `@extend`语句写在样式属性中

前者易于理解，跟`css`更为接近。后者形如则是`sass`的核心，有了这些才撑起了整体结构。

即使对上述词汇了解不多也不需要担心，接下来逐一拆解学习。

#### 表达式

表达式语法即`SassScript`。

表达式位于属性或变量声明的右侧，表达式产生一个`值`。显然，任意有效的`css`值都可以理解为`sass`的表达式。

在`sass`中，表达式用于传给`mixin`或`function`,亦或配合`@if`控制流，甚至进行`算术运算`。

最简单的表达式只表示静态的值，例如：

- Numbers: 100px
- String: "bolder"
- Colors: #eee
- Booleans: true or false
- Lists: 1px 2px 0 1px
- Maps: 键值对映射，例如`("color": red, "font-size": 12px)`

其他表达式：

- 变量`$var`
- 函数调用`var(--color-bg-1)`
- 特殊函数`calc(1px + 100%)`或`url(...)`
- 父选择器 `&`
- `!important`

### 操作符

`sass`支持许多操作符语法：

- `== or !=`比较值
- `+ - * / % `数学计算
- `< <= > >=`逻辑判断
- `and or not`布尔值判断
- `+ - /`字符串拼接
- `()`优先级控制

### 注释

`sass`是编程语言，有注释很正常。

在 `scss` 中写注释，可以这样写：

```scss
// 这个注释不会出现在CSS中

/* 这个将会出现在CSS中，压缩模式下不会有 */

/* CSS中显示插值的计算结果
 * 1 + 1 = #{1 + 1} */

/*! 在压缩模式下也会显示 */

p /* 多行注释可以写在任何允许 */
  /* 使用空格的地方。 */ .sans {
  font: Helvetica,
    // 单行注释也是
    sans-serif;
}
```

回到正题，在`sass`中更简洁：

```scss
//  这个注释不会出现在CSS中
    这个也被注释掉了

/*  这个将会出现在CSS中，压缩模式下不会有

/*  CSS中显示插值的计算结果
 *  1 + 1 = #{1 + 1}

/*! 在压缩模式下也会显示

p .sans
  font: Helvetica, /* 内联注释必须是闭合的 */ sans-serif
```

> 当你打算编写样式库时，可以在文档的最上方使用三斜杠`///`来开头编写文档，最终`SassDoc`等工具可以读取并且生成美观的文档。

### 特殊函数

此前在表达式处提及特殊函数，在此重申之。

`url()`是`css`中常用的函数，在`sass`中需要用特殊的逻辑来解析它。简单来看，可以按`css`规则来调用，也可以使用`sass`变量或函数调用最后的值来解析。举个例子：

```scss
$roboto-font-path: "../fonts/roboto"

@font-face
    // This is parsed as a normal function call that takes a quoted string.
    src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2")

    font-family: "Roboto"
    font-weight: 100


@font-face
    // This is parsed as a normal function call that takes an arithmetic
    // expression.
    src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2")

    font-family: "Roboto"
    font-weight: 300
```

此外，还有其他的特殊函数：

css 中的**calc()**跟`sass`算法冲突，总之一句话，除了`sass`插值用于动态注入值之外，其他内容都作为原生`css`内容解析。

举个例子：

```scss
.logo
  $width: 800px
  width: $width
  position: absolute
  left: calc(50% - #{$width / 2})
  top: 0
```

Sass 中的`min()和 max()`二者在`css`支持之前就实现了，当这类特殊函数中不包含除了插值之外的任何`SassScript`的特性时，解析为`css`原生函数。

举个例子：

```scss
$padding: 12px

.post
  // Since these max() calls don't use any Sass features other than
  // interpolation, they're compiled to CSS max() calls.
  // 插值和原生的 env 函数
  padding-left: max(#{$padding}, env(safe-area-inset-left))
  padding-right: max(#{$padding}, env(safe-area-inset-right))


.sidebar
  // Since these refer to a Sass variable without interpolation, they call
  // Sass's built-in max() function.
  // 变量属于 SassScript
  padding-left: max($padding, 20px)
  padding-right: max($padding, 20px)
```

除此之外，还有众多内建函数，我们在配合相关知识点时候再总结。

## 变量

`$<variable>:<expression> `即变量定义，使用`$`开头进行定义，表达式求值。

> Sass 标识符和变量名都将连字符`-`和下划线`_`视为相同的字符。

任何地方都可以申明变量，`sass`的变量会被编译，因此一次只能有一个值，可以重新定义同名的变量，使用新值覆盖旧值，再使用新的变量和值，整个过程是命令式的。

在开发`sass`库时可以使用`!default`来编写变量默认值，普通开发者则无需关心。

举例：

```scss
// _library.sass
$black: #000 !default
$border-radius: 0.25rem !default
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default

code
  border-radius: $border-radius
  box-shadow: $box-shadow
```

```scss
// style.sass
$black: #222
$border-radius: 0.1rem

@import 'library'
```

显然，我们在使用他人开发的库时，可以预先定义一些变量来个性化样式表。库的开发者也可以用默认样式兜底。

既然有变量，当然也有`变量作用域`。

一个`sass`文件顶层声明的变量是整个文件全局可访问的，并且当这个文件被其他文件引入时，顶层的变量将被共享。

在块中声明的变量却是本地可用的，在当前块内可用，当块内变量和全局变量同名时，在块内的优先级更高。

但是依然有办法灵活应用规则，举个例子：

```scss
$variable: first global value;

.content {
  $variable: second global value !global;
  value: $variable;
}

.sidebar {
  value: $variable;
}
```

使用`!global`标志可以显式指定此变量为全局变量。

另外，在`流程控制`中声明的变量具有特殊的作用域，并且流程控制内只能`给外部存在的变量赋值`，而不能声明新的变量。

举个`scss`的例子：

```scss
$dark-theme: true !default;
$primary-color: #f8bbd0 !default;
$accent-color: #6a1b9a !default;

@if $dark-theme {
  $primary-color: darken($primary-color, 60%);
  $accent-color: lighten($accent-color, 60%);
}

.button {
  background-color: $primary-color;
  border: 1px solid $accent-color;
  border-radius: 3px;
}
```

引入此库的其他文件可以自定义暗色主题来控制当前样式的结果。

还有一个问题，如何判断变量是否存在？`sass`提供了以下函数：

- Variable-exists()
- Global-variable-exists()

二者分别判断当前作用域内变量和全局变量。

## 插值

只要我们需要将表达式的结果嵌入到`css`块中去，就可以使用`#{}`包装的表达式，这种语法被称为插值。

我们可以在任何地方使用插值，插值就像表达式替换。`sass`以一种直白的方式来让插值生效，举个例子：

```scss
@mixin corner-icon($name, $top-or-bottom, $left-or-right) .icon-#{$name} background-image:
  url("/icons/#{$name}.svg") position: absolute #{$top-or-bottom}: 0 #{$left-or-right}:
  0 @include corner-icon("mail", top, right);
```

先不论`mixin`和`include`是什么，无论你传入什么值过去，编译后将直接在原位置进行替换：

```css
.icon-mail {
  background-image: url("/icons/mail.svg");
  position: absolute;
  top: 0;
  left: 0;
}
```

> 需要注意的是，当插值花括号中包含引号时，带引号的字符串周围的引号会被删除。

## 样式规则

进入正题。

> `css`也已经存在嵌套的草案，很棒。

`sass`支持嵌套，这是`sass`随处可见的知识点，但凡看过 sass 的开发者都知道，无需赘述。关键在于：`控制嵌套深度 `，嵌套很棒但过深的嵌套生成的`css`代码就越多，三层足以避免过犹不及。

选择器列表支持和组合选择器可以直接使用`css`语法。

举个例子 🌰：

```scss
.enlarge
  font-size: 14px
	margin: 1rem
		top: 2rem
  transition:
    property: font-size
    duration: 4s
    delay: 2s

  &:hover
    font-size: 36px
	& > h1
		color: #333
	&r
		color: purple

	.other
		color: red
```

上述`enlarge`类内嵌套了`other`类，并且使用了`&`父节点选择器实现了`.enlarge:hover`、`.enlarge > h1`甚至是`.enlarger`这样的选择器效果。

其中`margin`属性名还可以视为命名空间嵌套着使用，编译出`margin-top: 2rem`的样式。

此外，编译器都能对多个父选择器做出判断：

```scss
ul, ol
  text-align: left

  & &
    padding:
      bottom: 0
      left: 0
```

上述父选择器按顺序进行编译，不必担心`ul`和`ol`在使用父选择器时出现顺序异常。

`&`父选择器可以作为判断条件，例如：

`if(&, '&.app-background', '.app-background')`

当前处于子级范围时，采用前者，否则采用后者。

> 即使是 css，选择器就已经非常强大了。

此外，还可以根据特定的条件去设置属性和值，此时声明一个`null`作为表达式，最终将不会编译此属性。

举个例子：

```scss
$rounded-corners: false

.button
  border: 1px solid black
  border-radius: if($rounded-corners, 5px, null)
```

最终的`css`文件将不包含`border-radius`属性。

`css`支持`自定义属性`，也称为`css`变量。这个机制允许开发者灵活的设置属性，同时`JavaScript`能够访问这些值。

在`sass`中对`css`自定义属性的处理需要关注的核心只有一个：仅有插值是动态的，其他标记都将原样编译为`css`，举个例子：

```scss
$primary: #81899b
$accent: #302e24
$warn: #dfa612
// 插值将顺利转换
:root
  --primary: #{$primary}
  --accent: #{$accent}
  --warn: #{$warn}

  // Even though this looks like a Sass variable, it's valid CSS so it's not
  // evaluated.
  // 下一行将原样编译为 css
  --consumed-by-js: $primary
```

此外，还需要了解一个非常强大的`sass`选择器：`占位符`选择器。

占位符选择器和其他`css`选择器类似，它以`%`开头，并且不会包含在`css`输出中，举个例子：

```scss
.alert:hover, %strong-alert
  font-weight: bold


%strong-alert:hover
  color: red
```

最终编译的结果如下：

```css
.alert:hover {
  font-weight: bold;
}
```

但是，我们却可以在`sass`中引用其内容对其他选择器进行扩展，减少代码量，举个例子：

```scss
%toolbelt
  box-sizing: border-box
  border-top: 1px rgba(#000, .12) solid
  padding: 16px 0
  width: 100%

  &:hover
    border: 2px rgba(#000, .5) solid

.action-buttons
  @extend %toolbelt
  color: #4285f4

.reset-buttons
  @extend %toolbelt
  color: #cddc39
```

如上所示，`.action-buttons`和`.reset-button`都被扩展了，最后的编译结果为：

```css
.action-buttons,
.reset-buttons {
  box-sizing: border-box;
  border-top: 1px rgba(0, 0, 0, 0.12) solid;
  padding: 16px 0;
  width: 100%;
}
.action-buttons:hover,
.reset-buttons:hover {
  border: 2px rgba(0, 0, 0, 0.5) solid;
}

.action-buttons {
  color: #4285f4;
}

.reset-buttons {
  color: #cddc39;
}
```

显然我们可以灵活编写占位符选择器，并且选择适当的情况下`扩展`其他选择器，还不用关心占位符选择器这部分代码，因为最终在不引用的情况下会忽略这部分而编译整体。

## 模块化

编程语言模块化可以将复杂的单文件拆分成多个小文件，将复杂环境拆分梳理为若干小环境，降低开发者的心智压力。

按照惯例，开发者将以`下划线`开头的`sass`文件视为`片段文件`，这些片段文件将被`@import`指令使用，如果不然`sass`编译器将忽略编译这些片段文件。

一句话，使用下划线开头的文件作为片段文件，在需要用到片段文件的`sass`文件使用`@import`指令将之引入，引入时需要`忽略下划线`。

> css 具有自己的 @import 规则，浏览器在解析到 css 的导入行为时将会发起一个 http 请求获取此目标文件。

`sass`将会获取目标导入文件，并且将此文件和被导入的文件结合，编译出最终样式表。

当将片段文件导入到目标文件后，目标文件可以使用片段文件中的内容。

## 规则

Sass 的大部分额外功能都是在 CSS 之上添加新[@规则](https://developer.mozilla.org/zh-CN/docs/Web/CSS/At-rule)

以下是我们可以在日常开发中使用起来的规则：

- @import 引入样式、mixin、函数、变量
- @mixin、@include 增强复用样式块
- @function 增强内置函数外的函数功能
- @at-root 将样式放入 CSS 文档的根目录中
- @error、@warn、@debug 用于调试
- @if、@each、@for、@while 控制函数逻辑

接着，我们逐一加深这些知识点的印象。

### @import

原生的`css`让浏览器呈现时增加`http`请求，而`sass`则在编译期间解决问题。

导入多个文件时可以添加逗号作为分隔，使用`.sass`语法时不需要为`URL`添加括号。并且导入的文件内容将会放在`@import`指令出现的位置，但嵌套导入的 mixin、函数、变量依然具有原作用域。

另外，对于导入的文件`URL`，编译器都能很好的自动进行忽略扩展名的文件查找，并且在路径上统一使用`/`作为分隔符。开发者不需要为不同平台的地址问题费心思了。

对于加载路径的优先级而言，本地文件的优先级高于`node_modules`下的库文件。

如果导入的是一个`css`文件（本地或远程）亦或使用了`url()`或媒体查询时，最终将会直接作为原生的`css`导入使用。

### @mixin

通过`@mixin`定义一个具名的`mixin`，通过`@include mixinName` 使用`mixin`。

> 从笔者个人层面来看，`mixin`就是`sass`这门语言的"函数"

`mixin`能够让我们轻松通过`复用`机制减少非语义类的使用，并且`mixin`非常灵活。

接下来我直接看几个`mixin`及其用法：

```scss
@mixin square($size, $radius: 0) width: $size height: $size @if $radius != 0 border-radius:
  $radius .avatar @include square(100px, $radius: 4px);
```

如上所示，可以预定义一个`mixin`，参数支持具有默认值的可选参数，这一点跟`JS`很像。

再看一个示例：

```scss
@mixin square($size, $radius: 0, $n: 1) width: $size height: $size @if $n != 1 border:
  #{$n}px .avatar @include square(100px, $n: 4);
```

可以传递具名的参数，这样可以忽略传参的顺序。

再看：

```scss
@mixin order($height, $selectors...) @for $i from 0 to length($selectors) #{nth(
    $selectors,
    $i + 1
  )} position: absolute height: $height margin-top: $i * $height @include order(150px, "input.name", "input.address", "input.zip");
```

如果最后一个参数以`...`结尾，即可将传入的额外参数视为一个可以迭代的列表。

> nth 是内建函数

最终的编译结果为：

```css
input.name {
  position: absolute;
  height: 150px;
  margin-top: 0px;
}

input.address {
  position: absolute;
  height: 150px;
  margin-top: 150px;
}

input.zip {
  position: absolute;
  height: 150px;
  margin-top: 300px;
}
```

再看一个`.scss`示例：

```scss
@mixin syntax-colors($args...) {
  @debug keywords($args); // (string: #080, comment: #800, $variable: $60b)

  @each $name, $color in keywords($args) {
    pre span.stx-#{$name} {
      color: $color;
    }
  }
}

@include syntax-colors($string: #080, $comment: #800, $variable: #60b);
```

传递多个参数，`mixin`的定义参数位不定键名参数，最终可以使用内建的函数获取到键值对。

再看：

```scss
@mixin btn($args...) {
  @warn "The btn() mixin is deprecated. Include button() instead.";
  @include button($args...);
}
```

看到这里，是否能感受到我们可以使用`sass`很方便的创建某个`UI`库的样式表，可以为团队创建基础的`sass`片段。

另外，`mixin`还支持内容块，只需要在`mixin`中添加一行`@content`即可，举个例子：

```scss
@mixin hover &: not([disabled]): hover @content .button border: 1px solid black
  @include hover border-width: 2px;
```

到这里我已经觉得复杂了，还可以支持多个`@content`和给内容块传参，善用`sass`真不容易，需要大量的使用场景和解决问题的经验。

### @function

通过`@function`来定义函数，并且可以在任何地方直接调动函数，就像我们使用`css`原生的函数一样。

此前笔者提及`mixin`如`sass`的函数，然而实际上`sass`的函数由`@function`定义，二者是单独的概念。

来看一个基础函数`pow`：

```scss
@function pow($base, $exponent) $result: 1 @for $_ from 1 through $exponent $result:
  $result * $base @return $result .sidebar float: left margin-left: pow(4, 3) * 1px;
```

如其名，计算乘方。关注函数的标识、参数、结构控制、返回值，这部分跟`mixin`是一样的。

此外，`sass`内建了诸多强大的函数方便我们开发使用，针对不同类型有：

- 颜色
- 列表
- 映射表
- 数学模块
- meta
- 选择器
- 字符串

`sass`有诸多语法和数据类型，根据这些数据可以配合这部分内建函数处理问题，例如我们需要调整一个颜色值：

```scss
color.adjust($color,
  $red: null, $green: null, $blue: null,
  $hue: null, $saturation: null, $lightness: null,
  $whiteness: null, $blackness: null,
  $alpha: null)
adjust-color(...) //=> color

@debug color.adjust(#6b717f, $red: 15); // #7a717f
@debug color.adjust(#d2e1dd, $red: -10, $blue: 10); // #c8e1e7
@debug color.adjust(#998099, $lightness: -30%, $alpha: -0.4); // rgba(71, 57, 71, 0.6)
```

这个内建函数实在是强大而方便，此刻笔者不必赘述，我也非常欠缺使用经验。

### @extend

`sass`继承指的是让某个选择器继承另一个选择器的样式。关键在于扩展的目标类是否有效，其中的扩展机制能够保证以下几点：

- 不会生成匹配不到任何元素的选择器
- 它确保复杂的选择器是交错的，这样无论嵌套 HTML 元素的顺序如何，它们都可以工作。
- 它尽可能地减少冗余选择器，同时仍然确保选择器的特性大于或等于被扩展的选择器的特性。
- 它知道一个选择器何时匹配另一个选择器所做的一切，并可以将它们组合在一起。
- 它智能地处理[组合选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors#Combinators)、[通用选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)和[:not 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)。

举个例子：

```scss
.content nav.sidebar
  @extend .info

// 不会扩展，因为“p”与“nav”不兼容。
p.info
  background-color: #dee9fc

// 没有办法知道.guide和.content的层级关系，因此Sass安全起见会生成两种选择器。
.guide .info
  border: 1px solid rgba(#000, 0.8)
  border-radius: 2px

// Sass知道每个匹配“main”的元素。也匹配“.content”。并避免生成不必要的交错选择器。
main.content .info
  font-size: 0.8em
```

最后的结果为：

```css
p.info {
  background-color: #dee9fc;
}

.guide .info,
.guide .content nav.sidebar,
.content .guide nav.sidebar {
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 2px;
}

main.content .info,
main.content nav.sidebar {
  font-size: 0.8em;
}
```

最后扩展的结果非常难以理解（对于我来说），在有必要的时候尽可能写让大多数人易于理解的扩展吧。

### 调试和信息

- @error
- @warn
- @debug

如上所示，都用于在编译时输出信息或者在调试时检查数据。

# 参考

- [Sass 中文文档](http://www.sass-china.com/)
- [SassMeister | The Sass Playground!](https://www.sassmeister.com/)
