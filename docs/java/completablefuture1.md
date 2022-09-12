---
title: 多线程简介与CompletableFuture初体验
date: 2022-08-28
categories:
- BackEnd
tags:
- Java
---

## 简单来说

一个核心一个线程，一个线程运行一个任务

* 并发

一个核心一个线程，但是CPU执行速度快，和人脑差不多，虽然看起来在做多件事，实际上是在短时间切换任务

* 并行

多个核心多个线程，可以理解为多个脑子

## 线程的状态

```java
public enum State {
   
    NEW,
    RUNNABLE,
    BLOCKED,
    WAITING,
    TIMED_WAITING,
    TERMINATED;
}
```

NEW->RUNNABLE->TERMINATED

### 测试类

```java
package com.yuwei.multi;

import java.util.concurrent.TimeUnit;

public class MultiTest {
    public static void main(String[] args) throws InterruptedException {
        //1.创建thread对象，对象创建在堆上
        Thread thread = new Thread();
        System.out.println("1-"+thread.getState());
        //2.线程启动后，该线程出现在栈里，随时会被CPU执行
        thread.start();
        System.out.println("2-"+thread.getState());
        //3.线程结束后，线程从栈里退出
        //thread.sleep(1000);
        TimeUnit.SECONDS.sleep(1);
        System.out.println("3-"+thread.getState());

    }
}
```

```
1-NEW        线程被创建后
2-RUNNABLE	 线程开启后
3-TERMINATED 线程执行完毕
```

### TimeUnit线程枚举类

由于原生的thread.sleep()是毫秒为单位，不好计算且不够直观，所以出现了TimeUnit枚举类

```java
NANOSECONDS     毫微秒  十亿分之一秒（就是微秒/1000）
MICROSECONDS    微秒    一百万分之一秒（就是毫秒/1000）
MILLISECONDS    毫秒    千分之一秒    
SECONDS         秒
MINUTES         分钟
HOURS           小时
DAYS            天
```

## 线程创建的三种方式

### 1. Thread重写Run方法

```java
package com.yuwei.multi;

public class ThreadRun {
    public static void main(String[] args) {
        //创建继承Thread类重写run方法，或者直接重写run方法
        Thread thread = new Thread(){
            @Override
            public void run() {
                System.out.println("我是子线程");            }
        };
        thread.start();
        System.out.println("main结束");
    }
}

```

```
主线程结束
我是子线程
```

### 2. 实现Runnable接口

```java
package com.yuwei.multi;

public class RunnableRun {
    public static void main(String[] args) {
        //创建实现Runnable接口的类，或者调用函数式接口
        Thread td =new Thread(()-> System.out.println("我是子线程"));
        td.start();
        System.out.println("主线程结束");
    }
}
```

```
主线程结束
我是子线程
```

前两种方法本质上是一样的，他们的流程图如下所示

![image-20220827091753253](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220827091753253.png)

### 3. 创建FutureTask

前两种方法有个缺陷，那就是Run方法都是无状态的，我们不知道子线程执行的情况或者返回值，这时候我们就引入FutureTask解决这个问题。

```java
package com.yuwei.multi;

import java.util.concurrent.*;

public class FutureTaskRun {
    public static void main(String[] args) {
        Callable<String> callable = ()->{
            System.out.println("我是子线程");
            return "sub task done";
        };
        FutureTask<String> futureTask = new FutureTask(callable);
        Thread thread = new Thread(futureTask);
        thread.start();

        try {
            //String s = futureTask.get();
            String s = futureTask.get(5, TimeUnit.SECONDS);
            System.out.println(s);
        }
        catch (ExecutionException | InterruptedException e){

            System.out.println(e.getCause());
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }

        System.out.println("主线程");
    }
}

```

```
我是子线程
sub task done
主线程
```

该程序的执行顺序是，主线程创建后，子线程创建。子线程开始执行，主线程就会一直对子线程进行询问，直到子线程执行完成，主线程获取到子线程的状态，主线程才会结束。

## CompletableFuture

### 小工具

```java
package com.yuwei.multi.completablefuturerun;

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

**输出结果**：时间戳 线程Id 线程名称 消息

### supplyAsync的应用（开启）

小白来饭店点菜，点了番茄炒蛋加米饭。厨师开始炒菜，打饭。小白打王者荣耀等待。饭做好了，小白吃饭。

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _01_supplyAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("小白进入餐厅");
        SmallTool.printTimeThread("小白点了 番茄炒蛋加米饭");

        //使用supplyAsync，开启另一个线程执行
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("厨师炒菜");
            SmallTool.sleepMills(200);
            SmallTool.printTimeThread("厨师打饭");
            SmallTool.sleepMills(100);
            return "番茄炒蛋加米饭做好了";
        });

        SmallTool.printTimeThread("小白在打王者");
        //Join方法实际上是Future接口中get()方法的升级版
        //Join方法的作用在于，主线程等待子线程cf1结束并返回值后，在执行主线程
        SmallTool.printTimeThread(cf1.join()+",小白开吃");


    }
}
```

```shell
1661668494066	|	1	|	main	|	小白进入餐厅
1661668494066	|	1	|	main	|	小白点了 番茄炒蛋加米饭
1661668494099	|	1	|	main	|	小白在打王者
1661668494099	|	20	|	ForkJoinPool.commonPool-worker-25	|	厨师炒菜
1661668494303	|	20	|	ForkJoinPool.commonPool-worker-25	|	厨师打饭
1661668494413	|	1	|	main	|	番茄炒蛋加米饭做好了,小白开吃
```

