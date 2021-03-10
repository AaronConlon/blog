---
title: 'Javascript算法:三种哈希冲突解决方法'
date: '2021/3/10'
tags:
- Javascript
- 哈希冲突
- 算法
mainImg: 'https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '在学习 JavaScript 数据结构的时候,看到了三种解决哈希冲突的方法,书上记录其二,本文追加之三,聊表慰藉.'
---

在本文中,我们将学习到如何处理哈希冲突,如何编写健壮和优雅的代码,体会算法之美.

## 哈希冲突

在创建我们的哈希表的时候,对于不同的键值,依据一个哈希函数生成的键值有可能出现重复的情形,这种场景我们称之为`哈希冲突`.



为了应对哈希冲突,开发者们思考出了许多解决方案,今天我们来看看其中比较常用的三个解决方案.



### 分离链接法

所谓`分离链接`,指的是为哈希表的每一个位置创建一个`链表`,将元素存在链表里,这是最简单和常见的解决方法,但是在哈希表实例之外,还需要一些`额外的存储空间`.

如下是图示:

![](https://img-blog.csdnimg.cn/20200506160422230.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzc2NzAxNQ==,size_16,color_FFFFFF,t_70)

接下来看代码示例:

```typescript

```

