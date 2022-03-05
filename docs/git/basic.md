---
title: git基本操作
date: 2020-07-20
categories:
 - version control
tags:
 - Git
---

工作区---->暂存区----->本地库

## 寻求帮助

`git log help`

## 设置git的用户及其邮箱

查看配置

```git
git config user.email

git config user.name
```

修改配置

项目级别

```
git config  user.name "Your Name"

git config  user.email you@example.com
```

系统级别

```
git config --global user.name "Your Name"

git config --global user.email you@example.com
```

同等情况下，项目级别优于系统级别

## 将一个文件用git进行控制

`git init`

创建后会生成.git文件

## 存储索引

* 将当前目录下所有文件生成快照（临时的）snapshot ，工作区到暂存区的一步，**修改或新增的文件都需要这一步**

`git add .`

* 永久存储文件索引 index到本地版本库，暂存区到本地库的一步

`git commit -m '注释信息'`

* 将前两步合并，直接存储索引

`git commit -a`

输入提示语 ctrl+x 回车

**注意：**-a 并不会添加新创建的文件，只会添加修改的文件，新添加的还是需要git add



git add非常重要 只有经过git add的文件，才可以被纳入版本库

平时提代码时建议用以下操作

`git add -a -m '注释信息'`

## 比较差异

* 展示相同add过后的差异

`git diff --cached` [文件名]

* 工作区与暂存区比较

`git diff` [文件名]

* 比较HEAD指针版本

`git diff HEAD a.txt`

git diff 历史版本 a.txt

* 展示当前文件状态，及其所在分支

`git status`

## 查看日志

* 查看该文件的所有变化

`git log`

**多屏显示控制：**

空格向下 

b向上

q退出

`git log --pretty=oneline` 一行展示

`git log -p ` 详细变化

`git log --stat --summary` 更详细的变化

`git reflog` 展示版本前进后退需要几步

```
c155e4a (HEAD -> master) HEAD@{0}: checkout: moving from exper to master 0步
a9df838 HEAD@{1}: checkout: moving from master to exper					 1步
c155e4a (HEAD -> master) HEAD@{2}: commit: 删了						   2 步
d28a186 HEAD@{3}: commit: asd
```





## 总结

git init  git仓库初始化

git add 添加至暂存区 git开始对该文件进行版本追踪

git commit 将文件添加至本地版本库