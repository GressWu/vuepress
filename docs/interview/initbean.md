---
title: Spring中注册Bean的方式
date: 2022-03-04
categories:
 - BackEnd
tags:
 - Java
 - spring
 - interview
---

## 方式一

首先，对于SpringBoot项目来说，`classpath`指的是`src.main.java和src.main.resources`路径的根路径，存放在这两个路径下的文件，都可以通过`classpath`作为相对路径来引用；



xml方式是Spring中最早配置Bean的方式，比较复杂，现在基本不用，但是功能强大。beanName是严格大小写的

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
  <bean id="student" class="com.example.springbean.injectbean.method1.Student">

  </bean>
</beans>
```

```java
package com.example.springbean.injectbean.method1;

public class Student {
}
```

```java
package com.example.springbean.injectbean.method1;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Client {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext classPathXmlApplicationContext = new ClassPathXmlApplicationContext("classpath:spring-config.xml");
        System.out.println(classPathXmlApplicationContext.getBean("student"));

    }
}
```

输出结果：

```
com.example.springbean.injectbean.method1.Student@1820e51
```

## 方式二

使用注解的Bean的name自动为小驼峰

配置类制定包路径，这样可以扫描该包下面所有类似Component注解的类

@Controller、@Repository、@Service、@Configuration、@Repository本质上与@Component没有任何区别，都是用来将类注册到IOC容器中。但是注解代表的语义不同，能更好区分类的作用。

```java
package com.example.springbean.injectbean.method2;

import org.springframework.stereotype.Controller;

@Controller
public class UserController {
}
```

```java
package com.example.springbean.injectbean.method2;

import org.springframework.stereotype.Repository;

@Repository
public class UserDao {
}
```

```java
package com.example.springbean.injectbean.method2;

import org.springframework.stereotype.Component;

@Component
public class UserHandler {
}
```

```java
package com.example.springbean.injectbean.method2;

import org.springframework.stereotype.Service;

@Service
public class UserService {
}

```

```java
package com.example.springbean.injectbean.method2;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example.springbean.injectbean.method2")
public class Appconfig {
}
```

```java
package com.example.springbean.injectbean.method2;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("userDao"));
        System.out.println(annotationConfigApplicationContext.getBean("userController"));
        System.out.println(annotationConfigApplicationContext.getBean("userService"));
        System.out.println(annotationConfigApplicationContext.getBean("userHandler"));
        System.out.println(annotationConfigApplicationContext.getBean("appconfig"));
    }


}
```

```
com.example.springbean.injectbean.method2.UserDao@90b489
com.example.springbean.injectbean.method2.UserController@1b06cab
com.example.springbean.injectbean.method2.UserService@b7fc54
com.example.springbean.injectbean.method2.UserHandler@1552bd3
com.example.springbean.injectbean.method2.Appconfig$$EnhancerBySpringCGLIB$$1b8c9d37@22fc4c
```



## 方法三

@Bean中的BeanName为**方法名**

这种方式适合无法再想要的类上标注注解，但是又想将该类注册到IOC容器中。多用于引入第三方类，如RestTemplate。可以再构造方法的时候传入自定义的值，和进行其他操作。

```java
package com.example.springbean.injectbean.method3;

public class Teacher {
}
```

```java
package com.example.springbean.injectbean.method3;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Appconfig {
    @Bean
    public Teacher teacher(){
        return new Teacher();
    }
}
```

```java
package com.example.springbean.injectbean.method3;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("teacher"));
    }
}
```

```
com.example.springbean.injectbean.method3.Teacher@4f701
```



## 方法四

FactoryBean的Name是getObject()返回的Bean，带&才是返回FactoryBean本身的Bean

getObject()用来返回要创建的Bean对象，getObjectType()返回对象的类型，isSingleton()返回对象的作用域。

```java
package com.example.springbean.injectbean.method4;

public class Monkey {
}
```

```java
package com.example.springbean.injectbean.method4;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.stereotype.Component;

@Component
public class MonkeyFactoryBean implements FactoryBean<Monkey> {
    @Override
    public Monkey getObject() throws Exception {
        return new Monkey();
    }

    @Override
    public Class<?> getObjectType() {
        return null;
    }

    @Override
    public boolean isSingleton() {
        return FactoryBean.super.isSingleton();
    }
}
```

```java
package com.example.springbean.injectbean.method4;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example.springbean.injectbean.method4")
public class Appconfig {
}
```

```java
package com.example.springbean.injectbean.method4;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("monkeyFactoryBean"));
        System.out.println(annotationConfigApplicationContext.getBean("&monkeyFactoryBean"));
    }
}
```

```
com.example.springbean.injectbean.method4.Monkey@22fc4c
com.example.springbean.injectbean.method4.MonkeyFactoryBean@d0a57
```

## 方法五

需要Bean的全限定名

```java
package com.example.springbean.injectbean.method5;


