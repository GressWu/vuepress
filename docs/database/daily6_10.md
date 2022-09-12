---
title: SQL每日一题(6-10)
date: 2022-08-11
categories:
- DataBase
tags:
- MySql
---

## F0244

```sql
CREATE TABLE F0224 (
ID INT,
金额 INT
)

INSERT INTO F0224 VALUES (2,30);
INSERT INTO F0224 VALUES (3,30);
INSERT INTO F0224 VALUES (4,30);
INSERT INTO F0224 VALUES (11,9);
INSERT INTO F0224 VALUES (12,1);
INSERT INTO F0224 VALUES (13,1);
INSERT INTO F0224 VALUES (14,15);
INSERT INTO F0224 VALUES (15,33);
INSERT INTO F0224 VALUES (16,5);
INSERT INTO F0224 VALUES (17,8);
INSERT INTO F0224 VALUES (18,14);
INSERT INTO F0224 VALUES (19,3);
```

### 查询出从第一条记录开始到第几条记录 的累计金额刚好超过100？至少两种方法求解

```sql
-- 开窗函数累加
SELECT
	MIN(t.id)
from
	(
	SELECT
		id,
		SUM(金额) over (
		order by Id) 金额
	from
		F0224) t
where
	t.金额 >100;
	

-- 内连接
SELECT
	MIN(id)
from
	(
	SELECT
		b.ID,
		SUM(a.金额) as 金额
	FROM
		F0224 a,
		F0224 b
	where
		b.ID >= a.ID
	GROUP by
		b.ID
	HAVING
		SUM(a.金额) >100) t;
```

