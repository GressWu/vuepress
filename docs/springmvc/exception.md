---
title: SpringMVC异常处理
date: 2022-04-06
categories:
 - BackEnd
tags:
 - SpringMVC
---


## 底层涉及到的类

SpringMVC中`SimpleMappingExceptionResolver`与`DefaultHandlerExceptionResolver`类实现了`HandlerExceptionResolver`接口，其中`DefaultHandlerExceptionResolver`类是默认的处理类可以处理一些基础的异常错误，`DefaultHandlerExceptionResolver`类是一个可以给我们进行异常扩展的类。

### SimpleMappingExceptionResolver

```java
@Nullable
    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex) {
        try {
            if (ex instanceof HttpRequestMethodNotSupportedException) {
                return this.handleHttpRequestMethodNotSupported((HttpRequestMethodNotSupportedException)ex, request, response, handler);
            }

            if (ex instanceof HttpMediaTypeNotSupportedException) {
                return this.handleHttpMediaTypeNotSupported((HttpMediaTypeNotSupportedException)ex, request, response, handler);
            }

            if (ex instanceof HttpMediaTypeNotAcceptableException) {
                return this.handleHttpMediaTypeNotAcceptable((HttpMediaTypeNotAcceptableException)ex, request, response, handler);
            }

            if (ex instanceof MissingPathVariableException) {
                return this.handleMissingPathVariable((MissingPathVariableException)ex, request, response, handler);
            }

            if (ex instanceof MissingServletRequestParameterException) {
                return this.handleMissingServletRequestParameter((MissingServletRequestParameterException)ex, request, response, handler);
            }

            if (ex instanceof ServletRequestBindingException) {
                return this.handleServletRequestBindingException((ServletRequestBindingException)ex, request, response, handler);
            }

            if (ex instanceof ConversionNotSupportedException) {
                return this.handleConversionNotSupported((ConversionNotSupportedException)ex, request, response, handler);
            }

            if (ex instanceof TypeMismatchException) {
                return this.handleTypeMismatch((TypeMismatchException)ex, request, response, handler);
            }

            if (ex instanceof HttpMessageNotReadableException) {
                return this.handleHttpMessageNotReadable((HttpMessageNotReadableException)ex, request, response, handler);
            }

            if (ex instanceof HttpMessageNotWritableException) {
                return this.handleHttpMessageNotWritable((HttpMessageNotWritableException)ex, request, response, handler);
            }

            if (ex instanceof MethodArgumentNotValidException) {
                return this.handleMethodArgumentNotValidException((MethodArgumentNotValidException)ex, request, response, handler);
            }

            if (ex instanceof MissingServletRequestPartException) {
                return this.handleMissingServletRequestPartException((MissingServletRequestPartException)ex, request, response, handler);
            }

            if (ex instanceof BindException) {
                return this.handleBindException((BindException)ex, request, response, handler);
            }

            if (ex instanceof NoHandlerFoundException) {
                return this.handleNoHandlerFoundException((NoHandlerFoundException)ex, request, response, handler);
            }

            if (ex instanceof AsyncRequestTimeoutException) {
                return this.handleAsyncRequestTimeoutException((AsyncRequestTimeoutException)ex, request, response, handler);
            }
        } catch (Exception var6) {
            if (this.logger.isWarnEnabled()) {
                this.logger.warn("Failure while trying to resolve exception [" + ex.getClass().getName() + "]", var6);
            }
        }

        return null;
    }
```

## 实现自定义处理异常

### XML配置

```xml
    <bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
        <property name="exceptionMappings">
<!--            prop键表示可能出现的异常，value表示如果出现异常跳转的视图名称，比如下面当遇到算术异常则跳转到error.html页面-->
            <props>
                <prop key="java.lang.ArithmeticException">error</prop>
            </props>
        </property>

<!--        将会把异常ex传给接受域-->
        <property name="exceptionAttribute" value="ex"></property>
    </bean>
```

### 注解配置

```java
package com.yuwei.mvc.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionController {

    //@ExceptionHandler注解里放可能出现的异常类型
    @ExceptionHandler(ArithmeticException.class)
    public String handleArithmeticException(Exception ex, Model model){
        model.addAttribute("ex",ex);
        return "error";
    }
}

```

以上两种方式均可以有效进行自定义异常处理

