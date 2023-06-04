---
title: &与&&的区别
date: 2021-02-22
categories:
- BackEnd
tags:
- Java
---



&按位与

&& 逻辑与

其中&&具有短路的功能，即前一个条件不满足，就不会在走第二个条件了。&前一个条件不满足也会走第二个条件。

## 举例说明

这是一个常见的判空动作，如果名字不为空，则输出打印相关文字。

### &&逻辑与

```java
package com.yuwei.abstractclass;

public class uu {
    public static void main(String[] args) {
        String name = "";
        name = null;

        if(name != null && !name.equals("")){
            System.out.println("哇哈哈");
        }
    }
}
```

不满足条件什么也不输出

### &按位与

```java
package com.yuwei.abstractclass;

public class uu {
    public static void main(String[] args) {
        String name = "";
        name = null;

        if(name != null & !name.equals("")){
            System.out.println("哇哈哈");
        }
    }
}
```

```
Exception in thread "main" java.lang.NullPointerException
	at com.yuwei.abstractclass.uu.main(uu.java:8)

Process finished with exit code 1
```

直接空指针异常，因为按位与两个都会走，空对象.方法名必会报错。但是特别需要注意的是即使使用第一种方式，判空的时候也应该写成`"".equals(name)`