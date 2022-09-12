---
title: 自动注入与Spring注解
date: 2021-09-27
categories:
 - BackEnd
tags:
 - spring
---

## Bean的自动装配

1.单例模式（默认）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="teacher" class="com.yuwei.Teacher" p:age="16" p:name="赵六" scope="singleton"></bean>

    <bean id="teacher2" class="com.yuwei.Teacher" c:age="19" c:name="黄七"></bean>
</beans>
```

如果不写，默认就是scope="singleton" 单例模式

```java
public class TeacherTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("teacherbean.xml");
        Object teacher = applicationContext.getBean("teacher");
        Object teacher2 = applicationContext.getBean("teacher");
        System.out.println(teacher==teacher2);
        //System.out.println(teacher2);
    }
}
```

**输出：**

```
true
```

2.原型模式

每次从容器中get，都会产生一个新对象

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="teacher" class="com.yuwei.Teacher" p:age="16" p:name="赵六" scope="prototype"></bean>

    <bean id="teacher2" class="com.yuwei.Teacher" c:age="19" c:name="黄七"></bean>
</beans>
```

```java
public class TeacherTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("teacherbean.xml");
        Object teacher = applicationContext.getBean("teacher");
        Object teacher2 = applicationContext.getBean("teacher");
        System.out.println(teacher==teacher2);
        //System.out.println(teacher2);
    }
}
```

**输出：**

```
false
```

3.其余的request、session、application只能在web开发中使用

## Bean的自动装配

* 自动装配是Spring满足Bean依赖的一种方式
* Spring会在上下文自动寻找，并自动给bean装配属性

在Spring中有三种装配方式

1. xml显示装配
2. Java显示装配
3. 自动装配



**实体类：**

```
package com.yuwei.entity;

public class Cat {
    public void shout(){
        System.out.println("喵喵喵");
    }
}
```

```
package com.yuwei.entity;

public class Dog {
    public void shout(){
        System.out.println("汪汪汪");
    }
}
```

```
package com.yuwei.entity;

public class People {
    private String name;

    private Dog dog;

    private Cat cat;

    public People(String name, Dog dog, Cat cat) {
        this.name = name;
        this.dog = dog;
        this.cat = cat;
    }

    public People() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Dog getDog() {
        return dog;
    }

    public void setDog(Dog dog) {
        this.dog = dog;
    }

    public Cat getCat() {
        return cat;
    }

    @Override
    public String toString() {
        return "People{" +
                "name='" + name + '\'' +
                ", dog=" + dog +
                ", cat=" + cat +
                '}';
    }

    public void setCat(Cat cat) {
        this.cat = cat;
    }
}
```

**配置文件：**

自动装配主要为了省略类对于其它引用的重新引用

有两种方式

* autowire="byName" 这一种实际上原理是根据Setter方法做的装配，比如Dog类里面的setDog()方法this.dog =dog 那么他就会自动匹配 id为dog的Bean ，如果找不到会报错。id唯一。
* autowire="byType" 会根据类型进行匹配，但是如果有多个同样类型的Bean就会报错。class唯一。

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
        <bean id="cat" class="com.yuwei.entity.Cat"></bean>
        <bean id="dog" class="com.yuwei.entity.Dog"></bean>
       <!--<bean id="people" class="com.yuwei.entity.People" autowire="byType">-->
       <bean id="people" class="com.yuwei.entity.People" autowire="byName">
            <property name="name" value="王羲之"></property>
        </bean>
</beans>
```

**测试类：**

```
package com.yuwei.entity;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class PeopleTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        People people = applicationContext.getBean("people",People.class);
        people.getDog().shout();
        people.getCat().shout();
        System.out.println(people);
    }
}
```

### Spring注解

Spring4之后必须要Spring-aop包。配置文件必须要导入依赖

### @AutoWired

需要导入XML配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>
    <bean id="cat" class="com.yuwei.entity.Cat"></bean>
    <bean id="dog" class="com.yuwei.entity.Dog"></bean>
    <bean id="people" class="com.yuwei.entity.People"></bean>
</beans>
```

```java
package com.yuwei.entity;

import org.springframework.beans.factory.annotation.Autowired;

public class People {
    private String name;

    @Autowired
    private Dog dog;
    @Autowired
    private Cat cat;

    public People(String name, Dog dog, Cat cat) {
        this.name = name;
        this.dog = dog;
        this.cat = cat;
    }

    public People() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Dog getDog() {
        return dog;
    }

    public void setDog(Dog dog) {
        this.dog = dog;
    }

    public Cat getCat() {
        return cat;
    }


    @Override
    public String toString() {
        return "People{" +
                "name='" + name + '\'' +
                ", dog=" + dog +
                ", cat=" + cat +
                '}';
    }

    public void setCat(Cat cat) {
        this.cat = cat;
    }
}
```

