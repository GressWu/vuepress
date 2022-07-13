---
title: UML简介
date: 2022-07-13
categories:
- UML
tags:
- UML
---

![image-20220713213205533](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220713213205533.png)

## UML涉及到的十种用例图

1. 用例图
2. 类图
3. 对象图
4. 包图
5. 部署图
6. 活动图
7. 状态图
8. 序列图
9. 协作图
10. 组件图

## 类图

### 具体类

具体类在类图中用矩形框表示，矩形框分为三层：

第一层是类名字。

第二层是类的成员变量；

第三层是类的方法。

成员变量以及方法前的访问修饰符用符号来表示：

```java
package com.yuwei;

public class Dog {

    private String name = "小花";

    protected Integer age;

    public String host;

    Boolean alive;

    public void eat(int i){
        System.out.println("狗吃肉"+ i);
    }

    public String getName(){
        return this.name;
    }
}
```

![image-20220713213121755](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220713213121755.png)

**访问修饰符：**

private -

protected #

public +

default 空

### 接口

与具体类画法类似

```java
package com.yuwei;

public interface Fly {
    
    public void init();
    
    int BaseFund();
}
```

![image-20220713214027365](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220713214027365.png)

### 抽象类