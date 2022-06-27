---
title: StringJoiner的使用
date: 2022-06-27
categories:
 - backEnd
tags:
 - Java
---

## 用法

**使用举例：**

```java
package com.yuwei;

import java.util.ArrayList;
import java.util.StringJoiner;
import java.util.stream.Collectors;

public class StringTest {
    public static void main(String[] args) {

        ArrayList<Person> people = new ArrayList<>();
        Person zs = new Person("张三", "001");
        Person zs1 = new Person("张三1", "002");
        Person zs2 = new Person("张三2", "003");
        Person zs3 = new Person("张三3", "004");
        Person zs4 = new Person("张三4", "005");
        Person zs5 = new Person("张三5", "006");
        people.add(zs);
        people.add(zs1);
        people.add(zs2);
        people.add(zs3);
        people.add(zs4);
        people.add(zs5);


        //单构造方法，添加分隔符
        StringJoiner sj = new StringJoiner(",");
        sj.add("a");
        sj.add("b");
        sj.add("c");
        System.out.println(sj.toString());
        //全构造方法，添加分隔符与前缀、后缀（默认会自带前后缀）
        StringJoiner sj1 = new StringJoiner(",", "[", "]");
        //如果为空设置默认值
        sj1.setEmptyValue("");
        System.out.println(sj1);

        //merge操作
        StringJoiner sj2 = new StringJoiner(";", "(", ")");
        sj2.add("d");
        sj2.add("e");
        sj2.add("f");
        sj2.merge(sj);
        System.out.println(sj2);

        //Stream流操作，使用场景:处理List数据，将Id拼接
        String collect = people.stream()
                .map(person -> person.getId())
                .collect(Collectors.joining(",", "[", "]"));
        System.out.println(collect);
    }
}
```

**输出结果**

```java
a,b,c

(d;e;f;a,b,c)
[001,002,003,004,005,006]
```

## 源码分析

```java
public final class StringJoiner {
    //前缀
    private final String prefix;
    //分隔符
    private final String delimiter;
    //后缀
    private final String suffix;

   	//StringJoiner本质上是通过StringBuilder进行字符拼接
    private StringBuilder value;

    //空值
    private String emptyValue;

    //有参构造，如果只有一个参数，默认为分割符，并调用 public StringJoiner(CharSequence delimiter,CharSequence prefix,CharSequence suffix)构造方法，prefix和suffix置为""
    public StringJoiner(CharSequence delimiter) {
        this(delimiter, "", "");
    }

    public StringJoiner(CharSequence delimiter,
                        CharSequence prefix,
                        CharSequence suffix) {
        //不能为null
        Objects.requireNonNull(prefix, "The prefix must not be null");
        Objects.requireNonNull(delimiter, "The delimiter must not be null");
        Objects.requireNonNull(suffix, "The suffix must not be null");
        // make defensive copies of arguments
        this.prefix = prefix.toString();
        this.delimiter = delimiter.toString();
        this.suffix = suffix.toString();
        this.emptyValue = this.prefix + this.suffix;
    }

    //设置空值
    public StringJoiner setEmptyValue(CharSequence emptyValue) {
        this.emptyValue = Objects.requireNonNull(emptyValue,
            "The empty value must not be null").toString();
        return this;
    }


    @Override
    public String toString() {
        if (value == null) {
            return emptyValue;
        } else {
            if (suffix.equals("")) {
                return value.toString();
            } else {
                int initialLength = value.length();
                String result = value.append(suffix).toString();
                // reset value to pre-append initialLength
                value.setLength(initialLength);
                return result;
            }
        }
    }

    public StringJoiner add(CharSequence newElement) {
        prepareBuilder().append(newElement);
        return this;
    }

    public StringJoiner merge(StringJoiner other) {
        Objects.requireNonNull(other);
        if (other.value != null) {
            final int length = other.value.length();
            // lock the length so that we can seize the data to be appended
            // before initiate copying to avoid interference, especially when
            // merge 'this'
            StringBuilder builder = prepareBuilder();
            builder.append(other.value, other.prefix.length(), length);
        }
        return this;
    }

    private StringBuilder prepareBuilder() {
        //创建StringBuilder时，会首先添加前缀，然后后续增加具体元素
        if (value != null) {
            value.append(delimiter);
        } else {
            value = new StringBuilder().append(prefix);
        }
        return value;
    }

    //length算前后缀一起的长度
    public int length() {
        return (value != null ? value.length() + suffix.length() :
                emptyValue.length());
    }
}

```

