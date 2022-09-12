---
title: 正则表达式案例
date: 2021-06-06
categories:
 - BackEnd
tags:
 - Java
---

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExpTest {
    public static void main(String[] args) {

        //1.验证是否全为汉字 16进制范围
        //String content = "百年红船";
        //String regStr = "^[\u0391-\uffe5]+$";


        //2.验证邮编  1-9开头的6位数
//        String regStr = "^[1-9]\\d{5}";
//        String content = "122990";

        //3.验证QQ号码 1-9开头5-10位数
//        String regStr = "^[1-9]\\d{4,9}";
//        String content = "122990";

        //4.手机号码 13，14，15，18开头11位书
        String regStr = "^1[3|4|5|8]\\d{9}";
        String content = "13987765789";

        Pattern pattern = Pattern.compile(regStr);
        Matcher matcher = pattern.matcher(content);
        if(matcher.find()){
            System.out.println("满足格式");
        }else{
            System.out.println("不满足格式");
        }
    }
}
```

### 验证URL

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Url {

    public static void main(String[] args) {
        /**
         * 1.协议头 ((http|https)://)
         * 2.www.wondercv.com ([\w-]+\.)+[\w-]+
         * 3.?utm_campaign=zhtw&utm_medium=zh&utm_source=zh&gio_link_id=nRbGzGP3  (\/[\w-?=&/%.]*)?
         */
        String content="https://www.wondercv.com/?utm_campaign=zhtw&utm_medium=zh&utm_source=zh&gio_link_id=nRbGzGP3";
        String regStr = "^((http|https)://)?([\\w-]+\\.)+[\\w-]+(\\/[\\w-?=&/%.#]*)?$";
        //注意 [.?*]表示匹配特殊字符本身
        Pattern pattern = Pattern.compile(regStr);
        Matcher matcher = pattern.matcher(content);
        if(matcher.find()){
            System.out.println("满足格式");
        }else{
            System.out.println("不满足格式");
        }
    }

}
```

### 反向引用

圆括号内容被捕获后，可以在这个括号后被使用，从而写出一个比较实用的匹配模式，我们成为**反向引用**

内部反向引用\\\分组号，外部反向引用$分组号

```
1.匹配两个连续一样的数字
(\\d)\\1
2.匹配五个连续一样的数字
(\\d)\\1{4}
3.匹配个位与千位，十位与百位相等的数字 5225 1551
(\\d)(\\d)\\2\\1
2代表第二组 1代表第一组 ！！！！
```

```java
package com.yuwei.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExp11 {
    public static void main(String[] args) {
        //匹配两个连续一样的数字
        String content ="hello string miaoo miao 5335 1132";
        String regx="(\\d)\\1";
        Pattern compile = Pattern.compile(regx);
        Matcher matcher = compile.matcher(content);
        while (matcher.find()){
            System.out.println(matcher.group(0));
        }
    }
}
```

```
33
11
```

****



```java
package com.yuwei.regexp;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
//匹配个位与千位，十位与百位相等的数字
public class RegExp11 {
    public static void main(String[] args) {
        String content ="hello113 string3333 m1551iaoo miao 5335 1132";
        String regx="(\\d)(\\d)\\2\\1";
        Pattern compile = Pattern.compile(regx);
        Matcher matcher = compile.matcher(content);
        while (matcher.find()){
            System.out.println(matcher.group(0));
        }

    }
}
```

```
3333
1551
5335
```

****

```java
package com.yuwei.regexp;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExp11 {
    public static void main(String[] args) {
       //检索商品号 12321-333999111
        // 要求前面是一个五位数，然后一个-号，然后是一个九位数，连续三位相同
        String content = "12321-333999111";
        String regStr = "\\d{5}-(\\d)\\1{2}(\\d)\\2{2}(\\d)\\3{2}";
        Pattern pattern = Pattern.compile(regStr);
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()){
            System.out.println(matcher.group(0));
        }


    }
}
```

```
12321-333999111
```

****

```java
package com.yuwei.regexp;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExp11 {
    public static void main(String[] args) {
       //结巴去重
        String content = "我...我要...学学学学...编程java!";
        content=content.replace(".","");
        System.out.println(content);
//        String regStr = "(.)\\1+";
//        Pattern pattern = Pattern.compile(regStr);
//        Matcher matcher = pattern.matcher(content);
//        while (matcher.find()){
//            System.out.println(matcher.group(0));
//        }
//        //使用反向引用$1 来替换匹配
//        content = matcher.replaceAll("$1");
        content = Pattern.compile("(.)\\1+").matcher(content).replaceAll("$1");
        System.out.println(content);


    }
}
```

```
我我要学学学学编程java!
我要学编程java!
```

### 练习题

1. 验证电子邮件合法性

   规则：

   * 只能有一个@

   * @前面是用户名，可以是a-z A-Z 0-9 _ - 字符

   * @后面是域名，并且域名只能是英文子字母 sohu.com

     ```java
     package com.yuwei.regexp;
     
     
     public class RegTest {
         public static void main(String[] args) {
             String content = "1162925512_wQ-@qq.dd.n";
             String reg = "[\\w-]+@([a-zA-Z]+\\.)+[a-zA-Z]+";
             boolean matches = content.matches(reg);
             //matches是整体匹配 可以不加^ $
             System.out.println(matches);
         }
     }
     ```

2. 要求验证是不是整数或小数

```java
package com.yuwei.regexp;


public class RegTest {
    public static void main(String[] args) {
        String content = "12.99";
        String reg = "^[-]?([1-9]\\d*||0)(\\.\\d+)?$";
        boolean matches = content.matches(reg);
        System.out.println(matches);
    }
}
```

 3. 对一个url域名进行解析

    规则：

    * 协议是什么
    * 域名是什么
    * 端口是什么
    * 文件名是什么

```java
package com.yuwei.regexp;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegTest {
    public static void main(String[] args) {
        String content = "http://www.sohu.com:8080/abc/index.html";
        String reg = "^([a-zA-Z]+)://(\\S+):(\\d+)\\/[\\w-/]*\\/([\\S]+)$";
        Pattern pattern = Pattern.compile(reg);
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()){
            System.out.println("协议名："+matcher.group(1));
            System.out.println("域名："+matcher.group(2));
            System.out.println("端口号："+matcher.group(3));
            System.out.println("文件目录："+matcher.group(4));
        }
    }
}
```