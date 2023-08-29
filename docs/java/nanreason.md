---
title: NaN值出现的原因分析
date: 2023-08-29
categories:
 - BackEnd
 - FrontEnd
tags:
 - Java
---

最近接手了一个同事的项目，在测试过程中，日志一直在报某个值为NaN，无法序列化为Json。我的第一反应是某个值类型转换出问题了，例如JS中字符类型转数值类型就会报NaN。但日志报错是在后端，并不是在前端，这就想起了很久之前看的一个技术细节。

## 后端是如何产生NaN值的

首先在数学概念中，除数不能为0，否则该除数没有意义。在程序设计中，同样如此，我们要注意这一点。问题出现了前面一个同事的代码这里没有做异常处理，如 Z =X / Y,但是此时Y为0.0d。

这里怎么没报错？其实整型和浮点数对于除数为0的处理是不一样的。

### 整型

符合预期直接报错

```java
System.out.println(0/0);

java.lang.ArithmeticException: / by zero
```

### 浮点型

我们可以看到除数为0并不会报错，反而有三种值

```
System.out.println(12.0d/0d);
System.out.println(-12.0d/0d);
System.out.println(0d/0d);
```

## 扩展：JS中NaN值的出现情况

有五种不同类型的操作返回 `NaN`：

- 失败的数字转换（例如，显式转换，如 `parseInt("blabla")`、`Number(undefined)`，或隐式转换，如 `Math.abs(undefined)`）
- 计算结果不是实数的数学运算（例如，`Math.sqrt(-1)`）
- 不定式（例如，`0 * Infinity`、`1 ** Infinity`、`Infinity / Infinity`、`Infinity - Infinity`）
- 一个操作数被强制转换为 `NaN` 的方法或表达式（例如，`7 ** NaN`、`7 * "blabla"`）——这意味着 `NaN` 具有传染性
- 将无效值表示为数字的其他情况（例如，无效的 [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date) `new Date("blabla").getTime()`、`"".charCodeAt(1)`）