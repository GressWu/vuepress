---
title: 线程池简介与基本使用
date: 2023-04-08
categories:
- BackEnd
tags:
- Java
---

## 基本概念

corePoolSize 核心线程数

maximumPoolSize 最大线程数

keepAliveTime 存活时间

unit 存活时间单位

workQueue 工作队列

threadFactory 线程工厂

handler 拒绝策略

```java
public ThreadPoolExecutor(int corePoolSize,int maximumPoolSize,long keepAliveTime,TimeUnit unit,BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler){}
```

**核心线程数**代表了线程池中一直存在的线程数

**最大线程数**代表了最多可以存在多少个线程数，当核心线程数处理不过来的时候增加剩余可用的线程。

**存活时间** 除核心线程外，闲置的多余线程可以存活的时间

**存活时间单位**和上面是一对，设置时间单位

**工作队列** 现在需要处理的任务

**线程工厂** 以怎样的形式创建线程

**拒绝策略** 当任务数量大于 队列数+最大线程数时，要采取拒绝策略

### 形象化描述

核心线程数可以看成是一个单位或公司的正式员工，最大线程数可以看成是当核心员工处理不了那么多任务的时候雇佣的外包人员，当一个项目结束后，也就是存活时间到了，外包人员将会离场。工作队列需要做的工作。

## 创建线程池

```java
package com.example.springbootact.test;

import java.util.concurrent.*;

public class ThreadPoolTest {
    public static void main(String[] args) {

        ExecutorService executorService = Executors.newCachedThreadPool();
        ExecutorService executorService1 = Executors.newFixedThreadPool(3);
        ExecutorService executorService2 = Executors.newSingleThreadExecutor();
        new ThreadPoolExecutor(1,12,60, TimeUnit.MILLISECONDS,new LinkedBlockingQueue<Runnable>());
    }
}

```

虽然有工具类提供了创建线程池的方法，不过还是更推荐用 ThreadPoolExecutor()来自定义创建线程池。

## 例子

小白来饭店里吃饭，点十个菜，然后上菜

### 前期准备

```java
package com.example.springbootact.test.make;

import java.util.StringJoiner;

public class SmallTool {
    public static void sleepMills(long mills){
        try {
            Thread.sleep(mills);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
    public static void printTimeThread(String tag){
        String s = new StringJoiner("\t|\t")
                .add(String.valueOf(System.currentTimeMillis()))
                .add(String.valueOf(Thread.currentThread().getId()))
                .add(Thread.currentThread().getName())
                .add(tag)
                .toString();
        System.out.println(s);

    }
}

```

```java
package com.example.springbootact.test.make;

import java.util.concurrent.TimeUnit;

public class Dish {
    private String name;

    private Integer productionTime;

    public Dish(String name,Integer productionTime){
        this.name = name;
        this.productionTime = productionTime;
    }

    public void make(){
        SmallTool.sleepMills(TimeUnit.SECONDS.toMillis(this.productionTime));
        SmallTool.printTimeThread(this.name+"制作完毕，来吃我吧");
    }
}

```

### 具体实现

传统版

```java
package com.example.springbootact.test.make;

import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;

public class ResTest {
    public static void main(String[] args) {

        System.out.println("小白进入了饭馆");
        long startTime = System.currentTimeMillis();
        ArrayList<Dish> dishes = new ArrayList<>();
        for(int i =0;i<10;i++){
            dishes.add(new Dish("菜"+i,1));
        }

        ArrayList<CompletableFuture> completableFutures = new ArrayList<>();
        for (Dish dish : dishes) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> dish.make());
            //把子任务放到线程容器中
            completableFutures.add(future);
        }

        //等待所有任务执行完毕
        CompletableFuture.allOf(completableFutures.toArray(completableFutures.toArray(new CompletableFuture[completableFutures.size()]))).join();


      SmallTool.printTimeThread("菜做好了"+(System.currentTimeMillis()-startTime));
    }
}

```

### Stream版

```java
package com.example.springbootact.test.make;

import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ForkJoinPool;
import java.util.stream.IntStream;

public class ResTest {
    public static void main(String[] args) {


        //查看计算机可用线程数
        System.out.println(Runtime.getRuntime().availableProcessors());
        //查看当前线程数
        System.out.println(ForkJoinPool.commonPool().getPoolSize());
        //查看最大线程数
        System.out.println(ForkJoinPool.getCommonPoolParallelism());

        System.out.println("小白进入了饭馆");
        long startTime = System.currentTimeMillis();

        CompletableFuture[] dishes = IntStream.rangeClosed(1, 19)
                .mapToObj(i -> new Dish("菜" + i, 1))
                .map(dish -> CompletableFuture.runAsync(dish::make))
                .toArray(size -> new CompletableFuture[size]);

        //等待所有任务执行完毕
        CompletableFuture.allOf(dishes).join();


      SmallTool.printTimeThread("菜做好了"+(System.currentTimeMillis()-startTime));
    }
}

```

