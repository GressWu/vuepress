---
title: SpringAop
date: 2021-10-11
categories:
 - BackEnd
tags:
 - spring
---

代理模式是SpringAOP的底层
## 1. 静态代理模式

```
package com.yuwei.service;

public interface SnakeService {
    public void add();
    public void delete();
    public void update();
    public void query();
}
```

```
package com.yuwei.service;

public class SnakeServiceImpl implements SnakeService{
    @Override
    public void add() {
        System.out.println("增加小吃");
    }

    @Override
    public void delete() {
        System.out.println("删除小吃");
    }

    @Override
    public void update() {
        System.out.println("更新小吃");
    }

    @Override
    public void query() {
        System.out.println("查询小吃");
    }
}
```

```
package com.yuwei.service;

public class SnakeProxy implements SnakeService{

    SnakeService snakeService;
    public void setSnakeService(SnakeService snakeService){
        this.snakeService = snakeService;
    }

    @Override
    public void add() {
        snakeService.add();
    }

    @Override
    public void delete() {
        snakeService.delete();
    }

    @Override
    public void update() {
        snakeService.update();
    }

    @Override
    public void query() {
        snakeService.query();
    }

    public void check(){
        System.out.println("已做检查");
    }
}
```

```
import com.yuwei.service.SnakeProxy;
import com.yuwei.service.SnakeServiceImpl;

public class StaticProxyTest {
    public static void main(String[] args) {
        SnakeProxy snakeProxy = new SnakeProxy();
        snakeProxy.setSnakeService(new SnakeServiceImpl());
        snakeProxy.add();
        snakeProxy.check();
    }
}
```

很显然SnakeProxy做了SnakeService的代理，在不改变SnakeServiceImpl的实现的情况下，又增加了check()方法。

**代理模式好处：**

1. 可以使真实角色的操作更加纯粹！不用关注公共业务
2. 公共交给代理！实现业务分功
3. 方便之后方法扩展

## 2. 动态代理

```java
package com.yuwei.rent;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

//自动生成代理类
public class ProxyInvocationHandler implements InvocationHandler {

    //被代理的接口
    private Object object;

    public void setObject(Object object) {
        this.object = object;
    }

    //生成得到代理类
    public Object getProxy(){
        //第二个参数传的是对象的接口 动态代理的一定是一个继承了接口的类
       return Proxy.newProxyInstance(this.getClass().getClassLoader(), object.getClass().getInterfaces(),this);
    }

    //处理代理实例，并返回结果
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //动态代理类调用方法会执行以下内容
        log(method.getName());
        Object result = method.invoke(object, args);
        return result;
    }

    public void log(String msg){
        System.out.println("执行了："+msg+"方法");
    }
}
```

```
package com.yuwei.rent;

import com.yuwei.service.SnakeService;
import com.yuwei.service.SnakeServiceImpl;

public class DamicProxyTest {
    public static void main(String[] args) {
        //真实角色
        SnakeServiceImpl snakeService = new SnakeServiceImpl();
        //代理角色不存在
        ProxyInvocationHandler proxyInvocationHandler = new ProxyInvocationHandler();
        //设置要代理的对象
        proxyInvocationHandler.setObject(snakeService);
        //动态生成代理类
        SnakeService proxy = (SnakeService)proxyInvocationHandler.getProxy();
        proxy.query();
    }
}
```

输出:

```
执行了：query方法
查询小吃

```

Proxy：代理 		InvocationHandler：调用处理程序

**动态代理好处：**

1. 静态代理好处都有
2. 一个动态代理类代理的是一个接口，一个接口对应一类业务。
3. 一个动态代理类可以代理多个实现了

## 3. AOP

