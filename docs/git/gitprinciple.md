---
title: git原理
date: 2024-01-29
categories:
 - Version Control
tags:
 - Git
---
## Git与SVN的区别
Git 和 SVN（Subversion）是两种常见的版本控制系统，它们在工作流程、数据模型和分布式特性等方面有一些显著的区别。

分布式 vs 集中式:

Git 是一种分布式版本控制系统，每个克隆（clone）都是一个完整的仓库，包含完整的历史记录和版本信息。这意味着开发者可以在本地进行提交、分支和合并等操作，而不需要与中央服务器保持连接。
SVN 是一种集中式版本控制系统，开发者需要与中央服务器进行交互。历史记录和版本信息都保存在中央服务器上，开发者需要从中央服务器获取文件并提交更改。
数据模型:

Git 使用快照（snapshots）来存储数据，它记录文件在每个提交时的状态，并且在本地存储完整的历史记录。
SVN 使用增量变化（delta-based changes）来存储数据，它记录文件的每次变化，并且需要连接到中央服务器来获取完整的历史记录。
分支和合并:

在 Git 中，分支和合并操作非常轻量和快速，因为每个克隆都包含完整的版本历史。
在 SVN 中，分支和合并操作相对复杂，因为它们需要与中央服务器进行交互，而且操作相对慢一些。
性能:

由于 Git 的分布式特性，它通常在性能上比 SVN 更快，尤其是在处理大型仓库和执行分支操作时。
历史记录:

Git 的历史记录是不可更改的，每个提交都有一个唯一的 SHA-1 标识符。
SVN 的历史记录可以被修改，因为它使用版本号来标识提交。
总的来说，Git 更适合于分布式团队和开源项目，因为它提供了更强大的分支和合并功能，以及更快的性能。而 SVN 更适合于传统的集中式开发模型。

## 使用Hash算法

Git底层使用了SH1加密算法，用途是：

*  一个哈希算法，加密结果长度固定

*  输入数据确定，输出结果保证不变

*  输入数据有变化，输出结果一定变化


## git结构

工作区，暂存区，本地代码库 ，远程仓库


## git数据类型

在 Git 中，有四种主要的数据类型，它们分别是：blob、tree、commit 和 tag。

1. Blob（文件内容）：Blob 对象存储了**文件的数据**，每个文件对应一个 Blob 对象。它们代表了文件的内容，但不包含文件名、权限等元数据。
2. Tree（目录结构）：Tree 对象存储了**目录结构和文件名与 Blob 对象之间的映射关系**。每个 Tree 对象代表一个目录，它包含了指向文件或其他目录的指针。
3. Commit（提交）：Commit 对象包含了提交的**元数据，比如提交者、提交时间、提交消息等信息，以及指向一个或多个 Tree 对象（代表工作目录快照）和指向父提交的指针（如果是合并提交的话）**。
4. Tag（标签）：Tag 对象用于给某个特定的提交打上标签，通常用于标记软件版本发布。Tag 对象包含了**标签的信息**，比如标签名、标签创建者、标签消息，以及指向被标记的提交或其他对象的指针。

这些数据类型构成了 Git 对象数据库的基础，它们组合在一起构成了版本控制系统的核心。通过这些对象，Git 能够跟踪文件的变化、记录项目的历史，以及支持分支、合并等操作。

## .git目录下的文件

.git 文件夹是 Git 仓库的核心，包含了整个仓库的版本控制信息和元数据。下面是一些主要文件和文件夹的作用：

1. **config**: 这个文件包含了项目特定的配置选项，比如用户信息、远程仓库信息等。
2. **description**: 一个简短的描述文件，一般情况下不太常用。
3. **hooks**: 这个文件夹包含了客户端或服务器端的钩子脚本，可以用来在特定的 Git 事件发生时执行自定义的脚本。
4. **info**: 这个文件夹包含了一些全局的 Git 仓库配置。
5. **objects**: 这个文件夹是 Git 中最重要的部分之一，它包含了所有的数据内容。所有的提交、文件内容、树对象等都储存在这里。
6. **refs**: 这个文件夹包含了指向数据（commits, tags, branches等）的指针。分支引用、标签引用等都储存在这里。
7. **HEAD**: 这个文件指示了当前所在的分支。
8. **index**: 这是暂存区（stage）的索引文件，它存储了下一次提交时要包含的文件列表信息。

这些文件和文件夹组成了 Git 仓库的核心结构，它们存储了版本控制所需的所有信息，包括历史提交、分支、标签、配置等。

## 常用命令

`git cat-file-t SHA` 查看当前文件的类型

`git cat-file-p SHA` 查看当前文件的内容

### Git add

新建一个文件`a.txt`

内容:`aaaa`

`git add a.txt`

这时候查看 ./git/objects 会发现多了这一行

![image-20240124095552372](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240124095552372.png)

git cat-file -t 5d30 显示git的类型

类型:blob

git cat-file -p 5d30

显示内容：aaaa

###  Git Commit

git commit 生成了6b6c、b29c :

![image-20240124103549078](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240124103549078.png)

![image-20240124103709364](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240124103709364.png)

我们可以得知每次commit之后objects底下会生成两个文件一个**Tree**一个**Commit**

## 分支

### 新建分支

`git branch dev`

这时候refs/heads目录会多一个dev分支出来

![image-20240125192136223](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240125192136223.png)

### 切换分支

`git switch dev`

![image-20240129155851318](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240129155851318.png)

我们这时候可以发现Head指针已经指向refs，refs指向commit节点。如果在dev分支上commit一个文件c.txt，那么dev的refs将指向c.txt的commit节点，而master的refs将指向原来b.txt的commit节点。



## 链路关系

Head当前指针指向refs分支指针，refs分支指针指向commit，commit找到Tree和parent commit(即上一次提交的)，Tree找到Tree和Object。借用大佬的图一用。

![img](https://pic3.zhimg.com/80/v2-4be5787538b68b0ac950651e31aa30ce_1440w.webp)

## 补充

### 相同内容复用

![image-20240124105457587](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240124105457587.png)

我们这里新建一个b.txt ,内容仍然是aaaa，我们发现objects中并没有出现新的内容。原因是git会对每次add加入到暂存区的数据进行一次RSA摘要算法的加密，加密后的内容会作为文件的名称，所以如果内容一致的话不会生成新的文件，以达到节省空间复用的功能。

![image-20240124110759529](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240124110759529.png)

![image-20240124111022716](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20240124111022716.png)  



