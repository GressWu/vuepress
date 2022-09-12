---
title: git stash与git cherry-pick
date: 2022-03-26
categories:
 - Version Control
tags:
 - Git
---

## git stash

### 使用场景

当我们在一个分支feature-01上正在工作时，突然接到了紧急任务需要切换到feature-02上进行开发。由于feature-01上的代码还不具备提交的条件，又为了避免切换到其他分支导致我们代码丢失，因此我们需要用git stash对我们的代码进行一个隐藏并保存。待其他工作做完后，我们再将我们之前的代码拿出。

### 举例

![image-20220326161617348](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326161617348.png)

现在我们有三个分支，其中main为我们的主分支，feature-01和feature-02都是从main中检出的。现在我们要从feature-01切换到feature-02上进行工作。

![image-20220326161929127](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326161929127.png)

使用`git stash`存储我们修改过的代码

![image-20220326162037366](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326162037366.png)

利用`git stash list`查看stash的记录

```shell
PS D:\Develop\IdeaProjects\gitstatsh> git stash list
stash@{0}: WIP on feature-01: fbde25b 提交空白文件
```

git stash本质上是把记录存储在栈中，如果我们想拿出我们存储的代码，只需要出栈操作即可，同时也会删除掉stash的存储记录。还有一种操作是拿出代码，但是不删除记录。



* 利用`git stash pop`出栈，恢复我们存储的代码。

![image-20220326162429761](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326162429761.png)

* 利用`git stash apply`拿到代码，并且不删除记录

## git cherry-pick

### 使用场景

feature-01分支与分支feature-02分支都是从main分支检出的，现在feature-02想用feature-01中的代码，但是此时feature-01中的代码还未合并到main分支中，因此现使用git cherry-pick 命令让feature-02获得feature-01的代码。

### 举例

feature-02

![image-20220326203209389](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326203209389.png)

feature-01

![image-20220326203235698](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326203235698.png)

然后切换到feature-02分支上

![image-20220326203541379](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326203541379.png)

可以选择点击cherry-pick将代码同步或者复制reversion number，通过命令行进行同步。

```shell
PS D:\Develop\IdeaProjects\gitstatsh> git cherry-pick fbde25b1d22f44a71c9d37383fc905b65bdd5466

```

![image-20220326203807142](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220326203807142.png)