---
title: SpringBoot解决跨域问题
date: 2022-03-20
categories:
 - backEnd
tags:
 - springBoot
 - internet
---


## 什么是跨域

**跨域**：指的是浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器对javascript施加的安全限制。

**同源策略：**是指**协议，域名，端口**都要相同，其中有一个不同都会产生跨域；

## 如何解决跨域

### CrossOrigin注解解决跨域

通过在相对应的方法或者类上加上注解CrossOrigin来解决跨域，但是这种方法只能解决部分方法或控制器的问题，不能解决全局性的跨域问题。

```java
@RequestMapping("/")
@CrossOrigin
public String hello(){
    return "hello world";
}
```

```java
@RestController
@CrossOrigin
public class HelloController {
}
```

### corsFilter解决跨域

这是一种全局的解决跨域问题的方法

```java
package com.yuwwei.springbootweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter(){
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",corsConfiguration);
        return new CorsFilter(source);
    }
}

```

### 实现WebMvcConfigurer接口解决跨域

```java
package com.yuwwei.springbootweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
       registry.addMapping("/**")
               .allowedOriginPatterns("*")
               .allowedMethods("GET","POST","PUT","DELETE","HEAD","OPTIONS")
               .allowCredentials(true)
               .maxAge(3600)
               .allowedHeaders("*");
    }
}
```