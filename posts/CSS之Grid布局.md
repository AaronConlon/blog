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

如果简写忽略了第二个值，则默认等于第一个值，新的标准

## 参考

- [CSS Grid 网格布局教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

