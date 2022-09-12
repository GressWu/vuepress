---
title: 计算机进制计算
date: 2022-08-10
categories:
- ComputerBasic
tags:
- ComputerBasic
---

## 计算机单位

* bit(比特) bit是计算机中最小的单位，二进制0或1代表了一个位
* byte(字节) 8个bit组成一个字节 因此一个字节可以表示十进制数(0~255)个数
* 1KB = 1024Byte
* 1MB = 1024KB
* 1GB = 1024MB
* 1TB = 1024GB

## 无符号数

没有正负符号的数，Java没有任何无符号形式的int、long、byte、short类型

在一个8位寄存器中的范围是(0~255)

## 有符号数

机器数（符号数字化的数）与真值（带符号的数）

## 进制转换

二进制 BIN

八进制 OCT

十进制 DEC

十六进制 HEX

### 二进制转十进制

![image-20220810210917782](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220810210917782.png)

基本计算：2^(n-1)代表当前二进制位所对应的十进制数

如果所有位数都为1的话：当前二进制数对应的十进制数为2^n-1

## 十进制转二进制

![image-20220810211256299](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220810211256299.png)

除n-取余-倒排

## 二进制转八进制

![image-20220810211623506](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220810211623506.png)

因为2^3=8，所以每三位二进制数对应了一个八进制数。

将三个二进制数加起来就是一位八进制数表示的数值。

如果不够三位就在前面补0。

## 二进制转十六进制

![image-20220810211900233](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220810211900233.png)

因为2^4=16，所以每四位二进制数对应了一个十六进制数。

将四个二进制数加起来就是一位十六进制数表示的数值。

如果不够四位就在前面补0。

10代表A，11代表B以此类推

## 十六进制、八进制转二进制

与上面同一思路

十六进制，每一位拆成四位二进制数，不够补零

八进制，每一位拆成三位二进制数，不够补零