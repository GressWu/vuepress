---
title: SpringBatch前期准备
date: 2022-06-22
categories:
 - backEnd
tags:
 - springBatch
---

## SpringBatch所需依赖

SpringBatch**一定需要配置数据库**，才能够正常使用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>SpringBatchTest</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-batch</artifactId>
        </dependency>

        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    </dependencies>

</project>
```

## SpringBatch简单使用

```java
package com.yuwei.configuration;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableBatchProcessing
public class JobConfiguration {

    //注入创建任务对象的对象
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    //注入创建Step对象的对象
    @Autowired
    private StepBuilderFactory stepBuilderFactory;


    //创建任务对象
    @Bean
    public Job helloWorldJob(){
        return jobBuilderFactory.get("helloWorldJob")
                .start(step1())
                .build();
    }

    //创建Step对象
    @Bean
    public Step step1(){
        return stepBuilderFactory.get("step1")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("执行批量程序");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }


}
```

## SpringBatch所需元数据表

其中DDL脚本封装在Spring-Batch中的底层，根据不同数据库，进行不同的配置，即可自动生成下方六个Spring Batch所需的相关数据表

![image-20220621102522956](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220621102522956.png)

### BATCH_JOB_INSTANCE

Job每一次执行都会生成一个INSTANCE

![image-20220621102622664](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220621102622664.png)

该BATCH_JOB_INSTANCE表包含所有信息的JobInstance，并作为整个层次结构的顶层。以下通用DDL语句用于创建它：

- JOB_INSTANCE_ID：标识实例的唯一标识。这也是主要关键。这个列的值应该可以通过调用getId方法 来获得JobInstance。
- VERSION：见[版本](https://docs.spring.io/spring-batch/4.0.x/reference/html/schema-appendix.html#metaDataVersion)。
- JOB_NAME：从Job对象获取的作业的名称。由于需要标识实例，因此它不能为空。
- JOB_KEY：它的序列化JobParameters唯一地识别相同作业的不同实例。（JobInstances具有相同的作业名称必须具有JobParameters不同的JOB_KEY值，因此具有不同的值）。

### BATCH_JOB_EXECUTION_PARAMS

该BATCH_JOB_EXECUTION_PARAMS表包含与该JobParameters对象有关的所有信息 。它包含0个或更多传递给a的键/值对，Job并用作运行作业的参数的记录。对于有助于生成作业标识的每个参数，该IDENTIFYING标志设置为true。请注意，该表已被非规范化。不是为每种类型创建一个单独的表格，而是有一个表格带有指示类型的列，如下所示：

- JOB_EXECUTION_ID：BATCH_JOB_EXECUTION表中的外键，指示参数条目所属的作业执行。请注意，每次执行都可能存在多行（即键/值对）。
- TYPE_CD：存储值类型的字符串表示形式，可以是字符串，日期，长整数或双精度。由于该类型必须是已知的，因此它不能为空。
- KEY_NAME：参数键。
- STRING_VAL：参数值，如果类型是字符串。
- DATE_VAL：参数值，如果类型是日期。
- LONG_VAL：参数值，如果类型很长。
- DOUBLE_VAL：参数值，如果类型是双倍的。
- IDENTIFYING：指示参数是否有助于相关身份的标志JobInstance。

请注意，此表没有主键。这是因为框架没有用于一个，因此不需要它。如果需要，您可以添加一个主键，并添加一个数据库生成的密钥，而不会给框架本身带来任何问题。

### BATCH_JOB_EXECUTION

![image-20220621105345585](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220621105345585.png)

该BATCH_JOB_EXECUTION表包含与该JobExecution 对象有关的所有信息。每次Job运行a时JobExecution，此表中总是有一个新的和新的一行。以下清单显示了该BATCH_JOB_EXECUTION 表的定义：

- JOB_EXECUTION_ID：唯一标识此执行的主键。该列的值可通过调用对象的getId方法获得JobExecution。
- VERSION：见[版本](https://docs.spring.io/spring-batch/4.0.x/reference/html/schema-appendix.html#metaDataVersion)。
- JOB_INSTANCE_ID：BATCH_JOB_INSTANCE表中的外键。它表示此执行所属的实例。每个实例可能有多个执行。
- CREATE_TIME：代表创建执行时间的时间戳。
- START_TIME：代表执行开始时间的时间戳。
- END_TIME：表示执行完成时的时间戳，无论成功或失败。当作业当前未运行时，此列中的空值表示存在某种类型的错误，并且框架无法在失败之前执行上次保存。
- STATUS：表示执行状态的字符串。这可能是 COMPLETED，STARTED等等。该列的对象表示是 BatchStatus枚举。
- EXIT_CODE：表示执行退出代码的字符串。对于命令行作业，可能会将其转换为数字。
- EXIT_MESSAGE：表示作业如何退出的更详细描述的字符串。在失败的情况下，这可能包括尽可能多的堆栈跟踪。
- LAST_UPDATED：代表上次执行持续时间的时间戳。

### BATCH_JOB_EXECUTION_CONTEXT

该BATCH_JOB_EXECUTION_CONTEXT表包含ExecutionContext与a 有关的所有信息 Job。Job ExecutionContext每个 只有一个JobExecution，它包含特定作业执行所需的所有作业级别数据。这些数据通常代表故障发生后必须检索的状态，以便JobInstance能够“从停止的位置开始”。以下清单显示了该BATCH_JOB_EXECUTION_CONTEXT表的定义：

- JOB_EXECUTION_ID：表示JobExecution上下文所属的外键。可能有多于一行与给定的执行相关联。
- SHORT_CONTEXT：一个字符串版本的SERIALIZED_CONTEXT。
- SERIALIZED_CONTEXT：整个上下文序列化。

### BATCH_STEP_EXECUTION

![image-20220621102803653](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220621102803653.png)

BATCH_STEP_EXECUTION表包含与该StepExecution 对象相关的所有信息。该表格在很多方面与BATCH_JOB_EXECUTION表格类似，Step每个JobExecution创建的表格总是至少有一个条目。以下清单显示了该BATCH_STEP_EXECUTION表的定义：

- STEP_EXECUTION_ID：唯一标识此执行的主键。该列的值应该可以通过调用 对象的getId方法来获得StepExecution。
- VERSION：见[版本](https://docs.spring.io/spring-batch/4.0.x/reference/html/schema-appendix.html#metaDataVersion)。
- STEP_NAME：此执行程序所属步骤的名称。
- JOB_EXECUTION_ID：BATCH_JOB_EXECUTION表中的外键。它表明 JobExecution这StepExecution属于哪个。StepExecution给JobExecution定Step名称可能只有一个 给定的名称。
- START_TIME：代表执行开始时间的时间戳。
- END_TIME：表示执行完成时的时间戳，无论成功或失败。即使作业当前未运行，此列中的空值也表示存在某种类型的错误，并且框架无法在失败之前执行上次保存。
- STATUS：表示执行状态的字符串。这可能是 COMPLETED，STARTED等等。该列的对象表示是 BatchStatus枚举。
- COMMIT_COUNT：此执行期间步骤已提交事务的次数。
- READ_COUNT：执行过程中读取的项目数量。
- FILTER_COUNT：从此执行过滤出的项目数量。
- WRITE_COUNT：在执行期间写入和提交的项目数量。
- READ_SKIP_COUNT：在执行过程中跳过的项目数量。
- WRITE_SKIP_COUNT：执行期间在写入时跳过的项目数量。
- PROCESS_SKIP_COUNT：在执行过程中跳过的项目数量。
- ROLLBACK_COUNT：执行期间的回滚次数。请注意，此计数包括每次发生回滚时，包括重试回滚和跳过恢复过程中的回滚。
- EXIT_CODE：表示执行退出代码的字符串。对于命令行作业，可能会将其转换为数字。
- EXIT_MESSAGE：表示作业如何退出的更详细描述的字符串。在失败的情况下，这可能包括尽可能多的堆栈跟踪。
- LAST_UPDATED：代表上次执行持续时间的时间戳。

### BATCH_STEP_EXECUTION_CONTEXT

该BATCH_STEP_EXECUTION_CONTEXT表包含ExecutionContext与a 有关的所有信息 Step。ExecutionContext每个StepExecution数据只有一个，它包含了需要为特定步骤执行而保留的所有数据。这些数据通常代表故障发生后必须检索的状态，以便JobInstance可以从停止的位置开始。以下清单显示了该BATCH_STEP_EXECUTION_CONTEXT表的定义 ：

- STEP_EXECUTION_ID：表示StepExecution上下文所属的外键。可能有多个行与给定的执行关联。
- SHORT_CONTEXT：一个字符串版本的SERIALIZED_CONTEXT。
- SERIALIZED_CONTEXT：整个上下文序列化。

