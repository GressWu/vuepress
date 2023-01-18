---
title: Cookie
date: 2023-01-18
categories:
- Internet
tags:
- internet
---

Cookie是由一组请求和响应组成，是围绕着**一件相关事情**所进行的请求与响应。这些请求与响应之间一定需要数据传递，需要记录会话状态跟踪的。

但是HTTP协议是一种无状态协议，在不同的请求间无法传递数据。此时需要一种技术来记录当前的状态，这种技术就叫做Cookie。

Cookie是由**服务端生成**，保存在客户端的一种信息载体。只要Cookie没有失效，没有被清空，那么保存在其中的会话状态就有效。

用户第一次提交请求后，由服务器生成Cookie，并将其封装到响应头中，以响应的形式返还给客户端。客户端接收到响应，将Cookie保存到客户端。当客户端在**发送同类请求**后，在请求中会携带Cookie，发送到服务端。

## JavaEE中的Cookie

### 设置Cookie

* 设置Cookie与过期时间

```java
package com.example.springbootact.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class CookieController {


    @RequestMapping("/set/cookie")
    public void setCookie(HttpServletResponse response){
        //构造方法创建Cookie key,value形式
        Cookie cookie = new Cookie("name", "wangwu");
        //设置过期时间 正值代表有多少秒 负值代表关闭浏览器默认失效 0代表立刻失效
        cookie.setMaxAge(60);
        response.addCookie(cookie);
    }
}

```

重点：

**同类请求指的是资源路径相同的请求**

例如：`http://localhost:8080/set/cookie`

`http://localhost:8080/set`就是他的资源路径  `/cookie`就是他的资源名称

只要访问资源路径开头的url，那么该请求访问客户端的时候都会带Cookie



![image-20230117153848433](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230117153848433.png)

浏览器第一次访问服务端接口，服务端返回Cookie到客户端。

![image-20230117154149518](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230117154149518.png)

客户端访问资源路径下的地址，不管有没资源都会直接携带Cookie与服务端交互。

* 如果想要更改路径，设置全局携带Cookie可以这样做

```java
package com.example.springbootact.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class CookieController {


    @RequestMapping("/set/cookie")
    public void setCookie(HttpServletRequest request, HttpServletResponse response){
        //构造方法创建Cookie key,value形式
        Cookie cookie = new Cookie("name", "wangwu");
        //设置过期时间 正值代表有多少秒 负值代表关闭浏览器默认失效 0代表立刻失效
        cookie.setMaxAge(60);
        //设置Cookie绑定的路径
        System.out.println(request.getContextPath());
        cookie.setPath(request.getContextPath()+"/");
        response.addCookie(cookie);
    }
}
```

### 使用Cookie

#### JavaEE处理Cookie

```java
package com.example.springbootact.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class CookieController {


    @RequestMapping("/set/cookie")
    public void setCookie(HttpServletRequest request, HttpServletResponse response){
        //构造方法创建Cookie key,value形式
        Cookie cookie = new Cookie("name", "wangwu");
        //设置过期时间 正值代表有多少秒 负值代表关闭浏览器默认失效 0代表立刻失效
        cookie.setMaxAge(60);
        //设置Cookie绑定的路径
        System.out.println(request.getContextPath());
        cookie.setPath(request.getContextPath()+"/");
        response.addCookie(cookie);
    }


    @RequestMapping("/get/cookie")
    public void getCookie(HttpServletRequest request, HttpServletResponse response){

        //获取Cookie
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            System.out.println("key:"+cookie.getName()+"  value:"+cookie.getValue());
            if("wangwu".equals(cookie.getValue())){
                
            }else {
                
            }
        }
    }
}
```

```
key:name  value:wangwu
```

#### SpringMVC 注解处理Cookie

在`@CookieValue("")`把Cookie的Key值填进去可以直接获得Cookie的Value值

```
@RequestMapping("/get/cookie")
public void getCookie(@CookieValue("name") String name){
    //获取Cookie key为name的value值
    System.out.println(name);
}
```