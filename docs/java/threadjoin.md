---
title: 线程的阻塞
date: 2024-07-09
categories:
- BackEnd
tags:
- Java
---

平时我们工作中使用多线程编程，多个任务在某个节点结束后统一进行处理是非常常见的。下面将举两个例子，分别说说在单独启用线程或者是使用线程池时怎样做到阻塞的操作。

## Thread

```java
package com.yuwei.juc;


public class Te {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("主线程开始执行。。。");

        Thread thread = new Thread(() -> {
            System.out.println("子线程开始执行。。");
        });
        thread.start();
        thread.join();

        System.out.println("拿到子线程数据开始执行");
        System.out.println("主线程结束执行。。。");
    }
}

```

通过thread.join方法。完成thread的阻塞操作，即只有在thread子线程执行完之后，才会执行主线程后面的相关操作。

## ThreadPool

```java
package com.yuwei.juc;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Test {
    public static void main(String[] args) throws InterruptedException {

        System.out.println("主线程开始");

        CountDownLatch countDownLatch = new CountDownLatch(10);
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        for(int i=0;i<10;i++) {
            Thread t = new Thread(()->{
                System.out.println("子线程执行");
                try {
                    System.out.println(1 / 0);
                }catch (Exception e){
                    System.out.println(e);
                }finally {
                    countDownLatch.countDown();
                    //countDownLatch计数 到从n-1开始到0结束
                    System.out.println(countDownLatch.getCount());
                }

            });
            executorService.submit(t);

        }
        countDownLatch.await();
        executorService.shutdown();

        System.out.println("主线程结束");


    }



}

```

countDownLatch.await();语句用来阻塞子线程与父线程。特别需要**注意**的是，countDownLatch.countDown();该语句一定要放到finally里，因为一旦某一个子线程报错。线程池将永远阻塞，不能继续往下执行父线程里面的后续操作了。