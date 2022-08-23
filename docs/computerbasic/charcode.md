---
title: 字符集与字符编码
date: 2022-08-23
categories:
- computerBasic
tags:
- computerBasic
---

## 为什么要产生字符集

因为计算机中表示数据都是二进制编码，而平时我们的文字无法直接转换为二进制，这样就需要规定一套二者之间的映射关系，这就是字符集。常见的有ASCII码与Unicode编码。

![img](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile1.renrendoc.com%2Ffileroot_temp2%2F2021-1%2F3%2Ff54ef861-ded1-40be-85a2-0d3f0b0d0b96%2Ff54ef861-ded1-40be-85a2-0d3f0b0d0b961.gif&refer=http%3A%2F%2Ffile1.renrendoc.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663849052&t=963babf8a6567bfc7495314a37904bcd)

ASCII码是8位二进制的编码，正好一字节，能表示0~255所对应的256个字符。虽然ASCII编码可以很好的满足英语的使用，但是对于汉语、日文等语言，256个字符肯定远远不够。因此产生了能把世界上所有语言文字都包含的Unicode字符集。

## 编码格式

**UTF-8**

互联网的普及，强烈要求出现一种统一的编码方式。UTF-8就是在互联网上使用最广的一种unicode的实现方式。其他实现方式还包括UTF-16和UTF-32，不过在互联网上基本不用。**重复一遍，这里的关系是，UTF-8是Unicode的实现方式之一。**

UTF-8最大的一个特点，就是它是一种变长的编码方式。它可以使用1~4个字节表示一个符号，根据不同的符号而变化字节长度。

**GBK/GB2312/GB18030**

GBK和GB2312都是针对简体字的编码，只是GB2312只支持六千多个汉字的编码，而GBK支持1万多个汉字编码。而GB18030是用于繁体字的编码。汉字存储时都使用两个字节来储存。

<iframe src="//player.bilibili.com/player.html?aid=729809394&bvid=BV1kD4y1z7ft&cid=811695250&page=1" allowfullscreen="allowfullscreen" width="100%" height="500" scrolling="no" frameborder="0" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>


