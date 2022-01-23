---
---

## 泛型

### 什么是泛型

泛型就是在Java程序编译的时候给预定义的类赋予值的类。

### 为什么要使用泛型

首先看以下例子

```java
package com.yuwei;

import java.util.ArrayList;

public class Test1 {
    public static void main(String[] args) {
        ArrayList objects = new ArrayList();
        objects.add("a");
        objects.add(10);
        objects.add(true);
        for (Object object : objects) {
            String tem = (String)object;
            System.out.println(tem);
        }
    }
}
```

我们知道ArrayList<>()本身是一个泛型类，但是如果不指定相关类型，**那么泛型类的默认类型是object类**。

但是如果只知道是Object类的话，如上图代码，我们想拿到String类型的数据就需要通过(String)进行强转，但是这样的话编译正常通过，但是运行的时候就会报错（Integer无法转换成String）。

而如果我们引入了泛型类，提前指定类型，那么就会解决以上问题。**泛型的好处有二：第一，使用泛型规定对应类型，如果赋值的时候给一个不对应的值，那么该类就会编译报错，避免运行时报错。第二，使用泛型，可以更加灵活的规定需要用的数据类型。**



**用法：**

public ClassName <E、K、T.......>

<>中可以放若干个泛型类

如果不指定参数，默认为Object类型。

**抽奖实例：**

```java
package com.yuwei.price;

import java.util.ArrayList;
import java.util.Random;

public class DrawRaffle<T> {
    private T product;

    private ArrayList<T> productList = new ArrayList<>();

    Random random = new Random();

    public T getProduct() {
        return product;
    }

    public void setProduct(T product) {
        this.product = product;
    }

    public void init(T product){
        productList.add(product);
    }

    public T getTheProduct(){
        return productList.get(random.nextInt(productList.size()));
    }
}
```

```java
package com.yuwei.price;


public class RaffleTest {
    public static void main(String[] args) {
        DrawRaffle<String> stringDrawRaffle = new DrawRaffle<>();
        String[] productList = {"三国演义","水浒传","红楼梦","西游记"};
        for (String s : productList) {
            stringDrawRaffle.init(s);
        }
        System.out.println("抽到的奖品是："+stringDrawRaffle.getTheProduct());

        DrawRaffle<Integer> integerDrawRaffle = new DrawRaffle<>();
        Integer[] money = {11,22,333,6666};
        for (Integer integer : money) {
            integerDrawRaffle.init(integer);
        }
        System.out.println("抽到的奖金是："+integerDrawRaffle.getTheProduct());


    }
}
```

```
com.yuwei.price.RaffleTest
抽到的奖品是：红楼梦
抽到的奖金是：11

Process finished with exit code 0

```

### 泛型子类的应用

* 如果父类，子类都是泛型，子类的类型必须与父类一致，且子类可以扩展其他泛型参数。

```java
package com.yuwei.test;

public class Parent<T>{
    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
```

```java
package com.yuwei.test;

public class Child<T,E> extends Parent<T> {

    private E ele;

    @Override
    public T getValue() {
        return super.getValue();
    }

    @Override
    public void setValue(T value) {
        super.setValue(value);
    }

    public E getEle() {
        return ele;
    }

    public void setEle(E ele) {
        this.ele = ele;
    }
}
```

```java
package com.yuwei.test;

public class Test {
    public static void main(String[] args) {
        Child<String, Integer> stringIntegerChild = new Child<>();
        stringIntegerChild.setValue("张三");
        stringIntegerChild.setEle(12);
        System.out.println(stringIntegerChild.getEle());
        System.out.println(stringIntegerChild.getValue());
    }
}
```

* 如果子类不是泛型类，父类是泛型类，子类继承父类时必须要指定父类的类型。

```java
package com.yuwei.test;

public class Child2 extends Parent<Integer>{
    @Override
    public Integer getValue() {
        return super.getValue();
    }

    @Override
    public void setValue(Integer value) {
        super.setValue(value);
    }
}
```

