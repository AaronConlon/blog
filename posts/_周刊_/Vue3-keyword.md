---
title: 'Vue3 keyword'
date: '2022/6/16'
tags:
- Vue 
mainImg: 'https://images.unsplash.com/photo-1518818608552-195ed130cdf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTUzNDc3OTI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1518818608552-195ed130cdf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTUzNDc3OTI&ixlib=rb-1.2.1&q=80&w=400'
intro: 'Vue3 文档关键内容总结'
---

工作需要，从`React`转主力`Vue`开发，因此再看一遍`vue`的文档，故在此总结。

### Base

#### 实例和增强型功能

> 可以同时创建多实例

通过`createApp`函数接收一个根组件`App`来创建`App`实例，再通过实例方法`use()`集成插件功能，例如`pinia`和`vue-router`等，最后使用`mount()`方法并传入一个节点或者`CSS`选择器，最终挂载在一个实际的`DOM`节点上。

```js
const app = createApp(App)
app.use(router).use(createPinia()).mount('#root')
```



#### 全局错误监听

```js
app.config.errorHandle = (err) => {
  // 处理应用级别的错误，捕获所有子组件未处理的错误
 	// 发生错误时，记录信息，重定向到统一的错误页面
}
```

#### 全局资源注册

注册全局可用的组件：

> 可以全局注册一些自定义的组件，后续不用重复写导入语句

```js
app.component('CustomButton', CustomButton);
```

比如`element-plus`可以在这里全局注册所有的`icon`，当然也可以按需引入。

#### 模板语法

```html
<template>
	<!-- 插值 -->
  <span>Message: {{ msg }}</span>

	<!-- 字符串和字符串原始标签渲染 -->
	<p>Using text interpolation: {{ rawHtml }}</p>
	<p>Using v-html directive: <span v-html="rawHtml"></span></p>
	
	<!-- v-xx 指令，绑定标签的 id 属性和值，如下的值是表达式 -->
	<div v-bind:id="dynamicId"></div>
	<!-- 指令简写 -->
	<div :id="dynamicId"></div>
	<!-- 动态参数，灵活设置属性 -->
	<a :[attributeName]="url"> ... </a>
	<!-- 动态参数 + 函数表达式作为值，值为函数则会调用取返回值 -->
	<a :[attributeName]="generateUrlFunction"> ... </a>
	
	<!-- 布尔值的属性，根据表达式转布尔值的结果决定最终是否添加此属性 -->
	<button :disabled="isButtonDisabled">Button</button>

	<!-- 动态绑定多值 objectOfAttrs 为 {id: 'id', class: 'class'} -->
	<div v-bind="objectOfAttrs"></div>
	<!-- 简写 -->
	<div :="objectOfAttrs"></div>

	<!-- 表达式 -->
	{{ number + 1 }}
  {{ ok ? 'YES' : 'NO' }}
  {{ message.split('').reverse().join('') }}
  <div :id="`list-${id}`"></div>
	
	<!-- 新指令 v-on 和简写，监听事件 -->
  <a v-on:click="doSomething"> ... </a>
  <a @click="doSomething"> ... </a>
	<!-- 动态事件名，动态参数需要避免空格和引号这些不合法的HTML属性名 -->
	<a @[eventName]="doSomething">
  
  <!-- 修饰符后缀，简化事件处理函数的内部优化逻辑 -->
  <form @submit.prevent="onSubmit">...</form>
  
  <!-- 条件渲染，甚至可以在 template 上设置条件 v-if -->
  <h1 v-if="awesome">Vue is awesome!</h1>
  <div v-else-if="type === 'C'">
    C
  </div>
	<h1 v-else>Oh no 😢</h1>
  <!-- 低切换成本 -->
  <h1 v-show="ok">Hello!</h1>
   
  <!-- 循环渲染，支持在 template 上设置，确保 key -->
  <li v-for="item in items" :key="item.id">
    {{ item.message }}
  </li>
  <!-- 1..n 好吧，挺好的 -->  
  <span v-for="n in 10">{{ n }}</span>

</template>
```



在 Vue 模板内，JavaScript 表达式可以被使用在如下场景上：

- 在文本插值中 (双大括号)
- 在任何 Vue 指令 (以 `v-` 开头的特殊 attribute) attribute 的值中

