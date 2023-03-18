---
title: 缓存的使用
date: 2023-03-18
categories:
- BackEnd
tags:
- Java
---

## 为什么要使用缓存

使用缓存可以提高系统的性能和响应速度。当我们访问一个频繁被请求的资源时，每次都从数据库、文件系统或其他数据源中读取这个资源会消耗很多时间和计算资源，尤其是在高并发的情况下。如果我们将这个资源的副本存储在缓存中，当有用户请求这个资源时，可以直接从缓存中读取，而不必每次都去查询数据源，从而大大减少了响应时间和系统负载。此外，缓存还可以减少网络带宽的占用，降低运营成本。

## SpringBoot @Cacheable实现缓存

### 前期准备

引入依赖

```xml
		<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>
```

启动类开启缓存注解

```java
package com.example.springbootact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SpringBootActApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootActApplication.class, args);
    }

}
```

### Pojo

```java
package com.example.springbootact.Dao;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
    public class User {

        @TableId
        private Integer id;
        private String name;
        private Integer age;
        private String email;

    }
```

### Mapper

```java
package com.example.springbootact.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.springbootact.Dao.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

### Controller

```java
package com.example.springbootact.Controller;

import com.example.springbootact.Dao.User;
import com.example.springbootact.Mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CacheController {

    @Autowired
    UserMapper userMapper;

    @GetMapping("/{id}")
    @Cacheable(key = "#id", value = "cacheHome")
    public User findUserById(@PathVariable("id") String id){
       return userMapper.selectById(id);
    }
}

```

### 解读

第一次访问该请求时，缓存中没有数据，先去数据库里查，把id作为key，查到的值放到value中。后台打印查询日志

```
==>  Preparing: SELECT id,name,age,email FROM user WHERE id=?
==> Parameters: 1212121(String)
<==    Columns: id, name, age, email
<==        Row: 1212121, 张三, 12, asd@qq.com
<==      Total: 1
Closing non transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@2f71d1f0]
```

第二次访问时不查询数据库，用id值作为key去缓存中找，直接返回值。