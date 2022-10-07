---
title: 函数式编程思想与应用
date: 2022-10-7
categories:
- BackEnd
tags:
- Java
---

## 思想

面向对象思想需要关注用什么对象完成什么事情，而函数式编程思想主要关注于对数据进行了什么样的操作。

## 优点

* 代码简洁
* 接近自然语言
* 易于并发编程

## Lambda表达式

### 概述

对某些匿名内部类的写法进行简化，是函数式编程思想的一个重要体现。

### 核心原则

可推导 可省略

### 基本格式

(参数列表)->{代码}

### 简单举例

```java
new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("线程匿名内部类执行");
            }
        }).start();
```

```java
new Thread(()->{
    System.out.println("线程Lambda执行");
}).start();
```

![image-20221003160148409](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221003160148409.png)

### 使用条件

* 调用的方法入参使用了函数式接口
* 业务处理需要使用函数式接口的方法

### 关注点

我们不需要关注接口具体叫什么名字，也不需要关注接口下的方法叫什么名字。我们只需要关注方法所需的**参数列表和具体代码逻辑**即可。

### 复杂例子

```java
 public static void main(String[] args) {

        ArrayList<String> strings = new ArrayList<>();
        strings.add("a");
        strings.add("b");
        strings.add("c");
        strings.add("d");
        forEach(strings,t-> System.out.println(t.toUpperCase()));

        System.out.println(strings);
    }

    public static  void forEach(List<String> list, Consumer<String> consumer) {
        for (String s1 : list) {
            consumer.accept(s1);
        }
    }
```

```java
public class LambdaTest {
    public static void main(String[] args) {
        //匿名内部类重写
        Integer integer = convertType(new Function<String, Integer>() {

            @Override
            public Integer apply(String s) {
                return Integer.valueOf(s);
            }
        });
        System.out.println(integer);

        //Lambda表达式重写
        Integer integer1 = convertType(s -> Integer.valueOf(s));
        System.out.println(integer1);
    }

    public static <R> R convertType(Function<String,R> function){
        String str = "12345";
        R r = function.apply(str);
        return r;
    }
}
```

### 简写规则

* 参数类型可以省略
* 方法体只有一句代码时大括号return和唯一一句代码的分号可以省略
* 方法只有一个参数时小括号可以省略

## Stream流

### 概述

Stream使用的是函数式编程模式，它可以被用来对集合和数字进行链状流式的操作。可以更加方便的让我们对集合和数组进行操作。

### 过程

使用Stream流处理数据，主要分为创建流、中间操作和终结操作三个步骤

### 创建流

* 单列集合 `集合对象.stream()`

```java
List<Author> authors = getAuthors();
Stream<Author> stream = authors.stream();
```

* 数组 `Arrays.stream(数组)或者使用Stream.of进行创建`

```java
    String[] strings = {"1","a","b","f"};
    Stream<String> stream1 = Arrays.stream(strings);
    Stream<String> strings1 = Stream.of(strings);
```

* 双列集合 ：转换成单列集合再创建

```java
HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("江苏","南京");
        hashMap.put("浙江","杭州");
        hashMap.put("安徽","合肥");
        Stream<Map.Entry<String, String>> stream1 = hashMap.entrySet().stream();
```

### 中间操作

#### 数据准备

```java
package com.example.springbootdemo.stream.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Book {
    //id
    private Long id;
    //书名
    private String name;
    //分类
    private String category;
    //评分
    private Integer score;
    //简介
    private String intro;
}

```

```java
package com.example.springbootdemo.stream.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Author {
    //id
    private Long id;
    //姓名
    private String name;
    //年龄
    private Integer age;
    //简介
    private String intro;
    //作品
    private List<Book> books;
}

```

```java
package com.example.springbootdemo.stream;

import com.example.springbootdemo.stream.entity.Author;
import com.example.springbootdemo.stream.entity.Book;

import java.util.*;

public class TestMain {
    public static void main(String[] args) {

	//Write Your Code

    }

    public static List<Author> getAuthors(){
        Book book = new Book(1L,"雪山飞狐","武侠",90,"雪山飞狐讲述了");
        Book book1 = new Book(2L,"连城诀","武侠",92,"连城诀讲述了");
        Book book2 = new Book(3L,"笑傲江湖","武侠",96,"笑傲江湖讲述了");
        Book book3 = new Book(4L,"哈里波特","魔法,武侠",96,"哈利波特讲述了");
        Book book4 = new Book(5L,"三体","科幻",97,"三体讲述了");

        ArrayList<Book> jyBooks = new ArrayList<>();
        jyBooks.add(book);
        jyBooks.add(book1);
        jyBooks.add(book2);
        Author author = new Author(1L, "金庸", 53, "武侠小说家", jyBooks);

        ArrayList<Book> jkBooks = new ArrayList<>();
        jkBooks.add(book3);
        Author author1 = new Author(2L, "JK.罗琳", 45, "魔法小说家", jkBooks);


        ArrayList<Book> cxBooks = new ArrayList<>();
        cxBooks.add(book4);
        Author author2 = new Author(3L, "刘慈欣", 30, "科幻小说家", cxBooks);


        List authors = new ArrayList<Author>();
        authors.add(author);
        authors.add(author1);
        authors.add(author2);
        return authors;
    }
}
```

