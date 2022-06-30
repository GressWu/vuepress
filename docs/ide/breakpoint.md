---
title: Idea断点调试技巧
date: 2022-06-30
categories:
 - IDE
tags:
 - idea
---

## 行断点

代码行左侧 点击`鼠标左键`

这种断点最常见，Debug后会直接在对应行处挂起

![image-20220629170326194](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220629170326194.png)

## 源断点

代码行左侧 点击`SHIFT + 鼠标左键`，断点标识为黄色圆形

![image-20220629170754729](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220629170754729.png)

当挂起状态勾选，并选择All之后，**源断点就会变为行断点**。

![image-20220629172818564](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220629172818564.png)

使用源断点的时候，断点并不会进入，但是控制台会打印断点信息

## 方法断点

在方法申明的那一行打一个断点，或者在接口方法申明那一行打一个断点。

![image-20220630101136673](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630101136673.png)

![image-20220630101156003](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630101156003.png)

Debug后，会将在该方法的第一行或者是实现接口的方法第一行处挂起

## 异常断点

异常断点需要自己去配置，**全局有效**。

* 找到断点列表

* 配置需要的异常断点，已空指针异常为例

  ![image-20220630102116654](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630102116654.png)

配置完后，Debug模式下断点会自动停在异常处

![image-20220630102327236](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630102327236.png)

## 字段断点

在字段上打断点，用来监控字段值的变化过程

![image-20220630102925115](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630102925115.png)

## 条件断点

行断点上左键弹出设置。

* 在某个具体条件下停顿，比如说在一个循环中，在所有偶数项下停顿

![image-20220630105716158](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630105716158.png)

* 设置打印堆栈信息

  ![image-20220630105956236](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630105956236.png)

## 避免操作资源

有些时候我们数据处理会发生一些问题，如果不及时停止，后续更新到数据库就会造成脏数据污染。

![image-20220630134612597](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630134612597.png)

在控制台的栈帧上点击`Force Return`就会强制结束当前方法，以此来避免脏数据的产生。

## 调试控制台上常见功能

![image-20220630140417791](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630140417791.png)

## 调试Stream流

在Stream流上打一个行断点，点击`Trace Current Stream Chain`

![image-20220630141222112](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220630141222112.png)