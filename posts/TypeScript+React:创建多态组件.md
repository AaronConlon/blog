---
title: 'TypeScript+React:创建多态组件'
date: '2022/2/8'
tags:
- React
mainImg: 'https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQzMTUzNjM&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDQzMTUzNjM&ixlib=rb-1.2.1&q=80&w=400'
intro: '值得你花一分钟阅读的短文，简介如何创建多态组件。'
---

### 前言

笔者在油管上追踪了一些技术频道，今天看到一个很值得分享的短视频，此前笔者从未写过这样的代码，甚至从未想过如何实现多态的组件。

我觉得这或许会对新手朋友们👬🏻有帮助，也许吧~

> [Use Typescript to Build React Polymorphic Components - YouTube](https://www.youtube.com/watch?v=2QmsueWGL1c&list=PLMLZt4pr7Aq5BiAXhNXexzH6UYLtGKhnr&index=6)

今天，在这里把学到的东西分享给大家。

### 抛砖引玉

我们或许经常使用社区的一些 UI 框架，举个通用的示例：`<Text>`组件。

```jsx
<Text>好好吃饭</Text>
```

通常这些组件都支持我们配置一些选项属性，例如：

```jsx
<Text size="md" color="gray-70">好好吃饭</Text>
```

如果我们关心标签的语义化，那么势必应该不仅仅满足于将`Text`理解为这个组件是为了展示一段文本。

有时候，我们希望它渲染成`h1`，有时候则希望将之渲染成 `h5`，亦或是`p`。

我们可以通过添加`as`属性来让调用者灵活地选择希望渲染的标签，举个例子：

```jsx
<Text as="h2" size="lg" color="tomato-40">多喝热水</Text>
<Text as="label" size="lg" color="tomato-40">多锻炼</Text>
<Text as="p" size="lg" color="tomato-40">下雨天</Text>
```

这个组件的实现可以这么写：

```jsx
export const Text = ({
  as,
  children,
  size = 'md',
  color = 'gray-50',
  ...other
}) => {
  // 假设我们有一个辅助函数 getClasses 能根据属性对象生成一个字符串作为类名
  const classes = getClasses({size, color});
  const Component = as || 'p';
  return (
    <>
    	<Component {...other} className={class}>
      	{children}
    	</Component>
    </>
  )
}
```

其中的关键在于我们定义了一个`大写字母开头`的`Component`组件变量来保存我们想要渲染的标签，并且设置了一个默认值`p`作为备用。

> 在 JSX 中 React 将小写字母开头的变量视为标签的名字，因此要注意使用大写字母开头。

`other`则让我们的组件能保存用户传入的未知属性和值，最终传给返回的组件。比如，用户想要渲染`label`，那么我们就应该支持其传入`htmlFor`属性，这样`other`就派上用场了。

那么，这时候可能就会有人问，如何防止传入不适宜的属性呢？比如，预渲染一个`p`，那么我们就应该防止用户传入`href`属性值。

为了处理这个问题，我们可以使用`typescript`来写这个组件。我们可以通过`typescript`去限制传入的属性类型必须符合预期，并且通过静态检查提前发现问题，而不是让问题发生在浏览器端执行代码的时候。

### 实现`Text`

> Show me the code!

```tsx
interface Props<C extends React.ElementType> {
  /** 
  * 使用泛型提供一个 React 组件的继承类型
  */
  as?: C
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  color?: Color
}

type TextProps<C extends React.ElementType> = Props<C> &
	Omit<React.ComponentPropsWithoutRef<C>, keyof Props<C>>

export const Text = <C extends React.ElementType = 'p'>({
  as,
  children,
  size = 'md',
  color = 'gray-40',
  ...other
}: TextProps<C>) => {
  const classes = getClasses({ font, size, color })
  const Component = as || 'p'

  return (
    <Component {...other} className={classes}>
      {children}
    </Component>
  )
}
```

> 上述示例中使用了 TypeScript 的泛型知识，推荐阅读：[TypeScript Generics for People Who Gave Up on Understanding Generics](https://ts.chibicode.com/generics)

现在，我们实现了有效的类型检查。当我们将`as`属性值设置为`h1`的时候，泛型`C`保证在传入诸如`href`这样不存在于`h1`标签上的合法属性时会报错。

> 由于继承了 React.ElementType，泛型`C`具备了基础的`Element`类型支持，当传入诸如`something`这样无效的属性时也能发现问题。

这个`as`就像是一个参数，我们灵活地利用了`TypeScript`的泛型来保证类型正确。

