---
title: 记一次生产OOM宕机的生产问题
date: 2024-06-29
categories:
- BackEnd
tags:
- Java
---
## 问题描述

生产上的应用忽然宕机，报内存溢出，无法创建新的线程。有趣的是应用宕机之后，起应用的用户无法登录到服务器，而root用户是可以登录到服务器上的。

```log
[24-6-19 23:24:16:330 CST] 000000c3 SystemOut     O 2024-06-19 23:24:16.098 [2962C469-5230-4701-83C3-111CFB496D58] [was] [pool-4-thread-5] ERROR com.xxx.osf.ServiceEngine - executeService error
java.lang.OutOfMemoryError: unable to create new native thread：retVal -1073741830, errno 11
	at java.lang.Thread.startImpl(Native Method)
	at java.lang.Thread.start(Thread.java:981)
	at java.util.concurrent.ThreadPoolExecutor.addWorker(ThreadPoolExecutor.java:968)
	at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1378)
	at com.xxx.app.interfaces.asynchronous.ProcessPool.start(ProcessPool.java:65)
	at com.xxx.app.interfaces.asynchronous.ProcessPool.createThreadPool(ProcessPool.java:57)
	at com.xxx.app.interfaces.asynchronous.ProcessPool.putClass(ProcessPool.java:46)
	at com.xxx.app.interfaces.asynchronous.BaseProcess.start(BaseProcess.java:109)
	at com.xxx.app.interfaces.asynchronous.BaseProcess.init(BaseProcess.java:57)
	at sun.reflect.GeneratedMethodAccessor177.invoke(Unknown Source)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:55)
	at java.lang.reflect.Method.invoke(Method.java:508)
	at com.xxx.osf.controller.ReflactionController.doExecuteService(ReflactionController.java:80)
	at com.xxx.osf.controller.ReflactionController.executeService(ReflactionController.java:48)
	at com.xxx.osf.ServiceEngine.executeService(ServiceEngine.java:65)
	at com.xxx.osf.server.ServerModel.service(ServerModel.java:654)
	at com.xxx.osf.server.StringPayloadServerModel.service(StringPayloadServerModel.java:34)
	at com.xxx.osf.server.StringPayloadSocketServer$OSFSocketTask.run(StringPayloadSocketServer.java:266)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1160)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
	at java.lang.Thread.run(Thread.java:811)
```

## 问题分析

通过日志报错分析，线程无法创建有两种原因，第一种是操作系统内存不够了，第二种是达到了操作系统参数限制。首先查看操作系统内存，有很大剩余，然后使用ulimit -u命令查看应用服务器was用户下max user processes参数为4096，基本确定是was用户下服务器最大进程数都被占用了，导致线程无法创建从而引发内存溢出报错。

排查代码内哪里创建大量线程。通过**javacore文件**（有关Java虚拟机（JVM）线程的信息，例如线程的状态、堆栈跟踪和锁定信息。它通常用于分析应用程序的性能问题和死锁问题）查看线程信息。发现was创建20线程，属于正常情况。继续往下分析，发现应用创建了984个线程未关闭。因此怀疑可能是该原因导致报错。

### 利用IBM Thread and Monitor Dump Analyzar for Java分析Javacore文件

![image-20240629204653200](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240629204653200.png)

将javacore导入分析，我们发现当前应用所在的用户的最大线程数为4096个。

![image-20240629204943135](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240629204943135.png)

再结合线程状态分析有高达4009个线程处于Parked状态，可以定位就是这里的问题

![image-20240629205236339](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240629205236339.png)

打开该文件分析后，发现同事写的线程池并没有起到应有的作用，反而是每过来一个请求就创建了一个核心线程为4的线程池，并且线程池不会销毁，核心线程无法被回收，因此造成了这次严重的生产事故。

## 解决方案

线程池采用单例模式，避免重复创建线程池消耗资源。

```java
import java.util.concurrent.ExecutorService;
import.util.concurrent.Executorspublic class MyThreadPool {
    private static ExecutorService threadPool = null;

    private MyThreadPool() {
        私有构造函数以阻止外部直接实例化
       public static synchronized ExecutorService getThreadPool() {
        if (threadPool == null) {
           Pool = Executors.newFixedThreadPool(10); // 这里以固大小的线程池为示例
        }
        return threadPool;
    }
}

```

## 补充JavaCore中线程的状态含义

1.死锁，Deadlock（重点关注）

2.执行中，Runnable（重点关注）

3.等待资源，Waiting on condition（重点关注）

4.等待监控器检查资源，Waiting on monitor(eg:如果使用System.out.println等需要分配计算机资源的时候线程会如此等待,主要还需看堆栈)

5.暂停，Suspended

6.对象等待中，Object.wait()

7.阻塞，Blocked（重点关注）

8.停止，Parked(此状态必须明确,与字面意思不同,主要是指线程空闲时候的状态.如在线程池中,当线程被调用使用后再次放入到池子中,则其状态变为了Parked)