---
title: SQL每日一题(1-5)
date: 2022-08-03
categories:
- database
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

**查询既学习过001课程，也学过003课程的学生**

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

