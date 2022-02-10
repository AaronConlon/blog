---
title: 'TypeScript+React的常见类型总结'
date: '2022/1/15'
tags:
- React
- TypeScript
mainImg: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIyMjk0ODA&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDIyMjk0ODA&ixlib=rb-1.2.1&q=80&w=400'
intro: '在使用 TypeScript 开发 React 应用的时候，经常遇到一些事件需要添加类型，在此总结。'
---

### 前言

在 TypeScript + React 项目的开发过程中，遇到很多需要类型的定义知识，本文逐一总结：

### 按键事件

```tsx
handleKeywordKeyPress = (e: React.KeyboardEvent<FormControl>) =>{
  if( e.key == 'Enter' ){
    if( this.isFormValid() ){
      this.handleCreateClicked();
    }
  }
};
```

### Ref 转发

根据转发的 Ref 的使用类型，设置关键值

```tsx
const Component = React.forwardRef<RefType, PropsType>((props, ref) => {
  return someComponent;
});
```

如果转发给一个`input`，就可以：

```tsx
const Search = React.forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} type="search" />;
});
```

### Input

```tsx
onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
}
```

