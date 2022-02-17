---
title: 上传本地文件至GitHub
date: 2022-01-27
categories:
 - version control
tags:
 - Git
---

## 前期准备

1. 配置Git全局名字、邮件

```
git config --global user.name"James_Bobo"
git config --global user.email"James_Bobo@163.com"
```

2. Linux系统下配置SSH(可选)

```
生成公钥与私钥
ssh-keygen -t rsa -C "email"  # email为你在github上注册的邮箱
```

```
进入SSH文件夹
cd /root/.ssh/
查看公钥并且复制
cat id_rsa.pub
```

打开GitHub,点击头像选择setting，选择SSH and GPG KEYS

![image-20220123221229928](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220123221229928.png)

点击NEW SSH KEY，将刚才复制的公钥复制到Key，并且起一个名字，点击Add即可完成SSH KEY的配置。

![image-20220123221407368](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220123221407368.png)

## 方法一

* 登录GitHub创建仓库

找到左侧Repositories部分，点击New

![image-20220123204210336](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220123204210336.png)

填写相关信息创建Git仓库

![image-20220123204754161](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220123204754161.png)

复制HTTPS路径，或者是SSH路径

![image-20220123205030863](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220123205030863.png)

* 克隆该仓库

本地创建一个文件夹，执行以下命令

1. 克隆创建的项目

   `git clone HTTPS/SSH地址`

2. 将要上传的文件或文件夹拖到该文件夹中

3. 将这些文件全部添加至暂存区

   `git add .`

4. 将这些文件提交到本地仓库

   `git commit -m "提交本地项目至远程仓库"`

5. 推送至远程仓库

   `git push`

## 方法二

在要提交的文件夹中执行以下命令

1. 将该文件夹初始化，交给git进行管理

   `git init`

2. 将要上传的文件或文件夹拖到该文件夹中

3. 将这些文件全部添加至暂存区

   `git add .`

4. 将这些文件提交到本地仓库

   `git commit -m "提交本地项目至远程仓库"`

5. 将GitHub上的仓库与本地仓库关联

   `git remote add origin HTTPS/SSH地址`

6. 推送至远程仓库

   `git push`