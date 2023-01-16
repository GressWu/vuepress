---
title: Servlet容器与组件
date: 2023-01-16
categories:
- BackEnd
tags:
- Java
- Servlet
---

## JavaEE标准

规定了**容器和组件**

我们编写的代码就是组件，可以放到任意一个容器中跑

容器就是大的服务商编写的程序，支持高并发和各种安全性，比如Tomcat、Jetty

### 结构

浏览器 --> web服务器-->应用服务器-->数据库服务器

早期版本 web服务器是由java返回的Jsp，然后再交给浏览器渲染

后期当JavaScript ajax技术出现后，后端不需要再返回页面，只需要进行数据处理即可

### Tomcat

tomcat是Servlet容器的一种，每一个线程调用一个servlet，由于servlet无状态因此它是安全的。无论请求了多少次同一方法他们调用的servlet线程只有一个，每一次请求都会在线程中有各自独立的线程栈去存储自己的变量，因此每一次请求也是安全的。

### Servlet容器特点

* 装载

开发人员编写的Servlet组件并不能在服务器上直接运行，必须依赖于容器。

容器正常启动后再装载开发的Servlet代码中的业务逻辑，对外提供网络服务能力。容器装载Servlet组件的过程我们称之为**部署**。

容器根据javaee标准通过配置文件，加载各个组件。容器监听服务器的一个端口，接受网络请求，解析封装成符合Servlet标准的请求对象，转给特定的Servlet实例，实现业务逻辑。最终再将Servlet的返回值通过端口发送给客户端，完成完整的**网络请求-响应过程**。

* 隔离

隔离应用系统（我们开发的系统）与外部环境（操作系统环境、物理网络、通信协议）

1. 为业务逻辑实现屏蔽了复杂的外部环境差异性
2. 基于标准规范的容器产品，可以使应用程序无缝迁移
3. 容器产品与业务功能无关，一个容器可以支持任意多的应用系统
4. 容器可以实现与业务无关的通用技术处理：比如协议解析，对象转换，生命周期管理等等
5. 可以对资源进行统一管理

* 实现

Servlet并不是一个技术组件，而是一套标准。它包含了多个组件个技术要求。

业务功能的代码依赖Servlet标准规范中是接口。

## Servlet标准核心类

### 静态结构

![微信图片_20230116164842](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230116164842.png)

#### Servlet条线

上图中最右侧的部分，根源是**Servlet**接口，它内部可以获取**ServletConfig**，进而可以获取**ServletContext**（在一个应用系统中以单例的情况出现）。

**GenericServlet**是一个抽象类，同时实现Servlet接口和ServletConfig接口，它的目的是提供一个方便的组合基类；

**HttpServlet**也是一个抽象类，它继承GenericServlet，针对Http协议进行处理。

最下面是开发人员编写的具体业务子类MyServlet。

#### Filter条线

上图中最左侧的部分，Filter的继承体系与Servlet几乎相同

用于实现类似于AOP的功能，拦截验权。

#### 请求条线

上图中中间的部分，Servlet标准是基于**请求-响应模型**进行业务处理的。容器接收到一次网络请求，就会生成两个成对的对象**:Request和Response**。其中Request对象封装了请求的所有数据，而Response对象就用来封装需要返回给客户端的所有信息。

我们可以看到，Servlet条线和Filter条线几乎都依赖Request和Response对象，其实就是Servlet和Filter的主要逻辑处理方法的入参都是这两个对象。可以简单的认为，整个Servlet标准，包括其他类，在运行层面，就是围绕这两个对象进行处理。

同样的，请求-响应接口继承体系也分成两层：基本标准接口与Http层接口。对也业务功能开发人员来讲，几乎不会在这个条线下继承这些接口创建具体业务子类。

#### 全局上下文

这个条线只有一个接口：**ServletContext**，它代表了一个Java Web应用系统的全局上下文，具体实现类由Servlet容器提供。在一个JVM中，它以**单例的形式**存在的。我们可以通过这个去获取一些全局配置的东西。

#### 可以借鉴的设计

**接口功能单一**

例如Servlet接口仅仅提供功能，ServletConfig接口提供配置相关功能。GenericServlet抽象类同时实现两个

接口。业务人员仅仅需要继承抽象类，完成业务编写即可。

### 动态请求数据流向

![微信图片_20230116170913](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230116170913.png)



1. Servlet容器产品（如：Tomcat）,又称为Java Web中间件，负责监听服务端的端口，接收特定协议（如：HTTP）的网络请求。

2. 容器将每次请求都会封装成一对HttpServletRequest和HttpServletRespose对象，同时绑定会话对象。

3. Request对象和Response对象成对向后传递，根据URL匹配到一个Filter链，按照顺序经过0到多个Filter的doFilter方法依次进行处理。

4. 根据URL匹配到最多一个Servlet对象，Request对象和Response对象成对交给Servlet对象的service方法进行处理。

5. Servlet对象从Request对象中获取客户端发送的数据，并将相应数据写到Response对象中。

6. 最后，Servlet容器将Response对象转换为Http相应报文，发送给客户端，完成一次请求响应。

