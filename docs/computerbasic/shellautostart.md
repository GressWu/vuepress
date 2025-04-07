---
title: shell脚本实现应用的自动启停
date: 2025-04-07
categories:
 - ComputerBasic
tags:
 - Shell
---

## 编写背景

本项目涉及到规则引擎，用到了Groovy动态语言，但每次编译过后产生的Groovy文件无法被释放，常年累积越来越大以至于应用服务器的硬盘经常报警。故编写该脚本，每日凌晨停止服务后，删除生产的Groovy文件，进行重启。

## 具体实现

```shell
#!/bin/sh

APP_NAME=BRP
TARGET_FILE=/home/was/brp/groovy/*
START_SCRIPT=/home/was/brp/tomcat/bin/startup.sh

echo 脚本执行时间 $(date)

# 循环遍历停掉应用
while true;do
if [ $pid ];then
# 找到目标应用pid
pid=`ps -ef|grep $APP_HOME|grep -v grep|awk '{print $2}'`
echo 应用pid为$pid
kill -9 $pid
break
fi
sleep 5
done

# 清除文件
echo 开始清除文件
rm -rf $TARGET_FILE

# 重新启动应用
echo 开始重新启动应用
sh $TARGET_SCRIPT

```

## 涉及到的知识

`grep -v` 剔除掉包含该内容的信息

比如`ps -ef|grep $APP_HOME` 搜索出的内容包含了grep本身的一条数据，`grep -v grep`就会将该条数据排除。



awk相关知识

- **基本语法**：Awk的基本语法是`pattern { action }`，其中`pattern`用于匹配行，`action`用于指定对匹配行的操作。
- **内置变量**：Awk提供了许多内置变量，如`NF`（当前行的字段数）、`NR`（当前行数）、`$1`、`$2`等（当前行的第一个字段、第二个字段等）。