---
title: 注解的使用
date: 2021-05-23
categories:
 - BackEnd
tags:
 - Java
---

## Java内置注解

* @Override : 定义在方法上，表示一个类准备重写另一个类的方法

* @Deprecated：定义在方法、属性、类上，表示不推荐程序员使用

* @SuppressWarnings：镇压警告，会抑制报错。与之前不同该注解需要提供参数。

  `@SuppressWarnings({"all","uncheck"})`该注解需要传入String[]值



## 元注解

元注解是用来定义注解的注解，Java中提供了四种元注解

* @Target 用于描述范围，注解可以使用在何处

  可选值包括ElementType枚举类里的值

  ```java
      /** Class, interface (including annotation type), or enum declaration */
      TYPE,
  
      /** Field declaration (includes enum constants) */
      FIELD,
  
      /** Method declaration */
      METHOD,
  
      /** Formal parameter declaration */
      PARAMETER,
  
      /** Constructor declaration */
      CONSTRUCTOR,
  
      /** Local variable declaration */
      LOCAL_VARIABLE,
  
      /** Annotation type declaration */
      ANNOTATION_TYPE,
  
      /** Package declaration */
      PACKAGE,
  
      /**
       * Type parameter declaration
       *
       * @since 1.8
       */
      TYPE_PARAMETER,
  
      /**
       * Use of a type
       *
       * @since 1.8
       */
      TYPE_USE
  ```

* @Retention 表示什么时候注解有效，是注解的生命周期

  用的是RetentionPolicy枚举类里的值,作用期SOURCE<CLASS<RUNTIME

  ```java
      /**
       * Annotations are to be discarded by the compiler.
       */
      SOURCE,
  
      /**
       * Annotations are to be recorded in the class file by the compiler
       * but need not be retained by the VM at run time.  This is the default
       * behavior.
       */
      CLASS,
  
      /**
       * Annotations are to be recorded in the class file by the compiler and
       * retained by the VM at run time, so they may be read reflectively.
       *
       * @see java.lang.reflect.AnnotatedElement
       */
      RUNTIME
  ```

* @Document 定义该注解会生成JavaDoc文件

* @Inherited 表示字类可以继承父类的该注解

## 自定义注解

```java
package com.atguigu.eduservice;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;

@Target({METHOD})                           //定义只有方法上可以使用该注解
@Retention(RetentionPolicy.RUNTIME)			//定义程序运行的时候该注解仍然生效
public @interface MyAnnotion {
    String name() default "zhangsan";		//注解中定义属性有所不同 数据类型 属性名() default 可以设置默认值 这样如果注解中没有传参那么就自动使用默认值
    int age();
    String[] address();
}
```

```java
@Deprecated
@MyAnnotion(name ="s",age= 12,address = {"sh","nj"})
@SuppressWarnings({"all","uncheck"})
public static void happy(){

}
```

如果有一个属性且名字叫value,那么在使用注解的时候可以不写属性名，直接传参即可。

比如SuppressWarnings注解

```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    /**
     * The set of warnings that are to be suppressed by the compiler in the
     * annotated element.  Duplicate names are permitted.  The second and
     * successive occurrences of a name are ignored.  The presence of
     * unrecognized warning names is <i>not</i> an error: Compilers must
     * ignore any warning names they do not recognize.  They are, however,
     * free to emit a warning if an annotation contains an unrecognized
     * warning name.
     *
     * <p> The string {@code "unchecked"} is used to suppress
     * unchecked warnings. Compiler vendors should document the
     * additional warning names they support in conjunction with this
     * annotation type. They are encouraged to cooperate to ensure
     * that the same names work across multiple compilers.
     * @return the set of warnings to be suppressed
     */
    String[] value();
}
```

