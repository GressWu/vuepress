---
title: 建造者模式
date: 2024-08-18
categories:
- DesignPattern
tags:
- Java
---

## 建造者模式的使用场景

1. **创建复杂对象**：当需要创建一个包含多个属性或配置项的复杂对象时，使用建造者模式可以将对象的构建过程分解成多个步骤，使得代码更加可读、可维护，并且可以灵活地组合各个步骤。
2. **避免构造器参数过多**：如果一个类的构造器参数过多，使用构造方法来创建对象会导致代码可读性差、易出错。建造者模式通过将属性的设置过程封装在建造者类中，可以避免构造器参数过多的问题，使得代码更加清晰。
3. **创建不可变对象**：建造者模式常与**不可变对象**的创建相结合。通过建造者模式，可以在对象构建过程中设置对象的属性，并在构建完成后将对象设为不可变状态，从而保证对象的不可变性。
4. **灵活地构建对象**：建造者模式可以根据需要灵活地构建不同的对象实例。通过调整建造者类中的设置方法，可以创建具有不同属性组合的对象，而无需修改对象类的代码。
5. **隐藏对象构建细节**：使用建造者模式可以将对象的构建细节隐藏起来，对外只暴露简单的接口方法。这样可以提高代码的封装性和安全性，同时也降低了其他类对对象构建过程的依赖。

## 利用建造者模式完成链式创建对象

```java
package com.yuwei.bulilder;

public class Phone {

    private String name;

    private Integer age;

    private String address;

    private Phone(Builder builder){
        this.name = builder.name;
        this.age = builder.age;
        this.address = builder.address;
    }

    public static final class Builder{
        private String name;

        private Integer age;

        private String address;


        public Builder name(String name){
            this.name = name;
            return this;
        }

        public Builder age(Integer age){
            this.age = age;
            return this;
        }

        public Builder address(String address){
            this.address = address;
            return this;
        }

        public Phone build(){
            return new Phone(this);
        }

    }

    @Override
    public String toString() {
        return "Phone{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                '}';
    }
}

```

```java
package com.yuwei.bulilder;


public class PhoneDemo {
    public static void main(String[] args) {

        Phone.Builder builder = new Phone.Builder();
        Phone phone = builder.address("洛杉矶")
                .age(2)
                .name("Iphone")
                .build();
        System.out.println(phone);
    }
}

```

这样就可以通过创造者模式创建一个不可变的，参数可选，且不需要构造方法构造的手机类了

## 利用创建者模式根据不同builder直接创造一个类

```java
package com.yuwei.buildertest;

public class DataBase {
    private String userName;

    private String passWord;

    private String databaseName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }
}

```

```java
package com.yuwei.buildertest;

public abstract class Builder {

   protected DataBase dataBase=new DataBase();

   public abstract void setName();

   public abstract void setPassWord();

   public abstract DataBase getConnection();


}

```

```java
package com.yuwei.buildertest;

public class MysqlBuilder extends Builder{
    @Override
    public void setName() {
        dataBase.setUserName("root");
    }

    @Override
    public void setPassWord() {
        dataBase.setPassWord("root");
    }

    @Override
    public DataBase getConnection() {
        dataBase.setDatabaseName("Mysql");
        return dataBase;
    }
}

```

```java
package com.yuwei.buildertest;

public class OracleBuilder extends Builder {
    @Override
    public void setName() {
        dataBase.setUserName("admin");
    }

    @Override
    public void setPassWord() {
        dataBase.setPassWord("admin");
    }

    @Override
    public DataBase getConnection() {
        dataBase.setDatabaseName("Oracle");
        return dataBase;
    }
}

```

```java
package com.yuwei.buildertest;

public class Director {

    private Builder builder;

    public Director(Builder builder){
        this.builder = builder;
    }

    public DataBase createDatabase(){
        builder.setName();
        builder.setPassWord();
        return builder.getConnection();
    }
}

```

```java
package com.yuwei.buildertest;

public class BuilderTest {
    public static void main(String[] args) {
        Director director = new Director(new MysqlBuilder());
        DataBase database = director.createDatabase();
        System.out.println(database.getDatabaseName());
        System.out.println(database.getPassWord());
        System.out.println(database.getUserName());


    }
}

```

这样的话比较适合创建大量结构一致且创建过程多变中不一致的类