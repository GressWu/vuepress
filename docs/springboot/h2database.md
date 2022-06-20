---
title: SpringBoot h2数据库的使用
date: 2022-06-20
categories:
 - backEnd
tags:
 - springBoot
---


## 么是H2数据库

H2数据库是一个开源的关系型数据库。

H2是一个采用java语言编写的嵌入式数据库引擎，只是一个类库（即只有一个 jar 文件），可以直接嵌入到应用项目中，不受平台的限制。**内存数据库，数据库重启后数据将不复存在。**

**应用场景：**

* 可以同应用程序打包在一起发布，可以非常方便地存储少量结构化数据
* 可用于单元测试
* 可以用作缓存，即当做内存数据库

**H2的产品优势：**

* 纯Java编写，不受平台的限制；
* 只有一个jar文件，适合作为嵌入式数据库使用；
* h2提供了一个十分方便的web控制台用于操作和管理数据库内容；
* 功能完整，支持标准SQL和JDBC。麻雀虽小五脏俱全；
* 支持内嵌模式、服务器模式和集群。

## 所需依赖

导入H2数据库依赖

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>
```

导入JPA，JPA即可为自动生成数据库表。当然可以采取其他数据库框架，比如MyBatis，MyBatis_Plus等框架。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

## H2数据库控制台桌面

配置文件中将H2控制台开启，并进行相关其他配置

```properties
spring.h2.console.enabled=true
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

访问http://localhost:8082/h2-console，即可登录H2数据库控制台界面

![image-20220620144922933](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220620144922933.png)

与其他数据库编辑软件一致，可以进行相关操作。



## 配置数据

### 通过JPA注解生成数据表(无数据)

```java
package com.yuwei.entity;

import javax.persistence.Entity;

@Entity
public class Product {

    @javax.persistence.Id
    private String Id;

    private String name;
}

```

### 通过data.sql生成数据表及数据(推荐)

![image-20220620150705367](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220620150705367.png)

```sql
DROP TABLE IF EXISTS billionaires;



CREATE TABLE billionaires (

 first_name VARCHAR(250) NOT NULL,

 last_name VARCHAR(250) NOT NULL,

 career VARCHAR(250) DEFAULT NULL

);



INSERT INTO billionaires (first_name, last_name, career) VALUES

('Aliko', 'Dangote', 'Billionaire Industrialist'),

('Bill', 'Gates', 'Billionaire Tech Entrepreneur'),

('Folrunsho', 'Alakija', 'Billionaire Oil Magnate');


```

**数据库查询**

![image-20220620150746798](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220620150746798.png)