绑定在表达式中的方法每次更新都会执行，因此不应该产生渲染、数据改变、触发异步事件，**不要将副作用方法放在组件表达式中**。

> 模板表达式访问的全局对象是一个白名单，列于此：[有限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3)

修饰符图示：

![img](mdImgs/directive.69c37117.png)

#### 响应式基础

一律使用`声明式API`。

> 在 Vue 中，状态都是默认深层响应式的。依靠深层响应性，响应式对象内的嵌套对象依然是代理。

`vue3` 数据响应式基于`Proxy`，这就意味着在某个阶段创建的对象赋值给组件之后，此对象和组件上的代理对象是不相等的。

重用的组件内部函数可能会共享状态，多个实例同时访问将会导致状态不可预测，要保持组件实例某些状态独立性，可以在`created`生命周期中创建某些限制。

```html
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

>[nextTick()](https://staging-cn.vuejs.org/api/general.html#nexttick)：控制更新时机，此方法将内部传入的函数执行时机设置在下一个 DOM 更新完成之后，类似于`React.useEffectLayout`

##### reactive 的局限性

1. 仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#使用键的集合对象)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。
2. 因为 Vue 的响应式系统是通过 property 访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失。

也就是说将响应式对象的 property 赋值或解构至本地变量时，或是将该 property 传入一个函数时，我们会失去响应性。

解决其局限性的替代品：`ref()`

```react
import { ref } from 'vue'

const count = ref(0)
```

> `ref`包装了一个带 `.value`属性的值（未来可能增加优化体验的语法糖）

`ref`还有几个特征：

- 在模板中的顶层属性插值使用`ref`是能自动解包，不必使用`.value`取值，如果`ref`是某个对象的属性值，则依然需要`.value`
- 将`ref`作为`reactive`对象的属性值时也会自动解包，这里需要关注其深层和浅层`reactive`([浅层响应式对象](https://staging-cn.vuejs.org/api/reactivity-advanced.html#shallowreactive))
- Array 和 Map 不会解包



#### 计算属性

计算属性(`computed`)用于`描述依赖响应式状态的复杂逻辑`，避免在`template`中写复杂的表达式。

> 计算属性严格保持无副作用，避免直接修改计算属性值，尤其是无意识的数组sort()/reverse()等操作

使用`computed()`缓存基于响应式数据依赖的计算结果，例如：

```html
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

#### 类与样式绑定

> 类似 React 中的第三方库 classnames

切换动态`class`的示例：

基于`isActive`的真假来设置以`key`为类名的方案，并且和原有`class`进行合并。

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

> 在复杂情况下可以将内联的绑定对象单独抽出来。

```html
<script setup>
	const isActive = ref(true)
  const error = ref(null)

  const classObject = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
  }))
</script>
<template>
	<div :class="classObject"></div>
</template>
```

> 也可以传入数组，数组将会转化表达式为其值，另外需要注意组件属性透传合并到子组件的根元素`class`属性上，需要制定合并位置则需要单独设置`$attrs`表达式。

样式方面需要注意的是`:style`支持驼峰命名法和短横线命名的实际`CSS`名称作为`key`值，为复杂样式绑定样式对象或者计算属性能提高可读性，如果绑定数组则会合并数组元素的样式对象。

> Vue 支持在运行时自动为`:style`设置的样式添加浏览器前缀。

样式支持多值：

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

浏览器渲染支持的最后一个值。

#### 事件处理

事件处理器的值分为：

- 内联事件处理器：内联JavaScript语句
- 方法事件处理器：组件的方法访问

前者在场景简单时使用，后者更常用，也很容易获取到事件上的`DOM`元素（通过`event.target.tagName`）。

有一个特殊的内联场景，需要访问原生的`DOM`：

```html
<template>
	<!-- 使用特殊的 $event 变量 -->
  <button @click="warn('Form cannot be submitted yet.', $event)">
    Submit
  </button>

  <!-- 使用内联箭头函数 -->
  <button @click="(event) => warn('Form cannot be submitted yet.', event)">
    Submit
  </button>
</template>
```

即可活动`DOM`。

常用的事件修饰符：

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

作用如下：

```html
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>

<!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
<!-- 例如：指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
<div @click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成 -->
<!-- 以防其中包含 `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>

