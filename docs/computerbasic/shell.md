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

#### 拼接字符串

```shell
t="123"
b="23"
echo ${t}${b}

12323
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

### Shell数组

注意：这些方法是在bash编辑器下使用的，sh不一定可行。

```shell
# 创建数组方法一
my_array=("1" "12" "123")
# 输出所有数组参数
echo "${my_array[*]}"
echo "${my_array[@]}"
# 根据下标输出相关参数
echo "${my_array[0]}"
# 输出数组长度
echo "${#my_array[*]}"

# 创建数组方法二
array_name[0]=value0
array_name[1]=value1
array_name[2]=value2
echo "${array_name[*]}"

# 创建类似与map的数组
declare -A site=(["google"]="www.google.com" ["runoob"]="www.runoob.com" ["taobao"]="www.taobao.com")
echo ${site["google"]}
echo ${site[*]}
```

## Shell基本运算符

### 算术运算符

```shell
a=10
b=20

val=`expr ${a} + ${b}`
echo "a + b : ${val}"

val=`expr ${a} - ${b}`
echo "a - b : ${val}"

val=`expr ${a} \* ${b}`
echo "a * b : ${val}"

val=`expr ${b} / ${a}`
echo "b / a : ${val}"

val=`expr ${b} % ${a}`
echo "b % a : ${val}"

if [ ${a} == ${b} ]
then
   echo "a 等于 b"
fi
if [ ${a} != ${b} ]
then
   echo "a 不等于 b"
fi
```

**注意点**:

1. 运算符使用时，必须用

```
`expr  `
```

2. 比较两值是否相等，用中括号包住，并且前后必须要用空格隔开
3. 乘法前面需要用\转义
4. 算数运算符只**支持数字**

### 关系运算符

关系运算符**只支持数字**，不支持字符串，除非字符串的值是数字。

| 运算符 | 说明                                                  | 举例                       |
| :----- | :---------------------------------------------------- | :------------------------- |
| -eq    | 检测两个数是否相等，相等返回 true。                   | [ $a -eq $b ] 返回 false。 |
| -ne    | 检测两个数是否不相等，不相等返回 true。               | [ $a -ne $b ] 返回 true。  |
| -gt    | 检测左边的数是否大于右边的，如果是，则返回 true。     | [ $a -gt $b ] 返回 false。 |
| -lt    | 检测左边的数是否小于右边的，如果是，则返回 true。     | [ $a -lt $b ] 返回 true。  |
| -ge    | 检测左边的数是否大于等于右边的，如果是，则返回 true。 | [ $a -ge $b ] 返回 false。 |
| -le    | 检测左边的数是否小于等于右边的，如果是，则返回 true。 | [ $a -le $b ] 返回 true。  |

```shell
a=10
b=20

if [ $a -eq $b ]
then
   echo "$a -eq $b : a 等于 b"
else
   echo "$a -eq $b: a 不等于 b"
fi
```

### 逻辑运算符

| 运算符 | 说明       | 举例                                       |
| :----- | :--------- | :----------------------------------------- |
| &&     | 逻辑的 AND | [[ $a -lt 100 && $b -gt 100 ]] 返回 false  |
| \|\|   | 逻辑的 OR  | [[ $a -lt 100 \|\| $b -gt 100 ]] 返回 true |

```shell
if [[ $a -lt 100 || $b -gt 100 ]]
then
   echo "返回 true"
else
   echo "返回 false"
fi
```

### 字符串运算符

| 运算符 | 说明                                         | 举例                     |
| :----- | :------------------------------------------- | :----------------------- |
| =      | 检测两个字符串是否相等，相等返回 true。      | [ $a = $b ] 返回 false。 |
| !=     | 检测两个字符串是否不相等，不相等返回 true。  | [ $a != $b ] 返回 true。 |
| -z     | 检测字符串长度是否为0，为0返回 true。        | [ -z $a ] 返回 false。   |
| -n     | 检测字符串长度是否不为 0，不为 0 返回 true。 | [ -n "$a" ] 返回 true。  |
| $      | 检测字符串是否不为空，不为空返回 true。      | [ $a ] 返回 true。       |

### 文件测试运算符

| 操作符  | 说明                                                         | 举例                      |
| :------ | :----------------------------------------------------------- | :------------------------ |
| -b file | 检测文件是否是块设备文件，如果是，则返回 true。              | [ -b $file ] 返回 false。 |
| -c file | 检测文件是否是字符设备文件，如果是，则返回 true。            | [ -c $file ] 返回 false。 |
| -d file | 检测文件是否是目录，如果是，则返回 true。                    | [ -d $file ] 返回 false。 |
| -f file | 检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回 true。 | [ -f $file ] 返回 true。  |
| -g file | 检测文件是否设置了 SGID 位，如果是，则返回 true。            | [ -g $file ] 返回 false。 |
| -k file | 检测文件是否设置了粘着位(Sticky Bit)，如果是，则返回 true。  | [ -k $file ] 返回 false。 |
| -p file | 检测文件是否是有名管道，如果是，则返回 true。                | [ -p $file ] 返回 false。 |
| -u file | 检测文件是否设置了 SUID 位，如果是，则返回 true。            | [ -u $file ] 返回 false。 |
| -r file | 检测文件是否可读，如果是，则返回 true。                      | [ -r $file ] 返回 true。  |
| -w file | 检测文件是否可写，如果是，则返回 true。                      | [ -w $file ] 返回 true。  |
| -x file | 检测文件是否可执行，如果是，则返回 true。                    | [ -x $file ] 返回 true。  |
| -s file | 检测文件是否为空（文件大小是否大于0），不为空返回 true。     | [ -s $file ] 返回 true。  |
| -e file | 检测文件（包括目录）是否存在，如果是，则返回 true。          | [ -e $file ] 返回 true。  |

```shell
file="/var/www/runoob/test.sh"
if [ -r $file ]
then
   echo "文件可读"
else
   echo "文件不可读"
```

### 输出重定向

```shell
echo "It is a test" > myfile
```

## Shell流程控制

### 条件判断

#### IF...ELSE

```shell
if condition
then
    command1 
    command2
    ...
    commandN
else
    command
fi

```

if开头 fi结尾 then,else后面必须有结果。如果else没有执行语句，就不要写else关键字了。

#### IF...ELSEIF

```shell
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi
```

### 循环判断

#### For循环

```shell
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done

```

#### WHILE

```shell
while condition
do
    command
done

```

## 函数

### 无参函数

```shell
demoFun(){
    echo "hello world"
}
echo "-----函数开始执行-----"
demoFun
echo "-----函数执行完毕-----"
```

### 有参函数

```shell
funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "第十个参数为 $10 !"
    echo "第十个参数为 ${10} !"
    echo "第十一个参数为 ${11} !"
    echo "参数总数有 $# 个!"
    echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73
```

## 输入输出重定向

| 命令            | 说明                              |
| :-------------- | :-------------------------------- |
| command > file  | 将输出重定向到 file。             |
| command < file  | 将输入重定向到 file。             |
| command >> file | 将输出以追加的方式重定向到 file。 |

## read

```shell
#!/bin/bash
read param
echo "${param}"
```



