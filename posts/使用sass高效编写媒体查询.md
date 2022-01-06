---
title: "使用sass高效编写媒体查询"
date: "2021/12/19"
tags:
  - Sass
mainImg: "https://images.unsplash.com/photo-1611175697352-c8a3d5719783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzk4NjAwMzk&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1611175697352-c8a3d5719783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Mzk4NjAwMzk&ixlib=rb-1.2.1&q=80&w=400"
intro: "此前一直使用第三方库的功能编写媒体查询代码，最近则需要单独使用 sass 来写媒体查询，本文记录如何处理这个问题。"
---

### 前言

此前一直使用第三方库的功能编写媒体查询代码，最近则需要单独使用 sass 来写媒体查询，本文记录如何处理这个问题 📝。

> 愿笔者和读者皆有所得。

### 介绍

通常我们在处理响应式的样式表问题时会采用`CSS Media Queries`技术，这项功能可以让我们按不同设备类型或特定的设备参数来修改样式表属性。

媒体查询的语法如下：

```css
@media 媒体类型和条件 {
  // 样式表
}
```

通常，我们会为某种设备类型单独添加样式，诸如：

- all 所有设备
- print 打印预览模式
- screen 屏幕
- speech 语音合成器

最常用的即 screen 屏幕，用户体验设计得较好的产品则会全面考虑其他设备类型。

此外便是其他条件，诸如：

- (min-width: 960px): 宽度至少为为 960px 时
- (max-width: 960px): 宽度最大为 960px 时
- (aspect-ratio: 11/5): 长宽比为 11 比 5 时
- ...

诸多条件，根据需求按文档处理，不同的条件可以使用逻辑操作符联和起来：

- `and` 与
- `not` 非
- `only` 限定
- `,` 或

举个例子：

```css
@media screen and (aspect-ratio: 11/5) {
  ...;
}
```

则为长宽比为 11:5 的屏幕设备添加样式。

### sass 媒体查询

ok，使用`sass`编写媒体查询之前为了方便，我们来创建一个片段文件`_mixins.scss`：

```scss
@mixin responsive($breakpointer) {
  @if $breakpointer == mobile {
    @media screen and (max-width: 480px) {
      @content;
    }
  } @else if $breakpointer == tablet {
    @media screen and (min-width: 768px) {
      @content;
    }
  } @else if $breakpointer == desktop {
    @media screen and (min-width: 960px) {
      @content;
    }
  }
}
```

之后便可以在其他`sass`文件中`@import mixins`引入提前准备好的`mixin`，示例如下：

```scss
@import mixins .container @include responsive(tablet) background: purple @include
  responsive(mobile) background: blue @include responsive(desktop) background: tomato;
```

> 笔者更喜欢 .sass ，在写的时候混入了。

从某种程度上看，我们已经可以直接用这个`mixin`来写诸多样式了，搞定？

直到我看到这个项目：

[eduardoboucas/include-media: 📐 Simple, elegant and maintainable media queries in Sass](https://github.com/eduardoboucas/include-media)

以及这篇文章：

[Approaches to Media Queries in Sass - CSS-Tricks](https://css-tricks.com/approaches-media-queries-sass/)

还有这个：

[Breakpoint](http://breakpoint-sass.com/)

> 我突然意识到我得把我写的`mixin`删除干净，以免丢人现眼。

### 更好的方案

上述几个 🔗 链接有 GitHub 仓库，有 css-stricks 文章，还有一个断点概念介绍。

每个人心里都有自己喜欢的方案，我打算就在前人栽好的树下乘凉：

`Eduardo Bouças’s`的作品`include-media`!

我们可以通过`npm`直接安装`include-media`，然后在`sass`文件中导入并且使用：

```scss
@import include-media $breakpoints:
  (phone: 480px, tablet: 768px, desktop: 1024px) .container @include media(
    ">=phone",
    "<=tablet"
  ) background-color: purple @include media(">=tablet", "<=desktop")
  background-color: blue @include media(">desktop") background-color: red width:
  4rem height: 4rem;
```

相比较与其他的硬编码方式，`include-media`支持定义自定义的断点，并且通过">="这样的比较符号来更`精细`地控制间隔。

上述代码中我添加了断点变量，实际上库已经为我们设定了一系列默认变量，诸如上述几个设备类型，也支持高清屏`retina2x`等条件。使用默认变量还是自定义变量，自定义变量使用什么命名都由你选择。

举个例子：

```scss
@include media(">desktop", "<=1150px") {
  font-size: 4rem;
}
```

上述代码可以默认编译出在默认的`desktop`到`1150px`范围内的媒体查询代码，更多示例可查看官方文档。

感谢！

### 参考

- [eduardoboucas/include-media: 📐 Simple, elegant and maintainable media queries in Sass](https://github.com/eduardoboucas/include-media)
- [Approaches to Media Queries in Sass - CSS-Tricks](https://css-tricks.com/approaches-media-queries-sass/)
- [Breakpoint](http://breakpoint-sass.com/)
