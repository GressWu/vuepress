---
title: SpringMVC取值与返回值
date: 2022-04-02
categories:
 - BackEnd
tags:
 - SpringMVC
---


## 取值

### 通过占位符取值

```java
 @RequestMapping("/getvalue/{name}")
    public String getPathValue(@PathVariable String name){
        return name;
    }
```

### 通过Servlet取值

```java
  @RequestMapping("/getServlet")
    public String getHttpServlet(HttpServletRequest httpServletRequest){
        HttpSession session = httpServletRequest.getSession();
        System.out.println(session);
        String name = httpServletRequest.getParameter("name");
        return name;
    }
```

### 通过形参接收拼接参数

`localhost:8080/SpringMVC/dit?name=zhangsan&address=shanxi`

```java
 @RequestMapping("/dit")
    public String getDit(String name,String address){
        String result = name+" " + address;
        return result;
    }
```

### @RequestParam注解增强形参接收参数功能

value代表前端地址上实际拼接的参数名，required代表是否必输默认为true，defaultValue代表如果没值的默认值

`http://localhost:8080/SpringMVC/dit1?username=wangwu&address=shanxi`

这里虽然前端传的是username，但我们形参name还是成功接收到了值

```java
@RequestMapping("/dit1")
    public String getDit1(@RequestParam(value = "username",required = false,defaultValue = "lisi") String name, String address){
        String result = name+" " + address;
        return result;
    }
```

### @RequestHeader获取请求头的值

这三个参数与之前的`@RequestParam`参数是一致的，其中这个方法会帮助我们拿到该请求头的Host属性

```java
@RequestMapping("/header")
    public String getHeader(@RequestHeader(value = "Host",required = false,defaultValue = "8081") String host){
        return host;
    }
```

### 获取Cookie

```java
@RequestMapping("/cookie")
    public String getCooie(@CookieValue("JSESSIONID") String jessSessionId){
        return jessSessionId;
    }
```

### 获取POJO类

`http://localhost:8080/SpringMVC/entity?name=iii&address=shanxi`

```java
@RequestMapping("/entity")
    public User getPojo(User user){
        return user;
    }
```

### 传输Json

首先要在`DispatcherServlet`配置文件中加入该注解驱动

```xml
<!-- 开启MVC注解驱动-->
<mvc:annotation-driven />
```

只需很简单的加入`@RequestBody`注解即可很轻松的以Json形式接收参数

```java
@RequestMapping(value = "/aaa",method = RequestMethod.POST)
    public User responseUser(@RequestBody User user)  {
        System.out.println(user);
        return user;
    }
```

### 利用`RequestEntity<T>`获取请求头与请求体

其中泛型参数T代表了请求体的类型

```java
@RequestMapping(value = "/requestEntity",method = RequestMethod.POST)
    public String requestCon(RequestEntity<String>  request){
       //输出该请求的请求头信息
       request.getHeaders().forEach((k,v)->{
            System.out.println(k+"   "+v);
        });
		//返回请求体信息
        return request.getBody();
    }
```



## 返回值

### 视图与信息

Spring MVC如果类上的注解为`@Controller`，**默认**接收到的值为视图名称。如下方所示，当控制器接收到了参数进行了一系列业务操作后跳转至template中的index.html首页

```java
@RequestMapping(value = "/request",method = RequestMethod.POST)
    public String requestCon(String  request){
       //request进行了若干操作
        return "index";
    }
```

我们现在也有两种方式可以让控制器返回我们信息而不是视图，这样更符合我们现在前后端分离

* 原生返回

```java
 @RequestMapping(value = "/responseEntity",method = RequestMethod.POST)
    public void responseCon(HttpServletResponse response) throws IOException {
        response.getWriter().println("直接返回值");
    }
```

* SpringMVC注解形式
  * 将注解`@Controller`变为`@RestController`
  * 在相应方法上加`@ResponseBody`注解

### `ResponseEntity<T>`返回响应头响应体

这个方法可以让我们根据泛型参数T定义响应体数据类型，并且可以定义响应头与HTTP状态码

```java
public ResponseEntity(@Nullable T body, @Nullable MultiValueMap<String, String> headers, HttpStatus status) {
        super(body, headers);
        Assert.notNull(status, "HttpStatus must not be null");
        this.status = status;
    }
```



## Restuful风格

### 什么是Restful风格

