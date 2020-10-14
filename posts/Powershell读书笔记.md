---
title: "Powershell读书笔记"
date: "2020-08-03"
tags:
  - powershell
author:
  name: Tim Neutkens
ogImage:
coverImg: "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2378&q=80"
intro: "首先,可以使用`writeHead`设置响应头部,然后根据请求信息,可以读取数据库或者本地文件,获取资源并且设置相关的逻辑代码,返回不同类型的数据.并且,可以在做相关操作之前,记录相关信息,也许这就是中间件的来源."
---

# Powershell Notebook

## chapter1：getting started with powershell

### 1.1 允许在你的机器上运行脚本

```powershell
# 以管理员身份运行,这条命令将修改注册表,注册表中保存了powershell很多默认配置项
Set-ExecutionPolicy RemoteSigned
```

将 powershell 的运行策略修改为运行未签名的脚本运行.或者通过管理员权限打开一个终端,执行脚本的时候指明使用`bypass`策略.

```powershell
powershell.exe -ExecutionPolicy Bypass -File "c:\MyScript.ps1"
# 或者在此控制台先执行
Set-ExecutionPolicy Bypass Process
```

### 1.2 alias 和简单函数

举个例子,`write-output`和`write-host`都能接受字符并且输出到屏幕,但是`write-output`还能返回输出的值作为结果,这在变量引用和管道传递方面很有用.简单函数不同但是结果相同,这在 powershell 中非常常见.

同一个命令,可以有不同的别名,例如`write-output`的`alias`有`echo`和`write`.甚至,可以直接用单引号或者双引号括起来直接输出:

```powershell
"hello world"
'hello world'

# alias即别名,一条命令可以有不同的别名,就像人可以有不同的外号,如下举例
ls
dir
# 都是get-childitem的alias
```

这些是系统自带的 alias,我们可以自己增加,例如:

```powershell
set-alias -Name ping -value test-netconnection

# 如下所示
➜  Markdown笔记 Test-NetConnection www.baidu.com
ComputerName           : www.baidu.com
RemoteAddress          : 14.215.177.39
InterfaceAlias         : WLAN
SourceAddress          : 192.168.124.11
PingSucceeded          : True
PingReplyDetails (RTT) : 8 ms

➜  Markdown笔记 Set-Alias ping Test-NetConnection

➜  Markdown笔记 ping www.baidu.com
ComputerName           : www.baidu.com
RemoteAddress          : 14.215.177.39
InterfaceAlias         : WLAN
SourceAddress          : 192.168.124.11
PingSucceeded          : True
```

但是,不同的终端属于不同的`session`,你可以在当前终端设置`alias`,此时其他终端并不会生效.并且,本终端设置的`alias`会重写默认存在的命令,如上所述,我重写了`ping`命令.本来`ping`命令是这样的:

```powershell
➜  ~ ping www.baidu.com

正在 Ping www.a.shifen.com [14.215.177.39] 具有 32 字节的数据:
来自 14.215.177.39 的回复: 字节=32 时间=8ms TTL=55
来自 14.215.177.39 的回复: 字节=32 时间=8ms TTL=55
来自 14.215.177.39 的回复: 字节=32 时间=9ms TTL=55
来自 14.215.177.39 的回复: 字节=32 时间=8ms TTL=55

14.215.177.39 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 8ms，最长 = 9ms，平均 = 8ms
```

### 1.3 管道

管道符`|`放在一条命令的末尾,可以将命令的返回值传递到下一个命令上去,并且作为下一条命令的`最后一个参数`使用.

```powershell
Get-ChildItem | Select-Object Name
#This may be shortened to:
gci | Select Name

# gci就是命令的alias

Get-ChildItem | ForEach-Object {
 Copy-Item -Path $_.FullName -destination C:\NewDirectory\
}
#This may be shortened to:
gci | % { Copy $_.FullName C:\NewDirectory\ }
```

### 1.4 使用`.net`库的方法

powershell 天生支持`.net`的各种方法.毕竟是微软一家子的成员.例如:

```powershell
#calling Path.GetFileName()
C:\> [System.IO.Path]::GetFileName('C:\Windows\explorer.exe')
explorer.exe
```

如果你熟悉`.net` 的话,使用它的库函数就能如虎添翼事半功倍.

使用静态方法可以很直接,但是如果有些方法不是静态方法,则需要对`class`进行实例化.举例:

