---
title: 什么是SpringMVC
date: 2022-03-10
categories:
 - backEnd
tags:
 - SpringMVC
---

Spring MVC是Spring的一个后续产品，是Spring解决Web层面的一个子项目。



## MVC

**M:Model** 模型层，用来处理数据

* 一类是实体类Bean:专门存放业务数据
* 一类是业务处理Bean:指Service和Dao专门用于处理业务逻辑和数据访问

**V:View** 视图层，指的是项目中html或者jsp用于展示数据的页面

**C:Controller** 控制层，指的是项目中的Servlet，作用是请求与响应服务器

MVC的工作流程：

用户通过视图层发送请求至服务器，被服务器中的Controller接受，Controller调用Model层处理完数据返还给Controller，Controller再根据处理结果寻找合适的视图层。



## 三层架构

Spring MVC是Spring提供的为**表示层**开发的一套完整的方案

**表示层：**

**业务逻辑层：**

**数据访问层：**



## 特点

* 基于原生的Servlet，通过强大的**DispatcherServlet**,对请求和响应进行统一处理
* 内部组件化程度高，可插拔式即插即用
* 性能卓越
* Spring IOC容器等基础无缝对接



 ## 引入依赖

```xml
 <!-- SpringMVC -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.1</version>
        </dependency>
```

