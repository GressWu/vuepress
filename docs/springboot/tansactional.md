---
title: SpringBoot事务处理Transactional
date: 2022-03-20
categories:
 - backEnd
tags:
 - springBoot
---
## 1. SpringBoot事务

执行多条SQL，要么都成功，要么都失败

第一种：编程式事务管理，推荐使用TransactionTemplate

第二种：声明式事务管理，基于AOP原理注解@Transactional

## 2. 准备

### 建表语句

```sql
-- 订单表
CREATE TABLE `order_item` (
  `item_id` bigint NOT NULL COMMENT '订单ID',
  `goods_id` varchar(30) DEFAULT NULL COMMENT '商品ID',
  `count` int DEFAULT NULL COMMENT '数量',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '订单表'; 

-- 商品库存表
CREATE TABLE `good_stock` (
  `stock_id` bigint NOT NULL COMMENT '库存Id',
  `goods_id` varchar(30) DEFAULT NULL COMMENT '商品ID',
  `total` int DEFAULT NULL COMMENT '总数量',
  `sold` int DEFAULT NULL COMMENT '已售出',
  PRIMARY KEY (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '商品库存表'; 

-- 初始化数据
insert into good_stock  values (112233,'10000',10,0);
```

### 业务代码

实体类：

```java
package com.yuwwei.springbootweb.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.sun.org.glassfish.gmbal.Description;
import lombok.Data;

@Data
@TableName("good_stock")
public class GoodStock {
    @TableId(type = IdType.ID_WORKER)
    @Description("stock_id")
    private Long stock_id;

    @Description("goods_id")
    private String goods_id;

    @Description("total")
    private int total;

    @Description("sold")
    private int sold;
}

```

```java
package com.yuwwei.springbootweb.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.sun.org.glassfish.gmbal.Description;
import lombok.Data;

@Data
@TableName("order_item")
public class OrderItem {
    @TableId(type = IdType.ID_WORKER)
    @Description("item_id")
    private Long item_id;

    @Description("goods_id")
    private String goods_id;

    @Description("count")
    private int count;
}

```

mapper:

```java
package com.yuwwei.springbootweb.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuwwei.springbootweb.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderItemMapper extends BaseMapper<OrderItem> {
}

```

```java
package com.yuwwei.springbootweb.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuwwei.springbootweb.entity.GoodStock;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface GoodStockMapper extends BaseMapper<GoodStock> {

    @Update("update good_stock set sold = sold+#{reduceCount} where goods_id = #{goodsId} and total >= sold+#{reduceCount};")
    int reduceStock(@Param("goodsId") String goodsId,@Param("reduceCount") int reduceCount);
}

```

controller

```java
package com.yuwwei.springbootweb.controller;


import com.yuwwei.springbootweb.entity.OrderItem;
import com.yuwwei.springbootweb.mapper.GoodStockMapper;
import com.yuwwei.springbootweb.mapper.OrderItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderController {

    @Autowired
    OrderItemMapper orderItemMapper;

    @Autowired
    GoodStockMapper goodStockMapper;

    @GetMapping("/add/order")
    public String addOrder() throws Exception {

        //创建订单
        String result="sucess";
        OrderItem orderItem = new OrderItem();
        orderItem.setGoods_id("10000");
        orderItem.setCount(1);
        orderItemMapper.insert(orderItem);

        //扣减库存
        int count = goodStockMapper.reduceStock(orderItem.getGoods_id(), orderItem.getCount());
        if(count<=0){
            result = "false";
            throw new RuntimeException("扣减库存失败，库存不足");
        }
        return result;
    }
}

```

## 3. 问题引入

当我们创建订单的时候，库存会同样减少。当库存不足时，我们抛出异常扣减库存失败，库存不足。虽然库存没有再减少了，但订单表还是会产生数据。

![image-20220320135113844](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220320135113844.png)

## 4. 解决方式

类上加上`@Transactional`注解即可解决该问题

```java
@GetMapping("/add/order")
@Transactional
public String addOrder() throws Exception {

    //创建订单
    String result="sucess";
    OrderItem orderItem = new OrderItem();
    orderItem.setGoods_id("10000");
    orderItem.setCount(1);
    orderItemMapper.insert(orderItem);

    //扣减库存
    int count = goodStockMapper.reduceStock(orderItem.getGoods_id(), orderItem.getCount());
    if(count<=0){
        result = "false";
        throw new RuntimeException("扣减库存失败，库存不足");
    }
    return result;
}
```

当没有库存抛出异常时，订单数据也会自己回滚。

## 5. Transactional注解属性

#### propagation：事务传播行为

通俗来讲就是当有多个方法都操作数据库时，事务是怎么传播的

