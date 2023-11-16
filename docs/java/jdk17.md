---
title: JDK17新特性
date: 2023-11-15
categories:
 - BackEnd
tags:
 - Java
---

## Switch新写法

```java
var score = "e";
        int b = 10;
        switch (score) {
            case "a" -> b += 1;
            case "b" -> b += 2;
            default -> b += 10;
        }
        System.out.println(b);
```

## 代码块

```java
String xmlText = """
                    <html>
                	<head>Title</head>
                	<body>
                	    <p>Body</p>
                  	</body>
                    </html>
                """;
        System.out.println(xmlText);
```

## 不可变类

```java
public record Cat(String name,String address) {
    public void printfAll(){
        System.out.println(name+address);
    }
}

```

```java
Cat cat = new Cat("tom", "L.A");
        Cat cat1 = new Cat("tom", "L.A");
        System.out.println(cat.address());
        cat.printfAll();
        System.out.println(cat.equals(cat1));
```

## 密封类

接口Run只允许Man类实现。类同理。

```java
public sealed interface Run permits Man{
}
```

```java
public final class Man implements Run{
}

```

## instanceof 模式匹配

以前的写法，需要强制类型转换

```java
if(animal instanceof Cat) {
    Cat cat = (Cat) animal;
    cat.eat();
} else if (animal instanceof Dog) {
    Dog dog = (Dog) animal;
    dog.eat();

```

现在可以直接简写

```java
if(animal instanceof Cat) {
    cat.eat();
} else if (animal instanceof Dog) {
    dog.eat();
}
```

