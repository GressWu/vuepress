---
title: SpringBoot读取配置文件的五种方式
date: 2022-03-27
categories:
 - backEnd
tags:
 - springBoot
---

## 配置文件

* SpringBoot默认配置文件`application.yml`

```yml
spring:
  mvc:
    static-path-pattern: /res/**
    hiddenmethod:
      filter:
        enabled: true

server:
  port: 8089

user:
  name: 张三
  age: 18
  email: 8080@qq.com
```

* 自定义配置文件`yuwei.properties`

```properties
user1.name = wangwu
user1.age = 19
user1.email= 2343@qq.com
```

## 注解@Value

最简单，但需要一个个获取。取值的时候SqEL表达式

```java
@Value("${server.port}")
    public String port;
    
@GetMapping("/value")
    public String getPort(){
        return port;
    }
```

```
输出结果：8089
```

## 注解@ConfigurationProperties

获取的属性多，把properties配置文件转换为bean来使用，需要配合**prefix**属性

```java
package com.yuwwei.springbootweb.controller;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "user")
public class UserParam {
    private String name;

    private int age;

    private String email;

}

```

```java
@Autowired
    UserParam userParam;
    
@GetMapping("/configurationProperties")
    public UserParam getConfigurationProperties(){
        return userParam;
    }
```

```
输出结果:{"name":"张三","age":18,"email":"8080@qq.com"}
```

## 注解@PropertySource+@Value

除application.yml之外，自定义的其他配置文件，但是默认只支持加载自己的`*.properties`。若要支持yml，需要做额外的编码。

```java
package com.yuwwei.springbootweb.controller;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@Data
@PropertySource(value = "classpath:yuwei.properties")
public class UserParam01 {

    @Value("${user1.name}")
    private String name;
    @Value("${user1.age}")
    private int age;
    @Value("${user1.email}")
    private String email;

}

```

```java
 @Autowired
    UserParam01 userParam01;
 @GetMapping("/propertySourceandvalue")
    public UserParam01 getPropertySource(){
        return userParam01;
    }
```

```
输出结果：{"name":"wangwu","age":19,"email":"2343@qq.com"}
```



## 注解@PropertySource+@ConfigurationProperties

除application.yml之外，自定义的其他配置文件，但是默认只支持加载自己的`*.properties`。若要支持yml，需要做额外的编码。

```java
package com.yuwwei.springbootweb.controller;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource(value = "classpath:yuwei.properties")
@ConfigurationProperties(prefix = "user1")
@Data
public class UserParam02 {
    private String name;

    private int age;

    private String email;
}

```

```java
@Autowired
    UserParam02 userParam02;
@GetMapping("/propertySourceandconfigurationProperties")
    public UserParam02 getPropertySourceAndCon(){
        return userParam02;
```

```
输出结果：{"name":"wangwu","age":19,"email":"2343@qq.com"}
```



## Environment的getProperty方法获取

获取application.yml的配置文件数据

```java
@Autowired
    Environment env;
@GetMapping("/environment")
    public String getEnvironment(){
        return env.getProperty("server.port");
    }
```

```
输出结果：8089
```

