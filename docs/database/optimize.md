---
title: SQL优化
date: 2022-09-13
categories:
- DataBase
tags:
- MySql
---

# SQL优化

## MySQL分层

![image-20220912170922211](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220912170922211.png)

InnoDB与MyISAM引擎的区别

InnoDB : 事物优先，适用于高并发操作，行锁

MyISAM：性能优先；表锁

## SQL优化方向

性能低、执行时间长、等待时间长、SQL语句欠佳、索引失效、服务器参数设置不合理（缓冲、线程）；



### SQL执行过程

编写过程 ：

```sql
select distinct .. from .. join .. on .. where .. group by .. having .. order by .. limit ..
```

解析过程：

```sql
from .. on .. join .. where .. group by .. having .. select distinct .. order by .. limit ..
```

具体可以详见：

[MySQL查询执行流程-SQL解析顺序 - Saltery - 博客园 (cnblogs.com)](https://www.cnblogs.com/saltish/p/16564198.html)

## 索引

### 优化索引

索引：相当于书的目录，index是帮助MySQL高校获取数据的**数据结构**。（默认B树）

使用索引的弊端：

* 索引本身很大，可以存放在内存/硬盘
* 索引不适用于：少量数据、频繁更新的字段（会影响树的结构）、很少使用的字段
* 索引会降低增删改的效率

使用索引的优势：

* 提高查询效率（降低IO使用率）
* 降低CPU使用率

### 索引分类

单值索引：单列；一个表中可以有多个单值索引 (name)

唯一索引：不能重复，（id)  可以是NULL

主键索引：不能重复，比如主键 (id) 不能是NULL

复合索引：多个列构成的索引（相当于二级目录）(name,age) 如果第一个全部命中，例如找张三，整个库里只有一个张三，那么查找到此为止，不会在去查找age了。

### 创建索引

* 方式一：

```
create 索引类型 索引名 on 表(字段)
```

单值索引：给STUDENT表的NAME建一个名为name_index的索引

```sql
create index name_index on STUDENT(NAME);
```

唯一索引：给STUDENT表的id建一个名为id_index的唯一索引

```sql
create unique index id_index on STUDENT(ID);
```

复合索引：给STUDENT表的DEP、NAME建一个名为dep_name_index的复合索引

```sql
create index dep_name_index on STUDENT(DEP,NAME);
```

* 方式二：

```sql
alter table 表名 add 索引类型 索引名(字段)
```

**注意**：如果一个字段是主键、那么他默认就是**主键索引**

### 删除索引

```sql
drop index 索引名 on 表名;
```

删除STUDENT表的id_index索引

```sql
DROP index id_index on STUDENT;
```

### 查询索引

```sql
show index from 表名;
```

查询STUDENT表有哪些索引

```sql
show index from STUDENT ;
```

## SQL性能问题

分析SQL执行计划

```sql
explain SQL语句
```

例如：

```sql
explain SELECT * from STUDENT where Id = '1' ;	
```

| id（编号） | select_type（查询类型） | table（表） | type（类型） | possible_keys（预测用到的索引） | key（实际使用的索引） | key_len（实际使用的长度） | ref（表之间的引用） | rows（通过索引筛选的数据） | filtered |
| ---------- | ----------------------- | ----------- | ------------ | ------------------------------- | --------------------- | ------------------------- | ------------------- | -------------------------- | -------- |
| 1          | SIMPLE                  | STUDENT     | ref          | id_index                        | id_index              | 5                         | const               | 1                          | 100.0    |

**数据准备**：

```sql
create table course(
cid int(3),
cname varchar(20),
tid int(3)
);

create table teacher(
tid int(3),
tname varchar(20),
tcid int(3)
);

create table teacherCard(
tcid int(3),
tcdesc varchar(200)
);

INSERT into course values(1,'java',1);
INSERT into course values(2,'html',1);
INSERT into course values(3,'sql',2);
INSERT into course values(4,'web',3);


INSERT into teacher values(1,'tz',1);
INSERT into teacher values(2,'tw',2);
INSERT into teacher values(3,'tl',3);

INSERT into teacherCard values(1,'tzdesc');
INSERT into teacherCard values(2,'twdesc');
INSERT into teacherCard values(3,'tldesc');
```

​

## explain的用法

### 数据准备

```sql
create table course(
cid int(3),
cname varchar(20),
tid int(3)
);

create table teacher(
tid int(3),
tname varchar(20),
tcid int(3)
);

create table teacherCard(
tcid int(3),
tcdesc varchar(200)
);

INSERT into course values(1,'java',1);
INSERT into course values(2,'html',1);
INSERT into course values(3,'sql',2);
INSERT into course values(4,'web',3);


INSERT into teacher values(1,'tz',1);
INSERT into teacher values(2,'tw',2);
INSERT into teacher values(3,'tl',3);

INSERT into teacherCard values(1,'tzdesc');
INSERT into teacherCard values(2,'twdesc');
INSERT into teacherCard values(3,'tldesc');
```

### 联表查询

查询cid为2，或者tcid为3的教师证信息。

```sql
SELECT tc1.* from course cs,teacher tc,teacherCard tc1 where cs.tid = tc.tid and tc1.tcid = tc.tcid  and (cs.cid = '2' or tc.tcid  = '3');
```

![image-20220915220845145](C:\Users\11629\AppData\Roaming\Typora\typora-user-images\image-20220915220845145.png)

id值相同，从上到下，顺序执行

### 子查询

id值不同，由大到小，顺序执行 cs->teacher->tc1 ，从最内层顺序查询

```sql
SELECT * from teacherCard tc1 where tc1.tcid = (SELECT tcid from teacher where tid = (SELECT tid from course cs where cs.cid = '2'));

```

![image-20220920203916875](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220920203916875.png)

### 子查询加联表

id值越大越执行，然后在按照从上往下执行

```sql
SELECT * from teacherCard tc1 where tc1.tcid = (SELECT  t.tcid from teacher t ,course c where t.tid  = c.tid AND  c.cid = '2');
```

![image-20220920204654753](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220920204654753.png)

## SelectType查询类型

Primary：包含子查询SQL的主查询（最外层）

SubQuery:包含子查询SQL中的子查询（非最外层）

Simple：简单查询 （不包含子查询和union查询）

derived：衍生查询 （union查询）

![image-20220920205930078](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220920205930078.png)

## Type索引类型

type优化前提是有索引

效率从高到低 system>const>eq_ref>>ref>range>index>all

其中：system,const只是理想状态  实际上ref>range>

### 了解

system：

* 只有一条数据的表
* 衍生表只有一条数据

const：

* 仅仅能查到一条数据的sql
* 必须使用主键索引或唯一索引

eq_ref：

* 索引所在列每一条数据都是唯一的数据，不可重复。比如name，只有一个人叫张三。
* 常见于唯一索引与主键索引

### 掌握

ref：

* 非唯一性索引
* 返回0或多条数据

```sql
INSERT into teacher values(4,'tz',4);
create index tname_index on teacher(tname);
SELECT * from teacher where tname  = 'tz';
explain SELECT * from teacher where tname  = 'tz';
```

![image-20220920212613013](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220920212613013.png)