1. 直接在属性上使用即可
2. 使用@AutorWired 的属性可以不用写Set方法，前提是该属性被Ioc容器管理。

```java
  @Autowired(required = false)
    private Dog dog;
```

 默认为True。如果改为False那么该对象为null也不会报错。



****

**特别注意！！！**

@Autowired 注入模式为先byType后byName。如果只有一个Bean实例，那么会采取byType模式进行注入，如果有多个Bean实例，就会采取byName的形式进行获取。

1. 一个Bean实例的情况

```java
package com.yuwei.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class People {
    private String name;
    @Autowired
    private Dog dog3;
    @Autowired
    private Cat cat3;
    

    public People(String name, Dog dog, Cat cat) {
        this.name = name;
        this.dog3 = dog;
        this.cat3 = cat;
    }

    public People() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Dog getDog() {
        return dog3;
    }

    public void setDog(Dog dog) {
        this.dog3 = dog;
    }

    public Cat getCat() {
        return cat3;
    }


    @Override
    public String toString() {
        return "People{" +
                "name='" + name + '\'' +
                ", dog=" + dog3 +
                ", cat=" + cat3 +
                '}';
    }

    public void setCat(Cat cat) {
        this.cat3 = cat;
    }
}

```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>
    <bean id="cat" class="com.yuwei.entity.Cat"></bean>


    <bean id="dog" class="com.yuwei.entity.Dog"></bean>
    <bean id="people" class="com.yuwei.entity.People"></bean>
</beans>
```

```java
package com.yuwei.entity;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class PeopleTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        People people = applicationContext.getBean("people",People.class);
        people.getDog().shout();
        people.getCat().shout();
        System.out.println(people);
    }
}
```

**输出：**

```
汪汪汪
喵喵喵
People{name='null', dog=com.yuwei.entity.Dog@1a0cee9, cat=com.yuwei.entity.Cat@b21112}
```

我们可以看到当IOC容器中类型唯一时，不论@anutoWired注解 注解的对象名为什么，总是会注入成功，**证明类型有唯一的Bean时，会采取ByType的方式注入。**

2. 多个Bean实例的对象

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>
    <bean id="cat" class="com.yuwei.entity.Cat"></bean>
    <bean id="cat3" class="com.yuwei.entity.Cat"></bean>
    <bean id="cat4" class="com.yuwei.entity.Cat"></bean>


    <bean id="dog" class="com.yuwei.entity.Dog"></bean>
    <bean id="people" class="com.yuwei.entity.People"></bean>
</beans>
```

```
package com.yuwei.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class People {
    private String name;
    @Autowired
    private Dog dog3;
    @Autowired
    private Cat cat3;
    @Autowired
    private Cat cat4;
    @Autowired
    private Cat cat7;


    public People(String name, Dog dog, Cat cat) {
        this.name = name;
        this.dog3 = dog;
        this.cat3 = cat;
    }

    public People() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Dog getDog() {
        return dog3;
    }

    public void setDog(Dog dog) {
        this.dog3 = dog;
    }

    public Cat getCat() {
        return cat3;
    }

    @Override
    public String toString() {
        return "People{" +
                "name='" + name + '\'' +
                ", dog=" + dog3 +
                ", cat=" + cat3 +
                '}';
    }

    public void setCat(Cat cat) {
        this.cat3 = cat;
    }
}
```

```java
package com.yuwei.entity;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class PeopleTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        People people = applicationContext.getBean("people",People.class);
        people.getDog().shout();
        people.getCat().shout();
        System.out.println(people);
    }
}
```

**报错信息：**

```txt
Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'people': Unsatisfied dependency expressed through field 'cat7'; nested exception is org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.yuwei.entity.Cat' available: expected single matching bean but found 3: cat,cat3,cat4
```

我们可以看到报错信息为cat7没有匹配的依赖，bean里面只有cat，cat3，cat4。证明当一个类型的**Bean大于一时，@Autowired注解模式就会变为Byname**



如何解决该问题？

方法一： 创建新的Bean名称为cat7的实例

方法二：使用@Qualifer()注解将cat7注入到已存在注解中

