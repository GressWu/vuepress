---
title: Object超级父类
date: 2022-12-04
categories:
- BackEnd
tags:
- Java
---

Object类是Java中所有类的父类，除了例如数值、字符和布尔类型的值，所有类都隐式继承Object类

## toString()方法

官方解释：`a string representation of the object`

* 打印输出对象时默认输出`object.toString()`，如果不重写该方法，默认输出该对象的地址。

```java
        Person person = new Person("小明","1",12);
        System.out.println(person);
        System.out.println(person.toString());
        System.out.println(person.getClass().getName()+"@" + Integer.toHexString(person.hashCode()));
```

```shell
com.yuwei.Person@1b6d3586
com.yuwei.Person@1b6d3586
com.yuwei.Person@1b6d3586
```

* 地址值对于我们毫无意义，建议每个类都去重写`toString()`方法

```java
@Override
public String toString() {
    return "Person{" +
            "name='" + name + '\'' +
            ", sex='" + sex + '\'' +
            ", age=" + age +
            '}';
}
```

* 有些类重写了`toString()`方法，有些没有

```java
  int[] it = {1,2,3,4};
        System.out.println(it);
        List list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        System.out.println(list);
```

```
[I@4554617c
[1, 2, 3]
```

通过输出结果我们可以看出，数组没有重写toString()方法，list列表重写了toString()方法。

## equals()方法

官方解释：`if this object is the same as the obj argument;`

用于检测一个对象是否等于另外一个对象，判断两个对象是否具有相同的引用。

```java
public boolean equals(Object obj) {
        return (this == obj);
    }
```

### 默认地址比较

如果没有重写equals方法，那么Object类中默认进行`==`运算符的对象地址比较，只要不是一个对象，结果必然为false

注：`==`运算符都是比较对象的**引用地址**，而不是对象的值

```java
Object o1 = new Object();
Object o2 = new Object();
Object o3 = o1;
System.out.println(o1.equals(o2));
System.out.println(o1.equals(o3));
System.out.println(o2.equals(o3));


System.out.println(o1==o2);
System.out.println(o1==o3);
System.out.println(o2==o3);
```

```shell
false
true
false
false
true
false
```

### 重写equals()方法、及hashCode()方法

对于多数类，Object父类的equals方法没有任何意义，经常需要检测的是两个业务对象是否相同。

(equals)`==`默认比较的是每个对象的散列（地址），**所以如果重新定义equals方法，就必须重新定义hashCode方法**。

```java
package com.yuwei.superobject;

import java.util.Objects;

public class Leader {

    private String name;

    private String address;

    private String idCard;

    public Leader(String name, String address, String idCard) {
        this.name = name;
        this.address = address;
        this.idCard = idCard;
    }

    public Leader() {
    }

    @Override
    public String toString() {
        return "Leader{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", idCard='" + idCard + '\'' +
                '}';
    }

    @Override
    public int hashCode() {
        //如果默认为名字、地址、身份证号码一致的对象为同一个对象，那么就需要把这三个值进行散列值处理。如果是比较一个，那么散列一个即可
        return Objects.hash(name, address, idCard);
    }
    
    @Override
    public boolean equals(Object o) {
        //先比较是不是同一个对象
        if (this == o) return true;
        //判空后比较是不是同一个类型的
        if (o == null || getClass() != o.getClass()) return false;
        Leader leader = (Leader) o;
        //比较这三个值是否相同
        return Objects.equals(name, leader.name) && Objects.equals(address, leader.address) && Objects.equals(idCard, leader.idCard);
    }

    
}

```

### 老生常谈

为什么`String`类型的数据不能使用`==`，而必须要使用`equals`方法，看例子。

```java
  String a = new String("String");
        String b = "String";
        String c = "Str"+"ing";
        System.out.println(a==b);
        System.out.println(a==c);
        System.out.println(c==b);
```

```
false
false
true
```

很显然，如果使用==比较内存地址而不是实际值会出现这样的大问题

**总结**：其实如果我们理不清什么时候用哪个比较，只需要知道一点，**那就是基本类型用==，对象用equals**

### 补充

```java
int[] a1 = {1,2,6,4};
int[] b1 = {1,2,3,4};
System.out.println(Arrays.equals(a1, b1));
```

`Arrays.equals`方法可以快捷的比较两个数组是否相同。

## getClass()方法

返回包含对象信息的类对象

## clone()方法

具体可参考该篇文章，主要用于深拷贝

[Java深拷贝与浅拷贝 | 月牙弯弯](http://112.124.58.32/java/javacopy.html#重载构造方法实现深拷贝)