![image-20220828153150445](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220828153150445.png)

### thenCompose的应用（连接）

需求升级，增加一个服务员专门打饭，厨师只需要做饭即可。

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _01_supplyAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("小白进入餐厅");
        SmallTool.printTimeThread("小白点了 番茄炒蛋加米饭");

        //使用supplyAsync，开启另一个线程执行
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("厨师炒菜");
            SmallTool.sleepMills(200);
            CompletableFuture<String> race = CompletableFuture.supplyAsync(()->{
               SmallTool.printTimeThread("服务员打饭");
               return "加米饭";
            });
            SmallTool.printTimeThread("厨师打饭");
            SmallTool.sleepMills(100);
            return "番茄炒蛋"+race.join()+"做好了";
        });

        SmallTool.printTimeThread("小白在打王者");
        //Join方法实际上是Future接口中get()方法的升级版
        //Join方法的作用在于，主线程等待子线程cf1结束并返回值后，在执行主线程
        SmallTool.printTimeThread(cf1.join()+",小白开吃");


    }
}

```

上述方法在cf1线程中嵌套了race线程，并且当race线程结束后cf1线程才结束并且返回值，这样虽然可以满足条件，但是不够优雅

下面的`thenCompose()`方法就可以优雅的解决该问题

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _01_supplyAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("小白进入餐厅");
        SmallTool.printTimeThread("小白点了 番茄炒蛋加米饭");

        //使用supplyAsync，开启另一个线程执行
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("厨师炒菜");
            SmallTool.sleepMills(200);
            return "番茄炒蛋";
            //thenCompose传入厨师返回值，出参为两者合体
        }).thenCompose(dish-> CompletableFuture.supplyAsync(()->{
                SmallTool.printTimeThread("服务员打饭");
                SmallTool.sleepMills(100);
                return dish+"加米饭做好了";
                }
        ));

        SmallTool.printTimeThread("小白在打王者");
        //Join方法实际上是Future接口中get()方法的升级版
        //Join方法的作用在于，主线程等待子线程cf1结束并返回值后，在执行主线程
        SmallTool.printTimeThread(cf1.join()+",小白开吃");


    }
}
```

```shell
1661670144658	|	1	|	main	|	小白进入餐厅
1661670144658	|	1	|	main	|	小白点了 番茄炒蛋加米饭
1661670144686	|	20	|	ForkJoinPool.commonPool-worker-25	|	厨师炒菜
1661670144686	|	1	|	main	|	小白在打王者
1661670144899	|	23	|	ForkJoinPool.commonPool-worker-25	|	服务员打饭
1661670145009	|	1	|	main	|	番茄炒蛋加米饭做好了,小白开吃
```

![image-20220828153215111](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220828153215111.png)

### thenCombine()的应用（结合）

现在假设小白进餐厅的时候，饭还没有蒸好，蒸饭和炒菜同时进行。

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _02_supplyAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("小白进入餐厅");
        SmallTool.printTimeThread("小白点了 番茄炒蛋加米饭");

        //使用supplyAsync，开启一个子线程执行
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("厨师炒菜");
            SmallTool.sleepMills(200);
            return "番茄炒蛋";

        });

        CompletableFuture<String> cf2 = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("服务员蒸饭");
            SmallTool.sleepMills(200);
            SmallTool.printTimeThread("服务员打饭");
            return "加米饭做好了";
        });
        SmallTool.printTimeThread("小白在打王者");
        //Join方法实际上是Future接口中get()方法的升级版
        //Join方法的作用在于，主线程等待子线程cf1结束并返回值后，在执行主线程
        SmallTool.printTimeThread(cf1.join()+cf2.join()+",小白开吃");
    }
}

```

其实直接开两个线程就行，不过原生的方法已经提供过相应方法，写起来会更紧凑

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _02_supplyAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("小白进入餐厅");
        SmallTool.printTimeThread("小白点了 番茄炒蛋加米饭");

        //使用supplyAsync，开启一个子线程执行
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("厨师炒菜");
            SmallTool.sleepMills(200);
            return "番茄炒蛋";

        }).thenCombine(CompletableFuture.supplyAsync(()->{
            SmallTool.printTimeThread("服务员蒸饭");
            SmallTool.sleepMills(200);
            return "加米饭做好了";
            //将前面两个线程合并,并加工结果
        }),(dish,rice)->{
            SmallTool.printTimeThread(dish+rice);
            SmallTool.sleepMills(100);
            return dish+rice;
        });


        SmallTool.printTimeThread("小白在打王者");
        //Join方法实际上是Future接口中get()方法的升级版
        //Join方法的作用在于，主线程等待子线程cf1结束并返回值后，在执行主线程
        SmallTool.printTimeThread(cf1.join()+",小白开吃");
    }
}

```

```shell
1661671064014	|	1	|	main	|	小白进入餐厅
1661671064014	|	1	|	main	|	小白点了 番茄炒蛋加米饭
1661671064041	|	20	|	ForkJoinPool.commonPool-worker-25	|	厨师炒菜
1661671064041	|	21	|	ForkJoinPool.commonPool-worker-18	|	服务员蒸饭
1661671064041	|	1	|	main	|	小白在打王者
1661671064244	|	21	|	ForkJoinPool.commonPool-worker-18	|	番茄炒蛋加米饭做好了
1661671064355	|	1	|	main	|	番茄炒蛋加米饭做好了,小白开吃
```

![image-20220828153234821](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220828153234821.png)