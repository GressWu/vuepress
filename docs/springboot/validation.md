---
title: SpringBoot validation参数校验
date: 2022-05-18
categories:
 - BackEnd
tags:
 - springBoot
---

## SpringBoot中使用validation

### 1. 引入依赖文件

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

spring-boot-starter-validation文件中实际上引用了以下两个依赖来完成HTTP请求后的数据校验工作。

```java
<dependency>
      <groupId>org.apache.tomcat.embed</groupId>
      <artifactId>tomcat-embed-el</artifactId>
      <version>9.0.56</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>org.hibernate.validator</groupId>
      <artifactId>hibernate-validator</artifactId>
      <version>6.2.0.Final</version>
      <scope>compile</scope>
    </dependency>
```

### 2. 调用链路

通过发送Http请求，SpringMVC首先会调用HandlerMethodArgumentResolver接口的实现类RequestResponseBodyMethodProcessor的resolveArgument()实现方法。

```java
 public Object  public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer, NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
        parameter = parameter.nestedIfOptional();
        Object arg = this.readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
        String name = Conventions.getVariableNameForParameter(parameter);
        if (binderFactory != null) {
            WebDataBinder binder = binderFactory.createBinder(webRequest, arg, name);
            if (arg != null) {
                this.validateIfApplicable(binder, parameter);
                if (binder.getBindingResult().hasErrors() && this.isBindExceptionRequired(binder, parameter)) {
                    throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
                }
            }

            if (mavContainer != null) {
                mavContainer.addAttribute(BindingResult.MODEL_KEY_PREFIX + name, binder.getBindingResult());
            }
        }

        return this.adaptArgumentIfNecessary(arg, parameter);
    }(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer, NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
        parameter = parameter.nestedIfOptional();
        Object arg = this.readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
        String name = Conventions.getVariableNameForParameter(parameter);
        if (binderFactory != null) {
            WebDataBinder binder = binderFactory.createBinder(webRequest, arg, name);
            if (arg != null) {
                this.validateIfApplicable(binder, parameter);
                if (binder.getBindingResult().hasErrors() && this.isBindExceptionRequired(binder, parameter)) {
                    throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
                }
            }

            if (mavContainer != null) {
                mavContainer.addAttribute(BindingResult.MODEL_KEY_PREFIX + name, binder.getBindingResult());
            }
        }

        return this.adaptArgumentIfNecessary(arg, parameter);
    }
```

其中`this.validateIfApplicable(binder, parameter);`会进行具体的参数校验

### 3. 具体使用方法

实体类：

```java
package com.yuwei.entity;

import javax.validation.constraints.NotEmpty;

public class Dog {
    @NotEmpty
    private String name;

    private String host;

    public Dog(String name, String host) {
        this.name = name;
        this.host = host;
    }

    public Dog() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
}

```

Controller类

```java
@RequestMapping("/clear1")
    public String test2(@Valid Dog dog)
    {
        return dog.toString();
    }
```

日志

```console
2022-04-22 16:54:12.726  WARN 7876 --- [nio-8082-exec-2] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.validation.BindException: org.springframework.validation.BeanPropertyBindingResult: 1 errors<EOL>Field error in object 'dog' on field 'name': rejected value [null]; codes [NotEmpty.dog.name,NotEmpty.name,NotEmpty.java.lang.String,NotEmpty]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [dog.name,name]; arguments []; default message [name]]; default message [不能为空]]

```

### 4. 常用注解

| 注解                      | 作用                                                         |
| ------------------------- | ------------------------------------------------------------ |
| @Null                     | 限制只能为null                                               |
| @NotNull                  | 限制必须不为null                                             |
| @AssertFalse              | 限制必须为false                                              |
| @AssertTrue               | 限制必须为true                                               |
| @DecimalMax(value)        | 限制必须为一个不大于指定值的数字                             |
| @DecimalMin(value)        | 限制必须为一个不小于指定值的数字                             |
| @Digits(integer,fraction) | 限制必须为一个小数，且整数部分的位数不能超过integer，小数部分的位数不能超过fraction |
| @Future                   | 限制必须是一个将来的日期                                     |
| @Max(value)               | 限制必须为一个不大于指定值的数字                             |
| @Min(value)               | 限制必须为一个不小于指定值的数字                             |
| @Past                     | 限制必须是一个过去的日期                                     |
| @Pattern(value)           | 限制必须符合指定的正则表达式                                 |
| @Size(max,min)            | 限制字符长度必须在min到max之间                               |
| @Size(max = 12)           | 12是字符数,不论中英文都算一个字符                            |
| @Past                     | 验证注解的元素值（日期类型）比当前时间早                     |
| @NotEmpty                 | 验证注解的元素值不为null且不为空（字符串长度不为0、集合大小不为0） |
| @NotBlank                 | 验证注解的元素值不为空（不为null、去除首位空格后长度为0），不同于@NotEmpty |
| @Email                    | 验证注解的元素值是Email，也可以通过正则表达式和flag指定自定义的email格式 |

