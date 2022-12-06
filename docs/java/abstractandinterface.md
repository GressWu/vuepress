---
title: 抽象类与接口
date: 2022-12-06
categories:
- BackEnd
tags:
- Java
---

## 抽象类

### 抽象类适用场景

适用于业务较为复杂，但是有大量重复逻辑时。可以使用抽象类将逻辑抽出，有一些共性且子类方法实现不一致方法可以添加abstract关键字将方法抽象（**抽象方法**子类必须要实现），充当**占位角色**

### 举例

```java
package com.yuwei.abstractclass;

public abstract class Creature {

    public Creature(String name, int age) {
        this.name = name;
        this.age = age;
    }

    private String name;

    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    //将getDescription抽象出来进行占位
    public abstract String getDescription();

    @Override
    public String toString() {
        return "Creature{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

```

```java
package com.yuwei.abstractclass;

public class Monkey extends Creature{
    public Monkey(String name, int age) {
        super(name, age);
    }

    @Override
    public String getDescription() {
        return "猴子";
    }
}

```

```java
package com.yuwei.abstractclass;

import com.yuwei.Dog;

public class Human extends Creature {

    public Human(String name, int age) {
        super(name, age);
    }

    @Override
    public String getDescription() {
        return this.getName()+":"+this.getAge();
    }
}

```

```java
package com.yuwei.abstractclass;

public class AbsTest {
    public static void main(String[] args) {
        Creature asd = new Monkey("asd", 12);
        Creature zhangsan = new Human("zhangsan", 33);
        System.out.println(asd.getDescription());
        System.out.println(zhangsan.getDescription());
    }
}

```

```
猴子
zhangsan:33
```

**注**：

* 有抽象方法的类本身必须被声明为抽象的

* 抽象类可以包含具体数据和方法

* 抽象类**不能被实例化**

* 由于不能构抽象类的对象，因此变量永远不会引用到抽象类上，而是引用到子类上



## 接口

这种技术主要用来描述类具有什么功能，实现类必须复写接口中的方法

### 特点

* 接口中的方法自动的属于`public abstract`
* 不可以定义**变量**
* 可以定义常量，默认且必是 `public static final`
* 接口不可以被实例化

* 可以扩展extends继承其他接口
* 与类不同，类可以实现多个接口

### 举例

```java
package com.yuwei.interfacet;

public interface GetTheAnimal {
     String getName();
}

```

```java
package com.yuwei.interfacet;

public interface GetTheCup {
    public String getName();

    public abstract String getTheAge();
    public static String getTheSize(){
        return "haha";
    };
    default void wahaha(){};

    public static final int age = 100;
}

```

```java
package com.yuwei.interfacet;

public class InterfaceTestClass implements GetTheCup,GetTheAnimal{
    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getTheAge() {
        int i = age + 10;
        String theSize = GetTheCup.getTheSize();
        System.out.println(theSize);
        return "";


    }

    @Override
    public void wahaha() {
        GetTheCup.super.wahaha();
    }



}

```

### java8以后的新特性

* 支持了`public static`的静态方法，这样就不用复写工具类。实现类也不必实现该方法，但是不推荐这种方法，因为有悖接口本身的设计理念。
* 增加了默认方法，可以直接定义一个默认方法。实现类也不必实现默认方法，如果想用子类复写即可。出现的原因就在于不至于一个接口加了一个方法，所有类都去实现它。

## 什么时候用抽象类，什么时候用接口

抽象类与接口都是一种高度抽象的类。

我认为具有共性的实体可以抽象出抽象类。如果偏向于动作可以使用接口。设计应该是灵活的。