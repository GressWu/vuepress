---
title: BigDecimal常见问题
date: 2022-06-22
categories:
 - backEnd
tags:
 - Java
---

## BigDecimal类型的比较

比较BigDecimal类型的数据一定要用`compareTo`的函数进行比较，如果使用`==`或者是`equals`方法是不会得到正确结果的。

a.compareTo(b);

如果a小于b，返回值为-1

如果a大于b，返回值为1

如果a等于b，返回值为0

```java
package com.yuwei;

import java.math.BigDecimal;

public class BigDecimalTest {
    public static void main(String[] args) {
        BigDecimal bigDecimal = new BigDecimal("1");
        BigDecimal bigDecimal1 = new BigDecimal("1.0");

        if(bigDecimal == bigDecimal1){
            System.out.println("1");
        }

        if(bigDecimal.equals(bigDecimal1)){
            System.out.println("2");
        }

        if(bigDecimal.compareTo(bigDecimal1)==0){
            System.out.println("3");
        }

      
        
    }
}

```

## 丢失精度问题

由于计算机是二进制运算的，我们如果使用浮点类型进行计算，就会产生很严重的精度丢失，尤其对于金额类的数据更有可能造成不可估量的损失。使用BigDecimal的数据能很好的解决该问题，但是一定要注意，**在进行浮点数转换BigDecimal类型转换的时候，一定要注意先将浮点数转为字符串类型，再转为BigDecimal类型会造成精度丢失。**

```java
//字符串转BigDecimal
BigDecimal bigDecimal3 = new BigDecimal("1.0");
//浮点数转BigDecimal
BigDecimal bigDecimal4 = BigDecimal.valueOf(23.33);
//上面的API实际上是将23.33先转换为“23.33”然后再转换为BigDecimal类型
BigDecimal bigDecimal5 = new BigDecimal(Double.toString(23.33));
```

