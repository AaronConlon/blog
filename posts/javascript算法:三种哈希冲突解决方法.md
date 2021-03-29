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

## 1. 哈希函数

散列表是根据关键码值`(Key value)`而直接进行访问的数据结构.也就是说,它通过把关键码值映射到表中一个位置来访问记录,以加快查找的速度.

这个映射函数叫做`哈希(散列)函数`,存放记录的数组叫做散列表.

哈希函数不是一个纯函数,函数参数和值是`多对一`的关系.因为这种特性,哈希值理论上是无法逆推的.让我们来看一个在社区中常见的哈希函数:

```typescript
private loseloseHashCode(key: K) {
  if (typeof key === 'number') {
    return key;
  }
  const tableKey = this.toStrFn(key);
  let hash = 0;
  for (let i = 0; i < tableKey.length; i++) {
    hash += tableKey.charCodeAt(i);
  }
  return hash % 37;
}
```

上述代码是从哈希表的实现中摘取出来的,大致效果是通过不同类型的`key`获取一个数字作为`hashValue`.

## 2. 哈希冲突

在创建我们的哈希表的时候,对于不同的键值,依据一个哈希函数生成的键值有可能出现重复的情形`(一对多的关系)`,这种场景我们称之为`哈希冲突`.



为了应对哈希冲突,开发者们思考出了许多解决方案,今天我们来看看其中比较常用的三个解决方案.



### 分离链接法

所谓`分离链接`,指的是为哈希表的每一个位置创建一个`链表`,将元素存在链表里,这是最简单和常见的解决方法,但是在哈希表实例之外,还需要一些`额外的存储空间`.

如下是图示:

