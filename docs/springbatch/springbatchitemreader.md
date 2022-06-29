---
title: SpringBatch输入流
date: 2022-06-28
categories:
 - backEnd
tags:
 - springBatch
---
SpringBatch处理流主要分为ItemReader输入流、ItemProcessor处理流和ItemWriter输出流

## SpringBatch实现的ItemReader

| Item Reader                              | Description                                                  |
| ---------------------------------------- | ------------------------------------------------------------ |
| AbstractItemCountingItemStreamItemReader | Abstract base class that provides basic restart capabilities by counting the number of items returned from an ItemReader |
| AggregateItemReader                      | An ItemReader that delivers a list as its item, storing up objects from the injected ItemReader until they are ready to be packed out as a collection. This class must be used as a wrapper for a custom ItemReader that can identify the record boundaries. The custom reader should mark the beginning and end of records by returning an AggregateItem which responds true to its query methods isHeader() and isFooter(). Note that this reader is not part of the library of readers provided by Spring Batch but given as a sample in spring-batch-samples. |
| AmqpItemReader                           | Given a Spring AmqpTemplate, it provides synchronous receive methods. The receiveAndConvert() method lets you receive POJO objects |
| KafkaItemReader                          | An ItemReader that reads messages from an Apache Kafka topic. It can be configured to read messages from multiple partitions of the same topic. This reader stores message offsets in the execution context to support restart capabilities. |
| FlatFileItemReader                       | Reads from a flat file. Includes ItemStream and Skippable functionality. See FlatFileItemReader. |
| HibernateCursorItemReader                | Reads from a cursor based on an HQL query. See Cursor-based ItemReaders. |
| HibernatePagingItemReader                | Reads from a paginated HQL query                             |
| ItemReaderAdapter                        | Adapts any class to the ItemReader interface.                |
| JdbcCursorItemReader                     | Reads from a database cursor via JDBC. See Cursor-based ItemReaders. |
| JdbcPagingItemReader                     | Given an SQL statement, pages through the rows, such that large datasets can be read without running out of memory. |
| JmsItemReader                            | Given a Spring JmsOperations object and a JMS Destination or destination name to which to send errors, provides items received through the injected JmsOperations#receive() method |
| JpaPagingItemReader                      | Given a JPQL statement, pages through the rows, such that large datasets can be read without running out of memory |
| ListItemReader                           | Provides the items from a list, one at a time                |
| MongoItemReader                          | Given a MongoOperations object and a JSON-based MongoDB query, provides items received from the MongoOperations#find() method. |
| Neo4jItemReader                          | Given a Neo4jOperations object and the components of a Cyhper query, items are returned as the result of the Neo4jOperations.query method. |
| RepositoryItemReader                     | Given a Spring Data PagingAndSortingRepository object, a Sort, and the name of method to execute, returns items provided by the Spring Data repository implementation. |
| StoredProcedureItemReader                | Reads from a database cursor resulting from the execution of a database stored procedure. See StoredProcedureItemReader |
| StaxEventItemReader                      | Reads via StAX. see StaxEventItemReader.                     |
| JsonItemReader                           | Reads items from a Json document. see JsonItemReader.        |

## 1.基本使用

### 1.1处理类

```java
package com.yuwei.itembatch;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class ItemReaderDemo {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    //注入创建Step对象的对象
    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job itemReaderJob(){
        return jobBuilderFactory.get("itemReaderJob")
                .start(itemReaderStep1())
                .build();

    }

    @Bean
    public Step itemReaderStep1(){
        return stepBuilderFactory.get("itemReaderStep1")
            	//输入流参数为String，输出流参数为String
                .<String, String>chunk(20)
                .reader(readerDemo())
                .writer(list -> {
                    for (String s : list) {
                        System.out.println(s);
                    }
                }).build();
    }

    /**
    *	封装ItemReader
    **/
    private MyReader readerDemo() {
        List<String> strings = Arrays.asList("cat", "dog", "monkey", "duck", "boy", "girl");
        return new MyReader(strings);
    }
}
```

### 1.2封装ItemReader

这里实现ItemReader接口，可以进一步做到业务处理的分离。当然也可以在批处理中直接编写ItemReader()处理类。

```java
package com.yuwei.itembatch;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;

import java.util.Iterator;
import java.util.List;

//泛型String代表输入String数据
public class MyReader implements ItemReader<String> {

    private Iterator<String> iterator;

    public MyReader(List<String> list){
        this.iterator = list.iterator();
    }

    @Override
    public String read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
        //一次只能读一个数据
        if(iterator.hasNext()){
            return this.iterator.next();
        }else {
            return null;
        }
    }
}
```

