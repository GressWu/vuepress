---
title: SpringBoot中LogBack的使用
date: 2022-12-11
categories:
- BackEnd
tags:
- springBoot
---

## 为什么要使用日志框架

* 可以帮助我们在服务器上追踪关键信息及错误信息
* 并且可以通过控制日志级别控制输出内容
* `System.out.println()`不会再服务器上留痕

## 前期准备

SpringBoot中`spring-boot-starter`已经引入了logback的依赖，因此我们不需要再在maven的pom文件中导入任何的配置

## 使用LogBack打印输出文件

### 使用了lombok插件的

只需要再这个类前面加上这个注解`@Slf4j`，后面使用`log`根据日志级别打印输出即可

```java
package com.example.springbootact.Controller;

import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicObject;
import com.example.springbootact.LogicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class GetTheAnimalController {



    private List<LogicService> logicServiceLists;

    private List<LogicObject> logicObjects;


    @Autowired
    public void setLogicServiceLists(List<LogicService> logicServiceLists) {
        this.logicServiceLists = logicServiceLists;
    }

    @Autowired
    public void setLogicObjects(List<LogicObject> logicObjects) {
        this.logicObjects = logicObjects;
    }

    @PostMapping("/getthedogname")
    public String getTheAnimalFee(@RequestBody GetAnimalRequest getAnimalRequest){

        log.info("哇哈哈有限公司");
        log.error("出现错误");
        int theFee = 0;
        LogicService logicService = logicServiceLists
                .stream()
                .filter(p -> p.findService(getAnimalRequest))
                .findFirst().orElse(null);


        if(!ObjectUtils.isEmpty(logicService)){
            theFee = logicService.getTheFee(getAnimalRequest);
        }

        return theFee+"";
    }
}
```

### 没有使用lombok插件

需要在调用方法中调用工厂类获取`Logger`对象

```java
package com.example.springbootact.Controller;

import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicObject;
import com.example.springbootact.LogicService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetTheAnimalController {




    private List<LogicService> logicServiceLists;

    private List<LogicObject> logicObjects;


    @Autowired
    public void setLogicServiceLists(List<LogicService> logicServiceLists) {
        this.logicServiceLists = logicServiceLists;
    }

    @Autowired
    public void setLogicObjects(List<LogicObject> logicObjects) {
        this.logicObjects = logicObjects;
    }

    @PostMapping("/getthedogname")
    public String getTheAnimalFee(@RequestBody GetAnimalRequest getAnimalRequest){

        Logger log = LoggerFactory.getLogger(GetTheAnimalController.class);
        log.info("哇哈哈有限公司");
        log.error("出现错误");
        int theFee = 0;
        LogicService logicService = logicServiceLists
                .stream()
                .filter(p -> p.findService(getAnimalRequest))
                .findFirst().orElse(null);


        if(!ObjectUtils.isEmpty(logicService)){
            theFee = logicService.getTheFee(getAnimalRequest);
        }

        return theFee+"";
    }
}

```

## 配置文件

使用log打印日志文件时，默认只在控制台输出，要想生成日志文件需要其他配置

### application.yml

```yaml
logging:
  # 配置日志文件位置，file.name是从根目录算起的相对路径，当然也可以使用绝对路径
  file:
    name: info.log
  # 日志级别
  level:
    root: info
```

### logback.xml

如果要使用高级配置就需要xml配置了

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">

    <property name="LOG_HOME" value="logs" />
    <property name="PROJECT_NAME" value="beanlifecycle" />

    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    <!-- 按照每天生成日志文件 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--日志文件输出的文件名-->
            <FileNamePattern>${LOG_HOME}/${PROJECT_NAME}.log.%d{yyyy-MM-dd}.log</FileNamePattern>
            <!--日志文件保留天数-->
            <MaxHistory>30</MaxHistory>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <!--日志文件最大的大小-->
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
    </appender>

    <appender name="DruidFILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文件的路径及文件名 -->
        <file>${LOG_HOME}/${PROJECT_NAME}_log_druid_slow_sql.log</file>
        <!-- 日志记录器的滚动策略，按日期，按大小记录 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 归档的日志文件的路径，例如今天是2013-12-21日志，当前写的日志文件路径为file节点指定，可以将此文件与file指定文件路径设置为不同路径，从而将当前日志文件或归档日志文件置不同的目录。
            而2013-12-21的日志文件在由fileNamePattern指定。%d{yyyy-MM-dd}指定日期格式，%i指定索引 -->
            <fileNamePattern>${LOG_HOME}/${PROJECT_NAME}_log-druid_slow_sql-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- 除按日志记录之外，还配置了日志文件不能超过2M，若超过2M，日志文件会以索引0开始，
            命名日志文件，例如log-error-2013-12-21.0.log -->
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>20MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
        <!-- 追加方式记录日志 -->
        <append>true</append>
        <!-- 日志文件的格式 -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %logger Line:%-3L - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <!-- 此日志文件只记录级别的 -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>



    <!-- 日志输出级别 -->
    <logger name="cn.edu.xmu.javaee" level = "INFO"/>
    <root level="INFO">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

### 日志级别

logback有5种级别，分别是TRACE < DEBUG < INFO < WARN < ERROR，定义于`ch.qos.logback.classic.Level`类中。

Trace:是追踪，就是程序推进以下，你就可以写个trace输出，所以trace应该会特别多，不过没关系，我们可以设置最低日志级别不让他输出.

Debug:指出细粒度信息事件对调试应用程序是非常有帮助的.

Info:消息在粗粒度级别上突出强调应用程序的运行过程.

Warn:输出警告及warn以下级别的日志.

Error:输出错误信息日志.

此外OFF表示关闭全部日志，ALL表示开启全部日志。

### 文件位置与优先级

上面所提到的两种配置文件都需要在`resources`目录下。当二者同时存在相同的配置的时候yml会覆盖xml。例如xml中级别是info，yml中级别是error。那么日志就不会输出info以上的日志了，仅仅只会输出error级别的日志。