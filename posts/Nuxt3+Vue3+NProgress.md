---
title: "Nuxt3+Vue3+NProgress"
date: "7/19/2022"
tags:
  - Nuxt3
  - Vue3
  - NProgress
mainImg: "https://images.unsplash.com/photo-1569605803663-e9337d901ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTgxNjUzMzI&ixlib=rb-1.2.1&q=80&w=1080"
coverImg: "https://images.unsplash.com/photo-1569605803663-e9337d901ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTgxNjUzMzI&ixlib=rb-1.2.1&q=80&w=400"
intro: "为Nuxt3项目添加NProgress插件！"
---

有时候我们会在诸如`youtube`或`github`这样的站点上看到路由切换时的顶部进度条，那么在`Nuxt3`中如何实现同样的效果呢？

本文，将会分享如何在`Nuxt3`中通过创建插件的形式，支持顶部进度条，并且应用到`web`请求过程中，最后再浅析如何实现这样的进度条。

### 什么是 NProgress ？

> [NProgress: slim progress bars in JavaScript](https://ricostacruz.com/nprogress/)

`NProgress`是一个具有真实的细流动画的进度条，其效果可以让用户体会到某些事件正在发生，何时结束。

安装此工具：

```bash
npm install --save nprogress
```

也可以通过`unpkg`提供的`CDN`服务，直接引入此库。

- https://unpkg.com/nprogress@0.2.0/nprogress.js
- https://unpkg.com/nprogress@0.2.0/nprogress.css

其基础用法即：

```js
NProgress.start();
NProgress.done();
```

因此，如何使用取决于你想如何实现这些效果，例如你想在路由切换的过程中显示动画，即可在路由守卫机制中控制进入路由之前和之后启动和终结进度条即可。

`NProgress`是不限制框架的，你可以在你喜欢的框架中使用它，甚至是原生脚本中使用它。

### Nuxt3 + NProgress

如果你也有这样的需求，希望在`Nuxt3`的路由切换时显示顶部进度条，可以在项目根目录下的`plugins`目录下创建一个插件，例如叫`page-progress.js`，然后按如下所示编写钩子：

> Nuxt3 会自动注册此目录下的插件，不需要再在`nuxt.config.js`中做额外的配置。

```js
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook("page:start", () => {
    NProgress.start();
  });
  nuxtApp.hooks.hook("page:finish", () => {
    NProgress.done();
  });
});
```

上述代码中，定义插件的函数接收的是一个参数为`NuxtApp`实例的函数，内部可以通过实例钩子添加`page:start`和`page:finish`钩子，如语义所示。

> 更多钩子，请看：[Nuxt 3 - Lifecycle Hooks](https://v3.nuxtjs.org/api/advanced/hooks)

即可在页面开始前启动进度条动画，在页面结束加载完成时终止进度条。

此外，还可以在导出默认插件之前，对`nprogress`做一些配置，如有需要可以参考官方文档，例如不展示右上角的圆形进度环。

> 如果你需要在 web 请求的过程中控制进度条，也可以尝试看看以下思路。例如，你可以配合`axios`的`interceptors`一起使用，在请求拦截处开启动画，在响应处终止进度条动画。

### 源码解析
