---
title: SpringMVC @RequestMapping注解
date: 2022-03-27
categories:
 - backEnd
tags:
 - SpringMVC
---

## 注解的位置

```java
package org.springframework.web.bind.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.core.annotation.AliasFor;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Mapping
public @interface RequestMapping {
    String name() default "";

    @AliasFor("path")
    String[] value() default {};

    @AliasFor("value")
    String[] path() default {};

    RequestMethod[] method() default {};

    String[] params() default {};

    String[] headers() default {};

    String[] consumes() default {};

    String[] produces() default {};
}

```

RequestMapping注解可以写在类和方法上

写在**类上：**设置请求的初始信息

写在**方法上：**设置映射请求的具体信息

如写在类上的路径为@RequestMapping(/test)，卸载方法上的路径为@RequestMapping(/getresult)，那么客户端访问该接口方法的路径则为/test/getresult

## 注解的属性

### value属性

```java
 @AliasFor("path")
 String[] value() default {};
```

1. value是一个字符串类型的数组，可以匹配多个请求地址对应的请求，如下面例子，客户端可以通过`/test1`或`/test`来访问`index()`的方法。
2. value是必输属性

```java
@RequestMapping( value={"/test1","/test"})
public String index(){
    //返回视图名称
    return "target";
}
```

### method属性

```java
RequestMethod[] method() default {};
```

1. method属性是一个RequestMethod类型的数组，可以匹配多个请求地址对应的请求

   ```java
   package org.springframework.web.bind.annotation;
   
   public enum RequestMethod {
       GET,
       HEAD,
       POST,
       PUT,
       PATCH,
       DELETE,
       OPTIONS,
       TRACE;
   
       private RequestMethod() {
       }
   }
   ```

2. 如果不写method属性，那么get，post等所有请求都是可以被匹配到的，如果赋值的话只能匹配对应的请求。

```java
 @RequestMapping(value = {"/test1", "/test"}, method = {RequestMethod.GET, RequestMethod.DELETE})
    public String index() {
        //返回视图名称
        return "target";
    }
```

只能匹配GET和DELETE请求

3. 浏览器报**405**的错误，一般是请求协议不对的问题



### 衍生注解

通过以下注解可以免去写method属性的烦恼

```java
@PostMapping
@PatchMapping
@DeleteMapping
@PutMapping
@GetMapping
```

**注**：目前浏览器只支持get和post，若在form表单提交时，为method设置了其他请求方式的字符串(put或delete)，则默认为Get属性

### params属性

params是一个字符串类型的数组，可以通过四种表达式设置请求参数和请求参数映射的匹配关系

 	1. "param:"要求请求映射必须携带param请求参数，如下面例子代表请求参数必须要带上username参数。

如果直接访问`http://localhost:8080/SpringMVC/`，会报以下**错误400**

```shell
10:00:31.214 [http-nio-8080-exec-1] WARN org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver - Resolved [org.springframework.web.bind.UnsatisfiedServletRequestParameterException: Parameter conditions "username" not met for actual request parameters: ]
10:00:31.216 [http-nio-8080-exec-1] DEBUG org.springframework.web.servlet.DispatcherServlet - Completed 400 BAD_REQUEST
```

如果访问`http://localhost:8080/SpringMVC/?username=?admin`即可正常访问

```java
@RequestMapping(value = {"/"},
                params = {"username"})
public String params() {
    //返回试图名称
    return "target";
}
```

2. "!params":要求请求映射必须不能携带param请求参数
3. "param=value" : 要求请求映射必须携带param请求参数，并且请求参数param=value
4. "param!=value" : 要求请求映射必须携带param请求参数，并且请求参数param!=value

### headers属性

headers是一个字符串类型的数组，可以通过四种表达式设置请求参数和请求参数映射的匹配关系

 	1. "headers:"要求请求映射必须携带headers请求头

如果直接访问`http://localhost:8080/SpringMVC/?username=“admin”`，会报以下**错误404**

```shell
10:15:37.339 [http-nio-8080-exec-17] DEBUG org.springframework.web.servlet.DispatcherServlet - GET "/SpringMVC/?username=%2222%22", parameters={masked}
10:15:37.352 [http-nio-8080-exec-17] WARN org.springframework.web.servlet.PageNotFound - No mapping for GET /SpringMVC/
10:15:37.354 [http-nio-8080-exec-17] DEBUG org.springframework.web.servlet.DispatcherServlet - Completed 404 NOT_FOUND
```

如果访问`http://localhost:8081/SpringMVC/?username=“admin”`即可正常访问

```java
@RequestMapping(value = {"/"},
                    params = {"username"},
                    headers = {"Host: localhost:8081"})
    public String params() {
        //返回试图名称
        return "target";
    }
```

2. "!headers":要求请求映射必须不能携带headers请求头
3. "headers=value" : 要求请求映射必须携带headers请求头，并且请求头headers=value
4. "headers!=value" : 要求请求映射必须携带headers请求头，并且请求头headers!=value