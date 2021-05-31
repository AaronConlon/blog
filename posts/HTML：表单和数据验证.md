---
title: 'HTML：表单和数据验证'
date: '2021/5/30'
tags:
- HTML
mainImg: 'https://images.unsplash.com/photo-1553196798-b71feabce946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjIzNzgwMjc&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1553196798-b71feabce946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjIzNzgwMjc&ixlib=rb-1.2.1&q=80&w=400'
intro: '为了丰富我的 HTML 体系知识，专门针对表单和数据验证进行了回顾，本文将对表单和数据验证的知识进行总结。'
---

web 提交用户在表单中填写的数据到服务器的过程，无论是客户端或者服务端都需要对数据进行验证。客户端验证既可以约束用户输入的内容，获取格式正确的信息，也可以提升用户体验，减少服务器的压力。客户端验证很容易被绕过，因此服务端数据验证则是最后一道保障，必须要具有完备的验证逻辑。

今天，我们来聊聊客户端表单验证。

## 前言

我们既希望表单尽可能地易用，也希望表单能够对数据做严格的验证，究其原因不外乎以下几点：

- 开发者希望获取正确的数据，且数据具有正确的格式
- 开发者希望能够保护用户的数据，例如希望用户的密码具有一定的复杂度，避免使用过于简单的密码
- 开发者希望保护应用或网站本身，服务器安全也是开发者需要关注的一部分

## 数据验证技术

通常，开发者可以从以下两种方案去做数据验证：

- 浏览器内置的数据验证功能接口
- 使用 JavaScript 严格控制数据结构

#### 使用内置验证接口

`HTML5`为`form`标签提供了具有数据验证功能的属性：

- `required`: 在提交前必须填写
- `minlength`和`maxlength`：指定填写的字符串长度最小值和最大值
- `min`和`max`： 指定值的范围
- `type`：`input`标签常用此属性为输入值提供样式和数据类型默认匹配规则，例如值为`email`，则会验证填写的值是否是一个合格的`email`地址
- `pattern`：指定一个正则表达式作为匹配规则，通常我们可以针对特定的数据格式提供一个严格的`pattern`正则表达式作为匹配条件

当数据通过了浏览器内置的验证规则时，相关的元素可以使用`:valid` CSS 伪类来指定一些样式代码，并且在没有用户主动终止提交表单行为或者没有`Javascript`代码拦截表单提交行为的时候，数据可以顺利提交到服务器。

> `input:required:valid`伪类可以设置多个条件同时满足的时候的样式

如果数据无法通过浏览器内置的验证规则，则相关元素可以使用`:invalid` CSS 伪类来指定一些样式代码来强调或突出数据验证失败的讯息，浏览器也会默认提供一些数据验证失败的原因提示。

举个例子：

```css
input:required:invalid, input:focus:invalid {
  background-image: url(/images/invalid.png);
  background-position: right top;
  background-repeat: no-repeat;
}
input:required:valid {
  background-image: url(/images/valid.png);
  background-position: right top;
  background-repeat: no-repeat;
}
```

为输入框设置一个靠右的状态提示背景图。

#### 使用 JavaScript 验证表单

一些老旧的浏览器不支持`HTML5`的表单特性，因此表单数据验证的任务又回到了开发者的手里。

好在大多数浏览器都支持[Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation),此特性提供了一系列的`DOM`元素接口



## 参考

- [Client-side form validation - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [HTML5 Form Validation Examples < HTML | The Art of Web](https://www.the-art-of-web.com/html/html5-form-validation/#user_comments)
- [Data Validation – How to Check User Input on HTML Forms with Example JavaScript Code](https://www.freecodecamp.org/news/form-validation-with-html5-and-javascript/)
