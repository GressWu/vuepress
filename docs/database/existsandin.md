---
title: EXISTS和IN
date: 2022-09-01
categories:
- DataBase
tags:
- MySql
---

## 例子

查找不是一班的所有同学

**建表语句**：

```sql
CREATE TABLE STUDENT (
ID INT,
CLASSID INT,
STUDENTNAME varchar(32)
);

CREATE TABLE CLASS(
CLASSID INT,
CLASSNAME varchar(32)
);

INSERT INTO STUDENT VALUES (1,1,'张三');
INSERT INTO STUDENT VALUES (2,1,'李四');
INSERT INTO STUDENT VALUES (3,2,'王五');
INSERT INTO STUDENT VALUES (4,2,'欧阳');
INSERT INTO STUDENT VALUES (5,3,'黑猫');

INSERT INTO CLASS VALUES (1,'一班');
INSERT INTO CLASS VALUES (2,'二班');
INSERT INTO CLASS VALUES (3,'三班');
```

**SQL应用**:

```sql
SELECT st.* from STUDENT st where  EXISTS(select 1 from CLASS ca where st.CLASSID = ca.CLASSID and ca.CLASSNAME = '一班');
select * FROM STUDENT st where st.classID  in (SELECT CLASSID from CLASS where CLASSNAME = '一班');
```

## 区别

**Exists**会遍历外表，将外查询的每一行，代入内查询进行判断，当exists里的条件语句能返回行时，条件就为真，返回外表当前记录。如果条件为假，则外表当前记录被丢弃。

**In**是先把后面的语句查出来放到临时表中，然后遍历临时表，将临时表中的每一行，代入外查询去查找。

## 使用场景

当子查询的表比较大时，使用Exists可以有效减少总循环次数来提升速度

当外查询的表比较大时，使用in可以有效减少总循环次数来提升速度



