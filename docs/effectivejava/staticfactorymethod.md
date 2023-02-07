---
title: 静态工厂方法代替构造器
date: 2023-01-28
categories:
- BackEnd
tags:
- Java
---

## 创建对象的四种方式

1. new
2. 反射
3. 通过序列化创建解析对象
4. Cloneable 深拷贝对象

## 静态工厂方法

### 优势

```java
package effectivejava;

public class Student {

    private static Student student = new Student(18,"男");
    private int age;

    private String sex;

    public static Student getTheBoy(){
        return student;
    }

    public Student(int age, String sex) {
        this.age = age;
        this.sex = sex;
    }

    public Student() {
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```

静态工厂方法与设计模式中的工厂模式不同，只是用来代替你去调用构造器的方法。

* 有名称，见名知意，不像构造器只有一个类名
* 不必每次去创建一个对象。这使得不可变类可以预先创建好实例，将创建好的实例缓存起来，避免创建不必要的重复对象，节省系统开销

```java
		Student student = new Student(18,"男");
        Student student1 = new Student(18,"男");
        System.out.println(student == student1);

        Student theBoy = Student.getTheBoy();
        Student theBoy1 = Student.getTheBoy();
        System.out.println(theBoy1== theBoy);
```

```
false
true
```

我们可以看到，如果使用getTheBoy静态工厂方法即可使用同一个实例。避免像之前构造方法重复创建对象。

* 它可以返回原返回类型的任意一个子类类型，给我们选择返回对象的类有了更大的灵活性

```java
package effectivejava;

public class SuperStudent extends Student{
}

```

```java
package effectivejava;

public class Student {

    //返回具体子类对象
    private static Student student = new SuperStudent();
    private int age;

    private String sex;

    public static Student getTheBoy(){
        return student;
    }

    public Student(int age, String sex) {
        this.age = age;
        this.sex = sex;
    }

    public Student() {
    }

}

```

### 缺陷

* 不能被子类化（比如构造器是private方法或者类本身是final修饰的类）

```java
package effectivejava;

public class Student {
    //只能用new Student()了，不能new 子类了
    private static Student student = new Student();
    private int age;

    private String sex;

    public static Student getTheBoy(){
        return student;
    }

    private Student(int age, String sex) {
        this.age = age;
        this.sex = sex;
    }

    private Student() {
    }

   
}
```

* 不易发现如何调用
