---
title: '使用react和svg创建圆环进度条'
date: '2021/9/10'
tags:
- React
mainImg: 'https://images.unsplash.com/photo-1569396116180-210c182bedb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzEyMDQxMjc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1569396116180-210c182bedb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzEyMDQxMjc&ixlib=rb-1.2.1&q=80&w=400'
intro: '前段时间刚好接触一个设计页面需要用到圆形进度环，当时使用的是谷歌的 material-ui 的圆形进度条，为了实现设计图的效果需要对库组件进行修改，于是搜索了关于圆形进度条的实现，学了一手。'
---

前段时间刚好接触一个设计页面需要用到圆形进度环组件，当时使用的是谷歌的 material-ui 的组件，为了实现设计图的效果需要对库组件进行修改，于是搜索了关于圆形进度环的实现，学了一手使用 svg 的知识来创建这个“圆环”。

![image-20210910003938507](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/image-20210910003938507.png)

# 本文相关知识

- react 示例代码环境创建
- svg 🏷相关知识
- 碎碎念

# 开始

## 1. 创建 React 基础环境

很久以前，我断断续续的学习了`webpack`相关知识，后来工作中接触不到相关知识便淡忘了所学的内容，再看`webpack`的时候忽然觉得模棱两可且所知甚少，如下再次配置一遍基础环境是为了让自己加深一些印象。

> `Create-react-app` 很好，`codesandbox.io`也很方便，但是我还是想记录一下搭建简单的 React 开发环境。

首先，`yarn init -y`初始化根目录之后，即可安装以下依赖：

```bash
# react 核心依赖
yarn add react react-dom
# babel 相关依赖
yarn add -D babel-loader @babel/preset-env @babel/preset-react 
# webpack 依赖
yarn add webpack webpack-cli
# 使用 webpack 初始化其配置文件，根据需求会自动安装一些依赖
npx webpack init
```

接着，对`.babelrc`文件进行编辑使其支持`react`相关特性：

```js
{
  "plugins": ["@babel/syntax-dynamic-import"],
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ],
    ["@babel/preset-react"]
  ]
}
```

一切从简，接着安装`@chakra-ui`相关套件：

`yarn add @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^4`

熟悉了`chakra-ui`之后，可以很方便的直接写样式。

> Material-UI 的设计很好，也许未来可以尝试在项目中使用。

ok，接下来正式开始介绍今天的主题：`圆环进度条`。

## 2. 圆环进度环组件设计 - svg

首先，我们来回顾一下最终效果：

![image-20210910003938507](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/image-20210910003938507-20210910004529145.png)

如上所示，圆形中间有一个百分比字符串，圆形边缘是一个具有“进度”意义的紫色进度条，且其在整个环的占比为圆环中心的百分比字符串等值，并且其余百分比部分也有一个灰白色的样式。

我们可以通过`svg`标签来创建这个组件。

```jsx
return (
    <>
        <svg className="svg" width={} height={}>

        </svg>
    </>
);
```

`svg`的宽高可以通过组件的`props`传下来，在`svg`内部我们创建两个圆。

```jsx
<svg className="svg" width={} height={}>
    <circle
        className="svg-circle-bg"
        stroke={}
        cx={}
        cy={}
        r={}
        strokeWidth={}
    />
    <circle
        className="svg-circle"
        stroke={}
        cx={}
        cy={}
        r={}
        strokeWidth={}
    />
</svg>
```

> svg 可以使用 fill 和 stroke 属性来上色，fill 设置对象内部的颜色， stroke 设置对象边框线条的颜色。

`svg`具有`描边`的概念，描边是以路径为中心线绘制的。我们的圆环进度就是利用圆形边线描边实现的。

描边不能与边框属性`border`混淆，利用`svg`描边我们可以创建一些优美的`"边框"`。

看看描边的三种方式：

