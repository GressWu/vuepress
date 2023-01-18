---
title: MySQL、Oracle、DB2导入导出常用命令
date: 2023-01-18
categories:
- DataBase
tags:
- MySql
- Shell
---

## Mysql

**1.进入mysql控制台：**`mysql -uroot -p`

**2.查看mysql状态：**`service  mysqld  status`**（有的版本需使用mysql/mysqld）**

**3.启动mysql服务：**`service mysqld start`

**4.导出数据库 db1,db2,db3：**

`mysqldump -u root -p --databases db1 db2 db3 > bak.sql`

**5.导入数据库:**

`mysql -u root -p testDB < /home/bak.sql`

**6.mysql的锁表查询与解锁：**

```sql
show engine innodb status;

show OPEN TABLES where In_use > 0;

show processlist;

kill 8520; 为上面命令查出的id列
```

## Oracle

**1.1 连接数据库**

$ sqlplus / as sysdba;

**1.2.1 创建用户**

create user user_name identified by pass_word;

实例

SQL> create user ywwu1 identified by Tag111@;

**1.2.1**  **补充：更新用户密码**

alter user user_name identified by pass_word;

实例

SQL> alter user ywwu1 identified by 123456

**1.2.3**  **补充：删除用户**

drop user user_name cascade;

实例

SQL> drop user ywwu1 cascade;

**1.3**  **赋予用户权限**

grant resource,connect,dba to user_name

实例

SQL> grant resource,connect,dba to ywwu1 ;

**1.4   **导入数据**

imp user_name/pass_word file=file_name.dmp fromuser=export_username touser=imp_username log=imp_xxx.log

实例

SQL> imp ywwu1 /Tag111@ file=0000.dmp  log=imp_ygkuang.log full=y

**1.4.1**  **补充：导出数据**

exp user_name/pass_word file=file_name.DMP log=log_name.log

实例

exp userid=arsp_db/arsp_db file=arsp_0319.dmp owner=arsp_db

## DB2

**1、切换用户**

`su - db2inst1`

**2、创建数据库**

`db2 create db databaseName using codeset utf-8 territory CN`

若后续导入ddl时报名称找不到的错，将utf-8换成gbk

备注：查询所有数据库列表：`db2 list db directory`

删除查询到的数据库：`db2 drop db databasename`

若查询不到则需要添加至列表：`db2 catalog db databasename`

将数据库从列表移除：`db2 uncatalog db databasename`

**3、连接新数据库**

`db2 connect to databaseName`

**4、创建BUFFERPOOL**

`db2 create BUFFERPOOL testBUFFER SIZE 1000 PAGESIZE 32K`

**5、创建TABLESPACE**

`db2 "create regular tablespace  testSpace  pagesize 32k managed by database using(file '/home/db2inst1/test/ts' 5g) bufferpool testBUFFER"`

**6、创建临时表空间**

`db2 "create SYSTEM TEMPORARY TABLESPACE testBUF PAGESIZE 32K MANAGED BY database USING (file '/home/db2inst1/epay/tts' 1g) BUFFERPOOL testBUFFER"`

**7、断开连接**

`db2 disconnect databaseName`

**8、使用db2inst1角色连接数据库**

`db2 connect to databaseName`

**9、恢复表关系**

进入到db2look.ddl文件所在目录,使用文本编辑器打开该文件。

注意：需要将数据库名，用户名，表空间名（这三个要全部更改一项不漏，建议全局替换）改成将要导入的数据库具体内容修改完毕后使用如下命令导入数据结构：

`db2 -td@ -vf db2look.ddl`

报DB21007E错误执行以下导入语句：

` db2 -tvf db2look.ddl`

该命令请执行3次进入

**10.恢复表数据**

db2move文件夹

（1）修改文件夹访问权限,Linux系统需切换至root用户    sudo chmod -R 777 xxx（xxx为db2move文件夹路径）

（2）修改db2move文件夹目录下db2move.lst文件内容,   将文件中用户名替换为将要导入数据库用户名（注意是用户名）

（3）导入数据   db2move xxx load/db2move xxx import(xxx为将要导入的数据库名)

导出数据等参考:

导出db2数据库的表结构和数据

1、 catalog server 端的 node ，命令如下：

​      db2 catalog tcpip node node_name remote hostname server service_port

​      db2 uncatalog node node_name   （取消节点的编目）

​       其中 node_name 是由你任意起的一个结点名，结点名不能跟已有的结点名重复（可通过db2  list node directory 查看），hostname也可为IP address，service_port为端口号一般默认为50000。节点目录用于存储远程数据库的所有连通性信息。

​       2、 catalog 远端 DB2 数据库，命令如下：

​        db2 catalog db db_name [as alias_name] at node node_name

​     db2 uncatalog db db_name    （取消数据库的编目）

​           db_name 是指远程数据库的名字， alias_name 是客户端实例名（可以忽略）， db2node 是指上面你所指定的节点node ！

​     3、 连接数据库，命令如下：

​       db2 connect to db_name user user_name using password

​          db_name 是指数据库的名字， user_name 是数据库用户名，password是数据库密码

4、用db2look命令生成表结构的DLL脚本

​     db2look -d db_name -i user_name -w password -a -e -o d:\script.sql

​         db_name 是指数据库的名字， user_name 是数据库用户名，password是数据库密码

5、用db2move导出所有表的数据

​        db2move db_name export -u user_name -p password

​          db_name 是指数据库的名字，user_name 是数据库用户名，password是数据库密码

6、用export导出指定的表数据

​       db2 "export to d:\data\tab1.ixf of ixf lobs to d:\data\ lobfile lobs modified by lobsinsepfiles  messages d:\data\tab1.msgselect * from schema_name.table_name"

schema_name 是表所属，table_name是表名， lobsinsepfiles 或 lobsinfile 是生成lob文件 前一个是生成每个，后面是生成到一个文件中

7、执行sql脚本

​      db2 -tvf d:\script.sql -z d:\script.log

​    8、用db2move导入所有表的数据

​         db2move db_name import -io replace -u user_name -p password

​    9、用import导入指定的表数据

​         db2 "import from d:\data\tab1.ixf of ixf messages d:\data\tab1.msg insert into schema_name.table_name"