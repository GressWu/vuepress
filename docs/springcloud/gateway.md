---
title: SpringCloud GateWay
date: 2023-02-07
categories:
- BackEnd
tags:
- springCloud
---

## 什么是网关

是系统**对外的唯一入口**。`API`网关封装了系统内部架构，为每个客户端提供定制的API。 近几年来移动应用与企业间互联需求的兴起。从以前单一的Web应用，扩展到多种使用场景，且每种使用场景对后台服务的要求都不尽相同。 这不仅增加了后台服务的响应量，还增加了后台服务的复杂性。随着微服务架构概念的提出，API网关成为了微服务架构的一个标配组件。

## 为什么要使用网关

微服务的应用可能部署在不同机房，不同地区，不同域名下。此时客户端（浏览器/手机/软件工具）想 要请求对应的服务，都需要知道机器的具体 IP 或者域名 URL，当微服务实例众多时，这是非常难以记忆的，对 于客户端来说也太复杂难以维护。**此时就有了网关，客户端相关的请求直接发送到网关**，**由网关根据请求标识 解析判断出具体的微服务地址**，再把请求转发到微服务实例。这其中的记忆功能就全部交由网关来操作了。

## 核心概念

`路由（Route）`：路由是网关最基础的部分，路由信息由 ID、目标 URI、一组断言和一组过滤器组成。如果断言 路由为真，则说明请求的 URI 和配置匹配。
`断言（Predicate）`：Java8 中的断言函数。Spring Cloud Gateway 中的断言函数输入类型是 Spring 5.0 框架中 的 ServerWebExchange。Spring Cloud Gateway 中的断言函数允许开发者去定义匹配来自于 Http Request 中的任 何信息，比如请求头和参数等。
`过滤器（Filter）`：一个标准的 Spring Web Filter。Spring Cloud Gateway 中的 Filter 分为两种类型，分别是 Gateway Filter 和 Global Filter。过滤器将会对请求和响应进行处理。



## 搭建网关

### 创建项目

![image-20230207201007926](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230207201007926.png)

### pom文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.ruoyi</groupId>
        <artifactId>ruoyi</artifactId>
        <version>3.6.1</version>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>gateway-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>gateway-demo</name>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
    </dependencies>


</project>

```

### 配置文件

```java
# Tomcat
server:
  port: 8083

# Spring
spring:
  application:
    name: gateway-demo
  profiles:
    active: dev
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=1
```

* 这个路由中，`filters` `StripPrefix`表示隐藏`predicates path` 前面一位前缀，controller虽然不用写`/system`,但你访问具体接口的时候需要带上这个前缀。

![image-20230207211308389](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230207211308389.png)

例如：这个接口调用时要使用 /system/list才能调用到。直接使用/list是访问不到的。

* uri:代表调用前缀为/system/的接口，会访问http://localhost:9201/的接口

例如：访问`http://localhost:8083/system/config/list`网关

实际上网关转发调用的应该是System模块`http://localhost:9201/config/list`

### 启动类

```java
package com.example.gatewaydemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayDemoApplication.class, args);
    }

}
```

## 路由规则

`Spring Cloud Gateway`创建`Route`对象时， 使用`RoutePredicateFactory`创建`Predicate`对象，`Predicate`对象可以赋值给`Route`。

- `Spring Cloud Gateway`包含许多内置的`Route Predicate Factories`。
- 所有这些断言都匹配 HTTP 请求的不同属性。
- 多个`Route Predicate Factories`可以通过逻辑与`（and）`结合起来一起使用。

路由断言工厂`RoutePredicateFactory`包含的主要实现类如图所示，包括`Datetime`、请求的远端地址、路由权重、请求头、Host 地址、请求方法、请求路径和请求参数等类型的路由断言。

### Datetime

匹配日期时间之后发生的请求

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - After=2021-02-23T14:20:00.000+08:00[Asia/Shanghai]
```

在2021年2月23日之后，才可通过网关访问uri

### Cookie

匹配指定名称且其值与正则表达式匹配的`cookie`

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Cookie=loginname, ruoyi
```

测试 `curl http://localhost:8080/system/config/1 --cookie "loginname=ruoyi"`