## 普通Java类使用validation注解

### 如果不使用SpringBoot所需的依赖

```java
<dependency>
            <groupId>javax.validation</groupId>
            <artifactId>validation-api</artifactId>
            <version>1.1.0.Final</version>
        </dependency>
        <!-- hibernate validator-->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-validator</artifactId>
            <version>5.2.0.Final</version>
        </dependency>
```

由于普通Java类不走HTTP请求，因此不能使用SpringBoot提供的`this.validateIfApplicable(binder, parameter);`进行参数校验，需要我们自己去编写Bean的处理类

```java
package com.yuwei.entity;

import org.springframework.util.CollectionUtils;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.ValidationException;
import javax.validation.Validator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 对象验证器
 *
 * Created by Albert on 18/1/25.
 */
public class BeanValidator {

    /**
     * 验证某个bean的参数
     *
     * @param object 被校验的参数
     * @throws ValidationException 如果参数校验不成功则抛出此异常
     */
    public static <T> void validate(T object) {
        //获得验证器
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        //执行验证
        Set<ConstraintViolation<T>> constraintViolations = validator.validate(object);
        //如果有验证信息，则取出来包装成异常返回
        if (CollectionUtils.isEmpty(constraintViolations)) {
            return;
        }
        throw new ValidationException(convertErrorMsg(constraintViolations));
    }

    /**
     * 转换异常信息
     * @param set
     * @param <T>
     * @return
     */
    private static <T> String convertErrorMsg(Set<ConstraintViolation<T>> set) {
        Map<String, StringBuilder> errorMap = new HashMap<>();
        String property;
        for (ConstraintViolation<T> cv : set) {
            //这里循环获取错误信息，可以自定义格式
            property = cv.getPropertyPath().toString();
            if (errorMap.get(property) != null) {
                errorMap.get(property).append("," + cv.getMessage());
            } else {
                StringBuilder sb = new StringBuilder();
                sb.append(cv.getMessage());
                errorMap.put(property, sb);
            }
        }
        return errorMap.toString();
    }
}

```

	## 自定义校验注解

除了之前提供的相关注解，我们也可以进行自定义注解的开发，完成个性化的注解校验

### 1. 自定义注解

```java
package com.yuwei.annotation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy =MyValidatorHandler.class )
public @interface MyValidator {
    String message() default "wyw自定义注解";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

### 2. 注解处理类

```java
package com.yuwei.annotation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class MyValidatorHandler implements ConstraintValidator<MyValidator,Object> {


    /**
     * 注解初始化方法
     * @param constraintAnnotation
     */
    @Override
    public void initialize(MyValidator constraintAnnotation) {
        System.out.println("初始化.......");
    }

    /**
     * 具体逻辑判断方法
     * @param o
     * @param constraintValidatorContext
     * @return
     */
    @Override
    public boolean isValid(Object o, ConstraintValidatorContext constraintValidatorContext) {
        String s = o.toString();
        System.out.println(s);
        if(s.equals("柯基")){
            return true;
        }
        return false;
    }
}
```

### 3. 实体类

```java
package com.yuwei.entity;

import com.yuwei.annotation.MyValidator;


public class Dog {
    @MyValidator(message = "不是柯基")
    private String name;

    private String host;

    public Dog(String name, String host) {
        this.name = name;
        this.host = host;
    }

    public Dog() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
}

```

### 4. 测试类

```java
package com.yuwei;

import com.yuwei.controller.TestController;
import com.yuwei.entity.BeanValidator;
import com.yuwei.entity.Dog;
import com.yuwei.entity.UserBean;

public class KeyMain {
    public static void main(String[] args) {

        Dog dog = new Dog();
        dog.setName("Tom");
        BeanValidator.validate(dog);

    }
}

```

### 5.输出结果

![image-20220424104151838](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220424104151838.png)