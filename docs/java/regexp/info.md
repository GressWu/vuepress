---
title: 正则表达式详解
date: 2021-06-05
categories:
 - BackEnd
tags:
 - Java
---

正则表达式(Regular Expression)
## 1.原理

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegTheory {
    public static void main(String[] args) {
        String content ="1995年，互联网的蓬勃发展给了Oak机会。业界为了使死板、单调的静态网页能够“灵活”起来，" +
                "急需一种软件技术来开发一种程序，这种程序可以通过网络传播并且能够跨平台运行。于是，世界各大IT企业为此纷纷投入了大量的人力、物力和财力。" +
                "这个时候，Sun公司想起了那个被搁置起来很久的Oak，并且重新审视了那个用软件编写的试验平台，" +
                "由于它是按照嵌入式系统硬件平台体系结构进行编写的，所以非常小，特别适用于网络上的传输系统，而Oak也是一种精简的语言，程序非常小，适合在网络上传输。" +
                "Sun公司首先推出了可以嵌入网页并且可以随同网页在网络上传输的Applet（Applet是一种将小程序嵌入到网页中进行执行的技术），" +
                "并将Oak更名为Java（在申请注册商标时，发现Oak已经被人使用了，再想了一系列名字之后，最终，使用了提议者在喝一杯Java咖啡时无意提到的Java词语）。" +
                "5月23日，Sun公司在Sun world会议上正式发布Java和HotJava浏览器。IBM、Apple、DEC、Adobe、HP、Oracle、Netscape和微软等各大公司都纷纷停止了自己的相关开发项目，" +
                "竞相购买了Java使用许可证，并为自己的产品开发了相应的Java平台。";

        //目标：所有四个数字
        //1. \\d 表示0-9任意一个数字
        String regString = "(\\d\\d)(\\d\\d)";
        //2. 创建模式对象
        Pattern pattern = Pattern.compile(regString);
        //3.创建匹配器
        //创建以正则表达式组成的规则匹配
        Matcher matcher = pattern.matcher(content);
        //4.开始匹配
        /**
         *
         * matcher.find()
         * 什么时分组，比如(\d\d)(\d\d) 正则表达式()表示分组 第一个()代表组1 第二个()代表组2
         *
         * 1.根据指定的规则，定位满足规则的子字符串(1995)
         * 2.找到后，将子字符串的开始索引记录到matcher对象的属性 int[] groups
         *  groups[0] = 0 ,把该字符串的结束索引+1的值记录到 groups[1] = 4
         *  如果有其他分组----------------------- 1998  记录1组()19 匹配到的字符出阿伯 groups[2]=0  groups[3]=2
         *  记录1组()98 匹配到的字符出阿伯 groups[4]=2  groups[5]=4
         *
         *
         *
         * 3.同时记录oldLast的值为 子字符串的结束的索引+1 的值即为4 ，即下次执行find时 就从4开始匹配
         *
         * matcher.group(0)
         *
         *   public String group(int group) {
         *         if (first < 0)
         *             throw new IllegalStateException("No match found");
         *         if (group < 0 || group > groupCount())
         *             throw new IndexOutOfBoundsException("No group " + group);
         *         if ((groups[group*2] == -1) || (groups[group*2+1] == -1))
         *             return null;
         *         return getSubSequence(groups[group * 2], groups[group * 2 + 1]).toString();
         *     }
         *
         *  1.根据groups[0] = 0 ， groups[1] = 4 截取字符串返回
         *  2.find方法再次执行
         *  3.传入0 截取的就是groups[0]-groups[1]之间的字符串
         */
        while(matcher.find()){
            //匹配子字符串
            System.out.println(matcher.group(0));
            //匹配第一组的字符串
            System.out.println(matcher.group(1));
            //匹配第二组的字符串
            System.out.println(matcher.group(2));

        }
    }
}
```

## 2.语法

* **元字符**

  * **转义号\\\\**

  Java中两个\代表其他语言中的一个/     **当正则表达式匹配到以下符号时需要转义**

  ` .*+()$/\?[]^{}`

  * **字符匹配符**

| 符号 | 含义                                                       | 示例           | 解释                                         |
| :--- | ---------------------------------------------------------- | -------------- | -------------------------------------------- |
| []   | 可接收的字符列表                                           | [efgh]         | e、f、g、h中的任意一个字符                   |
| ^    | 不可接收的字符列表                                         | [^efgh]        | 除e、f、g、h中的任意一个字符                 |
| -    | 连字符                                                     | A-Z            | 任意单个大写字母                             |
| .    | 匹配除\n以外的任意字符                                     | a..b           | 以a开头b结尾 中间包含任意字符长度为4的字符串 |
| \\d  | 匹配单个数字字符 相当于[0-9]                               | \\\d{3}(\\\d)? | 三个或四个数字字符串    ?代表0个或者1个      |
| \\\D | 匹配非单个数字字符 相当于[非0-9]                           | \\\D(\\\d)*    | 非数字开头 长度任意的字符                    |
| \\\w | 匹配单个数字、大小写字母字符、下划线相当于[0-9a-zA-Z_]     | \\\d{3}\\w{4}  | 三个数字加四个字符                           |
| \\\W | 匹配单个非数字、大小写字母字符、下划线相当于[非0-9a-zA-Z_] | \\\\W\\\d{2}   | 一个非数字字母开头，2个数字结尾              |
| \\\s | 匹配任意空白字符(空格、制表符)                             |                |                                              |
| \\\S | 匹配任意非空白字符(空格、制表符)                           |                |                                              |
| .    | 匹配除 \n之外的所有字符，如果要匹配.本身需要转义字符       |                |                                              |
| \|   | 匹配 或的字符                                              | a\|b\|c        | 查找a或b或c的字符                            |

**注意：小方括号 [ ] 只能取单个字符的或情况或者字母写在一起 如：[a-zA-Z.*] 或者 ca[r|t] **

如要匹配多个或，请用小括号 (com|cn)

* **字符限定符**

用于限定字符出现的次数

| 符号  | 含义                             | 示例      | 说明                                                         | 匹配输入       |
| ----- | -------------------------------- | --------- | ------------------------------------------------------------ | -------------- |
| *     | 指定字符出现0次或n次             | (abc)*    | 仅包含含任意个abc的字符                                      | abc,abcabc     |
| +     | 指定字符出现1次或n次（至少一次） | m+(abc)*  | 至少1个m开头，后续任意个abc的字符串                          | m,mabc,mabcabc |
| ?     | 指定字符串重复0或1次（最多一次） | m+abc?    | 至少1个m开头，后续跟ab或者abc的字符串                        | mabc,mab,mmabc |
| {n}   | 只能输入n个字符                  | [abcd]{3} | 由abcd组成的长度为三的任意字符                               | abc,dbc        |
| {n,}  | 指定至少n个字符                  |           |                                                              |                |
| {n,m} | 指定至少n个字符但不多于m个       |           | java匹配默认是贪婪匹配，优先匹配多的，匹配m个字符。然后依次匹配低位的字符 |                |

​         

* 字符定位符

| 符号       | 含义                 | 示例           | 说明                                                         | 匹配输入                    |
| ---------- | -------------------- | -------------- | ------------------------------------------------------------ | --------------------------- |
| ^ 不在[]里 | 指定起始符           | ^[0-9]+[a-z]*  | 以至少一个数字开头，后接任意个小写字母的字符串               | 123，6aa                    |
| $          | 结束符               | ^[0-9]+[a-z]*$ | 以至少一个数字开头，后接任意个小写字母的字符串并以任意小写字母结束 | 6aa                         |
| \\\b       | 匹配目标字符串的边界 | han\\\b        | 匹配到字符串最后的字符串                                     | hanaaa aaa**han** jj**han** |
| \\\B       | 与上部相反           |                |                                                              | **han**aaa aaahan jjhan     |





* Java正则表达式默认时区分字母大小写的，如何实现不区分大小写

  * (?i)abc abc字符串不区分大小写

  * a(?i)bc a小写bc不区分大小写

  * a((?i)b)c ac小写b不区分大小写

  * ```java
    Pattern pattern = Pattern.compile(regStr,Pattern.CASE_INSENSITIVE);
    ```

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class lala {
    public static void main(String[] args) {
        String content = "a11c8abcABC";
        //String regStr =  "abc"; //默认区分大小写
        String regStr = "(?i)abc";//不区分大小写
        Pattern pattern = Pattern.compile(regStr);
        Matcher matcher = pattern.matcher(content);
        while(matcher.find()){
            System.out.println(matcher.group(0));
        }
    }
}
```

