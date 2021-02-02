---
title: 'JavaScript数组刷题对比与分析.md'
date: '2021/2/3'
tags:
- LeetCode
mainImg: 'https://images.unsplash.com/photo-1564879730502-08b4d3b312c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1564879730502-08b4d3b312c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=400'
intro: '参与了一个活动,和两百人一起学习数据结构与算法,一起刷题一起进步.本文记录了我学习数组的时候刷的题目,以及他人优秀的题解.'
---

### Day 1

> [989. 数组形式的整数加法 - 力扣（LeetCode）](https://leetcode-cn.com/problems/add-to-array-form-of-integer/submissions/)

#### 题目描述

对于非负整数 X 而言，X 的数组形式是每位数字按从左到右的顺序形成的数组。例如，如果 X = 1231，那么其数组形式为 [1,2,3,1]。

给定非负整数 X 的数组形式 A，返回整数 X+K 的数组形式。

 

##### 示例 1：

```wiki
输入：A = [1,2,0,0], K = 34
输出：[1,2,3,4]
解释：1200 + 34 = 1234
```



##### 思路

- 整数 K 转数组
- 确定更长的数组,确定遍历最长的数组 A 或者 K 数组
- 末尾 pop() 相加,控制进位
- 处理最后的进位,得出结果.

##### 我的代码

```js
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number[]}
 */
var addToArrayForm = function (A, K) {
  let kArr = [...K.toString()].map(i => ~~i)
  let {len, maxArr} = kArr.length > A.length ? {len: kArr.length, maxArr: kArr} : {len: A.length, maxArr: A}
  let carryNum = 0
  for (let index = 0; index < len; index++) {
    let lastA = ~~A.pop()
    let lastK = ~~kArr.pop()
    let sum = lastA + lastK + carryNum
    if(sum > 9) {
      maxArr.unshift(sum - 10)
      carryNum = 1
    } else {
      maxArr.unshift(sum)
      carryNum = 0
    }
  }
  if(carryNum === 1) maxArr.unshift(1)
  return maxArr
}
```

执行结果,用时太长,在内存控制方面做得还行.**偏向用空间换时间**.

##### 其他人的优秀代码

作者：Shawry14
链接：https://leetcode-cn.com/problems/add-to-array-form-of-integer/solution/shu-zu-xing-shi-de-zheng-shu-jia-fa-nei-60pm8/

```js
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number[]}
 */
var addToArrayForm = function (A, K) {
    count = 0;
    len = K.toString().length;
    for (let i = 0; i < len; i++) {
        if (A.length < len) {
            A.unshift(0);
        }
        count = K % 10;
        K = parseInt(K / 10);
        A[A.length - 1 - i] += count;
    }
    for (let i = 0; i < A.length; i++) {
        if (A[0] > 9) {
            A.unshift(0);
        }
        if (A[A.length - 1 - i] > 9) {
            A[A.length - 2 - i]++;
            A[A.length - 1 - i] = A[A.length - 1 - i] % 10;
        }
    }
    return A;
};
```

太恐怖了.

