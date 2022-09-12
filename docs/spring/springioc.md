---
title: Spring IOC与DI
date: 2021-09-25
categories:
 - BackEnd
tags:
 - spring
---

## 一、Spring IOC对象创建方式

1. 使用无参构造器构造（默认）

   **实体类：**

   ```java
   package com.yuwei;
   
   public class Animal {
       String name;
   
       public Animal(String name) {
           this.name = name;
       }
   
       public Animal() {
       }
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       @Override
       public String toString() {
           return "Animal{" +
                   "name='" + name + '\'' +
                   '}';
       }
   }
   ```

   **Bean配置文件:**

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">
   
       <bean id="helloSpring" class="com.yuwei.User">
           <!-- collaborators and configuration for this bean go here -->
           <property name="name" value="zhangSan"></property>
       </bean>
   
       <bean id="animal" class="com.yuwei.Animal">
           <property name="name" value="Lisi"></property>
        </bean>
   
   
   </beans>
   ```

   **测试类：**

   ```java
   package com.yuwei;
   
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.support.ClassPathXmlApplicationContext;
   
   public class Test2 {
       public static void main(String[] args) {
           ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml","userbeans.xml");
           //对象都在Spring中管理了
           Object animal = applicationContext.getBean("animal");
           System.out.println(animal);
   
       }
   }
   ```

   **输出：**

   ```
   User也加载了   //在 new ClassPathXmlApplicationContext加载容器的时候所有Spring管理的对象就已经被加载了
   Animal{name='Lisi'}
   ```

   

2. 有参构造创建对象

   1. 下标赋值

      ```xml
       <bean id="animal" class="com.yuwei.Animal">-->
          <constructor-arg index="0" value="Lisa"></constructor-arg>-->
       </bean>
      ```

   2. 根据类型赋值

      ```xml
      <bean id="animal" class="com.yuwei.Animal">
          <constructor-arg type="java.lang.String" value="Lisa"></constructor-arg>
      </bean>
      ```

   3. 直接通过参数名

      ```xml
      <bean id="animal" class="com.yuwei.Animal">
          <constructor-arg name="name" value="Lisa"></constructor-arg>
      </bean>
      ```

3. 总结：在配置文件加载的时候，无论要不要使用用该Bean，容器中所有被声明的Bean都会被加载。

## 二、Spring配置

#### 1.别名

给id为animal的bean起别名为panda

```xml
<alias name="animal" alias="panda"></alias>
```

#### 2.配置

```xml
<bean id="animal" class="com.yuwei.Animal" name="panda">
    <constructor-arg name="name" value="Lisa"></constructor-arg>
</bean>
```

id:bean的唯一标识

class:包的全路径

name:别名的另一种情况

#### 3. import

用于团队开发，将多个Bean合并到一起

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <import resource="beans.xml"></import>
    <import resource="userbeans.xml"></import>
</beans>
```

将`beans.xml`与`userbeans.xml`合并到`applicationContext.xml`中，后面直接读取父`xml`就可以了

```java
package com.yuwei;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test2 {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        //对象都在Spring中管理了
        Object animal = applicationContext.getBean("panda");
        System.out.println(animal);

    }
}
```

## 三、依赖注入

1. 构造器注入

