---
title: Java内存分析
date: 2021-11-01
categories:
 - backEnd
tags:
 - Java
---


* 堆：存放new出来的对象与数组，可以被所有线程共享。
* 方法区：包含了所有class文件和static变量与方法，可以被所有线程共享。
* 栈：存放基本数据类型、对象的引用

## 加载过程

1. 加载：将class文件字节码内容加载到内存中，并将静态数据数据结构加载到方法区中，并生成Class对象。

2. 链接：把二进制代码合并

   1. 监测是否有问题
   2. 正式为Static分配内存并设置默认值（比如 int =0）
   3. 将符号引用替换为直接引用地址

3. 初始化

   执行Clinit()方法，将编译过的数值与静态代码块合并；如果初始化一个类的时候，发现父类未初始化，就会先初始化父类。



举例：

```java
package com.atguigu.demo;

public class ClassTest {
    {
         a =20;
        System.out.println("ClassTest的静态代码块");
    }

    static int a =100;

    public ClassTest() {
        System.out.println("ClassTest的无参构造器");
    }
    public static void main(String[] args) {
        System.out.println("main方法加载");
        System.out.println(a);
        ClassTest classTest = new ClassTest();
        A e = new A();
        System.out.println(a);
    }
}

class A{
    {
        System.out.println("A的静态代码块");
    }

    public A(){
        System.out.println("A的无参构造器");
    }


}
```

1. **加载：**首先方法区中 ClassTest 与 ClassA 加载静态变量、静态方法、常量池、代码加载到堆里分别生成Java.lang.Class指代ClassTest 和java.lang.Class指代ClassA
2. **链接：**Main()方法执行，a=0初始化。new ClassTest()对象指向ClassTest，new ClassA()对象指向ClassA
3. **初始化：** a =20;静态代码块先执行，a=100 代码合并

打印结果：

```
main方法加载
100                      //初始化 a=20静态代码块先加载，a=100初始化代码进行合并
ClassTest的静态代码块
ClassTest的无参构造器
A的静态代码块
A的无参构造器
20						//重新new 调用了静态代码块
```

