---
title: maven profile完成不同环境的切换
date: 2024-04-05
categories:
- BackEnd
tags:
- Java
---

## 背景

当一个项目的配置项很多，一个个环境变量改起来很麻烦。虽然Spring的配置文件可以通过active控制使用不同的配置文件。但是遇到频繁变更和打包，一个个改起来也是麻烦。那有没有一种方法可以解决这个问题呢，maven的profile可以解决该问题。

## maven需要的配置

```xml
<profiles>
        <profile>
            <!--不同环境Profile的唯一id-->
            <id>dev</id>
            <properties>
                <profiles.active>dev</profiles.active>
            </properties>
        </profile>
        
        <profile>
            <id>prod</id>
            <properties>
                <profiles.active>prod</profiles.active>
            </properties>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
        </profile>
        
        <profile>
            <id>test</id>
            <properties>
                <profiles.active>test</profiles.active>
            </properties>

        </profile>
    </profiles>
    
    
    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
```

profile的id唯一确定，相当于主键。properties指定变量，方便application.yml替换参数。activation用于指定默认激活分支。

resource的配置是为了防止启动时**过滤器报错**。

## 项目结构

![image-20240405165911729](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240405165911729.png)

application.yml

```yml
spring:
  profiles:
   active: @profiles.active@
```

application-test.yml

```yml
server:
  port: 8081
```

application-dev.yml

```yml
server:
  port: 8082
```

application-prod.yml

```yml
server:
  port: 8084
```

## 与idea配合

![image-20240405170141836](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240405170141836.png)

idea右侧的maven插件profiles可以帮助我们切换环境，默认的激活分支会以灰色的形式展示。我们可以通过勾选对应的环境分支，以达到本地调试或者maven打包能够迅速的完成，且不用对配置文件进行修改，一定程度上也保证了项目的安全。