## 3. 捕获分组与非捕获分组

### 捕获分组

* 匿名分组

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FenZu {
    public static void main(String[] args) {
        String content = "ss3456 sfd9878";
        String regStr = "(\\d\\d)(\\d\\d)"; //匹配4个数字的字符串
        Pattern compile = Pattern.compile(regStr);
        Matcher matcher = compile.matcher(content);
        while (matcher.find()){
            //匹配字符
            System.out.println("匹配字符："+matcher.group(0));
            //分组1
            System.out.println("匹配分组1："+matcher.group(1));
            //分组2
            System.out.println("匹配分组2："+matcher.group(2));
        }
    }
}
```

```tex
匹配字符：3456
匹配分组1：34
匹配分组2：56
匹配字符：9878
匹配分组1：98
匹配分组2：78
```

* 命名分组

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FenZu {
    public static void main(String[] args) {
        String content = "ss3456 sfd9878";
        String regStr = "(?<g1>\\d\\d)(?<g2>\\d\\d)"; //匹配4个数字的字符串
        Pattern compile = Pattern.compile(regStr);
        Matcher matcher = compile.matcher(content);
        while (matcher.find()){
            //匹配字符
            System.out.println("匹配字符："+matcher.group(0));
            //分组1
            System.out.println("匹配分组1："+matcher.group(1));
            System.out.println("匹配分组1："+matcher.group("g1"));
            //分组2
            System.out.println("匹配分组2："+matcher.group(2));
            System.out.println("匹配分组1："+matcher.group("g2"));
        }
    }
}

```

```
匹配字符：3456
匹配分组1：34
匹配分组1：34
匹配分组2：56
匹配分组1：56
匹配字符：9878
匹配分组1：98
匹配分组1：98
匹配分组2：78
匹配分组1：78
```

### 非捕获分组

非捕获分组，并不会因为()进行分组，所以gruop(1)会数组越界

| 常用分组构造形式 | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| (?:pattern)      | 特别适用于替换(\|) 比如： **industry\|industries** 可以被 **industr(?:y\|ies)**代替 |
| (?=pattern)      | Windows(?=95\|98\|NT\|2000) 可以匹配 Windows 2000中的Windows 但不能匹配 Windows 3.1 的Windows |
| (?!pattern)      | 与上一条相反                                                 |

## 4.非贪婪匹配

在字符限定符 * + {}后面加?完成非贪婪匹配

| 符号 | 含义                     |
| ---- | ------------------------ |
| ?    | \\\d+?  最多匹配一个数字 |