```powershell
➜  Markdown笔记 $object = [System.DateTime]::now
➜  Markdown笔记 $object.AddHours(1)
2020年8月3日 3:00:07
```

直接就输出一个修改过的时间结果.

### 1.5 安装或者设置

现在默认 windows7 以上自带`powershell`,但是在其他平台,则需要手动安装,例如支持在 Ubuntu 上安装`powershell v6`.

powershell 脚本的注释使用`#`.或者长注释使用`<# comment #>`内部添加注释,支持换行.

### 1.6 简述创建对象

powershell 以管道传递对象,对象在 powershell 中具有独特的地位.举个例子.

```powershell
# 创建一个时间对象
$var = new-object system-datetime
# 创建一个流对象
$sr = new-object system.io.streamreader -argumentList "file stream"

# 创建一个复杂对象
$newObj = [PScustomObject]@{
	ComputerName = 'server1',
	Env = 'Production'
}

# 创建一个ie浏览器对象
$IE1 = New-Object -COMObject InternetExplorer.Application -Property @{Navigate2="www.microsoft.com"; Visible = $True}

# The following command gets the same results as the example above.
$IE2 = New-Object -COMObject InternetExplorer.Application`
$IE2.Navigate2("www.microsoft.com")`
$IE2.Visible = $True`
```

上述可以看出创建对象的时候可以设置一些属性,或者创建基础实例之后再设置属性.所有的对象都可以通过管道进行传输.对象的集合在导入和导出特定的格式,例如 csv 或者 xml 的时候非常有效,例如命令`export-csv`的每一行都是一个对象.

## chapter2: variable in powershell

> 变量用于保存数据,以便于后续使用.

### 2.1 简单变量和数组

```powershell
$name = "root"
$numArray = 1,2,3,4
$newArray = 1,"2" # 不限类型,比较灵活
$numArray = $numArray +5
$newArray = $newAarray + $numArray
```

### 2.2 拆分变量为数组

```powershell
$input="foo.bar.baz"
$parts=$input.Split(".")
$foo=$parts[0]
$bar=$parts[1]
$baz=$parts[2]
#You can simply do this:
$foo,$bar,$baz=$input.Split(".")
```

灵活处理字符串和数组.类似`js`,也可以根据变量的数量去分配.

```powershell
$foo, $_ = $input.Split(".")
# foo则保存首个拆分的值,_保存剩下的数组.
```

### 2.3 Scope

作用域范围跟分为局部和全局,函数内部只在内部有效,支持闭包.如果你想要指定外部的变量,以便于和函数内部同名变量区分.则可以使用如下方式:

`$local:foo` 和 `$global:foo`,如果存在多层嵌套,则`global`为最外层.

### 2.4 移除变量

```powershell
# 需要指定类型为 Variable,再指定变量名
Remove-Item Variable:\foo
```

变量支持像处理文件系统项目的大多数的`*-item`命令进行处理.

更显式的删除变量,可以使用`remove-variable`命令.其简写是`rv`.命令如`rv foo`

## chapter 3: Operators

### 3.1 比较运算符

类似`bash`,使用如下方式进行比较,返回`true`或者`false`的`boolean`值.

```powershell
2 -eq 2
2 -ne 2
2 -lt 2
2 -gt 2
2 -ge 2
2 -le 2
# 针对大小写是否敏感
a -eqi A # true,字符串不敏感,eqc则敏感

# 字符串比较
# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:39:32]
➜ "string" -like "*ing"
True
# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:40:00]
➜ "string" -like "ing"
False

# 加not取反
➜ "string" -notlike "ing"
True

# 支持正则表达式
➜ "string" -match "ing"
True
# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:41:15]
➜ "string" -match "inge"
False
# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:41:22]
➜ "string" -match "ing&"
False
# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:41:33]
➜ "string" -match "ing$"
True

# 集合数据比较

# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:41:37]
➜ "12","abc" -contains "1"
False
# root at LAPTOP-G92L1V81 in D:\pw7 workstation\git-repos\nextjs_blog\posts on git:master ≣ +0 ~1 -0 ! [1:44:14]
➜ "12","abc" -contains "12"
True

➜ "12" -in "aaa","12"
True
```

### 3.2 算数运算

```powershell
1+2	# Addition
1-2	# Subtraction
-1	# Set negative value
1*2	# Multiplication
1/2	# Division
1%2	# Modulus
100 -shl 2 # 按位左移
100 -shr 2 # 按位右移

