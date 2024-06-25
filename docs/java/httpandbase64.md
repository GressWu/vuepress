---
title: HTTP请求导致Base64解析失败的问题
date: 2024-05-28
categories:
- BackEnd
tags:
- Java
---

# HTTP请求导致Base64解析失败的问题

## 问题背景

最近遇到过一个问题，将密码用base64转义，HTTP请求目标接口后。明明两边密码一致，有时候密码校验通过，有时候会失败。通过比对失败案例发现，这些失败的案例通过HTTP请求发送过去的密码+号会变成空格，最后导致密码校验失败。

## 问题分析

当浏览器或其他 HTTP 客户端发送请求时，URL 中的加号 "+" 会被自动转换为空格。这种行为是为了遵循 URL 编码的标准，确保 URL 中的特殊字符能够正确传输和解析。

![image-20240528152244591](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240528152244591.png)

## 问题解决

发现问题是HTTP传输导致的，我们可以转换思路，查找URL编码表。将“+”号用%2B替代，这样的话传输过去的base64就是完整的了。

```java
str.replace("+","+2B");
```

