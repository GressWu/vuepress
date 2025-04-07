---
title: JVM性能分析
date: 2025-03-20
categories:
 - BackEnd
tags:
 - Java
---


## 工具类

/home/was/jdk1.8.0_172/bin中有大量java工具类

在 JDK（Java Development Kit）的 `bin` 目录中包含了一些重要的可执行文件和工具，这些文件对于 Java 开发和运行环境非常关键。以下是 JDK `bin` 目录中常见的一些文件：


1. **java**：Java 程序的启动器，用于运行 Java 应用程序。

2. **javac**：Java 编译器，用于将 Java 源代码编译为字节码文件（.class 文件）。

3. **jar**：用于创建和管理 Java 归档文件（JAR 文件）的工具。

4. **javadoc**：用于生成 Java 文档的工具，可以根据源代码中的注释生成 API 文档。

5. **javap**：Java 反汇编工具，用于查看编译后的字节码文件的内容。

6. **jps**：Java 进程状态工具，用于列出当前系统中正在运行的 Java 进程。

7. **jstack**：Java 堆栈跟踪工具，用于生成 Java 进程的堆栈跟踪信息。

8. **jstat**：Java 虚拟机统计信息监视工具，用于监视和收集虚拟机各种运行时统计数据。

9. **jmap**：Java 内存映像工具，用于生成 Java 进程的堆转储快照。

10. **jcmd**：Java 控制台管理工具，用于向正在运行的 Java 进程发送诊断命令。


这些工具和可执行文件在开发、调试和监控 Java 应用程序时非常有用，开发人员可以通过这些工具进行编译、运行、文档生成、调试、性能监控等操作，帮助提高开发效率和程序质量。

## threadDump

JVM所有线程的快照，记录每个线程的当前状态、调用栈信息和锁信息

方法一：

jstack <pid> > thread_dump.txt

方法二：

kill -3 <pid>

这种方式生成的日志可以直接在log日志中输出

方法三：

jmx远程连接 jconsole、jvisualvm进行生成

## HeapDump

JVM堆内存的快照，记录了堆中所有对象的大小、状态和引用关系

方法一：

jmap -dump:format=b,file=heap_dump.hprof <pid>

方法二：

启动JVM,添加参数，在系统宕机时自动生成堆文件

```
-XX:+HeapDumpOnOutOfMemoryError

-XX:HeapDumpPath=/path/to/dump
```
方法三：

jmx远程连接 jconsole、jvisualvm进行生成

## Metaspace容量

metaspace是JVM存储类元数据的内存区域（类信息、方法信息、常量池）的内存区域，他是不包含于堆内存的

方法一：

jstat -gcmetacapacity <pid>

MC：当前metaspace容量

MCMX：metaspace最大容量

方法二：

jmx远程连接 jconsole、jvisualvm进行分析