# 变量计算
$var = 1
$var += 2
$var++
$var += "2" # 也支持,自动类型转换
```

### 3.3 输出重定向操作

> 大神详解:[Understanding Streams, Redirection, and Write-Host in PowerShell | Scripting Blog](https://devblogs.microsoft.com/scripting/understanding-streams-redirection-and-write-host-in-powershell/)

执行命令或者程序,将产生不同类型的输出信息流.

![](https://devblogs.microsoft.com/wp-content/uploads/sites/29/2019/02/2570.1.png)

顺利执行将产生 success 的输出流,举个例子:

```powershell
cmdlet > file # 发送success输出流重写file的内容
cmdlet >> file # 追加success输出流到file的文件末尾
cmdlet 1>&2 # 1代表success状态的输出流,此时指的是将success(1)和error(2)的输出重定向到error流中去

cmdlet 2> file # error(2) 输出流
cmdlet 3> file # powershell v3+支持的warning数据流
cmdlet 4> file # powershell v3+支持的verbose输出流,详细消息流通常用于提供命令处理的相关信息,便于调试
cmdlet 5> file # Debug
cmdlet 6> file # information level
```

不同的流是平行的,在管道之间传递对象,我们并不希望接受 cmdlet 各种类型的流式数据.且管道符默认接收了`success`级别的信息.其他的流的数据发往了其他的接收处.

> Windows PowerShell inventor, Jeffrey Snover, says that [Write-Host is harmful](http://www.jsnover.com/blog/2013/12/07/write-host-considered-harmful/)

**Write-Host is not written to any stream**.`write-host`不会污染输出流,且`不向任何流进行输入`.单纯向屏幕输出.

也就是说你无法将`write-host`的 message 定向到其他流,也没法分配给变量.

还可以看看这里:[about_Redirection - PowerShell | Microsoft Docs](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection?view=powershell-7)

另外举个例子:

```powershell
# 同时ls查看两个目录,如下命令可以将错误信息重定向转移走,输入到z文件,而不会只是将success的ls d:结果输出z
▶ ls D:,fake *> z

# 如果不重定向
▶ ls D:,fake > z
Get-ChildItem: Cannot find path 'C:\Users\root\fake' because it does not exist.
~ ⨯
▶ cat z


    Directory: D:\pw7 workstation\git-repos\nextjs_blog\posts
# 则z保存了success的信息
```

至于,将`success`消息重定向到`error流`的操作,终端提示错误,跟书本不符.不过不会真有人想要做这种事吧.

另外,我用过几次将没必要的错误信息流重定向到`$null`中去.或者将没必要的所有流都扔掉:

```powershell
cmdlet *>$null
```

### 3.4 混合操作类型

举例如下:

```powershell
▶ "2"+2
22
~
▶ 2+"22"
24
~
➜ "2" * 2
22
➜ 2 * "2"
4
➜ $a = Read-Host
33
➜ $a -gt 5
False
➜ 5 -gt $a
False
```

左边的数据类型决定了整体的计算和数据转换方式.

### 3.5 逻辑操作和字符串变换操作

举例:

```powershell
-and # 与
-or # 或
-xor # 异或
-not # not
! # not

# 常见替换
➜ "just a demo" -replace "demo","test"
just a test

# 正则表达式单引号替换
➜ "root@gmail.com" -replace '^[\w]+@(.+)','$1'
gmail.com

# 拆分数组
➜ "root@gmail.com" -split "@"
root
gmail.com

# join数组
➜ "1","1","0" -join ":"
1:1:0
```

## Chapter 4: Special Operators

### 4.1 数组表达运算符

通过一个表达式返回一个数组:

```powershell
➜  posts git:(master) @(Get-ChildItem C:\Windows\System32\ntdll.dll)


    Directory: C:\Windows\System32

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           2020/7/17    20:10        1999968 ntdll.dll

➜  posts git:(master) @(Get-ChildItem C:\Windows\System32\ntdll.dll)[0]


    Directory: C:\Windows\System32

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           2020/7/17    20:10        1999968 ntdll.dll

