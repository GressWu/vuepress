---
title: git回退版本
date: 2022-03-06
categories:
 - version control
tags:
 - Git
---

## 撤销commit操作

1. 查看Git操作记录

```shell
git log
```

```java
当前版本
commit 8aa1f3955d8134938d948825a8b4fbae159ae8ac (HEAD -> main, origin/main, origin/HEAD)
Author: ywwu1 <******@qq.com>
Date:   Sun Mar 6 22:07:14 2022 +0800

    commit a file
上一个版本
commit 8aa1f3955d8134938d948825a8b4fbae159ae8ac (origin/main, origin/HEAD)
Author: GressWu <54533074+GressWu@users.noreply.github.com>
Date:   Mon Jan 31 10:50:04 2022 +0800

    Update Test.java

```

2. 我们可以看到第二条数据就是我们commit之前的那个版本，所以我们只要复制上个版本的key值，再通过命令即可撤销掉我们的commit操作。

```shell
git reset --soft 8aa1f3955d8134938d948825a8b4fbae159ae8ac
```

## 撤销commit与add操作

1. 第一步仍然是通过`git log`查看git 提交记录
2. 第二步通过命令撤销commit和add

```shell
git reset --soft 7aa1f3955d8653738d948825a8b4fbae159ae8ac
```

## 回滚到上个(或某个)版本

撤销commit与add操作并直接删除当前版本的所有内容回到上个版本，十分危险。并且不会留有版本记录。

1. 第一步仍然是通过`git log`查看git 提交记录

```shell
commit 1cae340d0144c1f9f2cdd8879e3ef4b7185cffcf (HEAD -> main)
Author: ywwu1 <******@qq.com>
Date:   Sun Mar 6 22:24:29 2022 +0800

    reset hard

commit 8aa1f3955d8134938d948825a8b4fbae159ae8ac (origin/main, origin/HEAD)
Author: GressWu <54533074+GressWu@users.noreply.github.com>
Date:   Mon Jan 31 10:50:04 2022 +0800

    Update Test.java

```

![image-20220306222546263](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220306222546263.png)

当前txt文件已经commit到本地版本库

2. 回滚

```shell
 git reset --hard 8aa1f3955d8134938d948825a8b4fbae159ae8ac
```

![image-20220306222739903](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220306222739903.png)

全部回滚至上个版本了

### 撤销push到远程分支的操作

我们同样使用命令将版本回退至上个版本

```shell
 git reset --hard 8aa1f3955d8134938d948825a8b4fbae159ae8ac
```

然后强制推送至远端进行合并即可

```shell
git push -f
```

## 温和回滚到上个(或某个)版本

由于上面的回滚十分暴力，我们还有一种比较温和的回滚方式。这种方式与`git reset --hard 上个(或某个)版本号` 命令不同，我们回滚后仍然会保留上一次的提交记录，并不会毁尸灭迹。

```java
commit b66921b76eb0c968aa4f614c8cafcc727948fbfb (HEAD -> main)            
Author: ywwu1 <******@qq.com>                                         
Date:   Sun Mar 6 22:30:24 2022 +0800                                     
                                                                          
    push                                                                  
                                                                          
commit 8aa1f3955d8134938d948825a8b4fbae159ae8ac (origin/main, origin/HEAD)
Author: GressWu <54533074+GressWu@users.noreply.github.com>               
Date:   Mon Jan 31 10:50:04 2022 +0800                                    
                                                                          
    Update Test.java 
```

需要注意的是与之前不同，该命令选择的版本号应该是当前版本号，本质上是保留当前版本，并且产生一个上一个版本的副本为当前版本。

```shell
 git revert b66921b76eb0c968aa4f614c8cafcc727948fbfb
```

跳转至该页面只需输入相关说明文字并且 `:wq`退出即可

```shell
    push
Revert "push"

This reverts commit b66921b76eb0c968aa4f614c8cafcc727948fbfb.

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch main
# Your branch is ahead of 'origin/main' by 1 commit.
#   (use "git push" to publish your local commits)

```

我们可以看到我们现在已经来到了之前版本的副本，并且保留了回滚的Git记录

```java
commit d61530d8d2f287f784762fe991118d70ef15f5db (HEAD -> main)
Author: ywwu1 <******@qq.com>                             
Date:   Sun Mar 6 22:47:29 2022 +0800                         

    Revert "push"

    This reverts commit b66921b76eb0c968aa4f614c8cafcc727948fbfb.

commit b66921b76eb0c968aa4f614c8cafcc727948fbfb
Author: ywwu1 <*****@qq.com>
Date:   Sun Mar 6 22:30:24 2022 +0800

    push

commit 8aa1f3955d8134938d948825a8b4fbae159ae8ac (origin/main, origin/HEAD)
Author: GressWu <54533074+GressWu@users.noreply.github.com>
Date:   Mon Jan 31 10:50:04 2022 +0800

    Update Test.java

```