RESTFUL是一种网络应用程序的设计风格和开发方式，基于[HTTP](https://baike.baidu.com/item/HTTP/243074)，可以使用[XML](https://baike.baidu.com/item/XML/86251)格式定义或[JSON](https://baike.baidu.com/item/JSON/2462549)格式定义。RESTFUL适用于移动互联网厂商作为业务接口的场景，实现第三方[OTT](https://baike.baidu.com/item/OTT/9960940)调用移动网络资源的功能，动作类型为新增、变更、删除所调用资源。

### Restful风格特点

RESTFUL特点包括：

1、每一个URI代表1种资源；

2、客户端使用GET、POST、PUT、DELETE4个表示操作方式的动词对服务端资源进行操作：GET用来获取资源，POST用来新建资源（也可以用于更新资源），PUT用来更新资源，DELETE用来删除资源；

3、通过操作资源的表现形式来操作资源；

4、资源的表现形式是XML或者HTML；

5、客户端与服务端之间的交互在请求之间是无状态的，从客户端到服务端的每个请求都必须包含理解请求所必需的信息。

### 举例说明

| 普通请求            | RestFul风格     | 用途                         |
| ------------------- | --------------- | ---------------------------- |
| getAllZoo           | GET/zoos        | 列出所有动物园               |
| createAZoo          | POST/zoos       | 新建一个动物园               |
| getTheZooById?zooId | GET/zoos/:id    | 获取某个指定动物园的信息     |
| updateTheZooById?Id | PUT/zoos/:id    | 更新某个指定动物园的全部信息 |
| deleteZooById?Id    | DELETE/zoos/:id | 删除某个指定动物园的全部信息 |

请求 = 动词 + 宾语

动词 使用五种 HTTP 方法，对应 CRUD 操作。

宾语 URL 应该全部使用名词复数，可以有例外，比如搜索可以使用更加直观的 search 。

过滤信息（Filtering） 如果记录数量很多，API应该提供参数，过滤返回结果。 ?limit=10 指定返回记录的数量 ?offset=10 指定返回记录的开始位置。

### SpringMVC实现Restful风格接口过滤器源码分析

1. 在`web.xml`中配置过滤器

```xml
 <filter>
        <filter-name>HiddenHttpMethodFilter</filter-name>
        <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>HiddenHttpMethodFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```

2. 源码分析

```java
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        HttpServletRequest requestToUse = request;
        if ("POST".equals(request.getMethod()) && request.getAttribute("javax.servlet.error.exception") == null) {
            String paramValue = request.getParameter(this.methodParam);
            if (StringUtils.hasLength(paramValue)) {
                String method = paramValue.toUpperCase(Locale.ENGLISH);
                if (ALLOWED_METHODS.contains(method)) {
                    requestToUse = new HiddenHttpMethodFilter.HttpMethodRequestWrapper(request, method);
                }
            }
        }

        filterChain.doFilter((ServletRequest)requestToUse, response);
    }

    static {
        ALLOWED_METHODS = Collections.unmodifiableList(Arrays.asList(HttpMethod.PUT.name(), HttpMethod.DELETE.name(), HttpMethod.PATCH.name()));
    }
```

通过源码分析我们可以看到`HiddenHttpMethodFilter`类`doFilterInternal`方法进行了一个过滤操作，如果我们的请求类型为Post类型且method的名字包括`PUT DELETE PATCH`那么就进行放行，从而说明这三种请求类型本质上其实就是`Post`请求

### Restful风格增删改查格式

```java
package com.yuwei.mvc.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestfulController {
    /**
     * 获取所有动物园信息
     * @return
     */
    @RequestMapping(value = "/zoos",method = RequestMethod.GET)
    public String getZoos() {
        return "success";
    }

    /**
     * 创建动物园信息
     * @return
     */
    @RequestMapping(value = "/zoos",method = RequestMethod.POST)
    public String createZoos(){
        return "success";
    }

    /**
     * 通过Id获取具体动物园信息
     * @param id
     * @return
     */
    @RequestMapping(value = "/zoos/{id}",method = RequestMethod.POST)
    public String getTheZooById(@PathVariable String id){
        return "success";
    }

    /**
     * 通过Id更新动物园信息
     * @param id
     * @return
     */
    @RequestMapping(value = "/zoos/{id}",method = RequestMethod.PUT)
    public String updateTheZooById(@PathVariable String id){
        return "success";
    }


    /**
     * 通过Id删除动物园信息
     * @param id
     * @return
     */
    @RequestMapping(value = "/zoos/{id}",method = RequestMethod.DELETE)
    public String deleteTheZooById(@PathVariable String id){
        return "success";
    }

}

```

## @RequestMapping衍生注解

`@GetMapping`

`@PostMapping`

`@PutMapping`

`@DeleteMapping`

这四个注解是`@RequestMapping`的衍生注解，使用起来和`@RequestMapping`没有区别只是直接限定了method

