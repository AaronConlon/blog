---
title: 'CSS之Grid布局'
date: '2021/6/10'
tags:
- CSS
mainImg: 'https://images.unsplash.com/photo-1494322296366-b46227baa318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjMyNTUyMjM&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1494322296366-b46227baa318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjMyNTUyMjM&ixlib=rb-1.2.1&q=80&w=400'
intro: '我打算使用 Grid 布局来设计我的音乐网站《岚》，所以这是一篇学习总结类的文章。'
---

网格布局`(Grid)`被视为当前最强大的`CSS`布局方案。

善用网格布局，可以轻松实现界面布局，并且具有现代浏览器良好的支持度。

## 1. 前言

我需要的布局大致如下：

![](https://i.loli.net/2021/06/10/GlXYwLiM4uyUIst.png)

可以看到，此布局并不复杂，我们可以使用多种方式来实现它，但今天我的计划是使用`Grid`布局。

`Grid`布局将容器划分为“行”与“列”，产生单元格，然后指定“item”所在的单元格，因此也常被视为“二维布局”。

## 2. 基本概念

### 2.1 容器和项目

如名所示，最外层的元素作为容器`(container)`，内部每一个最外层的元素作为一个单独的项目`(item)`。

```html
<main>
	<section>a</section>
 	<section>b</section>
  <section>c</section>
</main>
```

`Grid`布局针对`main`生效，`section`作为`item`，其内部元素与布局无关。

### 2.2 行和列

![](https://i.loli.net/2021/06/10/IFci7q2pKmdLsG6.png)

我想这一张图已经非常明显地使用深色体现出行`(row)`与列`(column)`的区别，行和列是有交叉的。

### 2.3 单元格和网格线

行列交叉的区域，我们称之为`Cell(单元格)`，如前言所示，我们将子元素放在单元格中。而深色区域，我们将之称为`Grid line(网格线)`，通常`n`行`m`列，即可产生可供布局的`n*m`个`Cell`。

不要讲空白区域视为单元格，单元格始终是`行`和`列`相交产生的。

## 3. 容器属性和项目属性

`Grid`布局属性分为定义在`container`上的`容器属性`,定义在`item`上的`项目属性`。

### 3.1 容器属性

#### 3.1.1 display

显示为`container`设置`display: grid`显示属性布局为`grid`。

```css
div {
  display: grid;
}
```

此时，`container`是一个单独的容器，默认是块级元素，也可以设置`display: inline-grid`为行内`Grid`布局，使其整体视为一个行内块级元素。

> 网格布局将使得子项（item）的`float`、`display: inline-block`、`display: table-cell`、`display: vertical-align`、`display: column-*`等设置失效。

#### 3.1.2 grid-template-rows 、grid-template-columns

`grid`布局除了需要显示指定布局类型为`grid`外，还需要指定行和列的值。

`grid-template-rows`定义行高，有多少行就提供多少个值。

`grid-template-column`定义列宽，同样，有多少列就提供多少个值。

例如，如果我们要设置一个九宫格，则分别需要三行三列：

```css
.container {
  display: grid;
  grid-template-rows: 100px 100px 100px;
  grid-template-column: 100px 100px 100px;
}
```

如此一来配上`item`(css 提供一些颜色值):

```html
<div id="container">
  <div class="item item-1">1</div>
  <div class="item item-2">2</div>
  <div class="item item-3">3</div>
  <div class="item item-4">4</div>
  <div class="item item-5">5</div>
  <div class="item item-6">6</div>
  <div class="item item-7">7</div>
  <div class="item item-8">8</div>
  <div class="item item-9">9</div>
</div>
```

我们可以得到一个九宫格布局：

![](https://i.loli.net/2021/06/10/ACZfnmovTdDsiwk.png)



除了使用`px`这样的绝对单位，也可以使用百分数，甚至可以使用`repeat`类函数简化赋值：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-template-rows: repeat(3, 33.33%);
}
```

甚至是：

```css
.container {
  display: grid;
  grid-template-columns: repeat(2, 100px 40px 50px);
  grid-template-rows: 50px 50px 50px;
}
```

定义了`100px 20px 80px 100px 20px 80px`，6 列宽度不一的列。

![image-20210610012604962](https://i.loli.net/2021/06/10/1UQYPNlAax5rodI.png)

如上所示，第三行由于没有`item`，默认空白。

某些场合下，我们希望容器尽可能填充每一行的`item`，可以使用`auto-fill`关键字：

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
}
```

![image-20210610012923160](https://i.loli.net/2021/06/10/RkMNLhud9IpliCw.png)

容器根据最大宽度进行自动列填充，此时行与列的数量是根据宽度变化的。

某些场合下，我们希望动态根据片段比例对行数进行判断，次数可以使用`fr(fraction)`关键字，表示列的宽度片段，例如：

```css
.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
}
```

上述示例表示，第一列宽度为整个容器宽度的`2/3`，第二列为`1/3`，一般配合绝对宽度使用可以实现很灵活的布局效果：

```css
.container {
  display: grid;
  grid-template-columns: 150px 1fr 2fr;
}
```

上述示例，每一行先扣除第一列的`150px`宽度，剩下的再动态计算分配。也可以使用`auto`关键字，由浏览器决定长度。

```css
grid-template-columns: 100px auto 100px;
```

网格线可以具有名字，并且可以有多个名字`（使用中括号括起来）`，方便后续复用。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```

#### 3.1.3 gap

网格线间距属性`gap`，其属性为行和列的简写：

```css
.container {
  gap: <row-gap> <column-gap>;
  gap: 20px 20px;
}
```

如果简写忽略了第二个值，则默认等于第一个值。

#### 3.1.4 grip-template-areas

网格布局可以通过字符串，抽象画的划分不同`item`所属的区域。

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
}

.area-a {
  grid-area: a;
  ....
}
```

`grid-template-areas`通过空格将不同区域分割开来，然后可以在`css`中直接使用`grid-area`属性和区域名作为值，再为标签添加类即可针对性的设置样式。

不使用的区域可以使用`.`占位，可以不同`cell`具有相同的`area`名，以便于指定样式，例如：

```css
grid-template-areas: 'a . a'
                     'b . b'
                     'c . d';
```

> `grip-template-rows`可以定义子项高度，同时也可以为网格线命名，而网格线可以有多个名字。`grid-template-areas`指定区域名的时候，也默认生成了`areaName-start`和`areaName-end`这样的网格线别名。

#### 3.1.5 grid-auto-flow

容器划分好网格后，容器内`item`按顺序放置，默认先行后列，这个顺序是可以更改的。`grid-auto-flow`就是设置这个顺序的属性，默认值为`row`,先行后列，如果需要先列后行，则设置值为`column`。

当某行或者某列按次序放置子项的时候，存在剩余宽度不足的情形，如果需要可以在`row`或`column`后添加一个`dense`值，二者用空格分开，意为尽可能让子项连续密集显示，如此一来就会跳过宽度超过剩余宽度的子项，按序优先使用后续满足条件的子项。例如：

![](https://i.imgur.com/P3bSu2L.png)

属性：

```css
grid-auto-flow: row dense;
```

结果：

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/bg2019032514-20210612221449095.png)

对于某些严格需要避免中间空白的布局来说，这个属性非常有效。

#### 3.1.6 单元格位置

`justify-items`设置单元格水平布局，`align-items`设置单元格垂直布局，二者可选的值为：

- start
- end
- center
- Stretch （默认值，拉伸）

如果要设置整个容器内的单元格位置，也就是将容器内所有单元格视为一个整体，其布局属性可用：

- justify-content:：整体水平对齐
- align-content： 整体垂直对齐
- place-content：此为上述两个属性的简写方式，如果忽略第二个值则采用第一个值

这几个布局属性的值类似`flex`的布局值，分别是：

- start
- end
- center
- stretch（拉伸）
- Space-around 项目两侧间隔相等，子项之间距离两个间隔
- Space-between 子项之间距离相等，第一个子项和最后一个子项左边或右边没有空白，紧贴容器
- Space-evenly 子项左右空白距离相等

#### 3.1.7 grid-auto-rows and grid-auto-columns

当`容器网格`只有三行的时候，如果需要指定某个`子项`在第五行，这时候浏览器自动`根据子项大小`创建新的网格以放置额外的子项，我们可以通过`grid-auto-rows`和`grid-auto-columns`指定自动创建的网格的高度和宽度。

例如：

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-auto-rows: 50px; 
}
```

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/bg2019032525.png)

之所以`8`和`9`会占据图中的位置，是因为我们使用`css`指定其行和列的位置值：

```css
.item-8 {
  background-color: #d0e4a9;
  grid-row-start: 4;
  grid-column-start: 2;
}

.item-9 {
  background-color: #4dc7ec;
  grid-row-start: 5;
  grid-column-start: 3;
}
```

由此引出`grid-row-start`和`grid-column-start`属性，可以指定其元素的位置。

除了`start`还有`end`可以指定，看示例：

```css
.item-1 {
  grid-column-start: 2;
  grid-column-end: 4;
}
```

此时如果没有指定`grid-auto-flow: row dense;`,则会让布局看起来如下图所示：

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/bg2019032526.png)

为了方便记忆，可以将网格线数字改为网格线名。

这四个属性的值还可以使用`span`关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

```css
.item-1 {
  grid-column-start: span 2;
}
```

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/bg2019032528.png)



#### 3.1.8 属性简写

此前我有翻译过`google html & css guide`文档风格指南，其中有一条建议是尽量在`css`中使用简写，我认为这是一个很好的准则。

`grid-template`属性是`grid-template-columns`、`grid-template-rows`和`grid-template-areas`这三个属性的合并简写形式。

`grid`属性是`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`这六个属性的合并简写形式。

> 如果你喜欢简写，务必不要弄错简写的属性顺序。

`grid-column`属性是`grid-column-start`和`grid-column-end`的合并简写形式，`grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式。

```css
.item {
  grid-column: <start-line> / <end-line>;
  grid-row: <start-line> / <end-line>;
}
```

下面是一个例子。

```css
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
```



上面代码中，项目`item-1`占据第一行，从第一根列线到第三根列线。

这两个属性之中，也可以使用`span`关键字，表示跨越多少个网格。

```css
.item-1 {
  background: #b03532;
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}
/* 等同于 */
.item-1 {
  background: #b03532;
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}
```

[上面代码](https://jsbin.com/volugow/edit?html,css,output)中，项目`item-1`占据的区域，包括第一行 + 第二行、第一列 + 第二列。

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/bg2019032529.png)

`grid-area`属性还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的合并简写形式，直接指定项目的位置。

```css
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}

.item-1 {
  grid-area: 1 / 1 / 3 / 3;
}
```

效果如上图所示。

### 3.2 子项属性

子项和容器的属性可以拆分开来，通过诸如`justify-self`等带`self`关键字的属性控制单独的子项的样式，并且优先级高于容器上相关的样式属性。

#### 3.2.1 justify-self 、align-self、place-self

`justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。

`align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

`place-self`属性是`align-self`属性和`justify-self`属性的合并简写形式。

```css
place-self: center center;
```

如果省略第二个值，`place-self`属性会认为这两个值相等。

## 4. 解题

学习了`grid`布局的知识后，让我们将之运用到一开头我的需求中来，再次看这个图：

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/GlXYwLiM4uyUIst-20210613022942072.png)

针对性的容器`CSS`如下：

```css
.container {
  
}
```



## 参考

- [CSS Grid 网格布局教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