## 2.数据库中读取数据

### 2.1处理类

SpringBatch提供了很多数据库框架的ItemReader，比如原生JDBC或者JPA、Mybatis。这些ItemReader的好处是可以实现分页查询设置最大处理量，当数据量很大时就可以很好的解决卡死无法处理数据的问题。

```java
package com.yuwei.itembatch;

import com.yuwei.entity.Billionaires;
import com.yuwei.listener.MyChunkListener;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.item.*;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.Order;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.database.JdbcPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.item.database.orm.JpaNativeQueryProvider;
import org.springframework.batch.item.database.support.H2PagingQueryProvider;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.RowMapper;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class ItemReaderDbDemo {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    //注入创建Step对象的对象
    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private ItemWriter<Billionaires> ItemWriterDb;

    @Autowired
    private EntityManagerFactory entityManagerFactory;


    @Bean
    public Job itemReaderDbJob(){
        return jobBuilderFactory.get("itemReaderDbJob")
                .start(itemReaderDbStep())
                .build();
    }

    @Bean
    public Step itemReaderDbStep(){
        return stepBuilderFactory.get("itemReaderDbStep")
                .<Billionaires,Billionaires>chunk(4)
                .reader(JpaReader())
                //.reader(itemReader())
                .writer(ItemWriterDb)
                .build();
    }

    /**
    *  使用JDBC分页处理
    **/
    @Bean
    public JdbcPagingItemReader<Billionaires> dbReader() {
        JdbcPagingItemReader<Billionaires> reader = new JdbcPagingItemReader<>();
        reader.setDataSource(dataSource);
        //一次性可以从数据库中抓取多少数据
        reader.setFetchSize(10);
        //把读取到的数据转换为user对象
        reader.setRowMapper(new RowMapper<Billionaires>() {
            @Override
            public Billionaires mapRow(ResultSet rs, int rowNum) throws SQLException {
                Billionaires billionaires = new Billionaires();
                billionaires.setId(rs.getString(1));
                billionaires.setFirst_name(rs.getString(2));
                billionaires.setLast_name(rs.getString(3));
                billionaires.setCareer(rs.getString(4));
                return billionaires;
            }
        });

        H2PagingQueryProvider h2PagingQueryProvider = new H2PagingQueryProvider();
        h2PagingQueryProvider.setSelectClause("id,first_name,last_name,career");
        h2PagingQueryProvider.setFromClause("from billionaires");
        Map<String, Order> hashMap = new HashMap<String, Order>(1);
        hashMap.put("Id",Order.ASCENDING);
        h2PagingQueryProvider.setSortKeys(hashMap);

        reader.setQueryProvider(h2PagingQueryProvider);
        return reader;
    }

 	/**
    *  使用JPA分页处理
    **/
    @Bean
    public JpaPagingItemReader<Billionaires> JpaReader(){
        JpaPagingItemReaderBuilder<Billionaires> readerBuilder = new JpaPagingItemReaderBuilder<>();
        JpaNativeQueryProvider<Billionaires> queryProvider = new JpaNativeQueryProvider<>();
        queryProvider.setEntityClass(Billionaires.class);
        queryProvider.setSqlQuery("select id,first_name,last_name,career from Billionaires");
        return readerBuilder
            	//最多能从数据库中取多少数据
                .maxItemCount(10000)
                .queryProvider(queryProvider)
                .entityManagerFactory(entityManagerFactory)
                .pageSize(5)
                .saveState(false)
                .build();
    }
    
}

```

### 2.2封装ItemWriter

```java
package com.yuwei.itembatch;

import com.yuwei.entity.Billionaires;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ItemWriterDb implements ItemWriter<Billionaires> {
    @Override
    public void write(List<? extends Billionaires> list) throws Exception {
        for (Billionaires billionaires : list) {
            System.out.println(billionaires);
        }
    }
}
```

## 3.从普通文件中读取数据

### 3.1要处理的文件

```
ID,FIRST_NAME,LAST_NAME,CAREER
1,Aliko Dangote,Billionaire,Industrialist
2,Bill Gates,Billionaire,Tech Entrepreneur
3,Bill1	Gates,Billionaire,Tech Entrepreneur
4,Bill2	Gates,Billionaire,Tech Entrepreneur
5,Bill3	Gates,Billionaire,Tech Entrepreneur
6,Bill4	Gates,Billionaire,Tech Entrepreneur
7,Folrunsho	Alakija,Billionaire,Oil Magnate
```

