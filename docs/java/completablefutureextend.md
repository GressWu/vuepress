---
title: CompletableFuture扩展
date: 2022-09-12
categories:
- backEnd
tags:
- Java
---

## supplyAsync

![image-20220912091740741](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912091740741.png)

## thenCompose

![image-20220912092030423](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912092030423.png)

## thenCombine

![image-20220912092151936](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912092151936.png)

从以上的三个API，我们可以看出来，之前学习的API都包含以下形式

```java
XXX(arg)
XXXAsync(arg)
XXXAsync(arg,Executor)
```

## xxx与xxxAsync的区别

![image-20220912093249791](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912093249791.png)

![image-20220912093445639](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912093445639.png)

以`thenApplyAsync`为例，不带`Async`的方法会将任务看成一个整体，放到一个线程中执行。而带`Async`的方法会将任务看成是两个不同的任务，因此会放在不同的线程中执行，第二个线程会拿到第一个线程的参数继续执行。



不过即便加了`Async`后仍然可能出现下面的结果

```
1662948217492	|	1	|	main	|	小白吃好了
1662948217492	|	1	|	main	|	小白 结账、要求开发票
1662948217524	|	20	|	ForkJoinPool.commonPool-worker-25	|	服务员A收款 500元
1662948217524	|	1	|	main	|	小白接电话，想打游戏
1662948218028	|	20	|	ForkJoinPool.commonPool-worker-25	|	服务员B开发票 500元
1662948218239	|	1	|	main	|	小白拿到500元发票准备回家
```

**为什么会出现这种情况呢？**

其实现在已经是分为两个方法执行了，虽然表面上看都是二十号线程执行的任务。实际上有可能是20号线程，执行速度太快，jvm发现该线程空闲就继续让20号线程工作了。这就是线程复用导致的。

## 常用API及其衍生兄弟

### supplyAsyn与runAsync

![image-20220912101258186](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912101258186.png)

开启异步，除了我们之前一直用的`supplyAsync`方法，其实还有`runAsync`方法，区别就在于一个有返回值，一个无返回值。

### thenApply与thenAccept、thenRun

![image-20220912101720167](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912101720167.png)

`thenAccept`会接受前面一个任务的返回值，但是没有返回值

![image-20220912101813139](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912101813139.png)

`thenRun`不会接受前一个任务的返回值，且没有返回值

### thenCombine与thenAcceptBoth、runAfterBoth

![image-20220912102206416](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912102206416.png)

`thenAcceptBoth`获取前两个值，但是没有返回值

![image-20220912102345183](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912102345183.png)

`runAfterBoth`不关心前面传的值，并且没有返回值。

### applyToEither与accpetEither、runAfterEither

`accpetEither`获取最快的任务但是没有返回值

`runAfterEither`不关心哪个任务快也没有返回值

### exceptionall与handle、whenComplete

`handle`成功接收返回值，失败接受异常，并会有返回值

`whenComplete`成功接收返回值，失败接受异常，不会有返回值

![image-20220912103310873](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912103310873.png)