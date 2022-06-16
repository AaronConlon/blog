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

```vue
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

![](mdImgs/directive.69c37117.png)

#### 响应式基础

一律使用`声明式API`。

> 在 Vue 中，状态都是默认深层响应式的。依靠深层响应性，响应式对象内的嵌套对象依然是代理。

`vue3` 数据响应式基于`Proxy`，这就意味着在某个阶段创建的对象赋值给组件之后，此对象和组件上的代理对象是不相等的。

重用的组件内部函数可能会共享状态，多个实例同时访问将会导致状态不可预测，要保持组件实例某些状态独立性，可以在`created`生命周期中创建某些限制。

```vue
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

```vue
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

```vue
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

> 在复杂情况下可以将内联的绑定对象单独抽出来。

```vue
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

```vue
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

```vue
<template>
	<input v-model="text" />
</template>
```

以下元素都兼容：

- input
- Textarea
- select

`textarea`不支持插值，务必使用`v-model`，如下复选框需要注意值：

```vue
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

![](mdImgs/lifecycle.16e4c08e.png)

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
>   deep: true
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

```vue
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

```vue
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

```vue
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

```vue
<script setup>
	const emit = defineEmits(['enlarge-text'])
</script>
<template>
	<button @click="emit('enlarge-text')">
    change
  </button>
</template>
```

##### 插槽

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