### 3.2处理类

`new ClassPathResource("file.txt")`可以读取resource下的文件

```java
package com.yuwei.fileitembatch;

import com.yuwei.entity.Billionaires;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.FieldSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.validation.BindException;

import java.util.Iterator;
import java.util.List;

@Configuration
public class ItemReaderFileDemo {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;


    @Bean
    public Job itemBatchJob(){
        return jobBuilderFactory.get("itemBatchJob")
                .start(itemBatchStep())
                .build();
    }

    @Bean
    public Step itemBatchStep(){
        return stepBuilderFactory.get("itemBatchStep")
                .<Billionaires,Billionaires>chunk(3)
                .reader(fileFlatReader())
                .writer(fileFlatWriter())
                .build();

    }

    private ItemWriter<? super Billionaires> fileFlatWriter() {
        return new ItemWriter<Billionaires>() {
            @Override
            public void write(List<? extends Billionaires> list) throws Exception {
                for (Billionaires billionaires : list) {
                    System.out.println("读文件"+billionaires);
                }
            }
        };
    }

    private FlatFileItemReader<? extends Billionaires> fileFlatReader() {
        FlatFileItemReader<Billionaires> reader = new FlatFileItemReader<>();
        //设置读取解析文件路径
        reader.setResource(new ClassPathResource("file.txt"));
        //跳过第一行
        reader.setLinesToSkip(1);
        //解析数据
        DelimitedLineTokenizer delimitedLineTokenizer = new DelimitedLineTokenizer();
        delimitedLineTokenizer.setNames(new String[]{"ID","FIRST_NAME","LAST_NAME","CAREER"});
        //把解析中的数据映射为Billionaires对象
        DefaultLineMapper<Billionaires> mapper = new DefaultLineMapper<>();
        mapper.setLineTokenizer(delimitedLineTokenizer);
        mapper.setFieldSetMapper(new FieldSetMapper<Billionaires>() {
            @Override
            public Billionaires mapFieldSet(FieldSet fieldSet) throws BindException {
                Billionaires billionaires = new Billionaires();
                billionaires.setId(fieldSet.readString("ID"));
                billionaires.setFirst_name(fieldSet.readString("FIRST_NAME"));
                billionaires.setLast_name(fieldSet.readString("LAST_NAME"));
                billionaires.setCareer(fieldSet.readString("CAREER"));
                return billionaires;
            }
        });
        //检查数据配置
        mapper.afterPropertiesSet();
        reader.setLineMapper(mapper);
        return reader;
    }

}
```

**输出结果**：

```java
读文件Billionaires(Id=1, first_name=Aliko Dangote, last_name=Billionaire, career=Industrialist)
读文件Billionaires(Id=2, first_name=Bill Gates, last_name=Billionaire, career=Tech Entrepreneur)
读文件Billionaires(Id=3, first_name=Bill1	Gates, last_name=Billionaire, career=Tech Entrepreneur)
读文件Billionaires(Id=4, first_name=Bill2	Gates, last_name=Billionaire, career=Tech Entrepreneur)
读文件Billionaires(Id=5, first_name=Bill3	Gates, last_name=Billionaire, career=Tech Entrepreneur)
读文件Billionaires(Id=6, first_name=Bill4	Gates, last_name=Billionaire, career=Tech Entrepreneur)
读文件Billionaires(Id=7, first_name=Folrunsho	Alakija, last_name=Billionaire, career=Oil Magnate)
```

## 4.从XML文件中读取数据

### 4.1所需依赖

```xml
<dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-oxm</artifactId>
      <version>5.3.8</version>
</dependency>

<dependency>
      <groupId>com.thoughtworks.xstream</groupId>
      <artifactId>xstream</artifactId>
      <version>1.4.10</version>
 </dependency>
```

### 4.2要处理的文件

`file.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<records>
    <billionaire>
        <Id>XYZ0001</Id>
        <first_name>5</first_name>
        <last_name>11.39</last_name>
        <career>Customer1</career>
    </billionaire>
    <billionaire>
        <Id>XYZ0002</Id>
        <first_name>2</first_name>
        <last_name>72.99</last_name>
        <career>Customer2c</career>
    </billionaire>
    <billionaire>
        <Id>XYZ0003</Id>
        <first_name>9</first_name>
        <last_name>99.99</last_name>
        <career>Customer3</career>
    </billionaire>
</records>
```