1. **什么是Aop**:在软件业，AOP为Aspect Oriented Programming的缩写，意为：[面向切面编程](https://baike.baidu.com/item/面向切面编程/6016335)，通过[预编译](https://baike.baidu.com/item/预编译/3191547)方式和运行期间**动态代理**实现程序功能的统一维护的一种技术。AOP是[OOP](https://baike.baidu.com/item/OOP)的延续，是软件开发中的一个热点，也是[Spring](https://baike.baidu.com/item/Spring)框架中的一个重要内容，是[函数式编程](https://baike.baidu.com/item/函数式编程/4035031)的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的[耦合度](https://baike.baidu.com/item/耦合度/2603938)降低，提高程序的可重用性，同时提高了开发的效率。

2. **Aop相关概念：**
   * 横切关注点：跨越应用多个模块方法或者功能。与我们的业务逻辑无关，但是同时又是我们需要关注的部分就是横切关注点。比如日志、安全、缓存、事务。。。
   * 切面(ASPECT)：横切关注点被模块化的特殊对象，他是一个类
   * 通知(Advice)：切面要完成的工作。他是切面类中的一个方法
   * 代理(Proxy)：向目标对象应用通知后创建的对象
   * 切入点(PointCut)：切面通知执行的具体地点，即在哪里执行通知
   * 连接点(JointPoint): 与切入点匹配的执行点、

### 3.1 方法一：Spring API实现

**配置文件：**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

        <!--注册Bean-->
        <bean id="userService" class="com.yuwei.UserServiceImpl"></bean>
        <bean id ="beforeLog" class="com.yuwei.log.BeforeLog"></bean>
        <bean id="afterLog" class="com.yuwei.log.AfterLog"></bean>

        <!--配置aop-->
        <aop:config>
            <!--切入点  expression表达式execution（要执行的位置） 修饰词 返回值 类名 方法名 参数-->
            <aop:pointcut id="pointcut" expression="execution(* com.yuwei.UserServiceImpl.*(..) )"></aop:pointcut>


            <!--执行环绕-->
            <!--afterLog 切入到pointCut中-->
            <aop:advisor advice-ref="afterLog" pointcut-ref="pointcut"></aop:advisor>
            <aop:advisor advice-ref="beforeLog" pointcut-ref="pointcut"></aop:advisor>
        </aop:config>
</beans>
```

* com.yuwei.UserServiceImpl.*(..) 

  这里代表的含义是  任意返回值 UserServiceImpl下的任意方法 所需任意的参数



**切面方法：**

```java
package com.yuwei.log;

import org.springframework.aop.MethodBeforeAdvice;

import java.lang.reflect.Method;

public class BeforeLog implements MethodBeforeAdvice {


    //method 要执行的目标方法
    //args 参数
    //target 目标对象
    @Override
    public void before(Method method, Object[] args, Object target) throws Throwable {
        System.out.println(target.getClass().getName()+"的"+method.getName()+"被执行了");
    }
}
```

```java
package com.yuwei.log;

import org.springframework.aop.AfterReturningAdvice;

import java.lang.reflect.Method;

public class AfterLog implements AfterReturningAdvice {

    //returnvalue 返回值
    @Override
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System.out.println("执行了"+method.getName()+"返回结果为"+returnValue);
    }
}
```

**业务类：**

```
package com.yuwei;

public interface UserService {
    public void query();
    public void delete();
    public void add();
    public void update();
}
```

```
package com.yuwei;

public class UserServiceImpl implements UserService{
    @Override
    public void query() {
        System.out.println("用户查询");
    }

    @Override
    public void delete() {
        System.out.println("用户删除");
    }

    @Override
    public void add() {
        System.out.println("用户增加");
    }

    @Override
    public void update() {
        System.out.println("用户更新");
    }
}
```

**测试类：**

```java
package com.yuwei;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
    public static void main(String[] args) {
        ApplicationContext classPathXmlApplicationContext = new ClassPathXmlApplicationContext("beans.xml");
        //后面的参数必须传接口的Class  这里和动态代理获取代理类 需要接口.class是一致的
        UserService userService = classPathXmlApplicationContext.getBean("userService", UserService.class);
        userService.add();
    }
}
```

输出：

```
com.yuwei.UserServiceImpl的add被执行了
用户增加
执行了add返回结果为null
```

### 3.2 方法二：自定义实现AOP

**切面类：**

```java
package com.yuwei.div;

public class DivpointCut {
    public void before(){
        System.out.println("方法执行前");
    }

    public void after(){
        System.out.println("方法执行后");
    }
}
```

**配置文件：**

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

        <!--注册Bean-->
        <bean id="userService" class="com.yuwei.UserServiceImpl"></bean>
        <bean id ="beforeLog" class="com.yuwei.log.BeforeLog"></bean>
        <bean id="afterLog" class="com.yuwei.log.AfterLog"></bean>

    <!--方式二 自定义-->
    <bean id="diy" class="com.yuwei.div.DivpointCut"></bean>

    <aop:config>
        <!--自定义切面-->
        <aop:aspect ref="diy">
            <!--切入点-->
            <aop:pointcut id="point" expression="execution(* com.yuwei.UserServiceImpl.*(..))"/>
            <!--通知-->
            <aop:before method="before" pointcut-ref="point"></aop:before>
            <aop:after method="after" pointcut-ref="point"></aop:after>
        </aop:aspect>
    </aop:config>
</beans>
```