public class Dog {
}
```

```java
package com.example.springbean.injectbean.method5;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({Dog.class})
public class Appconfig {
}
```

```java
package com.example.springbean.injectbean.method5;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("com.example.springbean.injectbean.method5.Dog"));

    }
}
```

```
com.example.springbean.injectbean.method5.Dog@b19b79
```



## 方法六

把某个功能相关的类放到一起方便管理和维护

重写selectImports方法时，可以自定义Bean的实例化

```java
package com.example.springbean.injectbean.method6;


public class Zoo {
}
```

```java
package com.example.springbean.injectbean.method6;


public class School {
}
```

```java
package com.example.springbean.injectbean.method6;

import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;


public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{"com.example.springbean.injectbean.method6.School","com.example.springbean.injectbean.method6.zoo"};
    }
}
```

```java
package com.example.springbean.injectbean.method6;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(MyImportSelector.class)
public class Appconfig {
}
```

```java
package com.example.springbean.injectbean.method6;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("com.example.springbean.injectbean.method6.School"));
        System.out.println(annotationConfigApplicationContext.getBean("com.example.springbean.injectbean.method6.Zoo"));
    }
}
```

```
com.example.springbean.injectbean.method6.School@91d63f
com.example.springbean.injectbean.method6.Zoo@14342c2
```



## 方法七

和selectImports差不多，但是更加灵活，可以自定义BeanName和Scope。常用的OpenFeign就是采用了ImportBeanDefinitionRegistrar进行的Bean注册。**推荐这一种**。

```java
package com.example.springbean.injectbean.method7;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;

public class CustomImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        //可以自定义Bean的名称
        registry.registerBeanDefinition("school",new RootBeanDefinition(School.class));
        //可以自定义Bean的名称，作用域等参数
        RootBeanDefinition rootBeanDefinition = new RootBeanDefinition(Zoo.class);
        rootBeanDefinition.setScope(BeanDefinition.SCOPE_SINGLETON);
        registry.registerBeanDefinition("zoo",rootBeanDefinition);

    }


}
```

```java
package com.example.springbean.injectbean.method7;

import com.example.springbean.injectbean.method6.MyImportSelector;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(CustomImportBeanDefinitionRegistrar.class)
public class Appconfig {
}

```

```java
package com.example.springbean.injectbean.method7;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("zoo"));
        System.out.println(annotationConfigApplicationContext.getBean("school"));
    }
}

```

```
com.example.springbean.injectbean.method7.Zoo@92d9cc
com.example.springbean.injectbean.method7.School@1f32542
```

## 方法八

```java
package com.example.springbean.injectbean.method8;

public class Joker {
}
```

```java
package com.example.springbean.injectbean.method8;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.stereotype.Component;

@Component
public class CustomBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry beanDefinitionRegistry) throws BeansException {
        beanDefinitionRegistry.registerBeanDefinition("joker",new RootBeanDefinition(Joker.class));
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {

    }
}
```

```java
package com.example.springbean.injectbean.method8;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example.springbean.injectbean.method8")
public class Appconfig {
}
```

```java
package com.example.springbean.injectbean.method8;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("joker"));
    }
}
```

```
com.example.springbean.injectbean.method8.Joker@ee5251
```

## 方法九

与方法八类似

```java
package com.example.springbean.injectbean.method9;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.stereotype.Component;

@Component
public class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {
        DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory)configurableListableBeanFactory;
        beanFactory.registerBeanDefinition("joker",new RootBeanDefinition(Joker.class));
    }
}

```

```java
package com.example.springbean.injectbean.method9;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example.springbean.injectbean.method9")
public class Appconfig {
}
```

```java
package com.example.springbean.injectbean.method9;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Client {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(Appconfig.class);
        System.out.println(annotationConfigApplicationContext.getBean("joker"));
    }
}

```

```java
com.example.springbean.injectbean.method9.Joker@c77c7
```

## 小结

对于方法四到方法九，我们都是去实现了Spring的相关接口完成Bean的注册，这些方法虽然更复杂但是灵活新更高，可以去控制Bean的生成规则和相关参数。对于这些实现接口的类我们可以选择两种方式进行注册

* 方式一

```java
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{"com.example.springbean.injectbean.method6.School","com.example.springbean.injectbean.method6.zoo"};
    }
}    
```

```java
@Configuration
@Import(MyImportSelector.class)
public class Appconfig {
}
```

实现接口的类不写@Component注解，通过@Import注解注入到IOC容器

* 方式二

```java
package com.example.springbean.injectbean.method8;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.stereotype.Component;

@Component
public class CustomBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry beanDefinitionRegistry) throws BeansException {
        beanDefinitionRegistry.registerBeanDefinition("joker",new RootBeanDefinition(Joker.class));
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {

    }
}
```

```java
@Configuration
@ComponentScan("com.example.springbean.injectbean.method8")
public class Appconfig {
}
```

实现接口的类写@Component注解，通过@ComponentScan注解包扫描注入到IOC容器