---
title: 避免索引失效与常见优化方法
date: 2022-11-06
categories:
- DataBase
tags:
- MySql
---

## 避免索引失效

*  复合索引，不要跨列或无序使用（最佳左前缀）
*  复合索引，尽量使用全索引匹配
*  不要在索引上进行任何操作（计算、函数、类型转换），否则索引失效
*  复合索引，不能使用不等于（!= <>）或 is null(is not null)，否则索引失效
*  一般而言，范围查询(> < in)，**之后**的索引会失效
*  like 尽量以常量开头，不要以%开头，否则索引失效
*  补救措施（通用）

直接查询tid的值，**覆盖索引**索引不会失效。但是select * 索引便会失效

```java
select tid frm teacher where tid like '%1%';
```

* 尽量不使用**类型转换**，负责索引失效
* 尽量不要使用or，负责索引失效

理论与实际上有差距，可以通过结论去优化，但是实践由于sql优化器的存在，可能与我们想的不一致。

## 常见优化方法

* exist和in(小表驱动大表)

```sql
select  .. from table where exist/in (子查询)
```

如果主查询数据大，则使用in（从里到外，效率高

如果子查询数据大，则使用exist（从外到里），效率高

* order by

1.using filesort 有两种算法：双路排序，**单路排序**（现在用的是这个，为了减少IO）

只读取一次（全部字段），在内存中排完序（数据量太大内存会不够）

如果max_length_for_sort_data值太低，则mysql会从单路变双路

```sql
set max_length_for_sort_data =1024
```

2.避免使用哦那个select *

3.复合索引 不要跨列使用

4.保证全部排序字段排序一致性（升序或者降序）

