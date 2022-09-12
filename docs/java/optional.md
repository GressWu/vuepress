---
title: Optional类的应用
date: 2022-03-01
categories:
 - BackEnd
tags:
 - Java
---

Optional类是Java8之后新出的一种代替原来判空的API。这样做会简化代码的书写，但同时可读性也会降低，使用他还是要仁者见仁智者见智。

## 准备

people类

```java
package com.yuwei;

import lombok.Data;

@Data
public class People {
    private String name;

    private String gender;

    private Cat cat;
}
```

猫类

```java
package com.yuwei;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Cat {
    private String name;

    private String hobby;
}
```

## of()与ofNullable()

通过这两种方法我们都可以构造出`Optional<T>`的对象，但是我们**通常使用ofNullable()**，因为即使类对象是空也不会报错。而使用of()方法，如果对象为空依然会报空指针异常。

```java
package com.yuwei;

import java.util.Optional;

public class Test1 {
    public static void main(String[] args) {
        People people = new People();
        Optional<Cat> cat = Optional.ofNullable(people.getCat());
    }
}

```

成功生成Optional类。

```java
package com.yuwei;

import java.util.Optional;

public class Test1 {
    public static void main(String[] args) {
        People people = new People();
        Optional<Cat> cat = Optional.of(people.getCat());
    }
}

```

```
Exception in thread "main" java.lang.NullPointerException
	at java.base/java.util.Objects.requireNonNull(Objects.java:208)
	at java.base/java.util.Optional.of(Optional.java:113)
	at com.yuwei.Test1.main(Test1.java:8)

```

空指针异常

## orElse()与orElseGet()

两个的作用都是当对象为空，生成一个默认值。

orElse()是对象为空，则生成orElse()里边构造的对象。如果不为空则返回原来的对象，但是**同时也会执行**orElse()里边的方法

```java
package com.yuwei;

import java.util.Optional;

public class Test {
    public static void main(String[] args) {
        People people = new People();
        Cat cat3 = new Cat("lucy", "sleep");
        people.setCat(cat3);
        Cat cat = Optional.ofNullable(people.getCat()).orElse(new Cat("tom", "catch rat"));
        System.out.println(cat);
    }
}

```

```java
Cat(name=lucy, hobby=sleep)
```

orElseGet()是对象为空，则生成orElseGet()里边构造的对象。如果不为空则返回原来的对象，但是**不会执**行orElseGet()里边的方法

```java
package com.yuwei;

import java.util.Optional;

public class Test {
    public static void main(String[] args) {

        People people1 = new People();
        Cat cat2 = new Cat("lucy", "sleep");
        people1.setCat(cat2);
        Cat cat1 = Optional.ofNullable(people1.getCat()).orElseGet(() -> new Cat("tom", "catch rat"));
        System.out.println(cat1);
    }
}
```

```java
Cat(name=lucy, hobby=sleep)
```

## orElseThrow

如果为空，就抛出异常

```java
Cat cat = Optional.ofNullable(people1.getCat()).orElseThrow(() -> new Exception("猫不存在"));
```

## map()与flatMap()

获取对应对象的值

例如:获取人拥有的猫的名字，但是特别注意如果Cat是空对象的话，该种方法就会报错。同样也可以使用OrElse()来预设值

```java
String catName = Optional.ofNullable(people1.getCat()).map(c -> c.getName()).get();
```

## isPresent()与ifPresent()

isPresent()主要用来判断value值是否为空，ifPresent()是value值不为空时做一些操作。

当有猫对象时，输出猫的名字

```java
    Optional.ofNullable(people1.getCat()).ifPresent(
                c->{
                    System.out.println(c.getName());
                }
        );
```

## filter()

根据条件进行过滤

获得一只叫lucy的猫

```java
Cat cat3 = Optional.ofNullable(people1.getCat()).filter(
        p -> "lucy".equals(p.getName())
).get();
```

## 实例

案例一：

```java
//旧写法
public String getCity(People people) throws Exception {
    if(people != null){
        Address address = people.getAddress();
        if(address!=null){
            return address.getCity();
        }
    }
    throw new Exception("取值错误");
}
//新写法
public  String newGetCity(People people) throws Exception {
    return Optional.ofNullable(people)
            .map(p->p.getAddress())
            .map(a->a.getCity())
            .orElseThrow(()->new Exception("取值错误"));
}
```

案例二：

```java
//旧写法
if(user!=null){
	doSomething(user);
}
//新写法
Optional.ofNullable(user)
		.ifPresent(u->{
		   doSomething(user);
		});
```

案例三：

```java
//新写法
public People getPeople(People people){
    if(people != null){
        if(people.getAge()>18){
            return people;
        }
    }

    People people1 = new People();
    people1.setName("张三");
    people1.setAge(19);
    return people1;

}
//旧写法
public People newGetPeople(People people){
    return Optional.ofNullable(people)
            .filter(p -> p.getAge()>18)
            .orElseGet(()->{
                People people1 = new People();
                people1.setName("张三");
                people1.setAge(19);
                return people1;
            });
}
```