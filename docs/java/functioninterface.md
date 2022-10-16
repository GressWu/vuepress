---
title: 常用函数式接口
date: 2022-10-16
categories:
- BackEnd
tags:
- Java
---

# 常用函数式接口

## 概述

**只有一个抽象方法的接口**我们称之为函数接口，不包含default默认的方法。

其中**JDK自带的函数式接口**还加上了`@FunctionalInterface`注解进行标识。

## 常见的函数式接口

### Consumer 消费接口

根据抽象方法的参数列表和返回类型知道，我们可以在方法中对传入的参数进行消费（操作）

![image-20221011210531793](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221011210531793.png)

### Function 计算转换接口

我们可以在方法中对传入的参数计算或转化，把结果返回

![image-20221011211633418](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221011211633418.png)

### Predicate 判断接口

我们可以在方法中对传入的参数条件判断，返回判断结果。

![image-20221011211824243](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221011211824243.png)

### supplier 生产型接口

我们可以在方法中创建对象，把创建好的对象返回。

![image-20221011212019931](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221011212019931.png)

## 常用的默认方法

### and

我们在使用Predicate接口时候可能需要进行**判断条件的拼接**。而and方法相当于是使用**&&**来拼接两个条件。

```java
//打印输出所有成年且作品在一部以上的作家名字
authors.stream()
        .filter(author -> author.getAge()>18)
        .filter(author -> author.getBooks().size()>1)
        .map(author -> author.getName())
        .forEach(name-> System.out.println(name));

authors.stream()
        .filter(author -> author.getAge()>18&&author.getBooks().size()>1)
        .map(author -> author.getName())
        .forEach(name-> System.out.println(name));

//使用接口
authors.stream()
        .filter(new Predicate<Author>() {
            @Override
            public boolean test(Author author) {
                return author.getAge()>18;
            }
        }.and(new Predicate<Author>() {
                    @Override
                    public boolean test(Author author) {
                        return author.getBooks().size()>1;
                    }
                })
        ).map(author -> author.getName())
        .forEach(name-> System.out.println(name));

//使用Lambda表达式
authors.stream()
        .filter(((Predicate<Author>) author -> author.getAge() > 18).and(author -> author.getBooks().size()>1)
        ).map(author -> author.getName())
        .forEach(name-> System.out.println(name));
```

### or

我们在使用Predicate接口时候可能需要进行判断条件的拼接。而and方法相当于是使用||来拼接两个判断条件。

```java
//打印输出未成年或作品大于1的作家信息 
authors.stream().filter(new Predicate<Author>() {
            @Override
            public boolean test(Author author) {
                return author.getAge()<18;
            }
        }.or(new Predicate<Author>() {
            @Override
            public boolean test(Author author) {
                return author.getBooks().size()>1;
            }
        })).forEach(author -> System.out.println(author));

        authors.stream().filter(((Predicate<Author>) author -> author.getAge() < 18)
                .or(author -> author.getBooks().size()>1))
                .forEach(author -> System.out.println(author));
```

### negate

```java
//打印出不小于18岁的作家姓名
authors.stream()
                .filter(new Predicate<Author>() {
                    @Override
                    public boolean test(Author author) {
                        return author.getAge()<18;
                    }
                }.negate()).map(author -> author.getName())
                .forEach(name-> System.out.println(name));



        authors.stream()
                .filter(((Predicate<Author>) author -> author.getAge() > 18).negate()
                ).map(author -> author.getName())
                .forEach(name-> System.out.println(name));
```

## 方法引用

我们使用Lambda表达式时，如果方法体中**只有一个方法调用**的话，我们可以进一步简化代码。

### 基本格式

类名或者对象名::方法名

```java
        authors.stream()
                .filter(new Predicate<Author>() {
                    @Override
                    public boolean test(Author author) {
                        return author.getAge()<18;
                    }
                }.negate()).map(Author::getName)
                .forEach(name-> System.out.println(name));
```

## 基本类型优化

使用Stream的方法由于**都是用到泛型**，所以涉及到的参数和返回值都是引用类型。

我们操作整数小数，实际上使用的是他们的包装类。当数据很多的时候自动拆装箱非常浪费资源。

所以为了避免这些造成的时间消耗，Stream提供了很多专门针对于基本数据类型的方法。

例如：`mapToInt`，`mapToLong`，`mapToDouble`，`flapMapToInt`，`flapMapToDouble`等

```java
        authors.stream()
                .map(author -> author.getAge())
                .map(age -> age+10)
                .forEach(System.out::println);

		//避免后续操作的拆装箱
        authors.stream()
                .mapToInt(author -> author.getAge())
                .map(age -> age+10)
                .forEach(System.out::println);

```

## 并行流

当流中有**大量元素**时，我们可以使用并行流去提高操作效率。并行流分配给多个线程，而且不用考虑线程安全问题，很方便。

```java
 //计算总年龄
        int asInt = authors.stream()
                .flatMap(author -> author.getBooks().stream())
                .peek(book -> System.out.println(book.getId()+ Thread.currentThread().getName()))
                .mapToInt(book -> book.getScore())
                .reduce((result, ele) -> result + ele)
                .getAsInt();
        System.out.println(asInt);

1main
2main
3main
4main
5main
471
```

```java
//计算总年龄
        int asInt1 = authors.parallelStream()
                .flatMap(author -> author.getBooks().stream())
                .peek(book -> System.out.println(book.getId()+ Thread.currentThread().getName()))
                .mapToInt(book -> book.getScore())
                .reduce((result, ele) -> result + ele)
                .getAsInt();
        System.out.println(asInt1);

4main
5main
1ForkJoinPool.commonPool-worker-25
2ForkJoinPool.commonPool-worker-25
3ForkJoinPool.commonPool-worker-25
471
```

