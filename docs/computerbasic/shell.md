---
title: Shell编程
date: 2023-08-30
categories:
- OS
tags:
- Shell
---

## 创建一个Shell脚本

```shell
vi/vim  shellname.sh
```

## Shell脚本开头

```shell
#!/bin/bash
echo "Hello World !"
```

第一行通常用**#!/bin/sh**来区分Shell脚本解释器的类型。

**#!** 是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行，即使用哪一种 Shell。

常用的解释器有

- Bourne Shell（/usr/bin/sh或/bin/sh）
- Bourne Again Shell（/bin/bash）

## 运行Shell脚本

### 赋予执行权限

```
chmod 755 ./shellname.sh
```

### 执行

```shell
./shellname.sh

sh/bash shellname.sh
```

### 注意事项

如果没有赋权的话`./shellname.sh`会报没有权限，但是`sh/bash shellname.sh`是可以执行的。原因在于使用`sh/bash`并不是执行shell脚本本身，而是利用脚本编辑器执行的脚本，因此不会报错。

## 变量

### 定义变量

定义变量时，变量名和等号之间**不能有空格**。

例如：

```shell
your_name="admin"
age=12
```

### 输出变量

```shell
# 直接输出值
echo ${your_name}
echo ${age}
# 在文字中输出相关变量
for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done
```

### 设置只读变量

```shell
readonly 变量名
```

### 删除变量

但是不能删除只读变量

```
unset 变量名
```

### 字符串变量

#### 特殊字符转义

特殊字符前需要加`\`进行转义

```shell
echo "hello,用户\"${your_name}\"欢迎您!"
hello,用户"admin"欢迎您!
```

#### 字符串长度

#用来取字符串长度

```shell
echo "${#your_name}"
5
```

#### 截取字符串

:字符起始位置:字符截至位置

**下标从0开始**

```shell
echo ${your_name:1:3}
dmi
```

#### 查找字符位置

显示字符出现的位置，从1开始和截取不一样

```shell
echo `expr index ${your_name} i`
4
```

### Shell传递参数

`$0`代表了执行的文件，传递是参数从`$1`开始

```shell
echo "参数传递"
echo "执行文件：$0"
echo "参数1：$1"
echo "参数2：$2"
echo "参数3：$3"
echo "传递参数的个数：$#"
echo "传递的参数：$@"
echo "传递到参数：$*"
```

```shell
./shellpara.sh 1 2 3
参数传递
执行文件：shellpara.sh
参数1：1
参数2：2
参数3：3
传递参数的个数：3
传递的参数：1 2 3
传递到参数：1 2 3
```

