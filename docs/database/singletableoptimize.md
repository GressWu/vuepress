---
title: SQL单表优化
date: 2022-09-26
categories:
- DataBase
tags:
- MySql
---

先看走不走索引 再看回不回数据表

## 创建数据库表

```sql
create table book
(
	bid int(4) primary key,
	name varchar(20) not null,
	authorid int(4) not null,
	publicid int(4) not null,
    typeid int(4) not null,
)


insert into book values(1,'java',1,1,2);
insert into book values(2,'tc',2,1,2);
insert into book values(3,'wx',3,2,1);
insert into book values(4,'math',4,2,3);
```

## 需求

查询authorid = 1 且 typeid为2或3的bid

## 逐步优化

```sql
select bid from book where typeid in (2,3) and authorid = 1 order by typeid desc;
```

![image-20220926210143387](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220926210143387.png)

**优化一：**

```sql
alter table book add index idx_bta(bid,typeid,authorid);
```

![image-20220926210409315](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220926210409315.png)

分析：这种优化没有考虑SQL实际解析的顺序，应该调整索引的顺序

**优化二：**

```sql
alter table book add index idx_tab(typeid,authorid,bid);
```

![image-20220926211056033](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220926211056033.png)

分析：比如in(1,2)里面有多列会造成索引失效

**优化三：**

```sql
select bid from book where authorid = 1 and typeid in (2,3) order by typeid desc;
```

```sql
alter table book add index idx_atb(authorid,typeid,bid);
```

![image-20220926212022739](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220926212022739.png)

## 总结

* 最佳左前缀，保持索引的定义和使用的顺序一致
* 索引需要逐步优化，删除之前的索引，防止索引冲突
* 将包含in的放到放在where条件的最后面