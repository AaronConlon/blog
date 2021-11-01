---
title: '谈谈JWT(Json web token) 技术'
date: '2021/11/1'
tags:
- Node
- Koa
- JWT
mainImg: 'https://images.unsplash.com/photo-1624696941338-934bf86c28b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU3NzY0NDI&ixlib=rb-1.2.1&q=80&w=1080'
coverImg: 'https://images.unsplash.com/photo-1624696941338-934bf86c28b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNjUyNjZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzU3NzY0NDI&ixlib=rb-1.2.1&q=80&w=400'
intro: '今天记录一下学习到的后端接口认证的知识，JWT 技术。'
---

# 前言

我的小项目需要使用一种接口认证机制，为了尽量减小服务器端的资源压力，我选择了近年来非常火热的`JWT`技术。



# 简介

什么是`JWT`?

> [JSON Web Tokens - jwt.io](https://jwt.io/)

在其官网的首页上有一段非常显眼的介绍：“JSON Web Token 是一个开放的行业标准（RFC 7519），可以在两方之间安全传输信息”。

如下是一个经过编码的`token`：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

请忽视换行符，`token`由三个部分组成并且使用`.`号分隔：

1. 头部
2. 载荷对象
3. 验证签名



让我们通过一张图片来理解这个过程：

![image-20211101223843693](/Users/yi/Library/Application Support/typora-user-images/image-20211101223843693.png)

上述例子中的：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`就是头部数据经过`base64`编码后的结果。`eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`则是载体对象经过`base64`编码后的结果，而`SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`则是通过某种算法对`头部 base64 编码`+`.`+`载荷对象 base64 编码`和秘钥进行加密后的结果。

## JWT 的优缺点

### 优点

- JWT 具有较好的扩展性，且相对于传统的 Session 方案有不占服务器资源的优势

- JWT 的载荷对象中可以存储信息（加密或不加密可视情况而定）

### 缺点

- 易滥用：当载荷对象中存储的信息过多的时候，`token`将会变得非常冗长，所以需要开发者进行控制，避免滥用于数据交换
- 载荷和头部对象可以直接通过 base64 进行解码得到明文信息（当然开发者可以进行额外的加密控制，或者使用 https 技术防止 token 泄露）
- 不支持撤销（可以通过增加服务器端缓存或白名单机制来弥补，但同时也增加了资源消耗） 

## 适用场景

- 安全要求不高的认证场景
- 短期或一次性认证需求

# Koa 和 Jwt

我的个人项目使用了`Koa`框架开发后端接口应用，为了使用`JWT`的特性我需要安装以下两个包：

- koa-jwt
- jsonwebtoken

`koa-jwt`中间件让我们能够设置使用`jwt`来保护哪些路由，并且将请求头中的`token`数据解析出来，扩展到`ctx`上下文中。

显然，我们可以将注册和登录的接口作为白名单，直接提供给所有用户使用，当用户注册或登录成功的时候，服务端通过`jsonwebtoken`创建一个`token`并返回给客户端。

此时，客户端可以将之保存在`localstorage`中，并且使用`axios`之类的库对请求进行拦截，设置拦截器将`token`放在请求头上面，形如：

```bash
Authorization: Bearer <token>	
```

此时，`token`保存在客户端上，服务端可以通过秘钥和加密算法就能解析到`token`的信息。

> Koa-jwt 和 jsonwebtoken 的使用方法建议阅读文档。

网上有一种`refresh token`的说法，即设置一个访问周期，当用户持续访问服务器时根据访问周期来提供新`token`来替换旧`token`，从而让保持有效期内访问的用户延长需要重新登录的时间。

显然这种机制需要设置一个合适的`token`过期时间和刷新周期，被替换的`token`在某些时间段依然可以访问服务器。

在不同的场合下选择不同的技术才是解决问题的关键！

# 参考

- [JSON Web Tokens - jwt.io](https://jwt.io/)
- [JSON Web Token Introduction - jwt.io](https://jwt.io/introduction)
