---
title: 设计模式七大原则
date: 2021-08-11
categories:
 - DesignPattern
tags:
 - Java
---

## 单一职责原则

   每个类只有一项单一的职责，如果是简单的类，可以实现方法为单一的原则。

## 接口隔离原则

   每个类实现接口的时候，只实现需要的接口方法，不需要的方法步会去实现。

## 依赖倒置原则

   每个类尽量实现接口进行开发，保证代码的可扩展性。

   变量的声明类型尽量是抽象类或者是接口。

   核心是面向接口编程。

   抽象不依赖细节，细节应该依赖抽象。

   ```java
   package inverse;
   
   public class DependcyInversion {
       public static void main(String[] args) {
           Person person = new Person();
           person.receive(new Email());
           person.receive(new WeChat());
       }
   }
   
   interface IReceiver{
       public String getInfo();
   }
   
   class WeChat implements IReceiver{
   
       @Override
       public String getInfo() {
           return "微信消息";
       }
   }
   
   class Email implements IReceiver{
   
       @Override
       public String getInfo() {
           return "接手Email";
       }
   }
   
   class Person{
       public void receive(IReceiver i){
           System.out.println(i.getInfo());
       }
   }
   ```

   **依赖关系传递的三种方式:**

   * 接口传递

     ```java
     package inverse;
     
     public class DependcyPass {
         public static void main(String[] args) {
             OpenAndClose openAndClose = new OpenAndClose();
             openAndClose.open(new Changhong());
         }
     }
     
     interface IOpenAndClose{
         public void open(ITV itv);
     }
     
     interface ITV{
         public void play();
     }
     class Changhong implements ITV{
     
         @Override
         public void play() {
             System.out.println("这就是长虹电视");
         }
     }
     class OpenAndClose implements IOpenAndClose{
     
         @Override
         public void open(ITV itv) {
             itv.play();
         }
     }
     ```

   * 构造方法传递

     ```java
     package inverse;
     
     public class DependcyPass {
         public static void main(String[] args) {
             OpenAndClose openAndClose = new OpenAndClose(new Changhong());
             openAndClose.open();
         }
     }
     
     interface IOpenAndClose{
         public void open();
     }
     
     interface ITV{
         public void play();
     }
     class Changhong implements ITV{
     
         @Override
         public void play() {
             System.out.println("这就是长虹电视");
         }
     }
     class OpenAndClose implements IOpenAndClose{
         public ITV itv;
     
         public OpenAndClose(ITV itv){
             this.itv = itv;
         }
     
         @Override
         public void open() {
             this.itv.play();
         }
     
     }
     ```

   * setter方法传递

     ```java
     package inverse;
     
     public class DependcyPass {
         public static void main(String[] args) {
             OpenAndClose openAndClose = new OpenAndClose();
             openAndClose.setTv(new Changhong());
             openAndClose.open();
         }
     }
     
     interface IOpenAndClose{
         public void open();
     
         public void setTv(ITV itv);
     }
     
     interface ITV{
         public void play();
     }
     class Changhong implements ITV{
     
         @Override
         public void play() {
             System.out.println("这就是长虹电视");
         }
     }
     class OpenAndClose implements IOpenAndClose{
         public ITV itv;
     
     
     
         @Override
         public void open() {
             this.itv.play();
         }
     
         @Override
         public void setTv(ITV itv) {
             this.itv=itv;
         }
     
     }
     ```

## 里氏替换原则

尽量不要重写父类的方法

如果非要用到可以和父类一起在抽象出一个更基础的基类

或者通过聚合的方式实现

**类中只允许存在方法与属性 其他运算什么的都不可以**

```java
package lishi;

public class Lishi {
    public static void main(String[] args) {

        //b.function1(11,2);
    }
}


class Base{

}

class A extends Base{
    public void function1(int a,int b){
        System.out.println(a+b);
    }
}


class B extends Base{

    public void function2(){

    }

    public void function3(int a,int b){
        //通过聚合引用方法
        A aa=new A();
        aa.function1(a,b);
    }

}
```

## 开闭原则

​     是编程中最基础、最重要的原则

* 对扩展开放（对提供方）、对修改关闭（对使用方）

```java
package inverse;

public class DependcyInversion {
    public static void main(String[] args) {
        Person person = new Person();
        //OCP原则
        person.receive(new Email());
        person.receive(new WeChat());
    }
}

interface IReceiver{
    public String getInfo();
}

class WeChat implements IReceiver{

    @Override
    public String getInfo() {
        return "微信消息";
    }
}

class Email implements IReceiver{

    @Override
    public String getInfo() {
        return "接手Email";
    }
}

class Person{
    public void receive(IReceiver i){
        System.out.println(i.getInfo());
    }
}
```

## 迪米特法则（最少知道原则）

直接朋友：成员变量、方法参数、方法返回值中的类为直接朋友。

陌生的类不要以局部变量的形式出现在类中

## 合成复用原则

原则上尽量使用合成、聚合的方式而不是使用继承