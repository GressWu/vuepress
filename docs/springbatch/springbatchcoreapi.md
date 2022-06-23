---
title: SpringBatch核心API
date: 2022-06-23
categories:
 - backEnd
tags:
 - springBatch
---

## SpringBatch核心API

### Job

![image-20220621103633003](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220621103633003.png)

```java
    @Bean
    public Job JobDemoJob(){
//        return jobBuilderFactory.get("JobDemoJob")
//                .start(step0())
//                .next(step2())
//                .next(step3())
//                .build();
        return jobBuilderFactory.get("JobDemoJob")
                .start(step0())
                .on("COMPLETED").to(step2())
                .from(step2()).on("COMPLETED").to(step3())
                .from(step3()).end()
                .build();
    }
```

```
.on()条件
.to()满足条件执行下一步
.from()从哪一步来
.end()结束
.stopAndRestart()停止并重启
```

### Flow

一个Flow包含多个Step，一个Job可以通过组合Flow或者Step完成批处理。

```java
package com.yuwei.configuration;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableBatchProcessing
public class FlowJobDemo {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    //注入创建Step对象的对象
    @Autowired
    private StepBuilderFactory stepBuilderFactory;


    //创建任务对象
    @Bean
    public Job FlowJobDemoJob(){
        return jobBuilderFactory.get("FlowJobDemoJob")
                .start(flowDemo())
                .next(stepc())
                .end().build();
    }

    /**
     * 指明Flow对象包含哪些Step
     * @return
     */
    @Bean
    public Flow flowDemo(){
        return new FlowBuilder<Flow>("flowDemo")
                .start(stepa())
                .next(stepb())
                .build();
    }


    @Bean
    public Step stepa(){
        return stepBuilderFactory.get("stepa")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("stepa");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Bean
    public Step stepb(){
        return stepBuilderFactory.get("stepb")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("stepb");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Bean
    public Step stepc(){
        return stepBuilderFactory.get("stepc")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("stepc");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

}
```

### split实现并发执行

`.split(new SimpleAsyncTaskExecutor())`实现不同Flow并发运行

```java
package com.yuwei.configuration;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

@Configuration
@EnableBatchProcessing
public class SplitJobDemo {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;


    @Bean
    public Job splitJob(){
        return jobBuilderFactory.get("splitJob")
                .start(splitFlowDemo1())
                .split(new SimpleAsyncTaskExecutor())
                .add(splitFlowDemo2())
                .end().build();
    }

    @Bean
    public Flow splitFlowDemo1(){
        return new FlowBuilder<Flow>("flowDemo")
                .start(stepx())
                .build();
    }

    @Bean
    public Flow splitFlowDemo2(){
        return new FlowBuilder<Flow>("flowDemo")
                .start(stepy())
                .next(stepz())
                .build();
    }

    @Bean
    public Step stepz(){
        return stepBuilderFactory.get("stepz")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("stepz");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Bean
    public Step stepy(){
        return stepBuilderFactory.get("stepy")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("stepy");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Bean
    public Step stepx(){
        return stepBuilderFactory.get("stepx")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("stepx");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }
}
```

### 决策器

在Job执行阶段通过`on`方法调用决策器来实现执行哪部Step。

**决策器示例**

```java
package com.yuwei.configuration;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.job.flow.FlowExecutionStatus;
import org.springframework.batch.core.job.flow.JobExecutionDecider;

public class MyDecider implements JobExecutionDecider {

    private int age = 0;
    @Override
    public FlowExecutionStatus decide(JobExecution jobExecution, StepExecution stepExecution) {
        age ++;
        if(age%2==0){
            return new FlowExecutionStatus("Even");
        }
        return new FlowExecutionStatus("Odd");
    }
}

```

**实现代码**

`.on("*")`代表不论什么结果

```java
package com.yuwei.configuration;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.flow.JobExecutionDecider;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@EnableBatchProcessing
@Configuration
public class DeciderDemo {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job deciderJobDemo(){
        return jobBuilderFactory.get("deciderJobDemo")
                .start(deciderStep1())
                .next(myDecider())
                .from(myDecider()).on("Odd").to(deciderStep2())
                .from(myDecider()).on("Even").to(deciderStep3())
                .from(deciderStep2()).on("*").to(deciderStep3())
                .end().build();
    }

    @Bean
    public Step deciderStep1(){
        return stepBuilderFactory.get("deciderStep1")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("deciderStep1");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Bean
    public Step deciderStep2(){
        return stepBuilderFactory.get("deciderStep2")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("deciderStep2");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Bean
    public Step deciderStep3(){
        return stepBuilderFactory.get("deciderStep3")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("deciderStep3");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    //创建决策器
    @Bean
    public JobExecutionDecider myDecider(){
        return new MyDecider();
    }

}
```

### Job的嵌套，父子Job的使用

**子Job**

```java
package com.yuwei.configuration.child;

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

@EnableBatchProcessing
@Configuration
public class ChildJob1 {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job childJob1Job(){
        return jobBuilderFactory.get("childJob1Job")
                .start(childStep1())
                .build();
    }

    @Bean
    public Step childStep1(){
        return stepBuilderFactory.get("childStep1")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("ChildStep1");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

}

```

```java
package com.yuwei.configuration.child;

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

@EnableBatchProcessing
@Configuration
public class ChildJob2 {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job childJob2Job(){
        return jobBuilderFactory.get("childJob2Job")
                .start(childStep2())
                .build();
    }

    @Bean
    public Step childStep2(){
        return stepBuilderFactory.get("childStep2")
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        System.out.println("ChildStep2");
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

}
```

**父Job**

