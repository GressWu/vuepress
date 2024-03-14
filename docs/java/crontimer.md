---
title: 利用线程池实现定时任务
date: 2024-02-23
categories:
- BackEnd
tags:
- Java
---

## 背景

接手了一个普通的javaWeb项目，没有SpringBoot的Cron和quartz这样的定时任务框架。

## 实现方式

### web.xml配置

当web应用在Tomcat容器中启动后，触发CronTest.class

```xml
<Servlet>
	<servlet-name>CronTest</servlet-name>
	<servlet-class>com.yuwei.crontimer.CronTest</servlet-class>
	<load-on-startup>2</load-on-startup>
</Servlet>
```

### 实现每月6号18:00点执行任务的功能

**具体任务unit**

```java
package com.yuwei.crontimer;



public class CronTask implements Runnable {

    @Override
    public void run() {
        System.out.println("开始执行查询任务。。。。");
        System.out.println("任务处理中。。。。");
        System.out.println("任务结束。。。。。");
    }
}

```

**定时任务处理类的实现**

```java
package com.yuwei.crontimer;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class CronTest extends HttpServlet{

        public void init(){
            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

            CronTask cronTask = new CronTask();

            // 获取当前时间
            Calendar now = Calendar.getInstance();
            // 计算距离每月6号18:00点的时间差（以秒为单位）
            Calendar scheduledTime = Calendar.getInstance();
            scheduledTime.set(Calendar.DAY_OF_MONTH, 6);
            scheduledTime.set(Calendar.HOUR_OF_DAY, 18);
            scheduledTime.set(Calendar.MINUTE, 0);
            scheduledTime.set(Calendar.SECOND, 0);

            long initialDelay = scheduledTime.getTimeInMillis() - now.getTimeInMillis();
            //如果已经过了当月6号，需要算下月6号到当日的时间
            if (initialDelay < 0) {
                scheduledTime.add(Calendar.MONTH, 1);
                initialDelay = scheduledTime.getTimeInMillis() - now.getTimeInMillis();
            }

            // 设置每月6号18:00点执行任务  (任务，初次启动后须等待时间，下次时间间隔，间隔单位)
            scheduler.scheduleAtFixedRate(cronTask, initialDelay/1000, 30 * 24 * 60 * 60, TimeUnit.SECONDS);

        }

}

```

## 补充：scheduleAtFixedRate和scheduleWithFixedDelay的区别

线程池有两个实现定时的方法，我们一起来看看他们的区别

`ScheduledExecutorService` 接口提供了两种方法来执行定时任务：`scheduleAtFixedRate()` 和 `scheduleWithFixedDelay()`。它们之间的区别在于任务的**执行方式和调度逻辑**：

1. `scheduleAtFixedRate()`
    - `scheduleAtFixedRate()` 方法用于以**固定的频率执行任务**。
    - 该方法会按照指定的初始延迟时间开始执行任务，然后在每次任务执行完成后，都会等待指定的时间间隔，然后再次执行任务。
    - 如果任务的执行时间超过了指定的间隔时间，那么下一个任务会在上一个任务执行完成后立即开始，即**可能出现任务重叠执行的情况**。

2. `scheduleWithFixedDelay()`
    - `scheduleWithFixedDelay()` 方法用于以**固定的延迟时间执行任务**。
    - 该方法会在每次任务执行完成后，等待指定的延迟时间，然后再次执行任务。
    - **无论任务执行时间长短，下一个任务都会在上一个任务执行完成后的固定延迟时间之后开始**，确保任务之间有固定的间隔。

在选择使用哪种方法时，需要根据任务的性质和需求来决定：

- 如果希望任务以固定的频率执行，并且不考虑任务执行时间的长短，可以选择 `scheduleAtFixedRate()`。
- 如果希望任务之间有固定的间隔，并且希望确保任务执行完成后再次执行，可以选择 `scheduleWithFixedDelay()`。