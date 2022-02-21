---
title: 注解@Component与@Bean的区别
date: 2022-02-20
categories:
 - backEnd
tags:
 - Java
 - spring
 - interview
---

## 相同点

都可以为Spring容器注册Bean对象

## 不同点

1. 作用对象不同

@Component注解作用于类上

@Bean注解作用于于方法上

2. 使用方法不同

@Component直接标注在类上声明即可

@Bean需要在**配置类**中使用，即类上面要加上@Configuration注解，然后在配置类中使用一个方法来自定义Bean是如何创建的

```java
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {

    @Bean
    //该方法返回的对象将注入到Spring容器中
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}

```

```java
package com.example.demo.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RestTest {
    @Autowired
    RestTemplate restTemplate;
}
```

3. 实现不同

@Component通常通过类路径扫描或者自动装配到Spring容器中(使用@ComponentScan可以指定要扫描的路径)

@Bean注解是在标有@Configuration注解类下的通过自定义方法产生的Bean，默认情况下方法名将作为Bean的Id与Name

4. 灵活性不同

@Bean比@Component注解更加灵活，我们可以按需注册Bean，尤其是我们要引用第三方库中的类需要装配到Spring容器中，我们无法直接在源代码上增加@Component注解，那么我们就可以通过@Bean方法完成Bean的注册。