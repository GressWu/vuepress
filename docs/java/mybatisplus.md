---
title: Mybatis-Plus用法总结
date: 2021-02-03
categories:
 - BackEnd
 - DataBase
tags:
 - Java
 - Mybatis-Plus
---



## 1. 什么是Mybatis-Plus

润物无声

只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑。

效率至上

只需简单配置，即可快速进行单表 CRUD 操作，从而节省大量时间。

丰富功能

代码生成、物理分页、性能分析等功能一应俱全。



## 2. 引入Mybatis-Plus

### pom文件

依赖：

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus</artifactId>
    <version>undefined</version>
</dependency>
```

### properties文件

数据库连接配置(问号后面为时区)

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis_plus?serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=root
```

开启数据库日志

```properties
#mybatis日志
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

设置逻辑删除值

```properties
#myBatis Plus 逻辑删除
mybatis-plus.global-config.db-config.logic-delete-value=1
mybatis-plus.global-config.db-config.logic-not-delete-value=0
```



## 3. 结构层次

* SpringBootApplication.class
* config
* controller
* entity
* handler
* mapper



### config包

主要提供乐观锁、分页、逻辑删除、SQL性能分析插件

```java
package com.yuwwei.springbootweb.config;

import com.baomidou.mybatisplus.core.injector.ISqlInjector;
import com.baomidou.mybatisplus.extension.injector.LogicSqlInjector;
import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.plugins.PerformanceInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * @author GressWu
 */
@Configuration
//扫描mapper包
@MapperScan("com.yuwwei.springbootweb.mapper")
public class MpConfig {
    /**
     * 乐观锁插件
     */
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor() {
        return new OptimisticLockerInterceptor();
    }

    /**
     * 分页插件
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }

    /**
     * 逻辑删除插件
     * @return
     */
    @Bean
    public ISqlInjector sqlInjector() {
        return new LogicSqlInjector();
    }

    /**
     * SQL 执行性能分析插件
     * 开发环境使用，线上不推荐。 maxTime 指的是 sql 最大执行时长
     */
    @Bean
    @Profile({"dev","test"})// 设置 dev test 环境开启
    public PerformanceInterceptor performanceInterceptor() {
        PerformanceInterceptor performanceInterceptor = new PerformanceInterceptor();
        //ms，超过此处设置的ms则sql不执行
        performanceInterceptor.setMaxTime(100);
        performanceInterceptor.setFormat(true);
        return performanceInterceptor;
    }
}
```

### controller包

主要提供客户端与服务端之间的接口交互

```java
@RestController                    //直接返回json数据，不返回视图
```

### entity包

实体类

```java
package com.yuwwei.springbootweb.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

/**
 * @author GressWu
 */
@Data
public class User {

    @TableId(type = IdType.ID_WORKER)
    private Long id;
    private String name;
    private Integer age;
    private String email;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill=FieldFill.INSERT_UPDATE)
    private Date updateTime;

    @Version
    @TableField(fill = FieldFill.INSERT)
    private Integer version;

    @TableLogic
    private Integer deleted;
}
```

Mybatis-Plus实体类**相关注解**

```java
@Description                                //解释注解
@TableId(type = IdType.ID_WORKER)           //主键自增（数字类型为IdType.ID_WORKER，字符串为IdType.ID_WORKER.STR）
@TableField(fill = FieldFill.INSERT)        //插入时自动更新注解（需要配置handler）
@TableField(fill=FieldFill.INSERT_UPDATE)   //插入或更新时自动更新注解（需要配置handler）
@Version                                    //乐观锁注解
@TableLogic                                 //逻辑删除注解
```

### handler包

```java
package com.yuwwei.springbootweb.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    /**
     * 使用mp实现添加操作，这个方法执行
     * @param metaObject
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        this.setFieldValByName("createTime",new Date(),metaObject);
        this.setFieldValByName("updateTime",new Date(),metaObject);
        this.setFieldValByName("version",1,metaObject);
    }

    /**
     * 使用mp实现更新操作...
     * @param metaObject
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        this.setFieldValByName("updateTime",new Date(),metaObject);
    }
}
```

### mapper包

```java
package com.yuwwei.springbootweb.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuwwei.springbootweb.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

### 主程序类

```java
package com.yuwwei.springbootweb;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author GressWu
 */
@SpringBootApplication
public class SpringBootWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootWebApplication.class, args);
    }

}
```



## 3. Mybatis-Plus 相关查询语句

Mapper查询

```java
package com.yuwwei.springbootweb;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuwwei.springbootweb.entity.User;
import com.yuwwei.springbootweb.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@SpringBootTest
class SpringBootWebApplicationTests {

    @Autowired
    private UserMapper userMapper;

    //查询User表所有数据
    @Test
    public void findAll() {
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }

    //添加数据
    @Test
    public void addUser() {
        User user = new User();
        user.setAge(40);
        user.setName("萱萱");
        user.setEmail("119@qq.com");
        int insert = userMapper.insert(user);
    }

    //修改数据
    @Test
    public void updateUser() {
        User user = new User();
        user.setId(1362763027183689729L);
        user.setAge(200);
        int row = userMapper.updateById(user);
    }

    //乐观锁测试
    @Test
    public void OptimisticLocker() {
        //查询
        User user = userMapper.selectById(1362769600639438850L);

        //进行修改
        user.setAge(200);
        int row = userMapper.updateById(user);
    }

