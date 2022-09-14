---
title: RestTemplate
date: 2022-02-12
categories:
 - BackEnd
 - Internet
tags:
 - Java
 - internet
---

RestTemplete是一个同步Web Http客户端请求模板工具

## 常用API

| Method group      | Description                                                  |
| :---------------- | :----------------------------------------------------------- |
| `getForObject`    | Retrieves a representation via GET.                          |
| `getForEntity`    | Retrieves a `ResponseEntity` (that is, status, headers, and body) by using GET. |
| `headForHeaders`  | Retrieves all headers for a resource by using HEAD.          |
| `postForLocation` | Creates a new resource by using POST and returns the `Location` header from the response. |
| `postForObject`   | Creates a new resource by using POST and returns the representation from the response. |
| `postForEntity`   | Creates a new resource by using POST and returns the representation from the response. |
| `put`             | Creates or updates a resource by using PUT.                  |
| `patchForObject`  | Updates a resource by using PATCH and returns the representation from the response. Note that the JDK `HttpURLConnection` does not support `PATCH`, but Apache HttpComponents and others do. |
| `delete`          | Deletes the resources at the specified URI by using DELETE.  |
| `optionsForAllow` | Retrieves allowed HTTP methods for a resource by using ALLOW. |
| `exchange`        | More generalized (and less opinionated) version of the preceding methods that provides extra flexibility when needed. It accepts a `RequestEntity` (including HTTP method, URL, headers, and body as input) and returns a `ResponseEntity`.These methods allow the use of `ParameterizedTypeReference` instead of `Class` to specify a response type with generics. |
| `execute`         | The most generalized way to perform a request, with full control over request preparation and response extraction through callback interfaces. |

## 初始化

常见的Http客户端工具有

* JDK HttpURLConnenction
* Apache HttpComponents
* Okttp
* Netty

而RestTemplete都是基于以上客户端工具的进一步封装



**初始化**：

* 默认构造器使用的是java.net.HttpURLConnection

```java
RestTemplate restTemplate = new RestTemplate();
```

* 可以在构造器中创建实现ClientHttpRequestFactory接口的实现类

![image-20220210212829553](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220210212829553.png)

比如想用Apache HttpComponents 作为底层执行引擎

```java
        RestTemplate template = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

```

**配置类**：

```java
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

## 使用

### Get请求

* getForObject获得Get请求到的返回值

  所需要的相关参数

![image-20220210220133444](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220210220133444.png)

**使用案例**：

```java
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;

@RestController
public class GetController {

    @Autowired
    RestTemplate restTemplate;