![](https://img-blog.csdnimg.cn/20200506160422230.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzc2NzAxNQ==,size_16,color_FFFFFF,t_70)

接下来看代码示例:

```typescript
import { defaultToString } from "../help";
import LinkedList from "../linkedList/index";

export default class HashTableSeparateChaining {
  table: { [name: string]: LinkedList };

  toStrFn: Function;

  count: number;

  constructor() {
    this.table = {};
    this.toStrFn = defaultToString;
    this.count = 0;
  }

  put(key: unknown, value: unknown): boolean {
    if (key !== undefined && value !== undefined) {
      const hashCode = this.getHashCode(key);
      if (this.table[hashCode] === undefined) {
        const linked = new LinkedList();
        this.table[hashCode] = linked;
      }
      this.table[hashCode].push([key, value]);
      this.count++;
      return true;
    }
    return false;
  }

  get(key: unknown): unknown {
    const hashCode = this.getHashCode(key);
    if (this.table[hashCode] && !this.table[hashCode].isEmpty()) {
      let current = this.table[hashCode].head;
      while (current) {
        if (current.val[0] === key) {
          return current.val[1];
        }
      }
      current = current.next;
    }
    return undefined;
  }

  remove(key: unknown): boolean {
    const hashCode = this.getHashCode(key);
    const linked = this.table[hashCode];
    if (linked && linked.indexOf(key) !== -1) {
      linked.remove(key);
      if (linked.isEmpty()) {
        delete this.table[hashCode];
      }
      this.count--;
      return true;
    }
    return false;
  }

  getHashCode(key: unknown): number {
    if (typeof key === "number") return key;
    const tableKey: string = this.toStrFn(key);
    let hash = 0;
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i);
    }
    return hash % 37;
  }

  size() {
    return this.count;
  }
}
```

> **分离链接法**关键在于对内部存储对象使用链表来存储"`哈希碰撞`"的值.

### 线性探查法

如果不额外使用链表空间来存储值,依然选择将值存储到表中,则可以选择使用`线性探查法`.

线性探查的关键在于,`如果一个 position 已经被占用,则尝试 position+1 的位置,依次类推`.

![](https://haif-cloud.oss-cn-beijing.aliyuncs.com/algorithm/LinearProbing-Add.png)

白色区域表示空闲位置，绿色区域表示已经存储数据.

在删除的时候,有两种思路去处理收尾的代码逻辑.

- 标记法: 标记已删除的位置,并且后续不可再使用,查找的时候也跳过.
- 位置移动修复法: 检验是否需要将后续存在的一个或者多个元素移动到之前的位置,以此来防止出现通过哈希值找到一个被删除的空位置.

对于第一种思路,也称为`惰性探查`,核心思想在于每个位置都有一个是否已删除的标记,遇到碰撞的时候递增哈希值,在移除碰撞的值的时候,将此标志位设置为`true`,方便再次插入碰撞的值的时候直接利用,或者在获取值的时候跳过具有已删除标志的位置,示例代码如下:

```typescript
import { defaultToString, ValuePairLazy } from "../help";

export default class HashTableLinearProbingLazy<K, V> {
  protected table: { [key: string]: ValuePairLazy<K, V> };

  constructor(
    public size = 0,
    protected toStrFn: (key: K) => string = defaultToString
  ) {
    this.table = {};
  }

  private loseloseHashCode(key: K) {
    if (typeof key === "number") return key;
    const tableKey = this.toStrFn(key);
    let hash = 0;
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i);
    }
    return hash % 37;
  }

  hashCode(key: K): number {
    return this.loseloseHashCode(key);
  }

  put(key: K, value: V): boolean {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      if (
        this.table[position] === undefined ||
        (this.table[position] != null && this.table[position].isDeleted)
      ) {
        this.table[position] = new ValuePairLazy(key, value);
      } else {
        let index = position + 1;
        while (this.table[index] != null && !this.table[position].isDeleted) {
          index++;
        }
        this.table[index] = new ValuePairLazy(key, value);
      }
      this.size++;
      return true;
    }
    return false;
  }

  get(key: K) {
    const position = this.hashCode(key);
    const table = this.table;
    if (table[position] != null) {
      if (table[position].key === key && table[position].isDeleted === false) {
        return table[position].value;
      }
      let index = position + 1;
      while (
        table[index] != null &&
        (table[index].key !== key || table[index].isDeleted)
      ) {
        index++;
      }
      if (
        table[index] != null &&
        table[index].key === key &&
        !table[index].isDeleted
      ) {
        return table[index].value;
      }
    }
    return undefined;
  }

  remove(key: K): boolean {
    let position = this.hashCode(key);
    const { table } = this;
    if (table[position] != null) {
      if (table[position].key === key && !table[position].isDeleted) {
        table[position].isDeleted = true;
        this.size--;
        return true;
      }
      position++;
      while (table[position].key !== key || table[position].isDeleted) {
        position++;
      }
      if (
        table[position] != null &&
        table[position].key === key &&
        !table[position].isDeleted
      ) {
        table[position].isDeleted = true;
        this.size--;
        return true;
      }
    }
    return false;
  }

  isEmpty() {
    return this.size === 0;
  }

  clear() {
    this.size = 0;
    this.table = {};
  }

  getTable() {
    return this.table;
  }

  toString(): string {
    if (this.isEmpty()) return "";
    const keys = Object.keys(this.table);
    let objStr = `{${keys[0]} => ${this.table[keys[0]].toString()}}`;
    for (let i = 1; i < keys.length; i++) {
      objStr = `${objStr}, {${keys[i]} => ${this.table[keys[i]].toString()}}`;
    }
    return objStr;
  }
}

```



对于第二种思路,示例代码如下:

```ts
import { defaultToString, ValuePair } from "../help";

export default class HashTableLinearProbing<K, V> {
  protected table: { [key: string]: ValuePair<K, V> };

  constructor(
    protected toStrFn: (key: K) => string = defaultToString,
    public size = 0
  ) {
    this.table = {};
  }

  private loseloseHashCode(key: K) {
    if (typeof key === "number") return key;
    const tableHash = this.toStrFn(key);
    console.log(tableHash, "is table hash value");

    let hash = 0;
    for (let i = 0; i < tableHash.length; i++) {
      hash += tableHash.charCodeAt(i);
    }
    return hash % 37;
  }

  hashCode(key: K) {
    return this.loseloseHashCode(key);
  }

  put(key: K, value: V) {
    // 保证 key 和 value 都不能是 undefined 和 null 之一
    if (key != null && value != null) {
      const position = this.hashCode(key);
      if (this.table[position] == null) {
        this.table[position] = new ValuePair(key, value);
      } else {
        let index = position + 1;
        while (this.table[index] != null) {
          index++;
        }
        this.table[index] = new ValuePair(key, value);
      }
      this.size++;
      return true;
    }
    return false;
  }

  get(key: K) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      if (this.table[position].key === key) {
        return this.table[position].value;
      }
      let index = position + 1;
      while (this.table[index].key != null && this.table[index].key !== key) {
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key)
        return this.table[index].value;
    }
    return undefined;
  }

  remove(key: K) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      if (this.table[position].key === key) {
        delete this.table[position];
        this.verifyRemoveSideEffect(key, position);
        this.size--;
        return true;
      }
      let index = position + 1;
      while (this.table[index] != null && this.table[index].key !== key) {
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key) {
        delete this.table[index];
        this.verifyRemoveSideEffect(key, index);
        this.size--;
        return true;
      }
    }
    return false;
  }

  private verifyRemoveSideEffect(key: K, removePosition: number) {
    const hash = this.hashCode(key);
    let index = removePosition + 1;
    while (this.table[index] != null) {
      const posHash = this.hashCode(this.table[index].key);
      if (posHash <= hash || posHash <= removePosition) {
        this.table[removePosition] = this.table[index];
        delete this.table[index];
        removePosition = index; // eslint-disable-line
      }
      index++;
    }
  }

  isEmpty() {
    return this.size === 0;
  }

  clear() {
    this.size = 0;
    this.table = {};
  }

  getTable() {
    return this.table;
  }

  toString(): string {
    if (this.isEmpty()) return "";
    const keys = Object.keys(this.table);
    let objStr = `${keys[0]} => ${this.table[keys[0]].toString()}`;
    for (let i = 1; i < keys.length; i++) {
      objStr = `${objStr}, ${keys[i]} => ${this.table[keys[i]].toString()}`;
    }
    return objStr;
  }
}
```

这里的关键在于`remove`方法,删除数据之后还要对后续由于哈希冲突导致的数据位置异常进行处理,对相应的值的位置进行修复.哈希冲突越多,则`remove`的开销越大,因此我们需要一个优秀的`哈希函数`.

### 多重散列法

多重散列或者多重哈希,没什么区别.`一个`哈希函数不够,`就用两个`.看示例代码:

```JavaScript
(firstHash(key) + i * secondHash(key)) % tableSize 
```







## 3. 参考

- [Data Structures 101: implement hash tables in JavaScript](https://www.educative.io/blog/data-strucutres-hash-table-javascript)