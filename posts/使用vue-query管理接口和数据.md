---
title: '使用vue-query管理接口和数据'
date: '8/14/2022'
tags:
  - react-query
  - vue-query
mainImg: 'https://images.unsplash.com/photo-1592609930961-219235eded71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjA0ODM2MDQ&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1592609930961-219235eded71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjA0ODM2MDQ&ixlib=rb-1.2.1&q=80&w=400'
intro: '使用 vue-query 管理应用的接口和数据状态。'
---

在我们的开发过程中，数据请求机制带来了一系列的挑战：

- 如何设置缓存
- 如何多请求模拟合并为单请求
- 如何在后台标记数据脱离有效期，并且在后台更新数据
- 如何尽快反应对数据的更新
- 如何对分页、延迟加载的数据进行优化
- 如何管理状态和记录查询结果
- 如何使得网络断开可以重新请求
- ...



这些问题困扰着许许多多的开发者们，社区也为此提供了一系列的解决方案。

今天我们就来介绍其中一个方案： [vue-query](https://vue-query.vercel.app/#/)

`vue-query` 是一个基于`React-query`的库，其为 `Vue` 应用提供了数据获取、缓存、状态管理和数据更新的钩子。



> 本文基于 Vue3 + vue-query v1.25



### 起步

首先，你可以使用`yarn`或者`npm`安装这个库：

```bash
npm install vue-query
# or
yarn add vue-query
```

再为`app`加载其插件：

```tsx
import { VueQueryPlugin } from "vue-query";

app.use(VueQueryPlugin);
```

此外，推荐使用其配套的开发工具组件：

```js
import { VueQueryDevTools } from "vue-query/devtools";
```

引入后放置于尽可能靠近根组件的位置即可。

来看看当前的`main.js`文件示例：

```js
import "uno.css";
import "@/styles/common.scss";

import App from "./App.vue";
import { VueQueryPlugin } from "vue-query";
import { createApp } from "vue";
import router from "@/routes";

const app = createApp(App);

app
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          retry: 2,
          retryDelay: 1000,
          refetchOnMount: "always",
          refetchOnWindowFocus: "always",
          refetchOnReconnect: "always",
          cacheTime: 1000 * 30, //30 seconds
          refetchInterval: 1000 * 30,
          refetchIntervalInBackground: false,
          suspense: false,
          staleTime: 1000 * 30,
        },
        mutations: {
          retry: 2,
        },
      },
    },
  })
  .use(router)
  .mount("#app");
```

当前示例应用我们支持了`unocss`和`vue-router`，上述重点依然在初始化全局的`vue-query`选项。

默认选项中有两个关键字段：

- queries
- mutations

前者是`useQuery`钩子的配置，后者是`useMutation`钩子的配置，二者差别后续再提。

我们来关注这些配置字段：

- retry：请求失败的重试次数
- retryDelay：失败重试的延迟时间
- refetchOnMount：组件挂载时是否重新请求获取数据，默认为`always`即忽略`staleTime`，每次挂载都重新请求
- refetchOnWindowFocus：窗口focus时是否重新获取数据
- refetchOnReconnect：网络重连时是否重新获取数据
- cacheTime：数据的缓存时间
- refetchInterval：定时重新获取数据的时间
- refetchIntervalInBackground：是否在后台重新获取数据
- suspense：整合整个应用的异步状态和请求的状态，如果你希望增加全局的请求状态显示功能，或许可以考虑此选项，例如：当请求发生时，显示全局的`loading`状态！
- staleTime：过期时间，这会影响到`loading`状态和数据重新获取机制。

### 获取数据

在使用`vue-query`之前，我是这样控制数据加载之前的状态和`UI`的：

```vue
<template>
  <div v-if="errorText">{{ errorText }}</div>
  <div v-else-if="isLoading">loading...</div>
  <div class="p-8" v-else>
    <ul>
      <li v-for="item in data" :key="item.id">{{ item.todo }}</li>
    </ul>
  </div>
</template>

<script setup>
import { sleep } from "@/utils";
import axios from "axios";
import { onMounted, ref } from "vue";

const isLoading = ref(true);
const data = ref([]);
const errorText = ref();

onMounted(async () => {
  try {
    const res = await axios.get("/api/todos");
    await sleep();
    data.value = res.data;
    isLoading.value = false;
    errorText.value = undefined;
  } catch (error) {
    errorText.value = error?.message;
  }
});
</script>
```

如上所示，我们简单地通过`axios`请求数据，并且显式定义了`data`、`isLoading`、`errorText`来显示状态、错误信息和完整的数据。

> 懒惰使人进步

现在，替换成`vue-query`:

```vue
<template>
  <div v-if="isError">{{ error }}</div>
  <div v-else-if="isLoading">loading...</div>
  <div class="p-8" v-else>
    <ul>
      <li v-for="item in data" :key="item.id">{{ item.todo }}</li>
    </ul>
  </div>
</template>

<script setup>
import { useQuery } from "vue-query";
import { getTodoList } from "@/services/todo";
import { TODO_LIST } from "@/configs/vueQueryKey.list";

const { isLoading, data, error, isError } = useQuery([TODO_LIST], getTodoList);
</script>
```

`getTodoList`是一个获取数据的函数，其实现为：

```js
const getTodoList = () => request.get(TODOS)
```

为了方便管理，我将所有的接口设置成了常量。

上述的`request.get`的封装如下：

```js
import axios from "axios";

export const instance = axios.create({
  baseURL: "/api",
});

const responseInterceptorsFuncParams = [
  (res) => {
    // 200 状态码的响应将会触发此函数
    // 有时候后端会根据请求再定义一些状态码 = =
    console.log(res);
    return res.data;
  },
  (error) => {
    // 非 200 状态码的响应会触发此函数
    return Promise.reject(error);
  },
];

export const myInterceptor = instance.interceptors.response.use(
  ...responseInterceptorsFuncParams
);

const request = {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data) => request.put(url, data),
  delete: (url) => request.delete(url),
};

export default request;
```

OK，话说回来，`vue-query`函数依次接收以下参数：

- 一个唯一的查询`key`，建议为了跟`react-query`新版本兼容，统一传一个数组。上述代码中我又用了常量来使其唯一，我尝试使用`symbols`，但却需要再重写其序列化函数以生成一个字符串。等会...我为何不直接使用常量字符串？是吧？这个`key`后续还有用处，暂时按下不表。
- 一个返回接口数据的异步函数，此函数内`throw`的错误将作为返回值的`error`熟悉的凭据。
- 可选项：包括一系列的配置（实在太多，控制着请求的方方面面的机制），在上面初始化配置时有一部分代码，但上述也不全。如果需要针对请求做配置，则可以查文档。

上述示例中，我们可以从`vue-query`的`useQuery`钩子的返回值中得到请求的数据和状态，甚至是可能存在的错误状态和信息。

信息越多，我们的控制流就更灵活和精细。