➜  posts git:(master) @(Get-ChildItem C:\Windows\System32\ntdll.dll)[1]
➜  posts git:(master)
```

如上所述,`@()`内部的表达式处理返回值将得到一个数组.

### 4.2 调用运算符

```powershell
$command = 'ls'
&$command # 等于直接调用字符串的内容,视为命令并执行
```

### 4.3 点源操作(dot sourcing operator)

`. $profile`是我很常用的一个命令,因为我经常修改预加载的配置文件`$profile`.这个变量指向一个`.ps1`文件,每个 console 打开的时候都会`run`这个文件.因此,可以在这里面设置一下 alias 或者 function.

当我们在当前 terminal 下使用`. xxx.ps1`命令执行此脚本的时候,即将此脚本的执行环境范围设置为当前`terminal session`.

回到`$profile`的例子,我修改了这个脚本,并且在当前`terminal`执行了`. $profile`,则此脚本内的函数即加载到我的`terminal session`内了.我可以轻松调用此脚本内的函数处理我的事务.

## Chapter 5: Basic set Operations

### 5.1 对象选择

使用条件表达式`where-object` 过滤枚举对象,其常用 alias 是`where`和`?`.

```powershell
➜  ~ $names= @("Aaron","Albert","Alphonse","Bernie","Charlie","Danny","Ernie","Frank")
➜  ~ $name | Where-Object {$_ -like "*yi"}
youyi
➜  ~ $name | Where {$_ -like "*yi"}
youyi
➜  ~ $name | ? {$_ -like "*yi"}
youyi
```

### 5.2 对象排序

对可迭代对象进行升序和降序排序:

```powershell
➜  ~ $names= @("Aaron","Albert","Alphonse","Bernie","Charlie","Danny","Ernie","Frank")
➜  ~ $names | sort
Aaron
Albert
Alphonse
Bernie
Charlie
Danny
Ernie
Frank
➜  ~ $names | Sort-Object -Descending
Frank
Ernie
Danny
Charlie
Bernie
Alphonse
Albert
Aaron

# 指定属性
➜  ~ $names | Sort-Object -Top 3 -Property Length
Aaron
Danny
Ernie
➜  ~ $names | Sort-Object {$_.length} -Top 3
Aaron
Danny
Ernie
```

### 5.3 分组排序

可以通过设置表达式,实现分组的排序.

```powershell
➜  ~ $names | Group-Object -Property length # group-object alias is group

Count Name                      Group
----- ----                      -----
    4 5                         {Aaron, Danny, Ernie, Frank}
    2 6                         {Albert, Bernie}
    1 7                         {Charlie}
    1 8                         {Alphonse}
```

### 5.4 对象投影

这个小节标题让我想起当初上 SQL 的课的时候了.投影一个可迭代对象的部分 item,可以对单独的对象进行展开操作.获取自己想要的部分数据.

```powershell
➜  ~ $dir = ls
➜  ~ $dir | select name, FullName, LastAccessTime

Name                     FullName                               Last
                                                                Acce
                                                                ssTi
                                                                me
----                     --------                               ----
.atom                    C:\Users\root\.atom                    202…
.config                  C:\Users\root\.config                  202…
.ssh                     C:\Users\root\.ssh                     202…
.vscode                  C:\Users\root\.vscode                  202…
3D Objects               C:\Users\root\3D Objects               202…
Contacts                 C:\Users\root\Contacts                 202…
Documents                C:\Users\root\Documents                202…
Downloads                C:\Users\root\Downloads                202…
Favorites                C:\Users\root\Favorites                202…
Links                    C:\Users\root\Links                    202…
Music                    C:\Users\root\Music                    202…
OneDrive                 C:\Users\root\OneDrive                 202…
Pictures                 C:\Users\root\Pictures                 202…
Saved Games              C:\Users\root\Saved Games              202…
scoop                    C:\Users\root\scoop                    202…
Searches                 C:\Users\root\Searches                 202…
Videos                   C:\Users\root\Videos                   202…
.bash_history            C:\Users\root\.bash_history            202…
.bash_profile            C:\Users\root\.bash_profile            202…
.bashrc                  C:\Users\root\.bashrc                  202…
.bashrc.swp              C:\Users\root\.bashrc.swp              202…
.gitconfig               C:\Users\root\.gitconfig               202…
.git-for-windows-updater C:\Users\root\.git-for-windows-updater 202…
.node_repl_history       C:\Users\root\.node_repl_history       202…
.viminfo                 C:\Users\root\.viminfo                 202…
.vuerc                   C:\Users\root\.vuerc                   202…
.yarnrc                  C:\Users\root\.yarnrc                  202…

➜  ~
```