```java
package com.yuwei.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class People {
    private String name;
    @Autowired
    private Dog dog3;
    @Autowired
    private Cat cat3;
    @Autowired
    private Cat cat4;
    @Autowired
    @Qualifier("cat")
    private Cat cat7;


    public People(String name, Dog dog, Cat cat) {
        this.name = name;
        this.dog3 = dog;
        this.cat3 = cat;
    }

    public People() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Dog getDog() {
        return dog3;
    }

    public void setDog(Dog dog) {
        this.dog3 = dog;
    }

    public Cat getCat() {
        return cat3;
    }
    public Cat getCat3() {
        return cat3;
    }
    public Cat getCat7() {
        return cat7;
    }




    @Override
    public String toString() {
        return "People{" +
                "name='" + name + '\'' +
                ", dog=" + dog3 +
                ", cat=" + cat3 +
                '}';
    }

    public void setCat(Cat cat) {
        this.cat3 = cat;
    }
}
```

这里将cat7注入到了名为cat的Bean里，这样的话就不会再报错了。

### @Resource

@Resource默认通过byName注入，如果没有匹配则通过byType注入

与@Autowired用法相似，都是用来自动装配的

```java
@Resource(name = "dog",type = Dog.class)
private Dog dog3;
```

可以通过name与type来指定byName方式还是byType来装配

### @Componet

**前置条件：**要指定扫描的包与开启注解约束

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>
    <!--指定要扫描的包，该包下面的注解会生效-->
    <context:component-scan base-package="com.yuwei.entity"></context:component-scan>
</beans>
```

```java
package com.yuwei.entity;

import org.springframework.stereotype.Component;

@Component
public class Snake {
    private String name;

    public Snake(String name) {
        this.name = name;
    }

    public Snake() {
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Snake{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

相当于在配置文件中增加了以下配置，实现注解配置Bean,而且name默认为类名的小写

```xml
<bean name="snake" class="com.yuwei.entity.Snake"></bean>
```

**衍生注解**

* @Repository

与@Compent功能一致，只是在Dao层这样写，更明了。

```java
package com.yuwei.dao;

import org.springframework.stereotype.Repository;

@Repository
public class SnakeDao {
}
```

* @Controller

```java
package com.yuwei.controller;

import org.springframework.stereotype.Controller;

@Controller
public class SnakeController {
}

```

* @Service

```java
package com.yuwei.service;

import org.springframework.stereotype.Service;

@Service
public class SnakeService {
}
```

以上注解与@Compent注解作用一致，都是将该类托管给Spring管理，注册到Spring容器中

### @Value

为属性注入值

```java
package com.yuwei.entity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Snake {
    @Value("Lisi")
    private String name;

    public Snake(String name) {
        this.name = name;
    }

    public Snake() {
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Snake{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

也可以写在setter方法上，实现效果同上

```java
@Value("Lisi")
    public void setName(String name) {
        this.name = name;
    }
```

相当于配置文件加了以下配置：

```xml
   <bean name="snake" class="com.yuwei.entity.Snake">
        <property name="name" value="lisi"></property>
    </bean>
```

### @Scope

作用域

```java
@Service
//单例模式
@Scope("singleton")
public class SnakeService {
}
```

## 注解与XML

xml功能强大，适用于所有场景，适用于复杂场景。

xml可以通过import对别人的Bean配置进行管理，注解不可以

但是Bean通过

## 使用Java的方式配置Spring

这种方式完全不使用xml配置了，全权交给Java来做。·

在Spring4之后，成为一个核心功能。

**配置类：**

```java
package com.yuwei.config;

import com.yuwei.entity.Movie;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration									 //配置类
@Import(OtherConfig.class)						 //Import导入其他包
@ComponentScan("com.yuwei.entity")               //包扫描，这个类的注解可以用
public class Myconfig {

    @Bean										//相当于xml中的<Bean></Bean>
    public Movie movieConfig(){					//方法名相当于Id
        return new Movie();
    }
}
```

**实体类：**

```java
package com.yuwei.entity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Movie {
    @Value("闻香识女人")
    private String name;

    public Movie(String name) {
        this.name = name;
    }

    public Movie() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "name='" + name + '\'' +
                '}';
    }
}

```

**测试类：**

```java
package com.yuwei;

import com.yuwei.config.Myconfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Test {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(Myconfig.class);
        Object movieConfig = applicationContext.getBean("movieConfig");
        System.out.println(movieConfig);
    }
}

```

**输出**

```
Movie{name='闻香识女人'}
```

