---
title: git分支与工作流
date: 2021-07-21
categories:
 - Version Control
tags:
 - Git
---

## GitFlow工作流

![查看源图像](https://tse1-mm.cn.bing.net/th/id/R-C.aa2f9f69955336f8ea7f0008a94aa85a?rik=LQsxqJ%2fl5mdp9w&riu=http%3a%2f%2fblog.chucklab.com%2fimg%2fGitFlow.png&ehk=94bWKfeI5OQm6fnD0Ik5s1AMUsV6Jv1wliAisyXxmVE%3d&risl=&pid=ImgRaw&r=0)

GitFlow是一种开发过程中的解决方案。

其中master分支代表主分支，我们在进行大型项目开发的时候是不直接操作主分支的。

而是从master分支中检出develop分支进行开发。

develop分支又会检出多个feature分支，进行功能开发，当功能开发完之后，将feature分支并入到develop分支，并将feature分支删除。

待开发完成后，将develop分支检出一个release分支进行测试工作。

当发现bug后，会创建一个hotfixes分支，进行bug修改。

## 分支

* 查看分支列表

`git branch -v` 

* 创建新分支

`git branch branchname`

* 切换分支

`git switch brannchname`

`git checkout brannchname ` 

* 合并分支

切换到自己的分支

`git merge 要合并进来的分支`

如果冲突了，通过diff 解决之后再合并

* 删除分支

`git branch -d 分支名`

**注意**：不同分支下，修改的文件commit 纳入版本管理后，彼此是看不到的，git log 只能看到本分支下的文件。

但是如果是本地，切换分支不commit，文件是会同步更新的，这种行为是不被允许的，因为这种修改会覆盖掉别人的东西。



发现冲突后一定要先解决冲突，强行 `git commit -a` 会造成乱码