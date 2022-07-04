---
title: JWT简介及简单使用
date: 2021-09-07
categories:
 - backEnd
tags:
 - Java
 - internet
---

## 什么是JWT

JSON Web Token (JWT)是一个开放标准(RFC 7519)，它定义了一种紧凑的、自包含的方式，用于作为JSON对象在各方之间安全地传输信息。该信息可以被验证和信任，因为它是数字签名的。

## JWT的简单使用

### 依赖

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

### 构成

jwt = Header.payload.signature

* Header

```
{
	'typ':jwt,
	'alg':'HS256'
}
```

typ：token类型

alg：算法名称

* payload

```
{
  'username':''
  'id':
}
```

* signature

```
String encode = base64(header)+"."+base64(payload)
Strng signature = sha256("encode",signatureKey)
```

## 加密与解密

```java
import io.jsonwebtoken.*;
import org.junit.Test;

import java.util.Date;
import java.util.UUID;

public class JWTTest {

    private long time = 1000*60*60*24;
    private String signature = "wuyuwei";
    @Test
    public void test(){
        JwtBuilder builder = Jwts.builder();
        String token = builder
                //header
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("alg", "HS256")
                //payload 载荷
                .claim("username", "tom")
                .claim("role", "admin")
                .setSubject("主题")
                .setExpiration(new Date(System.currentTimeMillis() + time))
                .setId(UUID.randomUUID().toString())
                //signature 签名
                .signWith(SignatureAlgorithm.HS256, signature)
                .compact();
        System.out.println(token);
    }

    @Test
    public void parse(){
        String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRvbSIsInJvbGUiOiJhZG1pbiIsInN1YiI6IuS4u-mimCIsImV4cCI6MTYzMTAyMTU2NCwianRpIjoiZTdhY2U1NjQtYjljYy00OGQyLTljZTMtM2E0MzZhMTY0NGUzIn0.AIyQe0uhgf25_Rsdo9tTx0T5sDntmX3BPAHaGmVYTXI";
        JwtParser parser = Jwts.parser();
        //通过签名 对token进行解析
        Claims body = parser.setSigningKey(signature).parseClaimsJws(token).getBody();
        System.out.println(body.get("username"));
        body.getId();
        body.getExpiration();
    }
}
```

