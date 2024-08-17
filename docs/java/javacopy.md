---
title: Java深拷贝与浅拷贝
date: 2022-06-27
categories:
 - BackEnd
tags:
 - Java
---

## 概念

**浅拷贝**：一个对象复制另一个对象的地址。当一个对象发生改变时，另一个对象也会发生改变。从本质上讲这两个对象是同一个东西，指向的是同一块内存地址。

**深拷贝**：一个对象复制了另一个对象的参数值，但是拥有全新的对象地址。当一个对象发生改变时，另一个对象不会发生改变。他们指向的是两个完全不同的内存地址。

## 浅拷贝

Java使用中最多的就是浅拷贝
### 直接通过引用赋值
```java
package com.yuwei;

public class CopyTest {
    public static void main(String[] args) {
        Person zs = new Person("张三", "001");
        Person zsCopy = zs;

        System.out.println("张三："+zs);
        System.out.println("张三拷贝："+zsCopy);

        zs.setId("002");
        System.out.println("张三："+zs);
        System.out.println("张三拷贝："+zsCopy);
        zsCopy.setId("003");
        System.out.println("张三："+zs);
        System.out.println("张三拷贝："+zsCopy);

    }
}
```

**输出结果：**

```java
张三：Person{name='张三', id='001'}
张三拷贝：Person{name='张三', id='001'}
true
张三：Person{name='张三', id='002'}
张三拷贝：Person{name='张三', id='002'}
张三：Person{name='张三', id='003'}
张三拷贝：Person{name='张三', id='003'}
```

通过结果输出结果我们可以看出，`=`进行浅拷贝，zs和zsCopy对象同时指向同一个内存地址。因此无论是zs还是zsCopy改变了值，两个对象的值都会发生变化。



### 实现Cloneable接口重写clone()方法

```java
package com.yuwei.deepcopy;

public class Person implements Cloneable{

    public String name;

    public String age;

    public RelativePerson relativePerson;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public RelativePerson getRelativePerson() {
        return relativePerson;
    }

    public void setRelativePerson(RelativePerson relativePerson) {
        this.relativePerson = relativePerson;
    }

    @Override
    protected Person clone() throws CloneNotSupportedException {
        return (Person)super.clone();
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                ", relativePerson=" + relativePerson +
                '}';
    }
}

```

```java
package com.yuwei.deepcopy;

public class RelativePerson {

    String name;

    String age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    @Override
    public String toString() {
        return "RelativePerson{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                '}';
    }

    public void setAge(String age) {
        this.age = age;
    }


}
```

```java
        package com.yuwei.deepcopy;

public class DeepTest {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person person = new Person();
        person.setAge("12");
        person.setName("张三");
        RelativePerson relativePerson = new RelativePerson();
        relativePerson.setAge("23");
        relativePerson.setName("审稿人");
        person.setRelativePerson(relativePerson);

        Person clone = person.clone();
        clone.setName("李四");
        clone.getRelativePerson().setName("闪光灯");
        System.out.println(person);
        System.out.println(clone);
    }
}

```
**输出结果**  
```
Person{name='张三', age='12', relativePerson=RelativePerson{name='闪光灯', age='23'}}
Person{name='李四', age='12', relativePerson=RelativePerson{name='闪光灯', age='23'}}
```
通过对输出结果的分析我们可以看出，对于基础类型Cloneable接口确实能是心啊深拷贝，但是对于引用类型来说仍然是浅拷贝。


## 深拷贝

### 重载构造方法实现深拷贝

```java
package com.yuwei;

public class Person{

    private String name;

    private String id;

    public Person(String name, String id) {
        this.name = name;
        this.id = id;
    }

    //重载构造方法
    public Person(Person person) {
        this(person.getName(), person.id);
    }

    public Person() {
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", id='" + id + '\'' +
                '}';
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
```

#### 测试类

```java
package com.yuwei;

public class CopyTest {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person zs = new Person("张三", "001");

        //利用构造方法的重载，实现深拷贝
        Person clone = new Person(zs);
        System.out.println(clone==zs);

        //重写clone方法实现深拷贝
        Person clone1 = (Person)zs.clone();
        System.out.println(clone1==zs);


    }
}

```

#### 测试结果

```java
false
false
```

### 序列化完成深拷贝
[Java序列化与反序列化 | 月牙弯弯](http://112.124.58.32/java/serializable.html)