    @RequestMapping(value = "/get/object",method = RequestMethod.GET)
    public String getForObject(){
        String url = "http://localhost:8089/test01/{username}/{userage}";

        HashMap<String,String> params = new HashMap();
        params.put("username","zhangsan");
        params.put("userage","12");

        //1.采用hashMap进行封装参数
        return restTemplate.getForObject(url,String.class,params);

        //2.直接传参数
       // return restTemplate.getForObject(url,String.class,"zhangsan","13");
    }
}
```

```java
//RestTemplate请求的接口
@RequestMapping(value = "test01/{username}/{userage}",method = RequestMethod.GET)
public String test01(@PathVariable("username") String username,
                     @PathVariable("userage") String userage){
    return "姓名："+username+" "+"年龄："+userage;
}
```

* getForEntity获取详细报文包括状态码，返回体，返回头等

  所需要的相关参数

![image-20220210222623825](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220210222623825.png)

**使用案例**：

```java
@RequestMapping(value = "/get/entity",method = RequestMethod.GET)
public String getForEntity(){
    String url = "http://localhost:8089/test01/{username}/{userage}";

    HashMap<String,String> params = new HashMap();
    params.put("username","zhangsan");
    params.put("userage","12");

    ResponseEntity<String> forEntity = restTemplate.getForEntity(url, String.class, params);
    HttpStatus statusCode = forEntity.getStatusCode();
    System.out.println("状态码值："+statusCode);
    int statusCodeValue = forEntity.getStatusCodeValue();
    System.out.println("状态码："+statusCodeValue);
    HttpHeaders headers = forEntity.getHeaders();
    System.out.println("返回头："+headers);
    String body = forEntity.getBody();
    System.out.println("返回体："+body);
    return body;
}
```

返回结果：

```
2022-02-10 22:25:53.161  INFO 20552 --- [nio-8089-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2022-02-10 22:25:53.161  INFO 20552 --- [nio-8089-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2022-02-10 22:25:53.162  INFO 20552 --- [nio-8089-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms
状态码值：200 OK
状态码：200
返回头：[Content-Type:"text/plain;charset=UTF-8", Content-Length:"29", Date:"Thu, 10 Feb 2022 14:25:53 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]
返回体：姓名：zhangsan 年龄：12

```

### Post请求

* postForObject获得Post请求传来的返回值

所需参数与之前的GetForObject有一定的出入，传入值与转换类型泛型类位置是**颠倒的**；

![image-20220213104158283](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220213104158283.png)

**情景一：服务商接受参数没有@RequestBody**

```java
@PostMapping("test03")
public String test03(UserDto userDto){
    return "姓名："+userDto.getUsername()+" "+"ID："+userDto.getUserId();
}
```



```java
@GetMapping("post/object")
public String postForObject(){
    //如果服务商直接接受参数或者包装类的话
    //必须要使用MultiValueMap，否则无法完成传输  ******特别注意******
    String url = "http://localhost:8089/test03/";
    MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
    map.add("userId","1000");
    map.add("username","Lisi");
    return restTemplate.postForObject(url, map, String.class);
}
```

**情景二：服务商请求参数含有@RequestBody**

@RequestHeader HttpHeaders headers 非必须，但是可以获取请求头相关参数。

```java
@PostMapping("test02")
public String test02(@RequestBody UserDto userDto, @RequestHeader HttpHeaders headers){
    System.out.println(headers.getAccept());
    return "姓名："+userDto.getUsername()+" "+"ID："+userDto.getUserId();
}
```

* 方式一：HashMap传递参数

```java
@GetMapping("post/object1")
public String postForObject1(){
    //如果服务商采用RequestBody进行接收
    //必须要使用HashMap，否则无法完成传输
    String url = "http://localhost:8089/test02/";
    HashMap<String, String> map = new HashMap<>();
    map.put("userId","1000");
    map.put("username","Lisi");
    return restTemplate.postForObject(url, map, String.class);

}
```

* 方式二：通过包装HttpEntity进行与服务端交互（推荐）

```java
@GetMapping("post/object2")
public String postForObject2(){
    //如果服务商采用RequestBody进行接收
    //同时也可以采用这种方式（推荐）
    //申明请求头
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);

    String url = "http://localhost:8089/test02/";

    UserDto userDto = new UserDto();
    userDto.setUserId("10086");
    userDto.setUsername("王五");

    //HttpEntity包装
    HttpEntity<UserDto> userDtoHttpEntity = new HttpEntity<>(userDto, httpHeaders);

    return restTemplate.postForObject(url, userDtoHttpEntity, String.class);

}
```

* postForEntity获取详细信息

两种情况与postForObject一致

```java
@GetMapping("post/entity")
public String postForEntity(){
    //申明请求头
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);

    String url = "http://localhost:8089/test02/";

    UserDto userDto = new UserDto();
    userDto.setUserId("10086");
    userDto.setUsername("王五");

    //HttpEntity包装
    HttpEntity<UserDto> userDtoHttpEntity = new HttpEntity<>(userDto, httpHeaders);

    ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(url, userDtoHttpEntity, String.class);
    String body = stringResponseEntity.getBody();
    return body;

}
```

### exchange方式

这种方式可以看成是对Get与Post整个方法的一个整合，只需要在restTemplate.exchange()中指定是Get或者是Post请求即可。

```java
package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class ExchangeController {

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("post/change")
    public String postForEntity(){
        //申明请求头
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        String url = "http://localhost:8089/test02/";

        UserDto userDto = new UserDto();
        userDto.setUserId("10086");
        userDto.setUsername("王五");

        //HttpEntity包装
        HttpEntity<UserDto> userDtoHttpEntity = new HttpEntity<>(userDto, httpHeaders);

        ResponseEntity<String> stringResponseEntity = restTemplate.exchange(url, HttpMethod.POST,userDtoHttpEntity, String.class);
        String body = stringResponseEntity.getBody();
        return body;

    }

}
```