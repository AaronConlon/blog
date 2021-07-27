---
title: '谷歌HTML-CSS代码风格指南<译>'
date: '2021/6/2'
tags:
- 翻译
mainImg: 'https://images.unsplash.com/photo-1488155436641-58ef42fcc44e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI2NDA1ODY&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1488155436641-58ef42fcc44e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI2NDA1ODY&ixlib=rb-1.2.1&q=80&w=400'
intro: '翻译了谷歌 html/css 代码风格指南，热乎的。行了，确实看了有收获，有些是自己平时就保持的好习惯，有些是自己没注意过的细节，先这样。'
---

## 1. 背景

本文档为编写`HTML`和`CSS`定义了若干代码风格和编码准则。本文的目标是为了提高代码质量和团队协作能力，并且使其支持基础建设的架构，将适用于原生的`HTML`、`CSS`甚至是`GSS`文件中。并且只要代码质量可维护，代码即可通过工具良好地进行的混淆、压缩或合并。

> [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)

## 2. 通用

### 2.1 通用样式规则

#### 2.1.1 协议

嵌入式资源引用尽可能使用`HTTPS`协议

总是使用`HTTPS`协议引用图片和其他媒体文件，样式表或脚本文件，除非目标文件不支持`HTTPS`协议的引用。

<p style="text-align: center">HTML 示例</p>

```html
<!-- 不推荐：省略协议 -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>

<!-- 不推荐：使用 HTTP -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>

<!-- 推荐 -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
```

<p style="text-align: center">CSS 示例</p>

```css
/* 不推荐 */
@import '//fonts.googleapis.com/css?family=Open+Sans';

/* 不推荐 */
@import 'http://fonts.googleapis.com/css?family=Open+Sans';

/* 推荐 */
@import 'https://fonts.googleapis.com/css?family=Open+Sans';
```

### 2.2 通用格式规则

#### 2.2.1 缩进

缩进设置为单次 2 个空格。

不要混用`tab`和`空格键`。

#### 2.2.2 大小写

以下范围内所有代码必须小写：

- `HTML` 标签及其属性、属性值（除非是文本或者 `CDATA`）
- `CSS` 选择器及其属、属性值（字符串除外）

示例如下：

<p style="text-align: center">HTML 示例</p>

```html
<!-- 不推荐 -->
<A HREF="/">Home</A>

<!-- 推荐 -->
<img src="google.png" alt="Google">
```

<p style="text-align: center">CSS 示例</p>

```css
/* 不推荐 */
color: #E5E5E5;

/* 推荐 */
color: #e5e5e5;
```

#### 2.2.3 结尾空格

应移除每行结尾不必要的若干空格字符。

```html
<!-- 不推荐 -->
<p>What?_

<!-- 推荐 -->
<p>Yes please.
```

### 2.3 元数据规则

#### 2.3.1 编码

使用无`BOM`的`UTF-8`编码，确保你的编辑器使用没有字节顺序标记的`UTF-8`编码格式。

