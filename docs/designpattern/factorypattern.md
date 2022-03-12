---
title: 《大话设计模式》—— 简单工厂模式
date: 2022-03-12
categories:
 - DesignPattern
tags:
 - Java
---

## 简介

工厂模式（Factory Pattern）是 Java 中最常用的设计模式之一。这种类型的设计模式属于**创建型模式**，它提供了一种创建对象的最佳方式。

在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象。

## 需求

创建一个计算器，完成加减乘除的基本功能。第一要考虑到后续开根号或者对数等其他操作，第二要考虑到多种场景方法复用的问题。

## 具体实现

* 创建计算接口，暴露一个获得结果的动作，原书中采用的是类的形式，但是我认为接口可能更合适一些。

```java
package factorypattern;

public interface CalculateOperation {
    double getTheResult(double numberA,double numberB);
}
```

* 创建加减乘除四个方法

```java
package factorypattern;

public class OperationAdd implements CalculateOperation{

    @Override
    public double getTheResult(double numberA, double numberB) {
        return numberA + numberB;
    }
}

```

```java
package factorypattern;

public class OperationSub implements CalculateOperation{
    @Override
    public double getTheResult(double numberA, double numberB) {
        return numberA - numberB;
    }
}

```

```java
package factorypattern;

public class OperationMul implements CalculateOperation{
    @Override
    public double getTheResult(double numberA, double numberB) {
        return numberA * numberB;
    }
}

```

```java
package factorypattern;

public class OperationDiv implements CalculateOperation{
    @Override
    public double getTheResult(double numberA, double numberB) {
        double result = 0;
        try {
            result = numberA / numberB;
        }catch (Exception e){
            System.out.println(e+"除数不能为0");
        }
        return result;
    }
}
```

## 创建计算器工厂

```java
package factorypattern;

public class CaculateFactory {
    private CaculateFactory(){

    }

    public static CalculateOperation createOperate(String operate){
        CalculateOperation calculateOperation = null;
        switch (operate){
            case "+":
                calculateOperation = new OperationAdd();
                break;
            case "-":
                calculateOperation = new OperationSub();
                break;
            case "*":
                calculateOperation = new OperationMul();
                break;
            case "/":
                calculateOperation = new OperationDiv();
        }

        return calculateOperation;
    }
}

```

## 客户端代码

```java
package factorypattern;

public class Client {
    public static void main(String[] args) {
        CalculateOperation divOperate = CaculateFactory.createOperate("/");
        System.out.println(divOperate.getTheResult(1, 9));

        CalculateOperation addOperate = CaculateFactory.createOperate("+");
        System.out.println(addOperate.getTheResult(1, 9));

        CalculateOperation mulOperate = CaculateFactory.createOperate("*");
        System.out.println(mulOperate.getTheResult(1, 9));

        CalculateOperation subOperate = CaculateFactory.createOperate("-");
        System.out.println(subOperate.getTheResult(1, 9));
        

    }
}

```

输出结果：

```java
0.1111111111111111
10.0
9.0
-8.0
```

## 为什么要采用工厂模式

拆解加减乘除方法逻辑上非常好理解，因为这样可以降低耦合度，其他功能也可以单独的使用加减乘除方法。

但是使用工厂模式是为了什么？我为什么不能直接new一个相对应的业务对象，直接去调相应的方法呢？为什么要再进行一层封装？

我认为有两点原因：

1. **使用工厂模式可以将所创建的逻辑隐藏，直接封装到类中，如果有配置文件的话也可以避免装配参数的过程，使用者无需关注逻辑只需要进行使用即可，另一方面也相对安全**

例如：我们现在有一个个税APP的计算器，其中有一个减税的功能

```java
package factorypattern;

public class OperationSub implements CalculateOperation{

    @Value("${user.name}")
    private String name;

    @Override
    public double getTheResult(double numberA, double numberB) {
        return numberA - numberB;
    }

    public double subSalary(){
        double subSalary = 2000;
        System.out.println(name+"应该减税"+subSalary);
        return subSalary;
    }
}

```

我们通过方法将用户名的逻辑封装到底层，客户端无需在进行用户信息传递，可以直接通过工厂拿到相应的对象，并且完成相关功能。

2. **方便一系列业务相关操作类的统一管理**

比如说取对数等操作，我们写完之后可以直接扔到工厂中，这样我们创建对象的时候也可以注意到与之相关的操作还有哪些？



**注:**我认为工厂模式也不应该被滥用，如果只有一两个的话可能直接new业务对象处理类会更好一些

