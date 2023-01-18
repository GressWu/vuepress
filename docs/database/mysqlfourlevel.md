---
title: MySQL的四种隔离级别
date: 2023-01-02
categories:
- DataBase
tags:
- MySql
---

## 四种事务隔离机制

1. Serializable 序列化，**同一时间只能有一个事务在执行**。

2. repeatable read 可重复读（默认），**在同一个事务下执行多次相同的select语句，获得的结果是相同的，看不到其他事务对数据的改变。**

   可能会出现幻读。

3. read commited ，提交读 其他事务提交后，可以看到其他事务对数据的改变。

​	   可能会出现不可重复读，幻读。

2. read uncommited 未提交读 其他事务修改不提交，也能看到其他事务对数据的改变。

​		可能会出现不可重复读，幻读，脏读。

**注**：隔离级别从高到低，效率从低到高

## 查看当前所使用的隔离级别

我这里的Mysql版本是8版本以上，8版本一下需将transaction替换为tx

```sql
-- 查看全局级别
SELECT @@global.transaction_isolation;
-- 查看当前会话级别
select @@session.transaction_isolation;
```

## 修改事务隔离级别

```sql
SET [SESSION | GLOBAL] TRANSACTION ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE}
```

任何用户都能够修改当前session的隔离级别，但只有super才能更改全局的隔离级别

## 举例

### SERIALIZABLE

![image-20230102152415390](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102152415390.png)

![image-20230102152320412](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102152320412.png)

我们在script5的会话中创建一个事务，但是不commit。script4的事务级别改为序列化，同时也开启一个事务，但是我们发现script4未成功执行，因为序列化只允许同时一个事务在运行。必须前一个事务结束后，才能开启第二个事务。

### REPEATABLE READ

![image-20230102153624505](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102153624505.png)

![image-20230102153710867](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102153710867.png)

![image-20230102153743644](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102153743644.png)

我们现在script4中将事务级别改回可重复读，再script5中将名字改为李四，并且将script5的事务提交。这是再返回到script4中，发现查询到的仍然是张三。可重复读有点类似于某一时间的快照。

### READ COMMITTED

![image-20230102155604847](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102155604847.png)![image-![image-20230102155640376](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102155640376.png)

![image-20230102155901528](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20230102155901528.png)

将script4中的隔离级别改为read commited。并进行查询此时的结果为李四，这时在script5更新为张三并提交事务。在scrpit4中再进行查询，结果已经改变。该事务可以监听到其他事务带来的改变。

### READ UNCOMMITTED

与read commited不同，即使script5**没有**提交事务。script4也能看到script5修改过的数据，这就是脏读。