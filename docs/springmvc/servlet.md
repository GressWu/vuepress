---
title: Servlet简介
date: 2022-03-10
categories:
 - BackEnd
tags:
 - SpringMVC
---

## 什么是Servlet

Servlet（Server Applet）是[Java](https://baike.baidu.com/item/Java/85979) Servlet的简称，称为小服务程序或服务连接器，用Java编写的[服务器](https://baike.baidu.com/item/服务器/100571)端程序，具有独立于平台和[协议](https://baike.baidu.com/item/协议/13020269)的特性，主要功能在于交互式地浏览和生成数据，生成动态[Web](https://baike.baidu.com/item/Web/150564)内容。

## web服务器与Servlet

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190704233303749.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h6azE1NjIxMTA2OTI=,size_16,color_FFFFFF,t_70)

类似于Tomcat这种符合Servlet规范的web应用动态服务器，一般拥有Http服务器和Servlet容器。

其中Http服务器用来接收用户发来的Http请求与返回处理过的响应数据。servlet容器用来保存各种各样的Servlet处理过的Http数据，并给后端程序开放servlet接口。servlet容器介于Http服务器与后端服务之间。

## Servlet接口

servlet接口默认有五个方法，如下：

```java
    public void init(ServletConfig config) throws ServletException;
    
    public ServletConfig getServletConfig();

	 public void service(ServletRequest req, ServletResponse res)
	throws ServletException, IOException;
	
	 public String getServletInfo();
	 
	 public void destroy();
```

servlet生命周期：

1. 初始化时调用init()方法，他只在第一次创建Servlet时被调用。
2. service()方法是执行实际任务的主要方法，Servlet 容器（即 Web 服务器）调用 service() 方法来处理来自客户端（浏览器）的请求，并把格式化的响应写回给客户端。
3. servlet销毁前调用destory()方法，该方法可以做一些关闭连接的操作。
4. 最后，servlet是由JVM的垃圾回收器进行回收

![img](https://img-blog.csdn.net/20160331192521134?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

其中HttpServlet中声明了doGet()、doPost()等方法，对于service()方法他是在这里处理了doGet()与doPost()方法。

## 实现

```java
package com;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name="Servlet",urlPatterns="/Servlet")
public class Test22 extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
    	
    }
	
	@Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
    	
    }


}


```

