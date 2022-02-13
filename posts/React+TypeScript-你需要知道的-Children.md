---
title: 'React+TypeScript 你需要知道的 Children'
date: '2022/2/13'
tags:
- React
- TypeScript
mainImg: 'https://images.unsplash.com/photo-1537884944318-390069bb8665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQ3NTQ0OTc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1537884944318-390069bb8665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQ3NTQ0OTc&ixlib=rb-1.2.1&q=80&w=400'
intro: '关于使用 TypeScript 去写 React 应用，你需要了解一些关于 Children 的知识！'
---

### 前言

笔者在前端开发方向上依然还是新手，对于如何使用`TypeScript`去写`React`应用的时候，依然拿不准最佳实践。

但好在，学习这回事从来都是积少成多，循序渐进的。

ok，今天来分享一下关于`Children`这个概念在`React`中的知识点。

### FC

`FC`即`FunctionComponent`，这是一个标准的 `React` 类型。我们可以在定义函数式组件的时候使用这个类型。

看示例：

```tsx
type Props = {
  title: string,
}
const Page: React.FC<Props> = ({
  title,
  children,
}) => {
  <div>
  	<h1>{title}</h1>
    {children}
  </div>
}
```

`FC`中使用了泛型去增强组件传参的功能，上述示例中我们指定了`props`应该包含`title`属性，且值是字符串类型。

在这里我们没有在`Props`中定义`children`类型，但是这个属性已经在`FC`中定义好了，希望这不会让你感到迷惑以至于多写一些额外的代码。

### 显示定义 children 类型

但是，我也曾不了解`FC`为我们做的事情，我选择去显示定义`children`的类型。

暂且不去回想那段记忆，让我们来看看“我”可能会怎么写。

#### JSX.Element

既然函数式组件返回的是`JSX`，那么将`children`定义为`JSX.Element`也“很合理”啊~

可能代码会是这样:

```tsx
type Props = {
  title: string;
  children?: JSX.Element;
};
const Page = ({ title, children }: Props) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);
```

`children`是可选的，这样看起来没什么问题，但是想想。

如果我们为这个组件传入多个`children`会怎么样？显然，我们需要增强类型。

```tsx
type Props = {
  title: string;
  children?: JSX.Element | JSX.Element[];
}
```

#### ReactChild

我们要知道`JSX.Element`是不支持字符串类型的，但是将字符串作为`children`也是很常见的。

难不成，我们要像这样继续扩展类型？

```tsx
type Props = {
  title: string;
  children?: JSX.Element | JSX.Element | string | string[];
}
```

如果将数字作为`children`呢？

如果是`portals`、`fragments`呢？

......

还好，`React`提供了`ReactChild`标准类型，这个类型包含了上述各种可能的`children`类型。

👌🏻，最后我们显示定义了这样的类型：

```tsx
type Props = {
  title: string;
  children?: React.ReactChild | React.ReactChild[];
}
```

#### ReactNode

想更简洁一点？

```tsx
type Props = {
  title: string;
  children?: React.ReactNode;
};
```

`FC`泛型也使用了`ReactNode`。

> 如果你使用 Class 组件，`React.Compent`内置了`children`的类型（`ReactNode`）。

### 最后想说

周末快乐！但是，这周末我干了啥？？好像没有 😂

### 参考

- [React Children with TypeScript | Building SPAs](https://www.carlrippon.com/react-children-with-typescript/)