### 4.3处理类

```java
package com.yuwei.xmlitembatch;

import com.yuwei.entity.Billionaires;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.xml.StaxEventItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.oxm.xstream.XStreamMarshaller;

import java.util.HashMap;

@Configuration
public class ItemReaderXMLDemo {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job itemReaderXMLJob(){
        return jobBuilderFactory.get("itemReaderXMLJob")
                .start(itemReaderXMLStep())
                .build();

    }

    @Bean
    public Step itemReaderXMLStep(){
        return stepBuilderFactory.get("itemReaderXMLStep")
                .<Billionaires,Billionaires>chunk(100)
                .reader(xmlReader())
                .writer(list -> {
                    for (Billionaires billionaires : list) {
                        System.out.println("读取XML文件："+billionaires);
                    }
                }).build();
    }

    private StaxEventItemReader<? extends Billionaires> xmlReader() {
        StaxEventItemReader<Billionaires> reader = new StaxEventItemReader<>();
        //读取XML文件
        reader.setResource(new ClassPathResource("file.xml"));
        //要处理的根标签
        reader.setFragmentRootElementName("billionaire");
        //把XML文件转换为Java对象
        XStreamMarshaller xStreamMarshaller = new XStreamMarshaller();

        HashMap<String, Class> hashMap = new HashMap<>();
        hashMap.put("billionaire",Billionaires.class);
        xStreamMarshaller.setAliases(hashMap);
        reader.setUnmarshaller(xStreamMarshaller);
        return reader;
    }


}

```

## 5.处理多个文件

### 5.1项目结构

![image-20220629140731906](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220629140731906.png)

### 5.2处理类

```java
package com.yuwei.multipartbatch;

import com.yuwei.entity.Billionaires;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.MultiResourceItemReader;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.FieldSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.validation.BindException;

@Configuration
public class multiPartBatchDemo {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Value("classpath:/file*.txt")
    private Resource[] resourcesFiles;

    @Bean
    public Job multiPartBatchJob(){
        return jobBuilderFactory.get("multiPartBatchJob")
                .start(multiPartBatchStep())
                .build();
    }

    public Step multiPartBatchStep(){
        return stepBuilderFactory.get("multiPartBatchStep")
                .<Billionaires,Billionaires>chunk(10)
                .reader(multiPartBatchReader())
                .writer(list -> {
                    for (Billionaires billionaires : list) {
                        System.out.println("多文件"+billionaires);
                    }
                })
                .build();
    }

    private MultiResourceItemReader<? extends Billionaires> multiPartBatchReader() {
        MultiResourceItemReader<Billionaires> reader = new MultiResourceItemReader<>();
        reader.setDelegate(fileFlatReader());
        reader.setResources(resourcesFiles);
        return reader;
    }

    private FlatFileItemReader<? extends Billionaires> fileFlatReader() {
        FlatFileItemReader<Billionaires> reader = new FlatFileItemReader<>();
        //跳过第一行
        reader.setLinesToSkip(1);
        //解析数据
        DelimitedLineTokenizer delimitedLineTokenizer = new DelimitedLineTokenizer();
        delimitedLineTokenizer.setNames(new String[]{"ID","FIRST_NAME","LAST_NAME","CAREER"});
        //把解析中的数据映射为Billionaires对象
        DefaultLineMapper<Billionaires> mapper = new DefaultLineMapper<>();
        mapper.setLineTokenizer(delimitedLineTokenizer);
        mapper.setFieldSetMapper(new FieldSetMapper<Billionaires>() {
            @Override
            public Billionaires mapFieldSet(FieldSet fieldSet) throws BindException {
                Billionaires billionaires = new Billionaires();
                billionaires.setId(fieldSet.readString("ID"));
                billionaires.setFirst_name(fieldSet.readString("FIRST_NAME"));
                billionaires.setLast_name(fieldSet.readString("LAST_NAME"));
                billionaires.setCareer(fieldSet.readString("CAREER"));
                return billionaires;
            }
        });
        //检查数据配置
        mapper.afterPropertiesSet();
        reader.setLineMapper(mapper);
        return reader;
    }
}

```

## 注意事项

**Job必须作为Bean对象注入IOC容器**，否则不生效，step可以不进行Bean注入。但是建议也将Step对象进行Bean注入，这样的话其他Job也可以使用该Step。



