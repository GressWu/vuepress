---
title: ClassLoader应用
date: 2023-11-18
categories:
- BackEnd
tags:
- Java
---

## 类的加载过程

我们编写的“.java”文件需要通过 javac 编译成“.class”文件，而程序运行时，JVM 会把 '.class' 文件加载到内存中，并创建对应的class对象，这个过程被称为**类的加载**。

简单来说：将class文件读入内存，并为之创建一个Class对象

## 为什么要使用ClassLoader

因为每次改完代码后，编译成class文件，需要重启服务器，造成业务短暂停止。如果使用ClassLoader就可以24小时不停机更新了。

### class类

![image-20231118101249749](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20231118101249749.png)

### 实现类

扫描路径可以扫描存放class路径的目录也可以扫描jar包的路径

```java
import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

public class Main {
        public static void main(String[] args) throws Exception {
                //1. 创建一个URL数组 读取class文件的路径
                File file = new File("D:\\Develop\\test");
                URL[] urls = new URL[]{file.toURI().toURL()};
                while (true) {
                //2. 创建URLClassLoader对象，并指定扫描路径
                URLClassLoader myClassLoader = new URLClassLoader(urls);
                //这时候 myClassLoader 的 parent 是 AppClassLoader

                //3. 利用反射执行jar包中的代码
                Class<?> aClass = myClassLoader.loadClass("Cat");
                Object obj = aClass.newInstance();//利用反射创建对象
                Method method = aClass.getMethod("run");//获取parse方法
                method.invoke(obj, null);
                Thread.sleep(2000);
            }
        }
}

```

此段代码将会实现不停机更新。只需要将重新编译过的class文件替换即可。