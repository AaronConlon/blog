---
title: '前端工具库'
date: '2022/4/4'
tags:
- Swift
mainImg: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDk5NTg5MDA&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDk5NTg5MDA&ixlib=rb-1.2.1&q=80&w=400'
intro: '想要开发原生的 macOS 桌面程序，学习 Swift 是我的第一步。'
---

用最快的速度，了解、学习、上手`Swift`！

### 基础

#### 简单值

```swift
// 变量
var count = 2
count = 3
// 常量
let count = 999
// 空值
nil
// 数据类型
let explicitDouble: Double = 70
// 可选值
let name: String? = 'Aaron' 
let sex: String? = nil
```

> 值不会隐式转换！

#### 显式转换值

```swift
let label = "The width is "
let width = 94
let widthLabel = label + String(width)
```

#### 插值转换

```swift
let apples = 3
let oranges = 5
let appleSummary = "I have \(apples) apples."
let fruitSummary = "I have \(apples + oranges) pieces of fruit."
```

#### 多行字符串

```swift
let quotation = """
I said "I have \(apples) apples."
And then I said "I have \(apples + oranges) pieces of fruit."
"""
```

#### 数组和字典

初始化空数组和字典：

```swift
let emptyArray: [String] = []
let emptyDictionary: [String: Float] = [:]
```

有值数组和字典：

```swift
var shoppingList = ["catfish", "water", "tulips"]
shoppingList[1] = "bottle of water"

var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
```

#### 控制流

组合遍历和条件语句示例：

```swift
let individualScores = [75, 43, 103, 87, 12]
var teamScore = 0
for score in individualScores {
    if score > 50 {
        teamScore += 3
    } else {
        teamScore += 1
    }
}
print(teamScore)
// Prints "11"
```

**Switch**语句：

```swift
let vegetable = "red pepper"
switch vegetable {
case "celery":
    print("Add some raisins and make ants on a log.")
// 多值匹配
case "cucumber", "watercress":
    print("That would make a good tea sandwich.")
// 条件匹配，区域变量
case let x where x.hasSuffix("pepper"):
    print("Is it a spicy \(x)?")
// 区间匹配
case 1..<5:
  	print('1~5')
default:
    print("Everything tastes good in soup.")
}
// Prints "Is it a spicy red pepper?"
```

> switch 必须包含所有可能的 case，不需要`break`，支持`fallthrough`贯穿

```swift
let somePoint = (1,1)
switch somePoint {
  case (0,0)
     print("fail")
  case (1,_)
     print("success")
  default:
     print("no match")
}
// print：success
```

