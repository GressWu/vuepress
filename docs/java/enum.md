---
title: enum枚举类的使用
date: 2020-09-08
categories:
 - backEnd
tags:
 - Java
---

快速定义所用通用数据，让使用者一目了然，明白变量的意思。

默认为静态变量，全局可用。

## enum枚举类的创建与使用

**1.创建**

直接在Idea中创建enum枚举类

以星期为例

```java
public enum WeekDay {

}
```



**2.enum的简单使用**

枚举类Weekday.java

```java
public enum WeekDay {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday;
}
```

测试类test.java

```java
public class test {
    public static void main(String[] args) {
        System.out.println(WeekDay.Friday);
    }
}
```

打印输出结果为`Friday`

**3.enum的增强使用**

枚举类Weekday.java

```java
public enum WeekDay {

    Monday("1","星期一"),								      //相当于利用底下的构造函数构造了一个id为1，name为星期一的对象Mondey
    Tuesday("2","星期二"),						
    Wednesday("3","星期三"),
    Thursday("4","星期四"),
    Friday("5","星期五"),
    Saturday("6","星期六"),
    Sunday("7","星期天");

    public final String id;
    public final String name;

    private WeekDay(String id,String name){					//私有构造函数
        this.id=id;
        this.name= name;
    }
    /**
     * 判断当前输入的参数值是否是枚举的一个值
     * @param id
     * @return
     */
    public static boolean isExist(String id) {				//判断是否
        return Monday.id.equals(id)
                || Tuesday.id.equals(id)
                || Wednesday.id.equals(id)
                || Thursday.id.equals(id)
                || Friday.id.equals(id)
                || Saturday.id.equals(id)
                || Sunday.id.equals(id);
    }
     /**
     * 判断当前输入的参数值是否是枚举的一个值
     *
     * @param id
     * @return
     */

    public static String getNameById(String id) {		  //根据Id返回名字
        for (WeekDay weekDay : WeekDay.values()) {
            if (weekDay.id.equalsIgnoreCase(id)) {
                return weekDay.name;
            }
        }
        return "";
    }

    /**
     * 判断当前输入的参数值是否是枚举的一个值
     *
     * @param name
     * @return
     */
    public static String getIdbyname(String name){		//根据name返回Id
        for (WeekDay weekDay : WeekDay.values()) {
            if(weekDay.name.equalsIgnoreCase(name)){
                return weekDay.id;
            }
        }
        return "";
    }
}
```

**注：**构造函数只能使用 private 访问修饰符

测试类test.java

```java
public class test {
    public static void main(String[] args) {
        System.out.println(WeekDay.Friday.id);			 //静态变量，类可以直接调用
        System.out.println(WeekDay.Friday.name);
    }
}
```

打印输出`5` `星期五`

**4.第二种枚举类的好处**

- 定义id值可以与数据库相对应
- 定义name值方便后期维护，可以让开发人员快速明白该枚举类表达的意思
- 可以通过Id或者name,快速拿到想要的数据

## 枚举类自带的一些方法

### values(), ordinal() 和 valueOf() 方法

enum 定义的枚举类默认继承了 java.lang.Enum 类，并实现了 java.lang.Seriablizable 和 java.lang.Comparable 两个接口。

values(), ordinal() 和 valueOf() 方法位于 java.lang.Enum 类中：

- values() 返回枚举类中所有的值。
- ordinal()方法可以找到每个枚举常量的索引，就像数组索引一样。
- valueOf()方法返回指定字符串值的枚举常量。

实例：

```java
enum Color
{
    RED, GREEN, BLUE;
}
 
public class Test
{
    public static void main(String[] args)
    {
        // 调用 values()
        Color arr[] = Color.values();
 
        // 迭代枚举
        for (Color col : arr)
        {
            // 查看索引
            System.out.println(col + " at index " + col.ordinal());
        }
 
        // 使用 valueOf() 返回枚举常量，不存在的会报错 IllegalArgumentException
        System.out.println(Color.valueOf("RED"));
    }
}
```

打印输出结果：

```
RED at index 0
GREEN at index 1
BLUE at index 2
RED
```