    //多个Id批量查询
    @Test
    public void testSelectDemo1() {
        //查询
        List<User> users = userMapper.selectBatchIds(Arrays.asList(1L, 2L, 3L));
        System.out.println(users);
    }

    //简单条件查询
    @Test
    public void testSelectByMap(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("name", "Jone");
        map.put("age", 18);
        List<User> users = userMapper.selectByMap(map);
        users.forEach(System.out::println);
    }

    //分页查询
    @Test
    public void testSelectByPage(){
        //1.创建Page对象
        //当前页，每页记录数
        Page<User> page=new Page<>(2,3);
        //调用wrapper查询
        userMapper.selectPage(page,null);
        //通过page对象获取分页数据
        //当前页
        System.out.println(page.getCurrent());
        //每页数据list集合
        System.out.println(page.getRecords());
        //每页显示记录数
        System.out.println(page.getSize());
        //总记录数
        System.out.println(page.getTotal());
        //总页数
        System.out.println(page.getPages());

        //是否下一页
        System.out.println(page.hasNext());
        //是否上一页
        System.out.println(page.hasPrevious());
    }

    //删除操作 物理删除
    @Test
    public void testDeleteById() {
        int i = userMapper.deleteById(3L);
    }


    //批量删除 物理删除
    @Test
    public void testDeleteBatchById() {
        int i = userMapper.deleteBatchIds(Arrays.asList(2L, 3L, 4L));
    }

    //mp实现复杂查询
    @Test
    public void testSelectQuery() {
        //创建queryWrapper对象
        QueryWrapper<User> wrapper = new QueryWrapper<>();

        //通过wrapper设置条件
        //ge、gt、le、lt
        //age>=30
        wrapper.ge("age",30);
        List<User> users = userMapper.selectList(wrapper);
        System.out.println(users);
        //eq(等于)、ne（不等于）

        //between

        //like

        //orderByDesc

        //last
        wrapper.last("limit 1");

        //指定列
        wrapper.select("id","name");
    }
}
```

Service增强

```java
package com.atguigu.eduservice.service;

import com.atguigu.eduservice.entity.EduTeacher;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 讲师 服务类
 * </p>
 *
 * @author GressWu
 * @since 2021-02-21
 */
public interface EduTeacherService extends IService<EduTeacher> {

}
```

```java
package com.atguigu.eduservice.service.impl;

import com.atguigu.eduservice.entity.EduTeacher;
import com.atguigu.eduservice.mapper.EduTeacherMapper;
import com.atguigu.eduservice.service.EduTeacherService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 讲师 服务实现类
 * </p>
 *
 * @author GressWu
 * @since 2021-02-21
 */
@Service
public class EduTeacherServiceImpl extends ServiceImpl<EduTeacherMapper, EduTeacher> implements EduTeacherService {

}
```

## 4. Mybatis-Plus 自动生成工具

在junit单元测试中生成Mybatis-Plus

```java
package com.atguigu.demo;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import org.junit.Test;

/**
 * @author
 * @since 2018/12/13
 */
public class CodeGenerator {

    @Test
    public void run() {

        // 1、创建代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 2、全局配置
        GlobalConfig gc = new GlobalConfig();
        //获得当前文件夹的路径
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath + "/src/main/java");
        gc.setAuthor("GressWu");
        gc.setOpen(false); //生成后是否打开资源管理器
        gc.setFileOverride(false); //重新生成时文件是否覆盖
        gc.setServiceName("%sService");    //去掉Service接口的首字母I
        gc.setIdType(IdType.ID_WORKER_STR); //主键策略
        gc.setDateType(DateType.ONLY_DATE);//定义生成的实体类中日期类型
        gc.setSwagger2(true);//开启Swagger2模式

        mpg.setGlobalConfig(gc);

        // 3、数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://localhost:3306/guli?serverTimezone=GMT%2B8");
        dsc.setDriverName("com.mysql.cj.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("root");
        dsc.setDbType(DbType.MYSQL);
        mpg.setDataSource(dsc);

        // 4、包配置
        PackageConfig pc = new PackageConfig();
        //com.atguigu.eduservice
        pc.setParent("com.atguigu");//父包
        pc.setModuleName("eduservice"); //模块名

        //com.atguigu.eduservice.controller
        pc.setController("controller");
        pc.setEntity("entity");
        pc.setService("service");
        pc.setMapper("mapper");
        mpg.setPackageInfo(pc);

        // 5、策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setInclude("edu_teacher");
        strategy.setNaming(NamingStrategy.underline_to_camel);//数据库表映射到实体的命名策略
        strategy.setTablePrefix(pc.getModuleName() + "_"); //生成实体时去掉表前缀

        strategy.setColumnNaming(NamingStrategy.underline_to_camel);//数据库表字段映射到实体的命名策略
        strategy.setEntityLombokModel(true); // lombok 模型 @Accessors(chain = true) setter链式操作

        strategy.setRestControllerStyle(true); //restful api风格控制器
        strategy.setControllerMappingHyphenStyle(true); //url中驼峰转连字符

        mpg.setStrategy(strategy);


        // 6、执行
        mpg.execute();
    }


    @Test
    public void test(){
        System.out.println("sss");
    }
}
```