```java
20
0
19
小白进入了饭馆
1680958461243	|	21	|	ForkJoinPool.commonPool-worker-18	|	菜2制作完毕，来吃我吧
1680958461243	|	25	|	ForkJoinPool.commonPool-worker-22	|	菜6制作完毕，来吃我吧
1680958461243	|	23	|	ForkJoinPool.commonPool-worker-4	|	菜4制作完毕，来吃我吧
1680958461243	|	36	|	ForkJoinPool.commonPool-worker-9	|	菜17制作完毕，来吃我吧
1680958461243	|	24	|	ForkJoinPool.commonPool-worker-29	|	菜5制作完毕，来吃我吧
1680958461243	|	22	|	ForkJoinPool.commonPool-worker-11	|	菜3制作完毕，来吃我吧
1680958461243	|	38	|	ForkJoinPool.commonPool-worker-27	|	菜19制作完毕，来吃我吧
1680958461243	|	35	|	ForkJoinPool.commonPool-worker-16	|	菜16制作完毕，来吃我吧
1680958461243	|	37	|	ForkJoinPool.commonPool-worker-2	|	菜18制作完毕，来吃我吧
1680958461243	|	34	|	ForkJoinPool.commonPool-worker-23	|	菜15制作完毕，来吃我吧
1680958461243	|	33	|	ForkJoinPool.commonPool-worker-30	|	菜14制作完毕，来吃我吧
1680958461243	|	32	|	ForkJoinPool.commonPool-worker-5	|	菜13制作完毕，来吃我吧
1680958461243	|	31	|	ForkJoinPool.commonPool-worker-12	|	菜12制作完毕，来吃我吧
1680958461243	|	29	|	ForkJoinPool.commonPool-worker-26	|	菜10制作完毕，来吃我吧
1680958461243	|	30	|	ForkJoinPool.commonPool-worker-19	|	菜11制作完毕，来吃我吧
1680958461243	|	28	|	ForkJoinPool.commonPool-worker-1	|	菜9制作完毕，来吃我吧
1680958461243	|	27	|	ForkJoinPool.commonPool-worker-8	|	菜8制作完毕，来吃我吧
1680958461243	|	26	|	ForkJoinPool.commonPool-worker-15	|	菜7制作完毕，来吃我吧
1680958461243	|	20	|	ForkJoinPool.commonPool-worker-25	|	菜1制作完毕，来吃我吧
1680958461243	|	1	|	main	|	菜做好了1037

Process finished with exit code 0

```

我们可以看到我的电脑最多可以支持20个线程，其中一个给主线程用了，剩下还有19个线程可用。也就是说CPU一瞬间可以处理19个做菜任务，一秒钟即可完成任务。如果我们改成循环20次，那么就要处理两秒。

### 问题解决

我们所说的CPU处理是一瞬间能处理19个子线程任务，并不是一秒钟处理19个任务。如果有200个任务，我们要怎么让他一秒中做完任务，答案就是使用线程池。提高他的最高线程数，在CPU切换的时候能够跑满200个线程。已完成需求。

```java
package com.example.springbootact.test.make;

import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ForkJoinPool;
import java.util.stream.IntStream;

public class ResTest {
    public static void main(String[] args) {


        //查看计算机可用线程数
        System.out.println(Runtime.getRuntime().availableProcessors());
        //查看当前线程数
        System.out.println(ForkJoinPool.commonPool().getPoolSize());
        //查看最大线程数
        System.out.println(ForkJoinPool.getCommonPoolParallelism());

        ExecutorService executorService = Executors.newCachedThreadPool();

        System.out.println("小白进入了饭馆");
        long startTime = System.currentTimeMillis();

        CompletableFuture[] dishes = IntStream.rangeClosed(1, 200)
                .mapToObj(i -> new Dish("菜" + i, 1))
                .map(dish -> CompletableFuture.runAsync(dish::make,executorService))
                .toArray(size -> new CompletableFuture[size]);

        //等待所有任务执行完毕
        CompletableFuture.allOf(dishes).join();


      SmallTool.printTimeThread("菜做好了"+(System.currentTimeMillis()-startTime));
    }
}

```

```java
1680959439826	|	185	|	pool-1-thread-166	|	菜166制作完毕，来吃我吧
1680959439826	|	205	|	pool-1-thread-186	|	菜186制作完毕，来吃我吧
1680959439826	|	188	|	pool-1-thread-169	|	菜169制作完毕，来吃我吧
1680959439826	|	207	|	pool-1-thread-188	|	菜188制作完毕，来吃我吧
1680959439826	|	167	|	pool-1-thread-148	|	菜148制作完毕，来吃我吧
1680959439834	|	1	|	main	|	菜做好了1080
```

