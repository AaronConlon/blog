---
title: 'TypeScript-unknown类型示例'
date: '2022/3/6'
tags:
- TypeScript
mainImg: 'https://images.unsplash.com/photo-1518818608552-195ed130cdf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDY1Njg3Nzc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1518818608552-195ed130cdf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDY1Njg3Nzc&ixlib=rb-1.2.1&q=80&w=400'
intro: '一个应用到 TypeScript 中 unknown 类型的实例分享！'
---

最近在学习 TypeScript 相关内容，其中对`unknown`类型的应用毫无头绪，今天看到一篇文章[[译] TypeScript 3.0: unknown 类型 - 掘金](https://juejin.cn/post/6844903866073350151)，其中描述了一个示例非常实用，在这里分享一下。

### unknown 类型

`TypeScript`两种顶级类型分别是：

- `any`：任意类型
- `unknown`：未知类型

通常，我们可以这样用：

```typescript
let value: unknown;
...
// 1
value = 1;
// null
value = null;
// NodeJs.Timer
value = setTimeout(() => {});
// 等等
...
```

当我们将其赋值给其他变量时：

```typescript
let value2: string = value; // error 
let value3: any = value; // ok
let value4: unknown = value; // ok
```

只有同为`unknown`或者`any`可以完成赋值，但是如果要实用此值的话，需要注意：

`编译器不允许对未知类型的值执行任意操作`，当类型未知时，我们便无法调用特定类型的实例方法或属性，但是我们可以通过以下几种方式缩小其类型范围：

```typescript
function stringifyForLogging(value: unknown): string {
  if (typeof value === "function") {
    // Within this branch, `value` has type `Function`,
    // so we can access the function's `name` property
    const functionName = value.name || "(anonymous)";
    return `[function ${functionName}]`;
  }

  if (value instanceof Date) {
    // Within this branch, `value` has type `Date`,
    // so we can call the `toISOString` method
    return value.toISOString();
  }

  return String(value);
}
```

此外，我们也可以用类型断言来告知编译器此变量的类型。

### unknown 须知

- `unknown` 在联合类型中会吸收任何类型，因此包含 `unknown` 的联合类型相当于 `unknown`，在联合类型中使用 `unknown` 并无多大意义
- `unknown` 和其他类型交叉时，`unknown` 会被忽略

### unknown 实例

假设一个场景：我们需要使用 `localStorage`中的数据，因此需要编写一个取值并且反序列化的函数：

```type
type Result = { success: true, value: unknown } | { success: false, error: Error};

function tryDeserializeLocalStorageItem(key: string): Result {
	const item = localStorage.getItem(key);
	if(item === null) {
	return {
			success: false,
			error: new Error(`item with key "${key}" does not exist`)
		};
	}
	// 这里用 unknown 类型就非常合适
	let value: unknown;
	try {
		value = JSON.parse(item);
	} catch (error) {
		return {
			success: false,
			error
		}
	}
	
	return {
		success: true,
		value
	};
}
```



现在，如果想要读取保存到`localStorage`中的数据，可以这样：

```typescript
const result = tryDeserializeLocalStorageItem("dark_mode");

if (result.success) {
  // We've narrowed the `success` property to `true`,
  // so we can access the `value` property
  const darkModeEnabled: unknown = result.value;

  if (typeof darkModeEnabled === "boolean") {
    // We've narrowed the `unknown` type to `boolean`,
    // so we can safely use `darkModeEnabled` as a boolean
    console.log("Dark mode enabled: " + darkModeEnabled);
  }
} else {
  // We've narrowed the `success` property to `false`,
  // so we can access the `error` property
  console.error(result.error);
}
```

如此一来，读取本地数据便可以方便地反序列化并且获取可靠的值。



### 最后

此前，并未有在实际开发中用到`unknown`类型，此示例非常实用，学到了。

周末快乐！