```java
package com.yuwei.test;

public class Test {
    public static void main(String[] args) {
        Child<String, Integer> stringIntegerChild = new Child<>();
        stringIntegerChild.setValue("张三");
        stringIntegerChild.setEle(12);
        System.out.println(stringIntegerChild.getEle());
        System.out.println(stringIntegerChild.getValue());

        //这时的child2类会变为普通的继承于Parent Integer类型的类。
        Child2 child2 = new Child2();
        child2.setValue(44);
        System.out.println(child2.getValue());
    }
}
```

### 泛型接口

1.如果实现泛型接口的类是普通类，则必须要指定实现泛型接口的类型，否则默认为Object类型。

```java
package com.yuwei.interfacet;

public interface Generator<T> {
    T getKey();
}
```

```java
package com.yuwei.interfacet;

//实现的是Stirng类型的接口
public class Apple implements Generator<String>{

    @Override
    public String getKey() {
        return "This is a Apple";
    }
}
```

2.如果实现泛型接口的类是泛型类，则泛型类与泛型接口必须有一个一样的泛型参数，泛型类可以进行其他扩展

```java
package com.yuwei.interfacet;

public class Pair<T,E> implements Generator<T> {
    T t;
    E e;
    @Override
    public T getKey() {
        return t;
    }

    public E getE(){
        return e;
    }

    public void setKey(T t){
        this.t= t;
    }

    public void setE(E e){
        this.e=e;
    }

}
```

测试类：

```java
package com.yuwei.test;

public class Test {
    public static void main(String[] args) {
        Child<String, Integer> stringIntegerChild = new Child<>();
        stringIntegerChild.setValue("张三");
        stringIntegerChild.setEle(12);
        System.out.println(stringIntegerChild.getEle());
        System.out.println(stringIntegerChild.getValue());

        Child2 child2 = new Child2();
        child2.setValue(44);
        System.out.println(child2.getValue());
    }
}
```

输出结果：

```java
This is a Apple
23
hah
```

### 泛型方法

泛型方法不是泛型成员方法而是泛型的方法

**格式：**

`Public [static] <T> void methodName(){}`

```java
package com.yuwei.price;


import java.util.ArrayList;
import java.util.Random;

public class DrawRaffle<T> {
    private T product;

    private ArrayList<T> productList = new ArrayList<>();

    Random random = new Random();

    public T getProduct() {
        return product;
    }

    public void setProduct(T product) {
        this.product = product;
    }

    public void init(T product){
        productList.add(product);
    }

    //泛型类的成员方法
    public T getTheProduct(){
        return productList.get(random.nextInt(productList.size()));
    }

    //泛型方法
    public <E> E getTheProduct(ArrayList<E> e){
        return  e.get(random.nextInt(e.size()));
    }
}

```

测试类：

```java
package com.yuwei.price;

import java.util.ArrayList;

public class Test2 {
    public static void main(String[] args) {
        DrawRaffle<Object> objectDrawRaffle = new DrawRaffle<>();
        ArrayList<String> strings = new ArrayList<>();
        strings.add("苹果电脑");
        strings.add("游戏机");
        strings.add("手机");
        String theProduct = objectDrawRaffle.getTheProduct(strings);
        System.out.println(theProduct);
        System.out.println("--------------------------------");
        ArrayList<Integer> integers = new ArrayList<>();
        integers.add(1000);
        integers.add(2000);
        integers.add(3000);
        Integer theProduct1 = objectDrawRaffle.getTheProduct(integers);
        System.out.println(theProduct1);
    }
}
```

输出：

```
游戏机
--------------------------------
2000
```

### 类型通配符

```java
package com.yuwei.demo;

public class Box<E> {
    private E cap;

    public E getCap() {
        return cap;
    }

    public void setCap(E cap) {
        this.cap = cap;
    }
}

```

```java
package com.yuwei.demo;

public class Test01 {
    public static void main(String[] args) {
        Box<Number> numberBox = new Box<>();
        numberBox.setCap(100);
        showBox(numberBox);
    }

    public static void showBox(Box<Number> box) {
        Number cap = box.getCap();
        System.out.println(cap);
    }
}
```

**问题引入：**

