---
title: 'marquee已经过时了，滚动文字的另一种选择又是什么？'
date: '2021/6/15'
tags:
- 前端
mainImg: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjM2ODcwODA&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjM2ODcwODA&ixlib=rb-1.2.1&q=80&w=400'
intro: '在回顾 HTML 知识的时候看到文字滚动标签 marquee 被标记为不推荐标签，于是查找替代方案。'
---

在阅读文档的时候，发现醒目的红色提示：

> <p style="color:red">The marquee element is a deprecated HTML tag. If you use it, your pages or apps may be broken.</p>

话说回来，之前有用到这个标签，用法非常简单：

```html
<marquee>This is basic example of marquee</marquee>
```

直接在其内部写滚动的文本内容，可以为其提供各种描述性属性值，例如：

- width
- height
- direction
- scrolldelay
- 等等

借此控制显示效果，但是标准文档认为这部分功能应该由开发者通过`CSS`实现，而不是将之划在结构性标签的范围内。

无论如何，我们不再推荐使用`marquee`标签，毕竟此标签随时可能被删除（尽管其当前的兼容性极佳），为了便携而去更规范硬刚意义不大。

既然如此，我们可以使用`CSS`来实现相同的效果，来看示例：

首先，我们创建示例`HTML`结构：

```html
<div class="example">
   <p>滚吧。。。赶紧滚</p>
</div>
```

然后直接写`CSS`：

```css
.example {
  height: 2rem;
  overflow: hidden;
  position: relative;
}
.example p {
  position: absolute;
  margin: 0;
  width: 50%;
  height: 2rem;
  line-height: 2rem;
  transform: translateX(100%);
  animation: marquee 10s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-50%);
  }
}
```

> 这里没有加厂商前缀，只是作为演示，项目开发中配合使用`postcss`安装相关插件即可。

通过`CSS`动画来实现滚动相比较于使用`marquee`标签看似更复杂了一点，实际上也是对贯彻`呈现与样式分离`原则的一种提现，笔者也支持使用`CSS`来实现这个需求。

这里有一份代码示例：[A Pen by Thomas Bormans](https://codepen.io/thomasbormans/pen/EjMBqO)，原理一致。

先这样。
