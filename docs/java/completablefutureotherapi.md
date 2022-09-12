---
title: CompletableFuture其他常用API
date: 2022-09-10
categories:
- BackEnd
tags:
- Java
---
## thenApplyAsync 任务后置执行

### 场景描述

小白吃完饭结账，服务员A收款。小白打电话的同时，服务员A完成结账，并且服务员B开发票

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _03_supplyAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("小白吃好了");
        SmallTool.printTimeThread("小白 结账、要求开发票");

        //线程切换具有随机性，大概率还是一个线程在执行
        CompletableFuture<String> stringCompletableFuture = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("服务员A收款 500元");
            SmallTool.sleepMills(500);
            return "500";
        }).thenApplyAsync(money -> {
            SmallTool.printTimeThread("服务员B开发票 " + money + "元");
            SmallTool.sleepMills(200);
            return money + "元发票";
        });

        //thenApplyAsync可以与ThenCompose相互替代

        SmallTool.printTimeThread("小白接电话，想打游戏");
        SmallTool.printTimeThread("小白拿到"+stringCompletableFuture.join()+"准备回家");
    }
}
```

```
1662821011481	|	1	|	main	|	小白吃好了
1662821011481	|	1	|	main	|	小白 结账、要求开发票
1662821011510	|	20	|	ForkJoinPool.commonPool-worker-25	|	服务员A收款 500元
1662821011510	|	1	|	main	|	小白接电话，想打游戏
1662821012012	|	20	|	ForkJoinPool.commonPool-worker-25	|	服务员B开发票 500元
1662821012230	|	1	|	main	|	小白拿到500元发票准备回家
```



## applyToEither 获取最先完成的任务

### 场景描述

张三吃完饭出门，等待公交车。700路或者800路公交车同时来，那一辆车先来，上哪个。

```java
package com.yuwei.multi.completablefuturerun;


import java.util.concurrent.CompletableFuture;

public class _04_otherAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("张三出门，来到公交站");
        SmallTool.printTimeThread("等待 700路 或者 800路公交到来");
        CompletableFuture<String> busFuture = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("700路公交正在赶来");
            SmallTool.sleepMills(300);
            return "700路公交到了";
        }).applyToEither(CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("800路公交正在赶来");
            SmallTool.sleepMills(200);
            return "800路公交到了";
        }), firstComeBus -> firstComeBus);
        SmallTool.printTimeThread(busFuture.join()+"张三坐车回家");
    }
}
```

```
1662820983510	|	1	|	main	|	张三出门，来到公交站
1662820983510	|	1	|	main	|	等待 700路 或者 800路公交到来
1662820983533	|	20	|	ForkJoinPool.commonPool-worker-25	|	700路公交正在赶来
1662820983533	|	21	|	ForkJoinPool.commonPool-worker-18	|	800路公交正在赶来
1662820983752	|	1	|	main	|	800路公交到了张三坐车回家
```

## exceptionally 异常处理

### 场景描述

张三出门坐公交车，如果公交车撞了，就去打车回家

我们先来看第一种方式，当公交车撞了，系统直接报错，完全没有做异常处理，不好！如果用try catch进行包裹，又略显臃肿

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _05_otherAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("张三出门，来到公交站");
        SmallTool.printTimeThread("等待 700路 或者 800路公交到来");
        CompletableFuture<String> busFuture = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("700路公交正在赶来");
            SmallTool.sleepMills(100);
            return "700路公交到了";
        }).applyToEither(CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("800路公交正在赶来");
            SmallTool.sleepMills(200);
            return "800路公交到了";
        }), firstComeBus -> {
            SmallTool.printTimeThread(firstComeBus);
            if(firstComeBus.startsWith("700")){
                throw new RuntimeException("撞树了");
            }
            return firstComeBus;
        });
        SmallTool.printTimeThread(busFuture.join()+"张三坐车回家");

    }
}

```

```
1662812008674	|	1	|	main	|	张三出门，来到公交站
1662812008675	|	1	|	main	|	等待 700路 或者 800路公交到来
1662812008703	|	20	|	ForkJoinPool.commonPool-worker-25	|	700路公交正在赶来
1662812008703	|	21	|	ForkJoinPool.commonPool-worker-18	|	800路公交正在赶来
1662812008816	|	20	|	ForkJoinPool.commonPool-worker-25	|	700路公交到了
Exception in thread "main" java.util.concurrent.CompletionException: java.lang.RuntimeException: 撞树了
	at java.util.concurrent.CompletableFuture.encodeThrowable(CompletableFuture.java:273)
	at java.util.concurrent.CompletableFuture.completeThrowable(CompletableFuture.java:280)
	at java.util.concurrent.CompletableFuture.orApply(CompletableFuture.java:1393)
	at java.util.concurrent.CompletableFuture$OrApply.tryFire(CompletableFuture.java:1364)
	at java.util.concurrent.CompletableFuture.postComplete(CompletableFuture.java:488)
	at java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java:1609)
	at java.util.concurrent.CompletableFuture$AsyncSupply.exec(CompletableFuture.java:1596)
	at java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)
	at java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)
	at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)
	at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:175)
Caused by: java.lang.RuntimeException: 撞树了
	at com.yuwei.multi.completablefuturerun._05_otherAsync.lambda$main$2(_05_otherAsync.java:20)
	at java.util.concurrent.CompletableFuture.orApply(CompletableFuture.java:1391)
	... 8 more
```

第二种方式，我们链式编程引入`.exceptionally`进行异常处理

```java
package com.yuwei.multi.completablefuturerun;

import java.util.concurrent.CompletableFuture;

public class _05_otherAsync {
    public static void main(String[] args) {
        SmallTool.printTimeThread("张三出门，来到公交站");
        SmallTool.printTimeThread("等待 700路 或者 800路公交到来");
        CompletableFuture<String> busFuture = CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("700路公交正在赶来");
            SmallTool.sleepMills(100);
            return "700路公交到了";
        }).applyToEither(CompletableFuture.supplyAsync(() -> {
            SmallTool.printTimeThread("800路公交正在赶来");
            SmallTool.sleepMills(200);
            return "800路公交到了";
        }), firstComeBus -> {
            SmallTool.printTimeThread(firstComeBus);
            if(firstComeBus.startsWith("700")){
                throw new RuntimeException("撞树了");
            }
            return firstComeBus;
        }).exceptionally(throwable -> {
            SmallTool.printTimeThread(throwable.getMessage());
            SmallTool.printTimeThread("张三叫出粗车");
            return "出租车 交到了";
        });
        SmallTool.printTimeThread(busFuture.join()+"张三坐车回家");

    }
}

```

```console
1662812504422	|	1	|	main	|	张三出门，来到公交站
1662812504422	|	1	|	main	|	等待 700路 或者 800路公交到来
1662812504451	|	20	|	ForkJoinPool.commonPool-worker-25	|	700路公交正在赶来
1662812504451	|	21	|	ForkJoinPool.commonPool-worker-18	|	800路公交正在赶来
1662812504562	|	20	|	ForkJoinPool.commonPool-worker-25	|	700路公交到了
1662812504562	|	20	|	ForkJoinPool.commonPool-worker-25	|	java.lang.RuntimeException: 撞树了
1662812504562	|	20	|	ForkJoinPool.commonPool-worker-25	|	张三叫出粗车
1662812504562	|	1	|	main	|	出租车 交到了张三坐车回家
```

