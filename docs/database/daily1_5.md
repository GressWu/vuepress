---
title: SQL每日一题(1-5)
date: 2022-08-03
categories:
- DataBase
tags:
- MySql
---

## F0215

```sql
CREATE TABLE F0215
(
  StuID INT,
  CID VARCHAR(10),
  Course INT
)

  INSERT INTO F0215 VALUES
(1,'001',67),
(1,'002',89),
(1,'003',94),
(2,'001',95),
(2,'002',88),
(2,'004',78),
(3,'001',94),
(3,'002',77),
(3,'003',90);
```

### 查询既学习过001课程，也学过003课程的学生

* 子查询先筛选出学过001的学生，在这些学生中在筛选学了003的学生先分别筛选出学过001和学过003的学生，再去取他们的交集

  ```sql
  SELECT
  	StuID
  from
  	F0215 f2
  where
  	f2.StuID in (
  	SELECT
  		StuID
  	from
  		F0215 f
  	where
  		f.CID = '001')
  	and f2.CID = '003';
  ```

* 先分别筛选出学过001和学过003的学生，再去取他们的交集

  ```sql
  SELECT
  	f.StuID
  from
  	F0215 f,
  	F0215 f2
  where
  	f.CID = '001'
  	and f2.CID = '003'
  	and f.StuID = f2.StuID ;
  ```

* 根据学生Id分组查询即学过001，又学过003的学生

  ```sql
  SELECT
  	StuID
  from
  	F0215 f
  where
  	CID in('001', '003')
  group by
  	StuID
  HAVING
  	COUNT(StuID) = 2;
  ```

* 联合查询

```sql
SELECT
	stuid
from
	(
	select
		stuid
	from
		F0215
	where
		Cid = '001'
UNION ALL
	select
		stuid
	from
		F0215
	where
		Cid = '003') A
GROUP BY
	stuid
HAVING
	COUNT(stuid) = 2 ;
```

## F0216

```sql
CREATE TABLE F0216
(Num INT );

INSERT INTO F0216 VALUES
(1),(2),(3),
(4),(5),(6),
(7),(8),(9);
```

### 求出每三个或两个不同数相加的和等于10，该如何求解，有多少个解

```sql
SELECT
	A.Num ,
	B.Num ,
	C.Num
from
	F0216 A,
	F0216 B,
	F0216 C
where
	A.Num + B.Num + C.Num = 10
	and A.Num <> B.Num
	and B.Num <> C.Num
	and C.Num <> A.Num
union
SELECT
	A.Num ,
	B.Num,
	NULL
from
	F0216 A,
	F0216 B
where
	A.Num + B.Num = 10
	and A.Num <> B.Num ;
```

## F0217

```sql
CREATE TABLE F0217
(
ID INT,
Uname VARCHAR(20),
Price INT,
BuyDate VARCHAR(20)
);

INSERT INTO F0217 VALUES
(1,'张三',180,'2021/12/1'),
(2,'张三',280,'2021/12/7'),
(3,'李四',480,'2021/12/10'),
(4,'李四',280,'2021/12/11'),
(5,'王五',280,'2021/12/1'),
(6,'王五',880,'2021/12/11'),
(7,'王五',380,'2021/12/15');
```

### 取所有记录中Uname的Price的最大值所对应的那行完整数据

* 内连接筛选

```sql
SELECT
	a.*
from
	F0217 a ,
	(
	SELECT
		uname,
		MAX(Price) as price
	from
		F0217
	group by
		uname) b
where
	a.uname = b.uname
	and a.price = b.price;
```

* 开窗函数

```sql
SELECT
	a.Id,
	a.Uname,
	a.price,
	a.BuyDate
from
	(
	SELECT
		*,
		Row_number() over (partition by uname
	ORDER by
		price desc) as num
	from
		F0217) a
where
	a.num = '1';
```

内连接会更好一些，比如最大的结果有两条那么开窗函数就会不起作用，取到最大的还是一条数据

## F0221

```java
-- 学生信息表
CREATE TABLE F0221A(stuID INT,classID VARCHAR(20),stuName VARCHAR(20));

INSERT INTO F0221A VALUES(1,'A','张三'),(2,'A','李四'),(3,'B','王五');

-- 班级信息
CREATE TABLE F0221B(classID VARCHAR(20),className VARCHAR(20));

INSERT INTO F0221B VALUES ('A','一班'),('B','二班');

-- 成绩表
CREATE TABLE F0221C(stuID INT,course VARCHAR(20),score INT);

INSERT INTO F0221C VALUES
(1,'语文',80),
(1,'数学',90),
(1,'英语',90),
(2,'语文',89),
(2,'数学',91),
(2,'英语',88),
(3,'语文',95),
(3,'数学',77),
(3,'英语',72);
```

### 查询一班各科成绩最高的学生姓名和对应的分数

```sql
SELECT
	a1.stuName,
	c1.course,
	c1.score
from
	F0221A a1,
	(
	SELECT
		c.course ,
		MAX(c.score) as score
	from
		F0221C c,
		F0221A a,
		F0221B b
	where
		a.classId = b.classId
		and b.classname = '一班'
		and c.stuId = a.StuId
	group by
		c.course) d ,
	F0221C c1
where
	a1.stuId = c1.StuId
	and c1.score = d.score
	and c1.course = d.course;
```

## F0222

```sql
CREATE TABLE F0222
(
X INT
);
INSERT INTO F0222 VALUES
(-2),
(0),
(2),
(5);

```

### 找到这些点中最近两个点之间的距离

```java
SELECT
	MIN( (ABS(A.X-B.x) ) from F0222 A, F0222 B where A.X <> B.X;
```

