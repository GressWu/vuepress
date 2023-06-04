---
title: 模板模式的应用
date: 2023-06-04
categories:
- BackEnd
tags:
- Java
---

以前做流程引擎的时候，主要是通过封装的流程引擎工具类完成流程的初始化，提交，否决，退回等操作。但是这样做会造成很多业务类不停的调用同一种方法，造成一定意义上的冗余。那有没有有一种办法是即能封装大部分代码，又能给程序员提供一个实现个性化方法入口的办法呢，这次我们使用了模板模式。

思路：创建一个`BaseFlowController`的抽象类，里面暴露基础的流程调用接口。子类`Controller`类上声明全局的`RequestMapping`，例如`/test1`，那么前端调用时可以直接`test1/initFlow` ，调用其他模块可以`test2/initFlow`，降低了前后端沟通的成本，同时也减少了一定程度上的工作量。

## 举例

举例就以做菜为例。我们做菜时，肯定要包括洗菜和关火，中间的其他步骤不同的菜有不同的方法。那么我们就可以把洗菜和关火作为公共方法在父类里定义。中间方法作为抽象方法供子类去实现。同时还可以定义一些共性高的普通方法，如果子类不想实现或者有其他的想法，可以直接重写调该方法。

### 模板类

```java
package com.yuwei.templatepatreen;

public abstract class Cook {
    abstract void method1();

    abstract void method2();

    void find(){
        System.out.println("找书");
    }

    public void cooking(){
        System.out.println("洗菜");

        method1();
        find();
        method2();

        System.out.println("关火");
    }
}
            
```

### 子类

```java
package com.yuwei.templatepatreen;

public class ChickenFresh extends Cook{
    @Override
    void method1() {
        System.out.println("起锅烧油");
    }

    @Override
    void method2() {
        System.out.println("做饭");
    }

    @Override
    void find() {
        System.out.println("看看菜谱");
    }
}

```

```java
package com.yuwei.templatepatreen;

public class Fish extends Cook{
    @Override
    void method1() {
        System.out.println("煮汤");
    }

    @Override
    void method2() {
        System.out.println("放葱香蒜去腥");
    }
}
```

### 实现调用

```java
package com.yuwei.templatepatreen;

public class Test {
    public static void main(String[] args) {
        ChickenFresh chickenFresh = new ChickenFresh();
        Fish fish = new Fish();
        fish.cooking();
        System.out.println("+++++++++++++++++++++");
        chickenFresh.cooking();
    }
}
```

```
洗菜
煮汤
找书
放葱香蒜去腥
关火
+++++++++++++++++++++
洗菜
起锅烧油
看看菜谱
做饭
关火
```

