---
title: SQL多表优化
date: 2022-11-06
categories:
- DataBase
tags:
- MySql
---
## 两表数据准备

```java
create table teacher2(
	tid int(4) primary key,
	cid int(4) not null
); 
INSERT into teacher2 values(1,2);
insert into teacher2 values(2,1);
insert into teacher2 values(3,3);

create table course2(
	cid int(4),
	cname varchar(20)
)
INSERT into course2 values(1,'java');
INSERT into course2 values(2,'python');
INSERT into course2 values(3,'kotlin');


```

## 索引放在哪张表

### 小表驱动大表

小表数据量：10

大表数据量：300

where 小表.id = 大表.id

```java
//如果是小表在前，大表在后
for(int i = 0;i<10;i++){
	for(int j=0;j<300;j++){
	
	}
}
//如果是大表在前，小表在后
for(int i = 0;i<300;i++){
	for(int j=0;j<10;j++){
	
	}
}
```

从总数来看都是3000次，但是

![20150304095709624](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/20150304095709624.jpg)
因此外循环放小数据更优。

### 索引建立经常使用的字段

### 索引一般加给主表



### 例子

```sql
SELECT * from teacher2 t left join course2 c on t.cid = c.cid where cname = 'java';  
```

t.cid字段频繁使用，且t是小表

* 未优化前

  ![image-20221106160515718](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221106160515718.png)

* 优化后

```sql
alter table teacher2 add index index_teacher2_cid(cid);
```

![image-20221106160832340](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221106160832340.png)

## 多表优化

1. 小表驱动大表，需要分析哪张表的数据量最小，将其作为驱动表
2. 索引建立在经常查询的字段，驱动表的where条件建索引
3. 对被驱动表的连接字段建立索引

