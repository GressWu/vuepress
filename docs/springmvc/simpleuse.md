---
title: SpringMVC简单使用
date: 2022-03-14
categories:
 - backEnd
tags:
 - SpringMVC
---

## 项目结构

![image-20220314220943929](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220314220943929.png)

1. web.xml配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- 配置SpringMVC的前端控制器，对浏览器发送的请求统一进行处理 -->
    <servlet>
        <servlet-name>SpringMVC</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!-- 使用classpath:表示从类路径查找配置文件，例如maven工程中的
        src/main/resources -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springMVC.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--
    设置springMVC的核心控制器所能处理的请求的请求路径
    /所匹配的请求可以是/login或.html或.js或.css方式的请求路径
    但是/不能匹配.jsp请求路径的请求
    -->
    <servlet-mapping>
        <servlet-name>SpringMVC</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!--    路径为/的路径采用DispatcherServlet控制器-->
</web-app>
```

2. springMVC配置文件

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
    <!--    设置包扫描路径-->
    <context:component-scan base-package="com.yuwei.mvc.controller"></context:component-scan>
    <bean id="viewResolver"
          class="org.thymeleaf.spring5.view.ThymeleafViewResolver">
    <property name="order" value="1"/>
    <property name="characterEncoding" value="UTF-8"/>
    <property name="templateEngine">
    <bean class="org.thymeleaf.spring5.SpringTemplateEngine">
        <property name="templateResolver">
            <bean
                    class="org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver">
                <!-- 视图前缀 对应了前端资源的路径-->
                <property name="prefix" value="/WEB-INF/templates/"/>
                <!-- 视图后缀 以什么为结尾-->
                <property name="suffix" value=".html"/>
                <property name="templateMode" value="HTML5"/>
                <property name="characterEncoding" value="UTF-8" />
            </bean>
        </property>
    </bean>
    </property>
    </bean>

</beans>
```

3. controller

```java
package com.yuwei.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 */
@Controller
public class HelloController {

    @RequestMapping( "/")
    public String index(){
        //返回视图名称，打开index.html页面
        return "index";
    }
}

```

## 过程

客户端发送请求，若请求满足前端控制器的url-pattern，该请求就会被前端控制器DisPatcherServlet处理。前端控制器会读取SpringMVC的核心配置文件，通过扫描组件找到控制器（带@Controller的类），将请求地址中和控制器中的@RequestMapping注解的value属性进行匹配，若匹配成功该注解所表示的控制器方法就是处理请求的方法。

处理请求的方法会返回一个Json数据；或者返回一个字符串类型的视图名称，该视图的名称会被视图解析器解析，加上前缀和后缀组成视图路径，经过模板引擎最后渲染出页面。