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

#### 注释

```swift
// something

/* 首行
/* 内部嵌套 */
尾行*/

/*多行
注释*/

```

#### 分号

期望在一行中执行多段代码，可以添加分号。分号不是必须的，跟`JavaScript`一样

```swift
let cat = "🐱";print(cat)
// Prints "🐱"
```

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
// 同类型变量，同时声明
var red, green, blue: Double
// 变量名几乎支持所有字符
let π = 3.14159
let 你好 = "你好世界"
let 🐶🐮 = "dogcow"
```

> 值不会隐式转换！

#### 布尔值

```swift
let isOk = false
let isAlone = true
```

错误的布尔值用法示例：

```swift
let i = 1
if i {
    // this example will not compile, and will report an error
}
```

#### 元组

```swift
let http404Error = (404, 'Not Found')
// http404Error is of type (Int, String), and equals (404, "Not Found")

// read
let (statusCode, statusMessage) = http404Error
print("The status code is \(statusCode)")
// Prints "The status code is 404"
print("The status message is \(statusMessage)")
// Prints "The status message is Not Found"

// ignore something
let (justTheStatusCode, _) = http404Error
print("The status code is \(justTheStatusCode)")
// Prints "The status code is 404"

// access by index
print("The status code is \(http404Error.0)")
// Prints "The status code is 404"
print("The status message is \(http404Error.1)")
// Prints "The status message is Not Found"

// 定义元组名
let http200Status = (statusCode: 200, description: "OK")
// 使用属性字段读取
print("The status code is \(http200Status.statusCode)")
// Prints "The status code is 200"
print("The status message is \(http200Status.description)")
// Prints "The status message is OK"
```

#### 整数

如下整数类型：

- UInt8
- UInt32
- ...

无符号：`unsigned`整数类型具有显式的范围。

```swift
let minValue = UInt8.min  // minValue is equal to 0, and is of type UInt8
let maxValue = UInt8.max  // maxValue is equal to 255, and is of type UInt8
```

显式的`Int/UInt`在不同位数的机器上能标识的数字范围取决于机器的位数。

在`32-bit`平台，`Int`等同于`Int32`，在`64-bit`平台，则等同于`Int64`。

#### 浮点数

- `Double` represents a 64-bit floating-point number.
- `Float` represents a 32-bit floating-point number.

#### 进制

```swift
let decimalInteger = 17
let binaryInteger = 0b10001       // 17 in binary notation
let octalInteger = 0o21           // 17 in octal notation
let hexadecimalInteger = 0x11     // 17 in hexadecimal notation
```

#### 指数

- `1.25e2` means 1.25 x 102, or `125.0`.
- `1.25e-2` means 1.25 x 10-2, or `0.0125`.

#### 数字的显式转换

使用类创建新数据的实例来转换。

```swift
let cannotBeNegative: UInt8 = -1
// UInt8 can't store negative numbers, and so this will report an error
let tooBig: Int8 = Int8.max + 1
// Int8 can't store a number larger than its maximum value,
// and so this will also report an error

let twoThousand: UInt16 = 2_000
let one: UInt8 = 1
let twoThousandAndOne = twoThousand + UInt16(one)

let three = 3
let pointOneFourOneFiveNine = 0.14159
let pi = Double(three) + pointOneFourOneFiveNine
// pi equals 3.14159, and is inferred to be of type Double
```

#### 类型别名

```swift
typealias AudioSample = UInt16
var maxAmplitudeFound = AudioSample.min
// maxAmplitudeFound is now 0
```

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

**For..in**循环遍历数组和字典：

```swift
let interestingNumbers = [
    "Prime": [2, 3, 5, 7, 11, 13],
    "Fibonacci": [1, 1, 2, 3, 5, 8],
    "Square": [1, 4, 9, 16, 25],
]
var largest = 0
for (_, numbers) in interestingNumbers {
    for number in numbers {
        if number > largest {
            largest = number
        }
    }
}
print(largest)
// Prints "25"
```

`while循环`：

```swift
var n = 2
while n < 100 {
    n *= 2
}
print(n)
// Prints "128"

var m = 2
repeat {
    m *= 2
} while m < 100
print(m)
// Prints "128"
```

系列索引循环：

```swift
var total = 0
for i in 0..<4 {
    total += i
}
print(total)
// Prints "6"
```

#### 函数和递归

> Functions are a first-class type.

定义和调用：

> 不同于JavaScript，函数传参要指定参数名

```swift
func greet(person: String, day: String) -> String {
  return "Hi \(person), today is \(day)"
}
greet(person: 'aaron', day: 'Monday')
```

甚至是参数别名：

> `_`占位符，用于表示通用别名

```swift
func greet(_ person: String, on day: String) -> String {
    return "Hello \(person), today is \(day)."
}
greet("John", on: "Wednesday")
```

函数可以返回元组(`Tuple`)，取值非常自由和灵活：

```swift
func calculateStatistics(scores: [Int]) -> (min: Int, max: Int, sum: Int) {
    var min = scores[0]
    var max = scores[0]
    var sum = 0

    for score in scores {
        if score > max {
            max = score
        } else if score < min {
            min = score
        }
        sum += score
    }

    return (min, max, sum)
}
let statistics = calculateStatistics(scores: [5, 3, 100, 3, 9])
// 元组变量名或下标
print(statistics.sum)
// Prints "120"
print(statistics.2)
// Prints "120"
```

**嵌套函数**：

```swift
func returnFifteen() -> Int {
    var y = 10
    func add() {
        y += 5
    }
    add()
    return y
}
returnFifteen()
```

**函数作为返回值**：

```swift
func makeIncrementer() -> ((Int) -> Int) {
    func addOne(number: Int) -> Int {
        return 1 + number
    }
    return addOne
}
var increment = makeIncrementer()
increment(7)
```

**函数作为参数传入：**

```swift
func hasAnyMatches(list: [Int], condition: (Int) -> Bool) -> Bool {
    for item in list {
        if condition(item) {
            return true
        }
    }
    return false
}
func lessThanTen(number: Int) -> Bool {
    return number < 10
}
var numbers = [20, 19, 7, 12]
hasAnyMatches(list: numbers, condition: lessThanTen)
```

> 函数可以无返回值，此时不必声明返回值类型

