---
title: 控制反转(IOC)与依赖注入(DI)
date: 2022-02-21
categories:
 - backEnd
tags:
 - Java
 - spring
 - interview
---

## 什么是IOC

IOC是一种思想，控制反转就是将原来我们程序通过手动新建对象的控制权，现在交由到Spring框架进行管理。Spring将会管理对象的生命周期与依赖关系。我们再也不需要去手动new对象了，而是直接去向Spring容器要你需要的对象即可。

## IOC的好处

1.传统程序需要我们在类内部中创建对象，这导致了类之间的高度耦合。

2.IOC的低耦合有利于功能服用，让整个体系变得非常灵活

3.IOC是一个工厂我们需要创建一个对象的时候，只需要配置好注解，不需要考虑对象是如何创建的。例如，在实际开发中，如果我们采用手动new依赖对象的话，我们需要搞清楚依赖对象的构造方法，但是如果交给Spring的IOC容器进行管理时我们只需要配置好，然后直接引用即可。

**例如：**

现在我们想吃泰国香米，首先我们有一个泰国香米类。

```java
package com.example.demo.ioc;

public class TaRice {
    private String type;

    private int price;

    public TaRice(String type, int price) {
        this.type = type;
        this.price = price;
    }

    public TaRice() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}

```

现在我们通过测试类（小明）来吃泰国香米

```java
package com.example.demo.ioc;

public class Test {

    public void eatRice(){
        TaRice taRice = new TaRice("泰国香米", 200);
        taRice.getPrice();
    }
}

```

但是我们现在不止有一个人想吃泰国香米，那么其他人想吃的时候同样的品种，同样的价格，每个类都要重新new一个泰国香米类，太麻烦了。

**解决：**

依托于Spring容器，首先完成泰国香米的配置，然后在需要的类中引入即可，并且当泰国香米涨价后，直接修改配置文件就可以了，实在是太方便了！！

```java
package com.example.demo.ioc;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TaRice {
    @Value("泰国香米")
    private String type;

    @Value("#{T(java.lang.Integer).parseInt('100'')}")
    private int price;

    public TaRice(String type, int price) {
        this.type = type;
        this.price = price;
    }

    public TaRice() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}

```

```java
package com.example.demo.ioc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Test {

    @Autowired
    TaRice taRice;

    public void eatRice(){
        taRice.getPrice();
    }
}

```

## 依赖注入

### 概念

依赖注入(DI)是指应用程序在运行时依赖IOC容器来动态注入组件所需要的某个依赖对象。Spring的DI是通过反射注入的，我们可以理解DI是实现IOC的一种方式。

### 关系

1. 谁依赖于谁？

   应用程序依赖于IOC容器

2. 为什么需要依赖？

   应用程序需要IOC容器来提供组件需要的外部资源。

3. 谁注入谁?

   IOC容器注入程序的某个对象，即应用程序依赖的对象。

4. 注入了什么

   注入了某个对象所需要的外部资源。

### 好处

通过依赖注入，我们只需简单配置，就可以获得想要的指定资源，完成业务逻辑，不需要关心资源从哪里来，由谁实现。