| 传播行为                                        | 含义                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| **TransactionDefinition.PROPAGATION_REQUIRED**  | 如果当前没有事务，就新建一个事务，如果已经存在一个事务，则加入到这个事务中。这是最常见的选择。（这个是默认的事务传播行为） |
| TransactionDefinition.PROPAGATION_SUPPORTS      | 支持当前事务，如果当前没有事务，就以非事务方式执行。         |
| TransactionDefinition.PROPAGATION_MANDATORY     | 表示该方法必须在事务中运行，如果当前事务不存在，则会抛出一个异常 |
| TransactionDefinition.PROPAGATION_REQUIRED_NEW  | 表示当前方法必须运行在它自己的事务中。一个新的事务将被启动。如果存在当前事务，在该方法执行期间，当前事务会被挂起。 |
| TransactionDefinition.PROPAGATION_NOT_SUPPORTED | 表示该方法不应该运行在事务中。如果当前存在事务，就把当前事务挂起。 |
| TransactionDefinition.PROPAGATION_NEVER         | 表示当前方法不应该运行在事务上下文中。如果当前正有一个事务在运行，则会抛出异常 |
| TransactionDefinition.PROPAGATION_NESTED        | 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与PROPAGATION_REQUIRED类似的操作。 |

#### isolation：事务隔离级别

 在实际开发过程中，我们绝大部分的事务都是有并发情况。下多个事务并发运行，经常会操作相同的数据来完成各自的任务。在这种情况下可能会导致以下的问题:

- 脏读（Dirty reads）—— 事务A读取了事务B更新的数据，然后**B回滚操作**，那么A读取到的数据是脏数据。
- 不可重复读（Nonrepeatable read）—— 事务 A 多次读取同一数据，事务 B 在事务A多次读取的过程中，对数据作了更新并提交，导致事务A多次读取同一数据时，结果不一致。
- 幻读（Phantom read）—— 系统管理员A将数据库中所有学生的成绩从具体分数改为ABCDE等级，但是系统管理员B就在这个时候插入了一条具体分数的记录，当系统管理员A改结束后发现还有一条记录没有改过来，就好像发生了幻觉一样，这就叫幻读。

这就是为什么要来考虑事务隔离性的问题：

| 隔离级别                                         | 含义                                                         | 脏读 | 不可重复读 | 幻读 |
| ------------------------------------------------ | ------------------------------------------------------------ | ---- | ---------- | ---- |
| TransactionDefinition.ISOLATION_DEFAULT          | 使用后端数据库默认的隔离级别                                 |      |            |      |
| TransactionDefinition.ISOLATION_READ_UNCOMMITTED | 允许读取尚未提交的数据变更(最低的隔离级别)                   | 是   | 是         | 是   |
| TransactionDefinition.ISOLATION_READ_COMMITTED   | 允许读取并发事务已经提交的数据                               | 否   | 是         | 是   |
| TransactionDefinition.ISOLATION_REPEATABLE_READ  | 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改（mySql默认） | 否   | 否         | 是   |
| TransactionDefinition.ISOLATION_SERIALIZABLE     | 最高的隔离级别，完全服从ACID的隔离级别，也是最慢的事务隔离级别，因为它通常是通过完全锁定事务相关的数据库表来实现的 | 否   | 否         | 否   |

> ​    ISOLATION_SERIALIZABLE 隔离规则类型在开发中很少用到。举个很简单的例子。咱们使用了ISOLATION_SERIALIZABLE规则。A,B两个事务操作同一个数据表并发过来了。A先执行。A事务这个时候会把表给锁住，B事务执行的时候直接报错。

​    **补充:**

- 事务隔离级别为ISOLATION_READ_UNCOMMITTED时，写数据只会锁住相应的行。
- 事务隔离级别为可ISOLATION_REPEATABLE_READ时，如果检索条件有索引(包括主键索引)的时候，默认加锁方式是next-key锁；如果检索条件没有索引，更新数据时会锁住整张表。一个间隙被事务加了锁，其他事务是不能在这个间隙插入记录的，这样可以防止幻读。
- 事务隔离级别为ISOLATION_SERIALIZABLE时，读写数据都会锁住整张表。
- 隔离级别越高，越能保证数据的完整性和一致性，但是对并发性能的影响也就越大。

#### timeout：超时时间

1. 事务需要在一定时间内提交，如果不提交会进行回滚
2. 默认值为-1（代表不设时间），设置时间以秒单位计算

#### readOnly:是否只读

1. 读：查询操作 写:添加修改删除操作
2. readOnly默认值false，表示可以查询，可以增删改
3. true就只能查

#### rollBackFor：回滚

设置哪些异常进行回滚

#### noRollbackfor:不回滚

哪些异常不进行回滚

举例：

```java
   @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.REPEATABLE_READ,timeout = 5,readOnly = false)
```

### 

## 事务失效场景

### 抛出Exception异常，会导致事务回滚失效

```java
if(true){
    throw new Exception("事务回滚");
}
```

原因是：Spring默认回滚的是RuntimeException的事务，不会处理Exception的事务

解决方法：指定哪些异常回滚

```java
    @Transactional(rollbackFor = Exception.class)
```

