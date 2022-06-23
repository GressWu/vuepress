---
title: 反射技术
date: 2021-05-25
categories:
 - backEnd
tags:
 - Java
---

## 动态语言和静态语言

1、动态语言

是一类在运行时可以改变其结构的语言：例如新的函数、对象、甚至代码可以被引进，已有的函数可以被删除或是其他结构上的变化。通俗点说就是**在运行时代码可以根据某些条件改变自身结构**。
主要动态语言：Object-C、JavaScript、PHP、Python、Erlang。

2、静态语言

与动态语言相对应的，运行时结构不可变的语言就是静态语言。如Java、C、C++、C#。
PS：C#不是动态语言，但是MS有将.NET支持动态语言的趋势，3.0吸收了一定动态特征,比如 匿名函数,临时类型,临时变量等

## 反射（Reflection）

但是反射使Java可以在运行的时候发现,并能够获取任何类的信息，并能直接操作任意对象内部属性与Java。

优点：灵活

缺点：影响性能

### 1. 获取类的方式

```java
package com.yuwei;

//一个父类
public class User {
    private String name;
    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                '}';
    }

    public User(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public User() {
    }
}
```

```java
package com.yuwei;
//一个字类
public class Customer extends User{
    public Customer(String name, String address) {
        super(name, address);
    }

    public Customer() {
    }
}
```

```java
package com.yuwei;

//测试类
public class ReflectTest {
    public static void main(String[] args) throws ClassNotFoundException {
        //1.通过类路径获取Class
        Class<?> aClass = Class.forName("com.yuwei.Customer");
        System.out.println(aClass.hashCode());
        //2.通过类名获取Class  最安全可靠，性能高
        Class<Customer> customerClass = Customer.class;
        System.out.println(customerClass.hashCode());
        //3.通过对象获取Class
        Customer customer = new Customer();
        Class<? extends Customer> aClass1 = customer.getClass();
        System.out.println(aClass1.hashCode());
        //4.(特殊不常用)基本内置类型包装类的Class类
        Class<Integer> type = Integer.TYPE;
        System.out.println(type);
        //5.获取父类的Class
        Class<? super Customer> superclass = Customer.class.getSuperclass();
        System.out.println(superclass);

    }
}
```

```
//打印输出结果
22307196
22307196
22307196
int
class com.yuwei.User
```

通过打印数据我们可以看出一个对象，通过不同方式获取Class对象，这个底层Class对象**都是唯一的**。 

### 2. 可以使用反射的类型

```java
package com.yuwei;


import java.lang.annotation.ElementType;

public class Test01 {
    public static void main(String[] args) {
        Class<Object> objectClass = Object.class; //类
        Class<? extends String[]> aClass = String[].class;//一维数组
        Class<String[][]> aClass1 = String[][].class;//二维数组
        Class<Comparable> comparableClass = Comparable.class;//接口
        Class<ElementType> elementTypeClass = ElementType.class;//枚举类
        Class<Void> voidClass = Void.class;//Void
        Class<Integer> integerClass = Integer.class;//包装类
        Class<Class> classClass = Class.class;//Class
        Class<Override> overrideClass = Override.class;//注解

    }
}
```

### 3.可以获得的属性

```java
package com.yuwei;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ClassAttribute {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException, NoSuchMethodException {
        Class<?> aClass = Class.forName("com.yuwei.User");
        //-----------------------------属性-----------------------------------------------
        //获取该类所有的公有属性
        Field[] fields = aClass.getFields();
        for (Field field : fields) {
            System.out.println(field);
        }
        //获取该类的所有属性
        Field[] declaredFields = aClass.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            System.out.println(declaredField);
        }
        //通过名字获取属性
        Field name = aClass.getDeclaredField("name");
        System.out.println(name);
        //--------------------------------------方法-----------------------------------
        Method[] methods = aClass.getMethods();
        //获取所有的public方法以及继承的父类的方法
        for (Method method : methods) {
            System.out.println(method);
        }
        //获取该方法的所有值
        Field[] declaredFields1 = aClass.getDeclaredFields();
        for (Field field : declaredFields1) {
            System.out.println(field);
        }
        //通过名字获取方法 需要传相应的数据类型
        Method setName = aClass.getDeclaredMethod("setName", String.class);
        System.out.println(setName);
        //-----------------------------构造器---------------------------------------
        //获取公有的构造器
        Constructor<?>[] constructors = aClass.getConstructors();
        for (Constructor<?> constructor : constructors) {
            System.out.println(constructor);
         }
        //获取所有的构造方法
        Constructor<?>[] declaredConstructors = aClass.getDeclaredConstructors();
        for (Constructor<?> declaredConstructor : declaredConstructors) {
            System.out.println(declaredConstructor);
        }

    }
}

```

### 4.动态创建对象执行方法

```java
//-------------------获得构造方法----------------------
//通过Class创建对象，默认是使用了无参构造器，如果没有无参构造器会报错
Object o = aClass.newInstance();
System.out.println(o);

//通过有参构造器获得对象
Constructor<?> constructor = aClass.getDeclaredConstructor(String.class, String.class);
Object o1 = constructor.newInstance("王五", "北京");
System.out.println(o1);

//通过无参构造器获得对象
Constructor<?> constructor1 = aClass.getDeclaredConstructor();
Object o2 = constructor1.newInstance();
System.out.println(o2);

//------------通过反射获得普通方法---------------
Method setName1 = aClass.getDeclaredMethod("setName", String.class);
setName1.invoke(o2, "张三");
System.out.println(o2);

//------------通过反射获得值---------------
Field name1 = aClass.getDeclaredField("name");
//不能直接操作私有属性，需要关闭Java安全性检查
name1.setAccessible(true);
name1.set(o,"李四");
System.out.println(o);
```

输出：

```
User{name='null', address='null'}
User{name='王五', address='北京'}
User{name='null', address='null'}
User{name='张三', address='null'}
User{name='李四', address='null'}
```

### 5.反射获取注解相关值

```java
package com.yuwei;

import java.lang.annotation.*;
import java.lang.reflect.Field;

public class ReflectAnnotion {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        Class<?> aClass = Class.forName("com.yuwei.MengZi");
        //--------------获取类上的注解信息------------------------
        Annotation[] annotations = aClass.getAnnotations();
        for (Annotation annotation : annotations) {
            System.out.println(annotation);
        }
        //获取类上注解的内容
        ClassAnnotion classAnnotion = (ClassAnnotion)aClass.getAnnotation(ClassAnnotion.class);
        System.out.println(classAnnotion);
        System.out.println(classAnnotion.value());

        //---------------获取字段注解-----------------------
        Field name = aClass.getDeclaredField("name");
        DataAnnotion annotation = name.getAnnotation(DataAnnotion.class);
        System.out.println(annotation);
        System.out.println(annotation.length());
        System.out.println(annotation.name());
        System.out.println(annotation.tableName());
    }
}

@ClassAnnotion("牛马")
class MengZi{
    @DataAnnotion(name = "大锰子",length = 12,tableName = "USER_TABLE")
    private String name;

    private int weight;
    private String school;
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface ClassAnnotion {
    String value();
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@interface DataAnnotion{
    String name();
    int length();
    String tableName();
}
```

```
@com.yuwei.ClassAnnotion(value=牛马)
@com.yuwei.ClassAnnotion(value=牛马)
牛马
@com.yuwei.DataAnnotion(name=大锰子, length=12, tableName=USER_TABLE)
12
大锰子
USER_TABLE
```

