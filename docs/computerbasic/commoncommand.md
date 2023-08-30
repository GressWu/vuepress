---
title: 常用命令行
date: 2022-09-22
categories:
- OS
- DataBase
tags:
- MySql
- Shell
sticky: 4
---

## Linux常用命令

查询包含该关键字运行的进程：`ps -ef | grep 进程名`

查询占用该端口的进程：`lsof -i:端口号`

查看指定ip是否能够访问：`ping ip地址`

查看指定ip的端口是否能够访问：`telnet ipaddress port`

查看内存使用情况：`free -h`

查看硬盘使用情况：`df -h`

查看当前文件夹的大小：`du -sh`

查找文件位置：` find /home -name "myshell*"`
find 文件位置 -name 要查找的文件名

## MySQL常用命令

重启Mysql：`service mysql restart`

查询Mysql使用什么字符集：`show variables like '%char%';`

查询有哪些数据库：`show databases;`

查询库中有哪些表：`use 库名;`  `show tables;`

查看Mysql支持引擎：`show engines;`

查看当前使用的引擎：`show variables like '%storage_engine%';`