必须是要带有 Cookie 为 `loginname=ruoyi` 的请求才能访问uri

### Header

匹配具有指定名称的请求头，`\d+`值匹配正则表达式

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Header=X-Request-Id, \d+
```

必须是请求头带有 X-Request-Id 且该值为数字的请求才能够访问uri

### Host

匹配主机名的列表

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Host=**.somehost.org,**.anotherhost.org
```

### Method

匹配请求methods的参数，它是一个或多个参数

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Method=GET,POST
```

必须是Get或者是post请求

### Path

匹配请求路径

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Path=/system/**
```

必须是/system/的才能访问uri

### Query

匹配查询参数

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - Query=username, abc.
```

### RemoteAddr

匹配IP地址和子网掩码

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system
          uri: http://localhost:9201/
          predicates:
            - RemoteAddr=192.168.10.1/0
```

### Weight

匹配权重

```yml
spring: 
  application:
    name: ruoyi-gateway
  cloud:
    gateway:
      routes:
        - id: ruoyi-system-a
          uri: http://localhost:9201/
          predicates:
            - Weight=group1, 8
        - id: ruoyi-system-b
          uri: http://localhost:9208/
          predicates:
            - Weight=group1, 2
```

发送十次请求，8次访问`http://localhost:9201/`，2次访问`http://localhost:9208/`

## 路由配置

在`spring cloud gateway`中配置`uri`有三种方式，包括

- websocket配置方式

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: ruoyi-api
          uri: ws://localhost:9090/
          predicates:
            - Path=/api/**
```

- http地址配置方式

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: ruoyi-api
          uri: http://localhost:9090/
          predicates:
            - Path=/api/**
```

- 注册中心配置方式

```yml
spring:
  cloud:
    gateway:
      routes:
        - id: ruoyi-api
          uri: lb://ruoyi-system
          predicates:
            - Path=/api/**
```

我们一般选择第三种配置，通过application name在配置中心找ruoyi-system的服务

![image-20230208202426510](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230208202426510.png)

注意：如果通过网关访问出现503的情况，可以尝试引入下面的依赖

```xml
 <!--客户端负载均衡loadbalancer-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        </dependency>
```

## 限流

顾名思义，限流就是限制流量

1、添加依赖

```xml
<!-- spring data redis reactive 依赖 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```

2、限流规则，根据`URI`限流

```yml
spring:
  redis:
    host: localhost
    port: 6379
    password: 
  cloud:
    gateway:
      routes:
        # 系统模块
        - id: ruoyi-system
          uri: lb://ruoyi-system
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 1 # 令牌桶每秒填充速率
                redis-rate-limiter.burstCapacity: 2 # 令牌桶总容量
                key-resolver: "#{@pathKeyResolver}" # 使用 SpEL 表达式按名称引用 bean
```

pathKeyResolver为Bean的名称

3、添加配置类

```java
package com.ruoyi.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

/**
 * 限流规则配置类
 */
@Configuration
public class KeyResolverConfiguration
{
    @Bean
    public KeyResolver pathKeyResolver()
    {
        return exchange -> Mono.just(exchange.getRequest().getURI().getPath());
    }
}
```

还可以通过IP和参数进行限流

## 解决跨域

```yml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOriginPatterns: "*"
            allowed-methods: "*"
            allowed-headers: "*"
            allow-credentials: true
            exposedHeaders: "Content-Disposition,Content-Type,Cache-Control"
```

其他方法，还可以通过ngnix配置解决跨域问题。

还有后端去解决跨域，[SpringBoot解决跨域问题 | 月牙弯弯](http://112.124.58.32/springboot/crossorgin.html)。

## 黑名单配置

就是不能访问的地址。实现自定义过滤器`BlackListUrlFilter`，需要配置黑名单地址列表`blacklistUrl`，当然有其他需求也可以实现自定义规则的过滤器。

```yml
spring:
  cloud:
    gateway:
      routes:
        # 系统模块
        - id: ruoyi-system
          uri: lb://ruoyi-system
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=1
            - name: BlackListUrlFilter
              args:
                blacklistUrl:
                - /user/list
```

和之前限流一样，也需要写name相对应的Spring Bean组件 `BlackListUrlFilter`组件