> 更多有关于编码的信息和怎样指定它，请查看 [Character Sets & Encodings in XHTML, HTML and CSS](http://www.w3.org/International/tutorials/tutorial-char-enc/en/all.html)。

在`HTML`模板和文件中指定编码`<meta charset="utf-8">`不需要指定样式表的编码，其默认为`UTF-8`。



#### 2.3.2 注释

尽可能添加翔实的注释。

> 此规则是可选的，没有必要为每一个地方添加充分的注释，这样反而会让整体代码不够简洁，这取决于项目复杂度。

用注释去解释代码：这是什么？它的目的是什么？各自的解决方案是什么，优先使用哪一个？

#### 2.3.3 行动项

使用`TODO`标志来标记任务或行动项。

使用关键字`TODO`并且高亮关键字，或者使用其他诸如`@@`的注释格式，添加任务内容或者条目描述（用括号括起来），可以在冒号后添加条目说明：

```html
{# TODO(john.doe): revisit centering #}
<center>Test</center>

<!-- TODO: remove optional tags -->
<ul>
  <li>Apples</li>
  <li>Oranges</li>
</ul>
```

## 3. HTMl

### 3.1 HTML 风格指南

#### 3.1.1 文档类型

使用`HTML5`。

推荐为所有`HTML`文档使用`HTML5`语法编写：`<!DOCTYPE html>`。

（推荐编写`text/html`类型的`HTML`。不使用`XHTML`，其媒体类型为`application/xhtml+xml`，极少数浏览器不支持，且需要更多存储空间）

使用`HTML`不必为空元素写闭合标签，例如直接写：`<br>`，不要写`<br />`。

#### 3.1.2 HTML 有效性

尽可能使用有效的`HTML`代码，除非对文件大小有严格的性能目标而不得不缩减代码量。

使用诸如[(W3C HTML validator)](https://validator.w3.org/nu/)这样的工具进行测试。

使用有效的`HTML`是一个可衡量的代码质量基线，有利于了解其技术要求和约束，并且确保正确使用`HTML`。

```html
<!-- 不推荐 -->
<title>Test</title>
<article>This is only a test.

<!-- 推荐 -->
<!DOCTYPE html>
<meta charset="utf-8">
<title>Test</title>
<article>This is only a test.</article>
```

#### 3.1.3 语义化

> Use elements (sometimes incorrectly called “tags”) for what they have been created for.

根据其设计用途使用`HTML`元素（有时被错误地称为标签）。比如，使用标题元素`h1~h6`来展示标题，使用`p`元素来展示段落，使用`a`元素来展示超链接，诸如此类。

根据`HTML`元素的设计用途来展示数据，有利于提高可访问性、可重用性和代码质量。

```html
<!-- 不推荐 -->
<div onclick="goToRecommendations();">All recommendations</div>

<!-- 推荐 -->
<a href="recommendations/">All recommendations</a>
```

#### 3.1.4 多媒体备选方案

为多媒体提供备选方案。

对于多媒体，例如图像、视频、canvas 动画，应该确保提供替代性的内容。

对于图片，应该提供有效且明确的`alt`属性值。对于音视频来说，应该提供有效的副本和文案说明。

提供备选方案是很重要的，例如：盲人可以通过图片的`alt`属性值了解图片的相关内容，少数无法理解音视频内容的用户可以根据其文案去了解音视频的内容。

（图像的`alt`属性会产生冗余，如果使用图像只是为了纯粹的装饰，可以写成`alt=""`）

```html
<!-- 不推荐 -->
<img src="spreadsheet.png">

<!-- 推荐 -->
<img src="spreadsheet.png" alt="Spreadsheet screenshot.">
```

#### 3.1.5 关注点分离

将结构、表现与行为分开。

严格保持结构（HTML）、表现（CSS）和行为（Javascript）分离，并尽量让这三者之间的交互保持最低限度。确保文档和模板只包含`HTML`结构，把所有表现都放在样式表里 ，把所有行为都放在`Javascript`脚本里。

另外，尽量减少外部链接，使样式和脚本在文档中的接触面尽可能的小。

将表现和行为分开维护可以降低更改`HTML`文档结构和模板的成本。

```html
<!-- 不推荐 -->
<!DOCTYPE html>
<title>HTML sucks</title>
<link rel="stylesheet" href="base.css" media="screen">
<link rel="stylesheet" href="grid.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
<h1 style="font-size: 1em;">HTML sucks</h1>
<p>I’ve read about this on a few sites but now I’m sure:
  <u>HTML is stupid!!1</u>
<center>I can’t believe there’s no way to control the styling of
  my website without doing everything all over again!</center>

<!-- 推荐 -->
<!DOCTYPE html>
<title>My first CSS-only redesign</title>
<link rel="stylesheet" href="default.css">
<h1>My first CSS-only redesign</h1>
<p>I’ve read about this on a few sites but today I’m actually
  doing it: separating concerns and avoiding anything in the HTML of
    my website that is presentational.</p>
<p>It’s awesome!</p>
```

#### 3.1.6 实体字符

不要滥用使用实体字符

> 笔者对此很疑惑，实体字符的优点非常明显

没有必要使用诸如：`&mdash;, &rdquo;, or &#x263a;`之类的实体字符，尽管团队里使用一致的编辑器编码（UTF-8）。

在HTML文档中具有特殊含义的字符（例如 `< `和 `& `)以及 “不可见” 字符 （例如no-break空格）例外。

```html
<!-- 不推荐 -->
欧元货币符号是 &ldquo;&eur;&rdquo;。
<!-- 推荐 -->
欧元货币符号是 “€”。
```

#### 3.1.7 可选标签

省略可选标签（可选）。

> 笔者支持必须保持可选标签

如若为了优化文件大小和校验，可以考虑省略可选标签，哪些是可选标签可以参考 [HTML5 specification](http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html#syntax-tag-omission)。

（这种处理方案可能需要更明确的规定作为指引，众多开发者具有不同看法，考虑到一致性和简洁性的原因，最好的方法是统一省略可选标签。）

```html
<!-- 不推荐 -->
<!DOCTYPE html>
<html>
  <head>
    <title>Spending money, spending bytes</title>
  </head>
  <body>
    <p>Sic.</p>
  </body>
</html>
<!-- 推荐 -->
<!DOCTYPE html>
<title>Saving money, saving bytes</title>
<p>Qed.
```

#### 3.1.8 `type`属性

在引入样式表和脚本时省略`type`属性。

在样式表（除非不使用 CSS）和脚本（除非不适用 JavaScript）的标签中不添加`type`属性。

没有必要指定`type`属性值为`text/css`或`text/javascript`，无论是`HTML5`还是旧版本浏览器都默认支持此属性值。

```html
<!-- 不推荐 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css"
  type="text/css">
<!-- 推荐 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css">
<!-- 不推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"
  type="text/javascript"></script>
<!-- 推荐 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>
```

### 3.2 HTML 格式规则

#### 3.2.1 通用格式

每一个块级元素、列表偶然表格元素都独占一行，子元素都添加缩进。

独立元素的样式将块级元素、列表元素和表格元素都放在新行，如若这些元素是块级元素、列表或表格的子元素，则为之添加缩进。

（如果你遇到列表项左右是空白节点的场景，可以试着将所有`li`元素放在一行。某些格式化工具会使用告警信息代替错误提示。）

```html
<blockquote>
  <p><em>Space</em>, the final frontier.</p>
</blockquote>
<ul>
  <li>Moe
  <li>Larry
  <li>Curly
</ul>
<table>
  <thead>
    <tr>
      <th scope="col">Income
      <th scope="col">Taxes
  <tbody>
    <tr>
      <td>$ 5.00
      <td>$ 4.50
</table>
```

#### 3.2.2 HTML 换行

长单行换行（可选）。

如果没有限制行的长度，则可以考虑为了提高可读性而对过长的单行内容换行。如果换行，则至少为换行部分添加四个额外的空格作为缩进。

```html
<md-progress-circular md-mode="indeterminate" class="md-accent"
    ng-show="ctrl.loading" md-diameter="35">
</md-progress-circular>

<md-progress-circular
    md-mode="indeterminate"
    class="md-accent"
    ng-show="ctrl.loading"
    md-diameter="35">
</md-progress-circular>

<md-progress-circular md-mode="indeterminate"
                      class="md-accent"
                      ng-show="ctrl.loading"
                      md-diameter="35">
</md-progress-circular>
```



#### 3.2.3 HTML 引号

`HTML`属性值一律使用双引号。

```html
<!-- 不推荐 -->
<a class='maia-button maia-button-secondary'>Sign in</a>

<!-- 推荐 -->
<a class="maia-button maia-button-secondary">Sign in</a>
```

## 4. CSS

### 4.1 CSS 样式规则

#### 4.1.1 CSS 有效性

尽可能地使用有效的`CSS`样式。

除非是`CSS`校验程序`BUG`，或者是特殊语法，否则应编写有效的`CSS`代码。

用类似[W3C CSS validator](http://jigsaw.w3.org/css-validator/) 这样的工具来进行有效性的测试。

使用有效的CSS是一个可衡量的基线质量属性，如果发现有些`CSS`代码存在与否都没有影响效果，则可在确保`CSS`的用法正确性的同时删除这部分代码。

#### 4.1.2 id 和 class 命名

使用具有意义或具有通用性的 ID 或 class 名。

保持`id`和`class`名具有目的性或通用性强，绝不使用一些直觉上可用或带有神秘感的名字。

名字能反应元素的目的性或是特定的，二者是取名首选，因为这些名字易于理解且不易改动。

通用名称只是简单的作为没有特殊意义的元素的起名备选方案，可以起`helpers`这类宽泛的名字。

使用功能性或通用性的名字可以减少没有必要的文档改动。

```css
/* 不推荐: 无意义 不易理解 */
#yee-1901 {}

/* 不推荐: 表达不具体 */
.button-green {}
.clear {}
/* 推荐: 明确详细 */
#gallery {}
#login {}
.video {}

/* 推荐: 通用 */
.aux {}
.alt {}
```

#### 4.1.3 id 和 class 命名风格

`id`和`class`命名应该尽可能简短，但在必要时也可以使用长命名。

`id`和`class`应简要传达其目的和相关性。

使用上述方式命名`id`和`class`有利于编写高效代码，且易于理解。

```css
/* 不推荐 */
#navigation {}
.atr {}
/* 推荐 */
#nav {}
.author {}
```

#### 4.1.4 类型选择器

避免使用类型选择器限定`id`和`class`。

除非必要，不使用元素标签名和`id`或`class`进行组合。

出于[性能考虑](http://www.stevesouders.com/blog/2009/06/18/simplifying-css-selectors/)，避免使用父节点做选择器。

```css
/* 不推荐 */
ul#example {}
div.error {}
/* 推荐 */
#example {}
.error {}
```

#### 4.1.5 属性名简写

尽可能简写属性和属性值。

`CSS`提供一种简写属性值的特性（如`font`），开发者应该尽可能使用此特性编写样式，即使只是显式指定一个属性值。

使用属性名简写对于代码效率和可读性有益处。

```css
/* Not recommended */
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;
/* Recommended */
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```

#### 4.1.6 0 和 单位

在属性值为`0`时，除非有必要，否则一律省略单位。

```css
flex: 0px; /* This flex-basis component requires a unit. */
flex: 1 1 0px; /* Not ambiguous without the unit, but needed in IE11. */
margin: 0;
padding: 0;
```

#### 4.1.7 0 开头小数

省略`0` 开头小数点前的`0`。

当值大于 -1 小于 1 的时候，省略小数点前面的 0 。

```css
font-size: .8em;
```



#### 4.1.8 十六进制标记

尽可能使用三个字符的十六进制标记。

描述颜色值的时候常用，3个字符串十六进制标记更短更简明。

```css
/* 不推荐 */
color: #eebbcc;
/* 推荐 */
color: #ebc;
```



#### 4.1.9 前缀

选择器可以带应用特定功能性描述的前缀（可选）。

在大型项目以及嵌入其他项目或外部站点的代码中，`id`和`class`可以使用前缀（作为命名空间）。前缀可以使用简短的唯一标识符加一个横线。



#### 4.1.10 ID 和 Class 命名分隔符

在`id`和`class`中单独的词汇应该使用`-`（短横线）连起来。

> id 和 class 不区分大小写

不在`id`和`class`的命名中直接合并单词，也不应使用缩写词。使用分隔符可以提高可读性，更利于查找。

```css
/* 不推荐：“demo”和“image”中间没加“-” */
.demoimage {}

/* 不推荐：用下划线“_”*/
.error_status {}

/* 推荐 */
#video-id {}
.ads-sample {}
```

#### 4.1.11 Hacks

最好避免`CSS Hacks`，除非所有方法都尝试无果。

`Hacks`可以在特殊的场景下发挥奇效，但会让这些行为过于频繁，长期下来会伤害项目的效率，不利于代码管理，所以尽可能寻找其他解决方案。

### 4.2 CSS 格式化规则

#### 4.2.1 声明顺序

按字母顺序进行声明，易于记忆和维护。

忽略浏览器的特定前缀排序顺序，但多厂商前缀应相对保持排序（例如`-moz`在`-webkit`前面）。

> 浏览器前缀可以通过 `postcss`此类工具处理

```css
background: fuchsia;
border: 1px solid;
-moz-border-radius: 4px;
-webkit-border-radius: 4px;
border-radius: 4px;
color: black;
text-align: center;
text-indent: 2em;
```

#### 4.2.2 代码块内容缩进

所有代码块都应该保持缩进。

缩进所有[代码块](http://www.w3.org/TR/CSS21/syndata.html#block)的内容，它能够提高层次结构的清晰度。

```css
@media screen, projection {

  html {
    background: #fff;
    color: #444;
  }

}
```

#### 4.2.3 声明终止

在每一个声明语句后面添加分号。

每一个声明语句都添加分号可以增强一致性和可扩展性。

```css
/* 不推荐 */
.test {
  display: block;
  height: 100px
}
/* 推荐 */
.test {
  display: block;
  height: 100px;
}
```

#### 4.2.4 属性名终止

在属性名和冒号后面使用一个空格。

在属性名和冒号后面加一个空格以保持一致性。

```css
/* 不推荐 */
h3 {
  font-weight:bold;
}
/* 推荐 */
h3 {
  font-weight: bold;
}
```

#### 4.2.5 声明块分隔

在最后一个选择器和声明块之间用一个空格分隔开。

大括号的开括号部分应该和最后一个选择器在同一行。

```css
/* 不推荐：缺少空格 */
#video{
  margin-top: 1em;
}

/* 不推荐：选择器和开括号不在同一行 */
#video
{
  margin-top: 1em;
}

/* 推荐 */
#video {
  margin-top: 1em;
}
```

#### 4.2.6 选择器和声明块分隔

多个选择器和声明块之间不在同一行。

每一个选择器占一行。

```css
/* 不推荐 */
a:focus, a:active {
  position: relative; top: 1px;
}
/* 推荐 */
h1,
h2,
h3 {
  font-weight: normal;
  line-height: 1.2;
}
```

#### 4.2.7 规则分行

两个规则之间空一行（或者两行）。

```css
html {
  background: #fff;
}

body {
  margin: auto;
  width: 50%;
}
```

#### 4.2.8 CSS 引号标记

使用单引号标记属性值。

`url()`内的地址不使用引号括起来。

例外： 如果你需要使用`@charset`规则，则使用双引号代替单引号。

```css
/* 不推荐 */
@import url("https://www.google.com/css/maia.css");

html {
  font-family: "open sans", arial, sans-serif;
}
/* 推荐 */
@import url(https://www.google.com/css/maia.css);

html {
  font-family: 'open sans', arial, sans-serif;
}
```

### 4.3 CSS 元规则

#### 4.3.1 节注释

分组写注释（可选）

如果可以，分组编写注释，注释后空一行。

```css
/* Header */

#adw-header {}

/* Footer */

#adw-footer {}

/* Gallery */

.adw-gallery {}
```

## 最后想说

保持一致性。

如果你将要编写代码，先花几分钟看看原来的代码风格，并且尽量保持代码风格的一致性。

拥有代码风格指南的重点是拥有一个通用的代码描述风格，这样人们就可以专注在你所描述的内容，而不是思考你是如何描述的。

我们在这里展示了这些代码风格规则，以便于开发者们了解编码中一致性的代码风格的意义，但是自己的代码风格同样是很重要的。

如果您添加到文件中的代码看起来与它周围的现有代码截然不同，那么读者在阅读它时就会失去节奏。避免这种情况。