![](https://raw.githubusercontent.com/youyiqin/markdown_imgs/master/%253DSVG_Stroke_Linecap_Example.png)

我们的圆环就是使用 css 属性 `troke-linecap: round;`来实现的圆角，相较于默认的矩形边界，圆角看起来更柔和一些。

另外，圆环中心的文本使用`text`创建：

```jsx
<svg>
    ...
    <text className="svg-circle-text" x={}  y={}>
        ...
    </text>
</svg>
```

如下是`scss`样式：

```scss
.svg {
  margin: 100px auto;
  border-radius: 50%;
  background-color: rgb(216, 237, 238);
}

.svg-circle-bg {
  fill: none;
}

.svg-circle {
  fill: none;
  stroke-linecap: round;
  // 以下是为了让进度起始在 12 点钟位置而添加的设置中心点和旋转属性
  transform-origin: center;
  transform: rotate(-90deg);
  transform-box: fill-box;
}
.svg-circle-text {
  font-size: 2rem;
  text-anchor: middle;
  fill: tomato;
  font-weight: bold;
}
```

整个组件的关键在于`svg`中使用两个圆形，一个作为百分比未达到的部分的背景，我们可以设置需要用到的背景色。另一个圆形则为了利用其描边，我们可以通过计算周长来设置描边数组：

```jsx
...
const center = size / 2;
const radiu = center - stokenW / 2;
const circumference = 2 * Math.PI * radiu;
...
```

描边使用了`strokeWidth`来设置描边的宽度，`stroke-dasharray`描边数组值，使用`stroke-dashoffset`来设置显示偏移错位。

按我的理解来看，`stroke-dasharray`的值作为总数，`stroke-dashoffset`则表示描边显示的范围，当偏移等于总数的时候，显示整个描边内容。

> 组件源代码如下：

```jsx
import { Box } from '@chakra-ui/layout';
import React, { useEffect, useRef, useState } from 'react';
import './style.scss';

export default function MyProgress(props) {
  const {
    size = 300,
    progress = 0,
    stokenW = 12,
    circleOneStroke = '#eee',
    circleTwoStroke = 'purple',
  } = props;
  const center = size / 2;
  const radiu = center - stokenW / 2;
  const circumference = 2 * Math.PI * radiu;
  const [offset, setOffset] = useState(0);
  const svgRef = useRef();
  const oldProgress = useRef(progress);
  const [time, setTime] = useState(1);

  useEffect(() => {
    const newTime = Math.abs(oldProgress.current - progress);
    oldProgress.current = progress;
    setTime(12 * (100 - newTime));
  }, [progress]);
  
  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference; // 百分比乘以圆周，等于当前百分比对应的显示部分值
    setOffset(progressOffset);
    svgRef.current.style = `transition: stroke-dashoffset ${time}ms ease-in-out;`;
  }, [progress]);

  return (
    <Box>
      <svg className="svg" width={size} height={size}>
        <circle
          className="svg-circle-bg"
          stroke={circleOneStroke}
          cx={center}  // 圆心 x
          cy={center}  // 圆心 y
          r={radiu}    // 半径
          strokeWidth={stokenW}  // 描边宽度，边线是描边的中心
        />
        <circle
          className="svg-circle"
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radiu}
          strokeWidth={stokenW}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          ref={svgRef}
        />
        <text
          className="svg-circle-text"
          x={center}
          y={center}
          dominantBaseline="middle"
        >
          {progress}%
        </text>
      </svg>
    </Box>
  );
}

```

眼皮上下互博了，这个组件还有很多可以优化的地方。现在，父组件传递过来的`progress`百分比值的改动将会创建一个描边偏移的动画，在另外的场景下也许不需要这个动画，而是根据`progress`的值来动态调整偏移即可，因此说这个组件依然有很多值得优化的地方。

## 3. 碎碎念

上次写分享是什么时候了？本篇内容比较初级，因此只在这里发布😂。

anyway - 我做过很多半途而废的事情，不希望写分享这件事变成其中之一。

先这样吧，睡觉😴。

# 参考

- [How to build an SVG circular progress component using React and React Hooks - LogRocket Blog](https://blog.logrocket.com/how-to-build-an-svg-circular-progress-component-using-react-and-react-hooks/)
- [youyiqin/react-progress](https://github.com/youyiqin/react-progress) 源代码