#### filter

可以对流中的元素进行条件过滤，**符合过滤条件**的才能继续留在流中。

```java
//打印出所有年龄大于40的作者名称        
List<Author> authors = getAuthors();
        authors.stream()
                .filter(author -> author.getAge() >40)
                .forEach(author -> System.out.println(author.getName()));
```

#### map

可以把对流中的元素进行**计算或转换**

```java
//转换 ： 打印所有作家的名字
     List<Author> authors = getAuthors();
        authors.stream()
                .map(author -> author.getName())
                .forEach(name -> System.out.println(name));
```

```java
//计算 ： 将所有作家的年龄加10再打印输出年龄
        List<Author> authors = getAuthors();
        authors.stream()
                .map(author -> author.getAge()+10)
                .forEach(age -> System.out.println(age));

```


#### distinct

可以去除流中的重复元素。

**注意**：distinct()方法是依赖Object的equals方法来判断是否是相同对象的，所以要注意重写equals**方法**

```java
//去重 ： 打印所有作家的名字
     List<Author> authors = getAuthors();
        authors.stream()
        		.distinct()
                .forEach(name -> System.out.println(name))
```

#### sorted

可以对流中的元素进行排序

![image-20221007154904243](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221007154904243.png)

```
//对流中的元素按照年龄进行降序排序
```

无参方法（需要流中的元素类实现Compared接口）：

```java
package com.example.springbootdemo.stream.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Author implements Comparable<Author>{
    //id
    private Long id;
    //姓名
    private String name;
    //年龄
    private Integer age;
    //简介
    private String intro;
    //作品
    private List<Book> books;


    @Override
    public int compareTo(Author o) {
        return o.getAge() - this.getAge();
    }
}

   //调用方法
   List<Author> authors = getAuthors();
        authors.stream()
                .sorted()
                .forEach(author -> System.out.println(author));


```

有参方法，直接使用Lambda表达式，无需重写Compared接口

```java
        List<Author> authors = getAuthors();
        authors.stream()
                .sorted(((o1, o2) -> o2.getAge() - o1.getAge()))
                .forEach(author -> System.out.println(author));
```

#### limit

可以设置流的最大长度，超出部分将会被抛弃

```java
//找出年龄最大的两个作家
        List<Author> authors = getAuthors();
        authors.stream()
                .sorted(((o1, o2) -> o2.getAge() - o1.getAge()))
                .limit(2)
                .forEach(author -> System.out.println(author));
```

#### skip

跳过流中的前n个元素，返回剩下的元素

```java
//找出除年龄最大的所有作家
        List<Author> authors = getAuthors();
        authors.stream()
                .sorted(((o1, o2) -> o2.getAge() - o1.getAge()))
                .skip(1)
                .forEach(author -> System.out.println(author));

```

#### flatMap

map只能把一个对象转换成另一个对象作为流中的元素。而flatMap可以把一个对象转换成多个对象作为流的对象。



通过以下代码，如果我们使用Map处理实际上得到的是三个作者名下的List集合的书籍

```java
//打印所有书籍名字
 List<Author> authors = getAuthors();
        authors.stream()
                .map(author -> author.getBooks())
                .forEach(books -> System.out.println(books));


[Book(id=1, name=雪山飞狐, category=武侠, score=90, intro=雪山飞狐讲述了), Book(id=2, name=连城诀, category=武侠, score=92, intro=连城诀讲述了), Book(id=3, name=笑傲江湖, category=武侠, score=96, intro=笑傲江湖讲述了)]
[Book(id=4, name=哈里波特, category=魔法, score=96, intro=哈利波特讲述了)]
[Book(id=5, name=三体, category=科幻, score=97, intro=三体讲述了)]
```

我们可以使用flapMap方法，将bookList拿出来转换成Stream，这时候会自动拼接成Book的流

```java
//打印所有书籍名字   
List<Author> authors = getAuthors();
        authors.stream()
                .flatMap(author -> author.getBooks().stream())
                .forEach(books -> System.out.println(books));

Book(id=1, name=雪山飞狐, category=武侠, score=90, intro=雪山飞狐讲述了)
Book(id=2, name=连城诀, category=武侠, score=92, intro=连城诀讲述了)
Book(id=3, name=笑傲江湖, category=武侠, score=96, intro=笑傲江湖讲述了)
Book(id=4, name=哈里波特, category=魔法, score=96, intro=哈利波特讲述了)
Book(id=5, name=三体, category=科幻, score=97, intro=三体讲述了)
```



```java
 //打印输出所有书籍的类型，但是不能出现(,)
        List<Author> authors = getAuthors();
        authors.stream()
                .flatMap(author -> author.getBooks().stream())
                .flatMap(book -> Stream.of(book.getCategory().split(",")))
                .distinct()
                .forEach(category -> System.out.println(category));


```



