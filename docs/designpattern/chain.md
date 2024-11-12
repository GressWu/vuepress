---
title: 责任链模式
date: 2024-09-13
categories:
- DesignPattern
tags:
- Java
---

## 什么是责任链模式

责任链模式是一种行为设计模式，其中多个对象按照其在链中的顺序依次处理请求，直到其中一个对象能够处理该请求为止。责任链模式可以避免请求发送者与接收者之间的直接耦合，同时允许多个对象都有机会处理请求。比较适合于**权限职责明确，有通用处理的方法**。

## 适用场景

1. **审批流程**：在企业中，例如请假审批流程，不同级别的主管可能需要依次审批请求。责任链模式可以用于实现这样的审批流程，每个主管负责处理自己权限范围内的审批请求。
2. **日志记录**：在日志记录系统中，可以创建多个日志处理器，每个处理器负责处理特定级别的日志消息。日志消息可以依次经过这些处理器，直到找到能够处理该级别日志的处理器为止。
3. **异常处理**：在软件系统中，可以使用责任链模式来处理异常。不同的异常处理器可以处理不同类型的异常，确保每种异常都能够得到适当的处理。
4. **权限验证**：在系统中进行权限验证时，可以使用责任链模式来检查用户的权限。每个权限验证器可以检查用户的不同权限，直到找到合适的验证器为止。

## 实例

```java
package com.yuwei.chain;

public abstract class AbstractLogger {

    public static int INFO =1;
    public static int DEBUG =2;
    public static int ERROR =3;

    protected int level;

    protected AbstractLogger nextAbstractLogger;

    public void setNextAbstractLogger(AbstractLogger nextAbstractLogger){
        this.nextAbstractLogger = nextAbstractLogger;
    }

    public void logMessage(int level,String message){
        if(this.level<=level){
            write(message);
        }
        if(nextAbstractLogger!=null){
            nextAbstractLogger.logMessage(level,message);
        }
    }

    abstract protected void write(String message);


}

```

```java
package com.yuwei.chain;

public class ConsoleLogger extends AbstractLogger{

    public ConsoleLogger(int level){
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("ConsoleLogger"+level+message);

    }
}

```

```java
package com.yuwei.chain;

public class ErrorLogger extends AbstractLogger{

    public ErrorLogger(int level){
        this.level = level;
    }
    @Override
    protected void write(String message) {
        System.out.println("ErrorLogger"+level+message);
    }
}

```

```java
package com.yuwei.chain;

public class FileLogger extends AbstractLogger{

    public FileLogger(int level){
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("FileLogger"+level+message);
    }
}

```

```java
package com.yuwei.chain;

public class ChainPattern {

    public static AbstractLogger getChainOfLoggers(){
        ErrorLogger errorLogger = new ErrorLogger(AbstractLogger.ERROR);
        FileLogger fileLogger = new FileLogger(AbstractLogger.DEBUG);
        ConsoleLogger consoleLogger = new ConsoleLogger(AbstractLogger.INFO);
        errorLogger.setNextAbstractLogger(fileLogger);
        fileLogger.setNextAbstractLogger(consoleLogger);

        return errorLogger;
    }
}

```

```java
package com.yuwei.chain;

public class ChainDemo {
    public static void main(String[] args) {
        AbstractLogger chainOfLoggers = ChainPattern.getChainOfLoggers();
        chainOfLoggers.logMessage(AbstractLogger.ERROR,"info");
    }
}

```


