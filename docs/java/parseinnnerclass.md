---
title: 内部类与匿名内部类编译
date: 2024-02-29
categories:
- BackEnd
tags:
- Java
---

## 问题引出

之前写了一个工具类，当Idea编译完之后，工具类可以从编译的文件夹中拿到选定的class文件。这样就可以给项目代码进行增量更新，不必再全局打包。但是有一个类产生了*$1.class文件，工具类未将其包含进去，导致发版后功能报错。故需要研究产生该文件的原因。

## 示例代码

```java
package com.yuwei.innerClass;

public  class Cat {
    public void eat(){

    }
}

```

```java
package com.yuwei.innerClass;


public class ParseClass {
    public static void main(String[] args) {
        Cat cat = new Cat() {
            @Override
            public void eat() {
                super.eat();
            }
        };
        cat.eat();
    }

    class Dog{
        private int age;

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }
}

```

main方法所在的类有一个内部类Dog和一个匿名内部类Cat

## 查看编译后的文件

![image-20240229112113415](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240229112113415.png)

我们可以看到ParseClass这个主类除了自己的CLass还生成了ParseClass$1.class和ParseClass$Dog.class两个类。

## 总结

* 当一个类有内部类的时候，编译之后会生成 主类名$内部类名.class文件
* 当一个类有匿名内部类的时候，编译之后会生成 主类名$数字.class文件

当一个类有这两种情况的时候，要注意把这两个编译文件也带上，否则一定会产生问题。