```java
Box<Integer> integerBox = new Box<>();
integerBox.setCap(900);
showBox(integerBox);
```

```java
public static void showBox(Box<Integer> box) {
    Number cap = box.getCap();
    System.out.println(cap);
}
```

我们尝试用多态的思想新增一个Number子类的对象

又想通过重载一个showBox()方法

我们会发现这两种方法都会报错，原因是泛型Box本质来说是一个Box类的Class，因此他不能用这两种方法解决。

**问题解决：**

```java
package com.yuwei.demo;

public class Test01 {
    public static void main(String[] args) {
        Box<Number> numberBox = new Box<>();
        numberBox.setCap(100);
        showBox(numberBox);

        Box<Integer> integerBox = new Box<>();
        integerBox.setCap(900);
        showBox(integerBox);

        Box<String> stringBox = new Box<>();
        stringBox.setCap("fund");
        showBox(stringBox);
    }

    public static void showBox(Box<?> box) {
        Object cap = box.getCap();
        System.out.println(cap);
    }


}
```

使用类型通配符?来代替具体类型的实参

类型通配符是类型实参，不是类型形参。



### 类型通配符的上限与下限

方法定义（举例）:

* 上限

```
ArrayList<? extends Cat>
```

* 下限

```
ArrayList<? super Cat> 
```

```java
package com.yuwei.demo1;

public class Animal {
}

```

```java
package com.yuwei.demo1;

public class Cat extends Animal{
}
```

```java
package com.yuwei.demo1;

public class MiniCat extends Cat{
}
```

```java
package com.yuwei.demo1;

import java.util.ArrayList;

public class Test {
    public static void main(String[] args) {
        ArrayList<Animal> animals = new ArrayList<>();
        ArrayList<Cat> cats = new ArrayList<>();
        ArrayList<MiniCat> miniCats = new ArrayList<>();

        //不符合上限
        //showAnimal(animals);
        showAnimal(cats);
        showAnimal(miniCats);

        showAnimals(animals);
        showAnimals(cats);
        //不符合下限
        //showAnimals(miniCats);
    }

    /**
     * 泛型上限通配符，传递的集合类型，只能是Cat或Cat的子类类型
     * 并且方法内部也不能进行list.add()进行填充
     * 实参类型
     * @param list
     */
    public static void showAnimal(ArrayList<? extends Cat> list ){
        for (Cat cat : list) {
            System.out.println(cat);
        }
    }

    /**
     * 泛型下限通配符，传递的集合类型，只能是Cat或Cat的父类类型
     * 并且方法内部可以进行list.add()进行填充
     * 实参类型
     * @param list
     */
    public static void showAnimals(ArrayList<? super Cat> list ){
        for (Object o : list) {
            System.out.println(o);
        }
    }
}
```

### 类型擦除

1. 无限制类型擦除

```Java
package com.yuwei.demo2;

public class Erasure2<T> {
    T t;

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }
}
```

```java
package com.yuwei.demo2;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;

public class Test {
    public static void main(String[] args) {
        Erasure2<Integer> integerErasure2 = new Erasure2<>();
        integerErasure2.setT(10);
        Class<? extends Erasure2> aClass = integerErasure2.getClass();
        //利用发射获取所有的成员变量
        Field[] declaredFields = aClass.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            //打印成员变量的类型
            System.out.println(declaredField.getName()+" "+declaredField.getType().getSimpleName());
        }
        
    }
}
```

```java
t Object
```

虽然我们这里传入的是Integer类型，但是编译结束后，T的类型并不是Integer类型，而是Object类型。这就是无限制类型擦除。

2. 有限制类型擦除

```
package com.yuwei.demo2;

public class Erasure1<T extends Number> {
    T t;

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }
}
```

```
Erasure1<Number> numberErasure1 = new Erasure1<>();
numberErasure1.setT(10);
Class<? extends Erasure1> aClass1 = numberErasure1.getClass();
Field[] declaredFields1 = aClass1.getDeclaredFields();
for (Field field : declaredFields1) {
    System.out.println(field.getName()+ " "+ field.getType().getSimpleName());
}
```

```
t Number
```

会擦除到上限