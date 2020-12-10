---
title: 'Vue基础初探'
date: '2020/12/10'
tags:
- 
mainImg: 'https://images.unsplash.com/photo-1556998914-e5cb6fe38124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1556998914-e5cb6fe38124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '粗略看过两边文档,后续就没写过 vue 项目,工作上做了其他方面的内容,这里私下补一下,既可以应对以后的 vue 开发需求,也可以提高自己的开发水平.当前只是记录阅读网络上的他人博客内容的总结.它山之石可以攻玉.'
---

# Vue3 

## 第一天

- defineComponent

  可以省略,也可以加上

  ```js
  export default defineComponent({
    name: "xx",
    component: {},
  	setup() {
      // init variables
    }  
  })
  ```

  

- setup 生命周期函数

  instead data function and methods function.

- reactive function

  ```js
  setup() {
      const data = reactive({
        a: "",
        d: () => {}
      });
      return {
        data,
      };
    },
  ```

  通过`reactive`函数,创建了变量和方法,但是返回的时候后续再`template`里使用,都需要从`data`开始,而`vue`不支持扩展运算符解构,这会导致数据不再具有`响应式`能力.
  
- toRefs function

  通过使用`vue3`提供的`toRefs`函数,包装一次`data`,就可以使用扩展运算符了.

  ```js
  return {
    ...toRegs(data)
  }
  ```

  

## 第二天

> 生命周期函数,vue2 到 vue3 发生了什么变化?

`vue3`提供了好几个生命周期函数,更加细粒度地控制组件和数据.

### 生命周期函数

- setup() :开始创建组件之前，在`beforeCreate`和`created`之前执行。创建的是`data`和`method`.
- onBeforeMount() : 组件挂载到节点上之前执行的函数。
- onMounted() : 组件挂载完成后执行的函数。
- onBeforeUpdate(): 组件更新之前执行的函数。
- onUpdated(): 组件更新完成之后执行的函数。
- onBeforeUnmount(): 组件卸载之前执行的函数。
- onUnmounted(): 组件卸载完成后执行的函数
- onActivated(): 被包含在`<keep-alive>`中的组件，会多出两个生命周期钩子函数。被激活时执行。
- onDeactivated(): 比如从 A 组件，切换到 B 组件，A 组件消失时执行。
- onErrorCaptured(): 当捕获一个来自子孙组件的异常时激活钩子函数。