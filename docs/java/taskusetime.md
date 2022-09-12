---
title: 任务耗时检测
date: 2022-09-04
categories:
- BackEnd
tags:
- Java
---

## 传统方法

```java
package com.example.springbootdemo;

import java.util.concurrent.TimeUnit;

public class Test {
    public static void main(String[] args) throws InterruptedException {
        //Task1
        long startTime1 = System.currentTimeMillis();
        TimeUnit.SECONDS.sleep(1);
        long endTime1 = System.currentTimeMillis();
        long executeTime1 = endTime1 - startTime1;
        System.out.println("Task1:"+executeTime1/1000+"s");
        //Task2
        long startTime2 = System.currentTimeMillis();
        TimeUnit.SECONDS.sleep(1);
        long endTime2 = System.currentTimeMillis();
        long executeTime2 = endTime2 - startTime2;
        System.out.println("Task2:"+executeTime2/1000+"s");
        //Task3
        long startTime3 = System.currentTimeMillis();
        TimeUnit.SECONDS.sleep(1);
        long endTime3 = System.currentTimeMillis();
        long executeTime3 = endTime3 - startTime3;
        System.out.println("Task3:"+executeTime3/1000+"s");

        //总耗时
        System.out.println((executeTime1+executeTime2+executeTime3)/1000+"s");
    }
}
```

```shell
Task1:1s
Task2:1s
Task3:1s
3s
```

## SpringBoot方法

由于传统方式每次都要进行计算，所以SpringBoot封装了一些方法，让耗时检测更优雅。

```java
package com.example.springbootdemo;


import org.springframework.util.StopWatch;

import java.util.concurrent.TimeUnit;

public class Test1 {
    public static void main(String[] args) throws InterruptedException {
        StopWatch stopWatch = new StopWatch();

        //Task1
        stopWatch.start("Task1");
        TimeUnit.SECONDS.sleep(1);
        stopWatch.stop();
        //System.out.println("Task1:"+executeTime1/1000+"s");
        //Task2
        stopWatch.start("Task2");
        TimeUnit.SECONDS.sleep(1);
        stopWatch.stop();
        //System.out.println("Task2:"+executeTime2/1000+"s");
        //Task3
        stopWatch.start("Task2");
        TimeUnit.SECONDS.sleep(1);
        stopWatch.stop();


        //打印详细耗时
        System.out.println(stopWatch.prettyPrint());
        System.out.println("+++++++++++++++++++++++++++++++++++");
        //打印简略信息
        System.out.println(stopWatch.shortSummary());
        System.out.println("+++++++++++++++++++++++++++++++++++");
        //打印最后一个任务相关信息
        System.out.println(stopWatch.getLastTaskName());
        System.out.println(stopWatch.getLastTaskInfo());
        System.out.println("+++++++++++++++++++++++++++++++++++");

        //汇总信息
        System.out.println("所有任务总耗时:"+stopWatch.getTotalTimeMillis());
        System.out.println("任务总数:"+stopWatch.getTaskCount());
        System.out.println("所有任务详情:"+stopWatch.getTaskInfo());
    }
}

```

```shell
StopWatch '': running time = 3021745000 ns
---------------------------------------------
ns         %     Task name
---------------------------------------------
1000766000  033%  Task1
1008920600  033%  Task2
1012058400  033%  Task2

+++++++++++++++++++++++++++++++++++
StopWatch '': running time = 3021745000 ns
+++++++++++++++++++++++++++++++++++
Task2
org.springframework.util.StopWatch$TaskInfo@5305068a
+++++++++++++++++++++++++++++++++++
所有任务总耗时:3021
任务总数:3
所有任务详情:[Lorg.springframework.util.StopWatch$TaskInfo;@1f32e575

Process finished with exit code 0

```

