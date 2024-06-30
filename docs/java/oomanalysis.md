---
title: 分析OOM工具的使用
date: 2024-06-30
categories:
- BackEnd
tags:
- Java
---

* dump

`heap dump`文件是一个二进制文件，它保存了某一时刻JVM堆中对象使用情况。**HeapDump**文件是指定时刻的Java堆栈的快照，是一种镜像文件。**Heap Analyzer**工具通过分析HeapDump文件，哪些对象占用了太多的堆栈空间，来发现导致内存泄露或者可能引起内存泄露的对象。

* javacore

`thread dump`文件主要保存的是java应用中各线程在某一时刻的运行的位置，即执行到哪一个类的哪一个方法哪一个行上。`thread dump`是一个文本文件，打开后可以看到每一个线程的执行栈，以`stacktrace`的方式显示。通过对`thread dump`的分析可以得到应用是否“卡”在某一点上，即在某一点运行的时间太长，如数据库查询，长期得不到响应，最终导致系统崩溃。

## dump分析软件 Heap Analyzer

1. 将dump文件导入到Heap Analyzer中 下图是概览

![image-20240630145108359](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630145108359.png)

![image-20240630145239197](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630145239197.png)

![image-20240630145256990](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630145256990.png)

![image-20240630145320733](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630145320733.png)

注：上面主要分析的是内存Jvm堆的占比，软件也说明了是suspect，具体情况还需结合代码一块分析内存泄漏的原因。

2. 具体分析 第二栏里面分别是对象、类型、类、根、根类型的分析

![image-20240630150538199](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630150538199.png)

可以帮助我们更加细致的分析，其中"RootTypes List"允许你以树状结构查看dump文件中的根类型。通过这个视图，你可以了解程序在**崩溃前哪些对象数据结构被认为是根对象**，并且对整个内存状态到重要作用。这有助于定位问题、理解程序状态以及进行进一步的调试和分析工作。

![image-20240630151019216](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630151019216.png)

如图所示崩溃前除了jdk自带的类，出现了ProcessPool我们自己写的类，前面还有一个我们自己写的类YP91001。大该也就能定位到是这里的问题了。

## JavaCore分析软件 IBM Thread and Monitor Dump Analyzar for Java

![image-20240630151447293](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240630151447293.png)

这个软件主要是分析应用的线程状况，比较简单不过多介绍。通过**线程、内存占用分析和应用日志的组合分析，定位OOM应该问题不大**