### 3.3 方法三：使用注解实现

**切面类：**

```java
package com.yuwei.div;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

//标注该类为切面
@Aspect
public class AnnotationPointCut {

    @Before("execution(* com.yuwei.UserServiceImpl.*(..))")
    public void before(){
        System.out.println("=====方法执行前======");
    }

    @After("execution(* com.yuwei.UserServiceImpl.*(..))")
    public void after(){
        System.out.println("=====方法执行前======");
    }

    //在环绕增强中 我们可以给定一个参数 代表我们要获取处理切入点
    @Around("execution(* com.yuwei.UserServiceImpl.*(..))")
    public void around(ProceedingJoinPoint pj) throws Throwable {
        System.out.println(pj);
        pj.proceed();
        System.out.println("=====环绕======");
    }
}

```

**配置类：**

```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

        <!--注册Bean-->
        <bean id="userService" class="com.yuwei.UserServiceImpl"></bean>
        <bean id ="beforeLog" class="com.yuwei.log.BeforeLog"></bean>
        <bean id="afterLog" class="com.yuwei.log.AfterLog"></bean>

    <!--方式三 自定义-->
    <bean id ="annotationPointCut" class="com.yuwei.div.AnnotationPointCut"></bean>
    <!--注解支持-->
    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
</beans>
```

## 4. 切点表达式

### 4.1 execution

​    由于Spring切面粒度最小是达到方法级别，而execution表达式可以用于明确指定方法返回类型，类名，方法名和参数名等与方法相关的部件，并且在Spring中，大部分需要使用AOP的业务场景也只需要达到方法级别即可，因而execution表达式的使用是最为广泛的。如下是execution表达式的语法：

```java
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)
```

​    这里问号表示当前项可以有也可以没有，其中各项的语义如下：

- modifiers-pattern：方法的可见性，如public，protected；
- ret-type-pattern：方法的返回值类型，如int，void等；
- declaring-type-pattern：方法所在类的全路径名，如com.spring.Aspect；
- name-pattern：方法名类型，如buisinessService()；
- param-pattern：方法的参数类型，如java.lang.String；
- throws-pattern：方法抛出的异常类型，如java.lang.Exception；

​    如下是一个使用execution表达式的例子：

```java
execution(public * com.spring.service.BusinessObject.businessService(java.lang.String,..))
```

​    上述切点表达式将会匹配使用public修饰，返回值为任意类型，并且是com.spring.BusinessObject类中名称为businessService的方法，方法可以有多个参数，但是第一个参数必须是java.lang.String类型的方法。上述示例中我们使用了..通配符，关于通配符的类型，主要有两种：

- *通配符，该通配符主要用于匹配单个单词，或者是以某个词为前缀或后缀的单词。

​    如下示例表示返回值为任意类型，在com.spring.service.BusinessObject类中，并且参数个数为零的方法：

```java
execution(* com.spring.service.BusinessObject.*())
```

​    下述示例表示返回值为任意类型，在com.spring.service包中，以Business为前缀的类，并且是类中参数个数为零方法：

```java
execution(* com.spring.service.Business*.*())
```

- ..通配符，该通配符表示0个或多个项，主要用于declaring-type-pattern和param-pattern中，如果用于declaring-type-pattern中，则表示匹配当前包及其子包，如果用于param-pattern中，则表示匹配0个或多个参数。

​    如下示例表示匹配返回值为任意类型，并且是com.spring.service包及其子包下的任意类的名称为businessService的方法，而且该方法不能有任何参数：

```java
execution(* com.spring.service..*.businessService())
```

​    这里需要说明的是，包路径service..*.businessService()中的..应该理解为延续前面的service路径，表示到service路径为止，或者继续延续service路径，从而包括其子包路径；后面的*.businessService()，这里的*表示匹配一个单词，因为是在方法名前，因而表示匹配任意的类。

​    如下示例是使用..表示任意个数的参数的示例，需要注意，表示参数的时候可以在括号中事先指定某些类型的参数，而其余的参数则由..进行匹配：

```java
execution(* com.spring.service.BusinessObject.businessService(java.lang.String,..))
```