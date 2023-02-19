---
title: 常用的分页方法
date: 2022-08-22
categories:
- BackEnd
tags:
- Java
- MySql
---

## SQL分页

### ORACLE

```sql
select * from (select rownumber() over(order by id asc ) as rowid from table where rowid <=endIndex ) AS a1
where a1.rowid > startIndex
```

```sql
select * from
    (
        select rownum as rn,t.* from testData t
        where rownum<=20
    ) t
where t.rn>=11
```
rn列是虚拟出来的，必须从1开始往上挨着查询。例如想查第三条，就必须是rn>2,rn<4。不可以是rn=3。

### DB2、MYSQL

```sql
select  *  from  table  limit  start,pageNum 
```

## 后端分页

### 数据准备

```java
List<Person> people = new ArrayList<>();
Person person = new Person("zhangsan", "f", 13);
Person person1 = new Person("zhangsan1", "f", 18);
Person person2 = new Person("zhangsan2", "f", 14);
Person person3 = new Person("zhangsan3", "f", 19);
Person person4 = new Person("zhangsan4", "f", 23);
Person person5 = new Person("zhangsan5", "f", 43);
Person person6 = new Person("zhangsan6", "f", 11);
Person person7 = new Person("zhangsan7", "f", 19);
Person person8 = new Person("zhangsan8", "f", 23);
Person person9 = new Person("zhangsan9", "f", 43);
Person person10 = new Person("zhangsan10", "f", 11);
people.add(person);
people.add(person1);
people.add(person2);
people.add(person3);
people.add(person4);
people.add(person5);
people.add(person6);
people.add(person7);
people.add(person8);
people.add(person9);
people.add(person10);

 int currentPage =2;
 int pageSize =5;
```

### Stream分页

```java
List<Person> collect = people.stream().skip((currentPage - 1) * pageSize).limit(pageSize).
        collect(Collectors.toList());
System.out.println(collect);
```

### Java分页

由于List有长度界限，所以要用三目表达式进行控制，防止数组越界

```java
List<Person> people1 = people.subList(((currentPage - 1) * pageSize> people.size()?people.size():(currentPage - 1) * pageSize),
        (currentPage*pageSize>people.size())?people.size():currentPage*pageSize);
System.out.println(people1);
```

### 补充：List过滤数据

```java
 Iterator<Person> iterator = people.iterator();
        while (iterator.hasNext()){
            if(iterator.next().getAge()<18){
                iterator.remove();
            }
        }

        System.out.println(people);
```

## 前端分页

### element-ui

```vue
<template>
 <div class="app">    
     <!-- 将获取到的数据进行计算 -->   
     <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)" style="width: 100%">
         <el-table-column prop="date" label="日期" width="180"></el-table-column>
         <el-table-column prop="name" label="姓名" width="180"></el-table-column>
         <el-table-column prop="address" label="地址"></el-table-column>
     </el-table>
      <div class="tabListPage">
           <el-pagination @size-change="handleSizeChange" 
                          @current-change="handleCurrentChange" 
                          :current-page="currentPage" 
                          :page-sizes="pageSizes" 
                          :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" 
                          :total="totalCount">
             </el-pagination>
       </div>
</div>
</template>
<script>
export default {
   data(){
       return {
            // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           // 个数选择器（可修改）
           pageSizes:[1,2,3,4],
           // 默认每页显示的条数（可修改）
           PageSize:1,
       }
   },
 methods:{
       getData(){
             // 这里使用axios，使用时请提前引入
             axios.post(url,{
                  orgCode:1
             },{emulateJSON: true},
             {
               headers:{"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",} 
              }
              ).then(reponse=>{
                   console.log(reponse)
                   // 将数据赋值给tableData
                   this.tableData=data.data.body
                   // 将数据的长度赋值给totalCount
                   this.totalCount=data.data.body.length
              }) 
         },
       // 分页
        // 每页显示的条数
       handleSizeChange(val) {
           // 改变每页显示的条数 
           this.PageSize=val
           // 注意：在改变每页显示的条数时，要将页码显示到第一页
           this.currentPage=1
       },
         // 显示第几页
       handleCurrentChange(val) {
           // 改变默认的页数
           this.currentPage=val
       },
   },
   created:function(){
         this.getData() 
   }
}
</script>
```