```java
package com.yuwei.configuration;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.JobStepBuilder;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@EnableBatchProcessing
@Configuration
public class ParentJobDemo {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private Job childJob1Job;

    @Autowired
    private Job childJob2Job;

    //注入job启动器
    @Autowired
    private JobLauncher jobLauncher;

    @Bean
    public Job parentJob(JobRepository jobRepository, PlatformTransactionManager platformTransactionManager){
        return jobBuilderFactory.get("parentJob")
                .start(childJobOne(jobRepository,platformTransactionManager))
                .next(childJobTwo(jobRepository,platformTransactionManager))
                .build();
    }
    /**
     * 返回的是Job类型的Step
     * @param jobRepository
     * @param platformTransactionManager
     * @return
     */
    @Bean
    public Step childJobOne(JobRepository jobRepository, PlatformTransactionManager platformTransactionManager){
        return new JobStepBuilder(new StepBuilder("childJobOne"))
                .job(childJob1Job)
                .launcher(jobLauncher) //使用父项目的Job启动器
                .repository(jobRepository) //持久化
                .transactionManager(platformTransactionManager) //事务处理
                .build();
    }

    @Bean
    public Step childJobTwo(JobRepository jobRepository, PlatformTransactionManager platformTransactionManager){
        return new JobStepBuilder(new StepBuilder("childJobTwo"))
                .job(childJob2Job)
                .launcher(jobLauncher) //使用父项目的Job启动器
                .repository(jobRepository) //持久化
                .transactionManager(platformTransactionManager) //事务处理
                .build();
    }

}
```



### 监听器

**Job的监听器**

```java
package com.yuwei.listener;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;

public class MyJobListener implements JobExecutionListener {
    @Override
    public void beforeJob(JobExecution jobExecution) {
        System.out.println(jobExecution.getJobInstance().getJobName()+"before...");
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        System.out.println(jobExecution.getJobInstance().getJobName()+"after...");
    }
}
```

**Step的监听器**

```java
package com.yuwei.listener;

import org.springframework.batch.core.annotation.AfterChunk;
import org.springframework.batch.core.annotation.BeforeChunk;
import org.springframework.batch.core.scope.context.ChunkContext;

public class MyChunkListener {

    @BeforeChunk
    public void beforeChunk(ChunkContext chunkContext){
        System.out.println(chunkContext.getStepContext().getStepName()+"before...");
    }

    @AfterChunk
    public void afterChunk(ChunkContext chunkContext){
        System.out.println(chunkContext.getStepContext().getStepName()+"after...");
    }
}
```

**实现类**

实现Step有两种方式，第一种是之前提到的`Tasklet`方式，第二种是`Chunk方式`，其中`Chunk`方式可以限定先处理几条数据然后在进行下一步。

```java
package com.yuwei.configuration;

import com.yuwei.listener.MyChunkListener;
import com.yuwei.listener.MyJobListener;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;


@EnableBatchProcessing
@Configuration
public class ListenerDemo {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job listenerJob() {
        return jobBuilderFactory.get("listenerJob")
                .start(step001())
                .listener(new MyJobListener()) //job级别监听
                .build();
    }

    //chunk作用：处理完两个数据在处理
    @Bean
    public Step step001() {
        return stepBuilderFactory.get("step001")
                .<String,String>chunk(2)  //read,process,write
                .faultTolerant()
                .listener(new MyChunkListener()) //step级别监听
                .reader(read())
                .writer(write())
                .build();
    }
    
    /**
     * 可以在此进行数据处理
    **/
    @Bean
    public ItemReader<String> read(){
        return new ListItemReader<>(Arrays.asList("java","c++","spring"));
    }
    @Bean
    public ItemWriter<String> write(){
        return new ItemWriter<String>() {
            @Override
            public void write(List<? extends String> list) throws Exception {
                for (String s : list) {
                    System.out.println(s);
                }
            }
        };
    }



}
```

**输出结果**

```shell
2022-06-22 10:11:01.156  INFO 27560 --- [           main] o.s.b.c.l.support.SimpleJobLauncher      : Job: [SimpleJob: [name=listenerJob]] launched with the following parameters: [{}]
listenerJobbefore...
2022-06-22 10:11:01.156  INFO 27560 --- [           main] o.s.batch.core.job.SimpleStepHandler     : Executing step: [step001]
step001before...
java
c++
step001after...
step001before...
spring
step001after...
2022-06-22 10:11:01.171  INFO 27560 --- [           main] o.s.batch.core.step.AbstractStep         : Step: [step001] executed in 15ms
listenerJobafter...
```

### Job参数

Job执行的是step，Job使用的数据肯定是在Step中使用。

向Step传递参数的方式有：

* 使用监听，Step级别的Chunk监听来传递数据
* 使用监听，实现类中 `implements StepExecutionListener`

```java
package com.yuwei.configuration;

import org.springframework.batch.core.*;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class JobParameterDemo implements StepExecutionListener {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    private Map<String,JobParameter> parameters;

    @Bean
    public Job jobParameter(){
        return jobBuilderFactory.get("jobParameter")
                .start(jobParameterStep())
                .build();
    }

    @Bean
    public Step jobParameterStep(){
        return stepBuilderFactory.get("jobParameterStep")
                .listener(this)
                .tasklet(new Tasklet() {
                    @Override
                    public RepeatStatus execute(StepContribution stepContribution, ChunkContext chunkContext) throws Exception {
                        //输出接受到的参数值
                        System.out.println(parameters);
                        return RepeatStatus.FINISHED;
                    }
                }).build();
    }

    @Override
    public void beforeStep(StepExecution stepExecution) {
        parameters=stepExecution.getJobParameters().getParameters();
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return null;
    }
}

```

