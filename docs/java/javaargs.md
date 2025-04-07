---
title: Java中的args
date: 2020-08-23
categories:
 - BackEnd
tags:
 - Java
---


`main`方法是Java应用程序的入口点，是JVM在执行Java程序时的起点

args是用于接收命令行参数。当命令行中执行一个Java程序时，可以向程序传递参数，这些参数会被传递给`main`方法的`args`参数。

`javac Test1.java`

`java Test1 name=haha`

```java
public class Test1{
public static void main(String[] args){
	System.out.print(args[0]);
	}
}
```

```
name=haha
```