<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

`.passive` 修饰符一般用于触摸事件的监听器，可以用来[改善移动端设备的滚屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能)。

还有非常有用的按键修饰符：

- `.enter`
- `.tab`
- `.delete` (捕获“Delete”和“Backspace”两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`
- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

和鼠标修饰符：

- `.left`
- `.right`
- `.middle`



#### 表单输入绑定

`react`需要为`input`设置值和`onChange`监听以改变值，`vue`做了优化：

```html
<template>
	<input v-model="text" />
</template>
```

以下元素都兼容：

- input
- Textarea
- select

`textarea`不支持插值，务必使用`v-model`，如下复选框需要注意值：

```html
<template>
	<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
</template>
```

单选框：

```html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

选择器：

```html
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option :value="{ number: 123 }">123</option>
</select>
```

##### 修饰符 

非常有用的修饰符：

- .trim
- .lazy
- .number

表单输入有两个标准事件：

- oninput
- onchange

`vue`很酷，按照规范区分了两个事件，我们可以按需要监听。

`oninput`即在输入变化时调用监听函数，`onchange`在按下`enter`或者脱离输入框之后调用监听函数，`.lazy`修饰符可以优化渲染次数。

> React 的`onChange`事件却调用了原生的`oninput`事件，一个无法再弥补的错误。



#### 生命周期浅解

生命周期函数设置在某些时间段、某些状态过程节点执行。

组件的生命周期如下图所示：

![img](mdImgs/lifecycle.16e4c08e.png)

#### 侦听器

`watch`制定的响应式数据（变化的状态），执行制定的函数，类似`react useEffect`。

示例：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

侦听的目标将会传入侦听处理函数，需要注意不能侦听`reactive的property`。

> watch 支持强制深度侦听，添加第三个参数即可
>
> ```js
> {
>   	deep: true
> }
> ```

`watch`是懒执行的，也就是说第一次不会执行，只有源变化了才执行。

如果需要在首次执行，则使用`watchEffect`代替。

> watchEffect 可以自动分析副作用发生期间的源并且追踪依赖

```js
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

默认情况下，侦听回调都会在组件更新之前调用，因此可能会出现侦听器回调中访问的`DOM`是更新之前的状态，如果想确保其访问的`DOM`最新，则需要在最后一个`option`对象`param`指明`flush: 'post'`选项，这种行为称为`watchPostEffect`刷新（可以导入此函数直接使用）。

> 同步创建的侦听器会再组件卸载时自动停止，异步创建的侦听器则需要调用创建函数返回的函数（姑且称为`unwatch`)主动停止侦听器。

#### 模板 Ref

`template`中元素可以通过`ref`属性获取到`DOM`。

```html
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

亦或是多个`DOM`，挂载后自动填充：

> ref 可以是函数，ref 可以给组件属性赋值，此时可以取得组件实例（不推荐使用此方法实现父子组件的交互），并且`<secript setup>`语法糖的组件默认不支持此特性，使用此语法糖将默认设置组件为私有状态，除非子组件通过`defineExpose`这主动暴露自己的数据。

```html
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

> 应该注意的是，ref 数组**不能**保证与源数组相同的顺序。

#### 组件基础

将`vue`组件单独定义在一个`.vue`文件中，我们称之为`single file component`（单文件组件）。

在`setup`语法糖中，使用`defineProps`函数定义`props`类型。

> setup 语法糖中 defineProps/defineEmits 都是全局宏定义，不需要显式引入

组件可以通过自定义事件监听来实现父组件交互。

```html
// 父组件
<template>
	<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
</template>

// 子组件
<!-- BlogPost.vue, 省略了 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

父组件传递自定义事件`enlarge-text`，子组件监听点击事件，监听函数显示地调用了`$emit('enlarge-text')`来引用父组件传递来的自定义事件。

`$emit`是内置的方法，这些事件也可以显示地声明，在`setup`语法糖中，使用`defineEmits`来声明。

```html
<script setup>
	const emit = defineEmits(['enlarge-text'])
</script>
<template>
	<button @click="emit('enlarge-text')">
    change
  </button>
</template>
```

#### 动态组件

```html
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

给`:is`传值的类型如下：

- 被注册的组件名
- 导入的组件对象

组件会在被切换掉后卸载，可以使用`KeepAlive`保持状态。

#### 元素位置限制

某些 HTML 元素对于放在其中的元素类型有限制，例如 `<ul>`，`<ol>`，`<table>` 和 `<select>`，相应的，某些元素仅在放置于特定元素中时才会显示，例如 `<li>`，`<tr>` 和 `<option>`。

这将导致在使用带有此类限制元素的组件时出现问题。例如：

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义的组件 `<blog-post-row>` 将作为无效的内容被忽略，因而在最终呈现的输出中造成错误。我们可以使用特殊的 [`is` attribute](https://staging-cn.vuejs.org/api/built-in-special-attributes.html#is) 作为一种解决方案：

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

#### 插槽

组件中可以传递 HTML 内容或其他组件：

```html
<AlertBox>
  Something bad happened.
</AlertBox>
```

传入的内容在组件内何处显示，取决于组件内`slot`元素的位置。

`HTML`只允许少数的特殊元素省略其关闭标签，最常见的是`input`和`img`，其他的元素最佳实践就是主动保持闭合标签。



### 深入



#### 组件注册

全局注册之前说过，它的缺陷在于构建系统无法移除未使用的组件（tree-shaking），在大型项目中依赖关系将会因此变得模糊，全局变量的数量骤增。

而在单文件组件中使用`setup`语法糖，导入的组件可以直接在`template`中使用，即使组件名是大驼峰格式，也可以在使用时直接用短横线命名调用。



#### Props

区分组件透传和组件本身的参数依赖于`props`声明，使用`setup`语法糖时需要用`defineProps`显式声明。

`props`名字建议使用小驼峰格式，同时可以避免在其作为属性`key`时必须带引号。在子组件传递`props`时，会自动转为短横线命名。

静态和动态传值的区别在于是否使用`v-bind`或者缩写格式，任何类型的值都可以作为`props`传递。

> 类型也可以是自定义的类或者构造函数

通常显式的类型如下：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Date`
- `Function`
- `Symbol`

- Object(传递对象时，不要在子组件修改对象内部的数据)

`Props`的传递遵循`单项数据流`的原则，保持了数据流的清晰度，降低复杂数据流的心智负担。

如果子组件仅仅需要父组件传一个初始值，则子组件应该在本地创建一个局部属性保存初始值，亦或是定义一个基于`props`的计算属性。



所有的类型例子：

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // Number 类型的默认值
  propD: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propG: {
    type: Function,
    // 不像对象或数组的默认，这不是一个工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
```

通常我们只需要用到最简单的几个类型，如果过于复杂，或许可以想想有没有什么可以优化的。



#### 组件事件

组件的自定义事件的关键在于：

- 组件内声明自定义事件 `emits`，返回的函数可以直接用于组件模板，省去`$emit`语句
- 组件模板内使用`$emit('eventName', params)`调用自定义事件
- 父组件引用组件时传参，提供自定义事件的源

事件是可以校验的，只需要将事件赋值为函数，函数返回布尔值表示是否合法：

```js
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

双向绑定`v-model`支持在组件上工作：

```js
<!-- CustomInput.vue -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

关键在于模板内的表单需要绑定`value`，触发`update:modelValue`事件。

还有一种方法：

```js
<!-- CustomInput.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input v-model="value" />
</template>
```

如果需要多个绑定：

```html
<UserName
  v-model:first-name="firstName"
  v-model:last-name="lastName"
/>
```

```react
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

自定义事件支持自定义修饰符，例如创建一个自定义的`capitalize`修饰符，自动将`v-model`绑定输入的字符串的首字母大写：

```html
<MyComponent v-model.capitalize="myText" />
```

接着，自定义处理过的监听函数：

```js
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

给组件的`v-model`添加修饰符，都可以通过`modelModifiers` prop 在组件内访问到，如果我们需要自定义修饰符，则需要提供一个`nodelModifiers`的`prop`。



#### 透传属性

常见的透传属性的例子是透传`class`/`id`、`style`等，属性会合并到子组件的模板的根元素上，甚至是事件监听系统也一样。

如果根组件也是组件，则会将部分属性继续透传下去。

但是透传的`props`和`v-on`事件监听不会深层透传。

属性继承是可控的，使用`setup`语法糖时，可以额外提供一个`script`:

```js
<script>
// 使用一个简单的 <script> to declare options
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...setup 部分逻辑
</script>
```

这个额外的声明可以禁用属性继承，通常在需要自己控制透传的属性应用到什么位置上时使用。

透传的属性可以直接使用插值访问：

```html
<span>Fallthrough attribute: {{ $attrs }}</span>
```

>这个 `$attrs` 对象包含了除组件的 `props` 和 `emits` 属性外的所有其他 attribute，例如 `class`，`style`，`v-on` 监听器等等。

也可以使用`hooks`访问：

```js
const attrs = useAttrs()
```

> attrs 不是响应式数据，不要用于侦听



#### 插槽

插槽可以让我们灵活控制组件的结构！需要注意的是，组件内的`style scope`不会作用于插槽。

![img](mdImgs/slots.dbdaf1e8.png)

> 插槽内容可以访问父组件的数据

组件内使用`slot`渲染插槽的默认内容，控制默认插槽的位置。

插槽`slot`可以提供`name`属性（默认是 `default`），如此一来我们可以显式控制插槽内容：

组件：

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

父组件：

```jsx
<BaseLayout>
  <!-- v-slot 简写 # -->
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
</BaseLayout>
```

如图所示：

![img](mdImgs/named-slots.ebb7b207.png)

如下所示是控制完整的插槽：

```html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

等同于：

```html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽，顶级非 template 节点被隐式设为默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

> 减少隐式代码，多写显式逻辑

另外如果需要，插槽不仅可以访问父组件的数据，还可以访问子组件的数据。



#### 依赖注入

在多级组件传递数据的时候，可以使用状态管理库，也就可以使用`依赖注入机制`。

> vue 创建的 app 实例也可以`provider`注入依赖，便于开发插件和在创建实例的地方初始化插件需要的数据。

父组件提供数据依赖，子组件提取注入的依赖。

![img](mdImgs/provide-inject.3e0505e4.png)

举个例子：

> 注入名推荐使用 `Symbol`，并且使用单独的文件管理这些名字。

```js
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
</script>
```

子组件使用`inject`注入祖先组件的数据：

```js
<script setup>
import { inject } from 'vue'

const message = inject('message', 'default value...')
</script>
```

> 如果注入的是 ref，不会自动解包

为了避免在不适用可选值的情况下进行不必要的计算，可以提供一个工厂函数来创建默认值。

```js
const value = inject('key', () => new ExpensiveClass())
```

为了配合响应性，推荐`provider`一个需要用到的修改`provider`响应式数据的方法，将数据修改逻辑保持在`provider`内部。



#### 异步组件

动态导入组件，最后的`AsyncComp`是包装组件， 配合[<Suspense>](https://staging-cn.vuejs.org/guide/built-ins/suspense.html)使用。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

亦或是增强其配置：

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```



### 可重用性

#### 组合式函数

> [VueUse](https://vueuse.org/)提供了一系列高效的`hooks`!

组合式函数即`Vue`的“`自定义Hooks`”。

这是一个典型的网络请求`hooks`:[Vue SFC Playground](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyB1c2VGZXRjaCB9IGZyb20gJy4vdXNlRmV0Y2guanMnXG5cbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3RvZG9zLydcbmNvbnN0IGlkID0gcmVmKCcxJylcbmNvbnN0IHVybCA9IGNvbXB1dGVkKCgpID0+IGJhc2VVcmwgKyBpZC52YWx1ZSlcblxuY29uc3QgeyBkYXRhLCBlcnJvciwgcmV0cnkgfSA9IHVzZUZldGNoKHVybClcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIExvYWQgcG9zdCBpZDpcbiAgPGJ1dHRvbiB2LWZvcj1cImkgaW4gNVwiIEBjbGljaz1cImlkID0gaVwiPnt7IGkgfX08L2J1dHRvbj5cblxuXHQ8ZGl2IHYtaWY9XCJlcnJvclwiPlxuICAgIDxwPk9vcHMhIEVycm9yIGVuY291bnRlcmVkOiB7eyBlcnJvci5tZXNzYWdlIH19PC9wPlxuICAgIDxidXR0b24gQGNsaWNrPVwicmV0cnlcIj5SZXRyeTwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UtaWY9XCJkYXRhXCI+RGF0YSBsb2FkZWQ6IDxwcmU+e3sgZGF0YSB9fTwvcHJlPjwvZGl2PlxuICA8ZGl2IHYtZWxzZT5Mb2FkaW5nLi4uPC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiLFxuICAgIFwidnVlL3NlcnZlci1yZW5kZXJlclwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy9zZXJ2ZXItcmVuZGVyZXIuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwidXNlRmV0Y2guanMiOiJpbXBvcnQgeyByZWYsIGlzUmVmLCB1bnJlZiwgd2F0Y2hFZmZlY3QgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGZXRjaCh1cmwpIHtcbiAgY29uc3QgZGF0YSA9IHJlZihudWxsKVxuICBjb25zdCBlcnJvciA9IHJlZihudWxsKVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRvRmV0Y2goKSB7XG4gICAgLy8gcmVzZXQgc3RhdGUgYmVmb3JlIGZldGNoaW5nLi5cbiAgICBkYXRhLnZhbHVlID0gbnVsbFxuICAgIGVycm9yLnZhbHVlID0gbnVsbFxuICAgIFxuICAgIC8vIHJlc29sdmUgdGhlIHVybCB2YWx1ZSBzeW5jaHJvbm91c2x5IHNvIGl0J3MgdHJhY2tlZCBhcyBhXG4gICAgLy8gZGVwZW5kZW5jeSBieSB3YXRjaEVmZmVjdCgpXG4gICAgY29uc3QgdXJsVmFsdWUgPSB1bnJlZih1cmwpXG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIGFydGlmaWNpYWwgZGVsYXkgLyByYW5kb20gZXJyb3JcbiAgXHQgIGF3YWl0IHRpbWVvdXQoKVxuICBcdCAgLy8gdW5yZWYoKSB3aWxsIHJldHVybiB0aGUgcmVmIHZhbHVlIGlmIGl0J3MgYSByZWZcblx0ICAgIC8vIG90aGVyd2lzZSB0aGUgdmFsdWUgd2lsbCBiZSByZXR1cm5lZCBhcy1pc1xuICAgIFx0Y29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsVmFsdWUpXG5cdCAgICBkYXRhLnZhbHVlID0gYXdhaXQgcmVzLmpzb24oKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9yLnZhbHVlID0gZVxuICAgIH1cbiAgfVxuXG4gIGlmIChpc1JlZih1cmwpKSB7XG4gICAgLy8gc2V0dXAgcmVhY3RpdmUgcmUtZmV0Y2ggaWYgaW5wdXQgVVJMIGlzIGEgcmVmXG4gICAgd2F0Y2hFZmZlY3QoZG9GZXRjaClcbiAgfSBlbHNlIHtcbiAgICAvLyBvdGhlcndpc2UsIGp1c3QgZmV0Y2ggb25jZVxuICAgIGRvRmV0Y2goKVxuICB9XG5cbiAgcmV0dXJuIHsgZGF0YSwgZXJyb3IsIHJldHJ5OiBkb0ZldGNoIH1cbn1cblxuLy8gYXJ0aWZpY2lhbCBkZWxheVxuZnVuY3Rpb24gdGltZW91dCgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC4zKSB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignUmFuZG9tIEVycm9yJykpXG4gICAgICB9XG4gICAgfSwgMzAwKVxuICB9KVxufSJ9)。

务必阅读其源码理解其实现。

以下是几个约定和最佳实践：

- 组合式函数约定用驼峰命名法命名，并以“use”作为开头。
- 兼容输入参数的响应性（如果组合式函数是共享的，他人使用时可能会传入`ref`，别忘了兼容响应式数据）
- 返回值保持为`ref`类型，以免结构过程丢失响应性状态连接
- 处理好副作用
  - 服务端渲染时确保其在浏览器端执行（将副作用添加到 onMounted 内）
  - 确保其在 `onUnmounted`时清理副作用，防止内存泄漏
- 在组合式`setup`语法糖中，保持同步调用，可以在`onMounted`生命周期中使用
- 可以在`hooks`中注册生命周期钩子



#### 自定义指令

`Vue`最常用的内置指令：`v-model`、`v-show`、`v-if`等等，另外支持自定义指令。

只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令。

> 在 `<script setup>` 中，任何以 `v` 开头的驼峰式命名的变量都可以被用作一个自定义指令。

一个自定义指令对象，所有钩子函数都是可选的：

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted() {},
  // 绑定元素的父组件更新前调用
  beforeUpdate() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated() {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount() {},
  // 绑定元素的父组件卸载后调用
  unmounted() {}
}
```

来实现一个通用的`v-focus`指令，控制输入框自动聚焦：

```js
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

通常，通用自定义指令可以注册到应用实例全局：

```js
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})
```

##### 简化形式

在仅需`mounted`和`updated`钩子下实现相同的行为且不关心其他钩子时，可以简化写法：

```html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

如果需要组件上使用自定义指令，则指令始终应用于组件的根节点。

所有钩子的参数格式都是一致的：

- `el`：指令绑定到的元素。这可以用于直接操作 DOM。
- `binding`：一个对象，包含以下 property。
  - `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令的定义对象。
- `vnode`：代表绑定元素的底层 VNode。
- `prevNode`：之前的渲染中代表指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

如果需要复杂的自定义指令，则需要关注这个问题。





### 五个实用的内置组件

内置组件可以在任意别的组件里使用，跟宏定义一样无需显式注册。

#### Transition

进入和离开可以由以下三个条件之一触发动画：

- `v-if`条件渲染
- `v-show`条件显式
- `<component>`组件的切换

需要注意的是，`<Transition>`仅仅支持单个元素或组件作为其插槽内容，要确保组件仅有一个根元素。

> `transform`和`opacity`切换动画不会影响`DOM`结构，不会导致昂贵的布局重新计算，而`height`、`width`则刚好相反，因此需要谨慎选择动画属性。

`<Transition>`支持在动画过程周期挂上钩子函数：

```jsx
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

手动传入`mode="out-in"`可以控制过渡效果，控制动画执行次序稳定。`CSS`真的很难。



#### TransitionGroup

控制和设计一个列表中的元素或组件的插入、移除、顺序改变的动画效果。

[TransitionGroup·过渡组 | Vue.js](https://staging-cn.vuejs.org/guide/built-ins/transition-group.html#enter-leave-transitions)



#### KeepAlive

组件的缓存，防止切换卸载时丢失组件状态，来看看其`props`的实现：

```tsx
interface KeepAliveProps {
  /**
   * 如果指定，则只有与 `include` 名称
   * 匹配的组件才会被缓存。
   */
  include?: MatchPattern
  /**
   * 任何名称与 `exclude`
   * 匹配的组件都不会被缓存。
   */
  exclude?: MatchPattern
  /**
   * 最多可以缓存多少组件实例。
   */
  max?: number | string
}

type MatchPattern = string | RegExp | (string | RegExp)[]
```

举个例子：

```html
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive include="demo">
  <component :is="activeComponent" />
</KeepAlive>
```

仅仅缓存组件名为`demo`的组件（区分大小写）。



#### Teleport

`Teleport`简称`TP`，适用于将组件的一部分模板传送到此组件的`DOM`层次结构之外的节点中。

应用场景有全局的模态框、信息提示等。

`Teleport`仅改变了渲染的`DOM`结构，不会影响组件间的逻辑关系，开发者可以正常使用组件和子组件的交互的数据（props/reject/provider）等。

`Teleport`支持`disabled`属性将其特性禁用，从而视为行内组件。

当在一个目标上挂载多个`Teleport`时，将会按顺序挂载。

```html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

将渲染成：

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```



#### Suspense

2022-06-17 `Suspense`依然是实验性功能。

`Suspense`组件可以等待整个内部多层级组件树的各个异步依赖获取结果时，在顶层展示加载中或加载失败的状态。

`Suspense`可以等待的异步依赖如下：

- 带有异步 `setup`钩子的组件（使用setup语法糖，顶层具有await表达式的组件）
- 异步组件（默认本身加载状态被忽略，由`Suspense`接管依赖，也可以在选项中制定`suspensible: false`表达不受`Suspense`控制的特性）



来看一个实例：

```jsx
<Suspense>
  <!-- 具有深层异步依赖的组件 -->
  <Dashboard />

  <!-- 在 #fallback 插槽中显示 “正在加载中” -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

和一个配合复杂的实例：

```jsx
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback>
            正在加载...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```



