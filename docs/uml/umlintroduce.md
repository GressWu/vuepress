---
title: UML统一建模语言
date: 2022-07-13
categories:
- UML
tags:
- UML
---

![image-20220727210812608](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220727210812608.png)

## UML涉及到的十种用例图

1. 用例图
2. 类图
3. 对象图
4. 包图
5. 部署图
6. 活动图
7. 状态图
8. 序列图
9. 协作图
10. 组件图

## 类图

### 什么是类图

* **各个对象**的类型及其间存在的各种关系
* **类中**的特性和操作以及用于对于对象连接的约束

### 详细介绍

**类名-属性-操作**，特性包括属性与关联。

具体类在类图中用矩形框表示，矩形框分为三层：

* 第一层是类名字。

**属性（特性）：**

可见性 名:类型 重数=默认 {特性串}

* 第二层是类的成员变量；

* 第三层是类的方法。

**操作：**

可见性 名（参数表）：回送类型{特性串}

成员变量以及方法前的访问修饰符用符号来表示：

```java
package com.yuwei;

public class Dog {

    private String name = "小花";

    protected Integer age;

    public String host;

    Boolean alive;
    
    public static String address;

    public void eat(int i){
        System.out.println("狗吃肉"+ i);
    }

    public String getName(){
        return this.name;
    }
}
```

![image-20220726211511567](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726211511567.png)

**可见性：**

private -

protected #

public +

default 空

**特性串：**

{ReadOnly} 代表只读

**静态操作与静态属性：**

静态属性或操作下方画下划线

## 接口

与具体类画法类似

```java
package com.yuwei;

public interface Fly {
    
    public void init();
    
    int BaseFund();
}
```

![image-20220713214027365](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220713214027365.png)

## 抽象类

## 模板类（泛型）

虚线框中的参数用来表示泛型参数或者模板参数

```java
class Set<T>{
	void insert(T newElement);
	void remove(T newElement);
}
```

![image-20220726215450596](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726215450596.png)

## 枚举

用来表示固定的一组值，这些值除符号值外，则无任何特性

![image-20220726214649373](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726214649373.png)

## 关系

### 泛化（Generalization）

这种关系就是面向对象语言中的**继承**关系，逻辑上可以用"is a"表示。

例如：柯基 is a 狗

![image-20220726212756478](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726212756478.png)

### 实现关系（Realization）

逻辑上可以理解为A实现了B

实现接口或继承某个抽象类。

例如：狗实现了跑步接口

![image-20220726213229280](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726213229280.png)

### 组合关系（Composition）

逻辑上可以理解为has a，且部分是不可以脱离整体的

例如狗离不开主人，主人has a 狗，且狗离不开主人

![image-20220726214115141](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726214115141.png)



### 聚合关系（Aggregation）

逻辑上可以理解为has a，但部分是可以脱离整体的

例如公司has 员工，但是员工离得开公司

![image-20220727204014752](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220727204014752.png)

### 关联关系（Association）

逻辑上可以理解为has a

**多对多关系：**箭头可以省略

![image-20220727205440906](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220727205440906.png)

**一对多关系：**

![image-20220727205554794](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220727205554794.png)

一个学生有一个或多个朋友

一个学生没有梦想或者有一个梦想

一个学生有多门课程

### 依赖关系（Dependency）

是一种使用关系，即一个类的实现需要另一个类的协助。逻辑上能用"use a"表示

在大多数情况下， 依赖关系体现在某个类的方法使用另一个类的对象作为**参数**。

![image-20220727210442772](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220727210442772.png)





### 关系总结

六种关系的耦合度大小是：泛化 = 实现 > 组合 > 聚合 > 关联 > 依赖



## 其他

### 注文与注释

当需要描述图的详细含义，可以用短横线与方框组成注释

![image-20220726210840008](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726210840008.png)

### 导出特性

用来描述两个属性之间产生的特性，主要描述出一种约束关系，导出的属性前面加/

![image-20220726212250612](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220726212250612.png)

