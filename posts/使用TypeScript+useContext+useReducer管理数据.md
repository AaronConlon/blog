---
title: '使用TypeScript+useContext+useReducer管理数据'
date: '12/24/2021'
tags:
- TypeScript
- 状态管理
mainImg: 'https://images.unsplash.com/photo-1607970669494-309137683be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAzNjExNjM&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1607970669494-309137683be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDAzNjExNjM&ixlib=rb-1.2.1&q=80&w=400'
intro: '这是一篇学习使用 TypeScript 去写 React Context 的学习心得。'
---

### 前言

在不引入第三方库的情况下，React Context 可以使用内置的`useContext`和`useReducer`两个钩子来创建状态管理模块。



### 代码

首先，在项目根目录下创建`contexts`目录，内部存放所有的`context`，可以根据不同的用途创建不同的目录，内层创建三个文件：

- context.ts 存放核心 context
- reducer.ts 存放数据变更专用的 reducer
- types.ts 存放 TypeScript 类型和接口定义

#### context

代码如下：

```tsx
import React, { createContext, useContext } from "react";
import { IState, IRootAction } from "./types";

// 定义初始状态值
export const initState: IState = {
  count: 0,
  profile: {
    name: "Aaron",
    age: 100,
  },
};

// 定义 context，使用 createContext api
export const RootContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IRootAction>;
}>({
  state: initState,
  dispatch: () => null,
});

// 导出 context 的 provider，用于放置 context 
export const RootContextProvider = RootContext.Provider;
// 导出 hooks ，便于获取 state 和 dispatch 函数
export const useRootContext = () => useContext(RootContext);
```

#### reducer

代码如下：

```tsx
import { IState, IRootAction } from "./types";

// 定义 reducer 的参数类型
export const rootReducer = (state: IState, action: IRootAction): IState => {
  const { type, payload } = action;
  // 根据类型进行处理，返回最终的 state
  switch (type) {
    case "add_count":
      return {
        ...state,
        count: state.count + (payload as number),
      };
    case "sub_count":
      return {
        ...state,
        count: state.count - (payload as number),
      };
    case "update_profile":
      return {
        ...state,
        profile: payload as typeof state.profile,
      };
    default:
      return state;
  }
};
```

#### types

共用的类型值：

```tsx
export interface IState {
  count: number;
  profile?: {
    name: string;
    age: number;
  };
}

export interface IRootAction {
  type: "add_count" | "sub_count" | "update_profile";
  payload:
    | number
    | {
        name: string;
        age: number;
      };
}

```

### 用法和解析

此时，只要在顶层使用 provider 即可：

```tsx
import { useReducer } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Total from "routes/total";
import Home from "routes/home";
import { rootReducer } from "contexts/root/reducer";
import { initState, RootContextProvider } from "contexts/root/context";

function App() {
  const [state, dispatch] = useReducer(rootReducer, initState);

  return (
    <RootContextProvider value={{ state, dispatch }}>
      <BrowserRouter>
        <div className="navs">
          <Link to={"/"}>Home</Link>
          <Link to={"/total"}>Total</Link>
        </div>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/total"} element={<Total />} />
        </Routes>
      </BrowserRouter>
    </RootContextProvider>
  );
}

export default App;

```

关键在于使用 `useReducer`传入`reducer`和默认数据，得到包含`state`和`dispatch`的数组，将二者传给`Provider`的`value`参数即可。

后续组件便可以如此：

```tsx
import CountBtn from "components/CountBtn";
import { useRootContext } from "../../contexts/root/context";
import Profile from "./Profile";

export default function Total() {
  const { state } = useRootContext();
  const { profile } = state;

  return (
    <div
      style={{
        margin: "2rem",
      }}
    >
      <p>count is: {state.count}</p>
      <CountBtn />
      <p>
        I am {profile?.name}, {profile?.age} years old.
      </p>
      <Profile profile={profile as any} />
    </div>
  );
}

```

通过`useRootContext`钩子获取到`state`，同时也可以获取到`dispatch`，有需要就可以修改数据了。

### 重复渲染的问题

当组件内使用了`useRootContext`后，`context`内任意数据变化都会引起当前组件重新渲染，举个例子：

当我使用`dispatch`更新了`count`的值，某个使用了`useRootContext`的组件即使没有使用`count`，也会重新渲染。

这个问题，可以有两种类似的方法解决：

- 方案 1：将组件返回的`jsx`封装成新的组件，将组件需要的数据通过`props`传入进去，并且此新组件通过`React.memo`包裹起来并导出，这时候传入的参数不变，则子组件不会重新渲染，这是利用了`React.memo`比较传入的`props`相等时不渲染的原理。
- 方案 2：将使用了`useRootContext`的组件 return 的`jsx`部分替换成`useMemo(() => 原先的jsx, [deps])`，原先的`jsx`内依赖的数据全部放到依赖数组里，这是利用了`useMemo`缓存`jsx`的原理。

当然还有更好的方案，比如：

- 拆分 Context ，构造一套更精细的数据更新控制机制，例如《[如何避免useContext重渲染](https://juejin.cn/post/6869340244954513421)》中提及的思路
- 使用第三方库，如[Recoil](https://recoiljs.org/zh-hans/)、[concent · power your react](https://concentjs.github.io/concent-site/)



### 总结

没啥好总结的，用`Recoil`或者`concent`吧。