2. set注入

   **实体类：**

   ```java
   package com.yuwei;
   
   public class Address {
       private String address;
   
       public Address(String address) {
           this.address = address;
       }
   
       public Address() {
       }
   
       public String getAddress() {
           return address;
       }
   
       public void setAddress(String address) {
           this.address = address;
       }
   
       @Override
       public String toString() {
           return "Address{" +
                   "address='" + address + '\'' +
                   '}';
       }
   }
   ```

   ```java
   package com.yuwei;
   
   import java.util.*;
   
   public class Student {
       private String name;
       private Address address;
       private String[] books;
       private List<String> hobbys;
       private Map<String,String> card;
       private Set<String> games;
       private String wife;
       private Properties info;
   
       public Student(String name, Address address, String[] books, List<String> hobbys, Map<String, String> card, Set<String> games, String wife, Properties info) {
           this.name = name;
           this.address = address;
           this.books = books;
           this.hobbys = hobbys;
           this.card = card;
           this.games = games;
           this.wife = wife;
           this.info = info;
       }
   
       public Student() {
       }
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public Address getAddress() {
           return address;
       }
   
       public void setAddress(Address address) {
           this.address = address;
       }
   
       public String[] getBooks() {
           return books;
       }
   
       public void setBooks(String[] books) {
           this.books = books;
       }
   
       public List<String> getHobbys() {
           return hobbys;
       }
   
       public void setHobbys(List<String> hobbys) {
           this.hobbys = hobbys;
       }
   
       public Map<String, String> getCard() {
           return card;
       }
   
       public void setCard(Map<String, String> card) {
           this.card = card;
       }
   
       public Set<String> getGames() {
           return games;
       }
   
       public void setGames(Set<String> games) {
           this.games = games;
       }
   
       public String getWife() {
           return wife;
       }
   
       public void setWife(String wife) {
           this.wife = wife;
       }
   
       public Properties getInfo() {
           return info;
       }
   
       public void setInfo(Properties info) {
           this.info = info;
       }
   
       @Override
       public String toString() {
           return "Student{" +
                   "name='" + name + '\'' +
                   ", address=" + address +
                   ", books=" + Arrays.toString(books) +
                   ", hobbys=" + hobbys +
                   ", card=" + card +
                   ", games=" + games +
                   ", wife='" + wife + '\'' +
                   ", info=" + info +
                   '}';
       }
   }
   ```

   **Bean的配置：**

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
       <bean id="goodStudentAdd" class="com.yuwei.Address">
           <property name="address" value="苏州"></property>
       </bean>
   
       <bean id="goodStudent" class="com.yuwei.Student">
           <!--基本数据类型注入-->
           <property name="name" value="江流儿"></property>
   
           <!--引用类型注入-->
           <property name="address" ref="goodStudentAdd"></property>
   
           <!--数组注入-->
           <property name="books">
               <array>
                   <value>三国演义</value>
                   <value>西游记</value>
                   <value>红楼梦</value>
               </array>
           </property>
   
           <!--List注入-->
           <property name="hobbys">
               <list>
                   <value>抽烟</value>
                   <value>喝酒</value>
                   <value>烫头</value>
               </list>
           </property>
   
           <!--Map注入-->
           <property name="card">
               <map>
                   <entry key="身份证" value="1145543332"></entry>
                   <entry key="银行卡" value="889900009933"></entry>
               </map>
           </property>
   
           <!--Set注入-->
           <property name="games">
               <set>
                   <value>CF</value>
                   <value>DNF</value>
                   <value>LOL</value>
               </set>
           </property>
   
           <!--property注入-->
           <property name="info">
               <props>
                   <prop key="url">192.22.23.44</prop>
                   <prop key="userId">wang</prop>
                   <prop key="passWord">998877</prop>
                   <prop key="driver">oracle</prop>
               </props>
           </property>
   
           <!--空值注入-->
           <property name="wife">
               <null></null>
           </property>
       </bean>
   </beans>
   ```

   **测试类：**

   ```java
   package com.yuwei;
   
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.support.ClassPathXmlApplicationContext;
   
   public class StudentTest {
       public static void main(String[] args) {
           ApplicationContext applicationContext = new ClassPathXmlApplicationContext("studentBeans.xml");
           Object bean = applicationContext.getBean("");
           System.out.println(bean);
       }
   }
   ```

   **输出：**

   ```
   Student{name='江流儿', address=Address{address='苏州'}, books=[三国演义, 西游记, 红楼梦], hobbys=[抽烟, 喝酒, 烫头], card={身份证=1145543332, 银行卡=889900009933}, games=[CF, DNF, LOL], wife='null', info={passWord=998877, url=192.22.23.44, userId=wang, driver=oracle}}
   
   ```

   

3. 其他注入

   使用c命名空间（相当于有参构造注入）与p命名空间（相当于无参构造+set注入）

   **配置文件：**

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"     // 必须引入约束，才可使用标签
       xmlns:c="http://www.springframework.org/schema/c"	//  必须引入约束，才可使用标签
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="teacher" class="com.yuwei.Teacher" p:age="16" p:name="赵六"></bean>

    <bean id="teacher2" class="com.yuwei.Teacher" c:age="19" c:name="黄七"></bean>
</beans>
```

​		**实体类：**

```java
package com.yuwei;

public class Teacher {
    private String name;
    private String age;

    public Teacher(String name, String age) {
        this.name = name;
        this.age = age;
    }

    public Teacher() {
    }

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

    @Override
    public String toString() {
        return "Teacher{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                '}';
    }
}
```

​	**测试类：**

```java
package com.yuwei;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TeacherTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("teacherbean.xml");
        Object teacher = applicationContext.getBean("teacher");
        Object teacher2 = applicationContext.getBean("teacher2");
        System.out.println(teacher);
        System.out.println(teacher2);
    }
}
```

​	**结果：**

```
Teacher{name='赵六', age='16'}
Teacher{name='黄七', age='19'}
```

