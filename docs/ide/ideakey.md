---
title: Idea快捷键
date: 2022-03-22
categories:
 - IDE
tags:
 - idea
sticky: 3
---


## 自动导包与自动删包

只需设置这两步，Idea即可完成自动导包与删除引入多余的包的功能

![image-20220309222134324](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220309222134324.png)

## Boolean类型判断的快速补全

`boolean flag = true;`

`if命令与else命令`

```java
flag.if=>
if(flag){

}
flag.else=>
if(!flag){

}
```

## try

```java
int r = 0/10;.try
 try {
            int r = 0/10;
        } catch (Exception e) {
            e.printStackTrace();
        }
```

## 查看类的继承或实现关系

`ctrl+H` 

![image-20220405160548149](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220405160548149.png)

## 查看当前类拥有的属性与方法

`alt + 7`

![image-20220405160727457](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220405160727457.png)

## 实现接口方法

`ctrl+o`

![image-20220405161047860](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220405161047860.png)

## 快速重写类的方法（比如Setter、Getter）

`alt + insert`

![image-20220405161242984](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220405161242984.png)

## 查看方法所需参数

将光标移至方法参数区，`ctrl + p`查看所需参数

![image-20220405163936982](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220405163936982.png)

## 切换Tab页
`ctrl + shift + tab`

## 大小写转换
`ctrl + shift + u`

## 清楚多余jar包
`ctrl + alt + o`