---
title: 从idea提示再看DI的三种注入方式
date: 2022-12-11
categories:
- BackEnd
tags:
- spring
---

## IOC容器

我们知道IOC是Spring框架的两大特性之一。他的出现主要体现了控制反转的思想。例如我们创建的一个A对象，它本身依赖了B对象，那么我们就需要先new一个B对象，然后在手动将B对象注入到A对象中。

```java
@Data
public class A {
	private B b;
	
	public void getB(){
		b...
	}

}
```

```java
public class Test{
	public static void main(String[] args){
		A a = new A();
		B b = new B();
		a.setB(b);
		a.getB();
	}
}
```

IOC的出现，就不再需要我们自己去管理对象依赖的对象，交给Spring的IOC容器即可，他会自己给我们装配好。简化了写法的同时，也降低了系统的耦合性。

## DI的三种方式

IOC是一种思想，（DI）依赖注入还需要依赖三种众所周知的方式进行注入。

* Filed域注入

```java
 @Autowired
 private List<LogicService> logicServiceLists;
```

* set注入

```java
@Autowired
 public void setLogicServiceLists(List<LogicService> logicServiceLists) {
     this.logicServiceLists = logicServiceLists;
  }
```

* 构造器注入

  ```java
      @Autowired
      public GetTheAnimalController(List<LogicService> logicServiceLists){
          this.logicServiceLists = logicServiceLists;
      }
  ```

## idea提示

![image-20221211103140396](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20221211103140396.png)

当我们使用Field注入时，给了我们一个提示不建议使用Field注入,Field注入缺点如下

- 不能像构造器那样注入**不可变的对象**
- 依赖对外部不可见，外界可以看到构造器和setter，但无法看到私有字段，自然无法了解所需依赖
- 会导致组件与**IoC容器紧耦合**（这是最重要的原因，离开了IoC容器去使用组件，在注入依赖时就会十分困难）
- 导致单元测试也必须使用IoC容器，原因同上
- 依赖过多时不够明显，比如我需要10个依赖，用构造器注入就会显得庞大，这时候应该考虑一下此组件是不是违反了单一职责原则

```java
public class TeUser {

    public static void main(String[] args) {
        GetTheAnimalController getTheAnimalController = new GetTheAnimalController();

        GetAnimalRequest getAnimalRequest = new GetAnimalRequest();
        getAnimalRequest.setType("4");
        System.out.println(getTheAnimalController.getTheAnimalFee(getAnimalRequest));
    }
}
```

假如我们使用Field Injection ，我们用main方法进行单元测试的时候，调用`getTheAnimalFee`方法，就会报空指针异常，因为main方法调用的类不再被IOC容器进行管理，所以无法注入。

但是如果我们使用构造器注入或者是set注入时，就不会再有这种困扰，我们可以抛开IOC容器，自己注入进行测试。

```java
public class TeUser {

    public static void main(String[] args) {
        GetTheAnimalController getTheAnimalController = new GetTheAnimalController();
        List<LogicService> logicServiceLists = new ArrayList<>();
        GetTheMonkeyService getTheMonkeyService = new GetTheMonkeyService();
        logicServiceLists.add(getTheMonkeyService);
        getTheAnimalController.setLogicServiceLists(logicServiceLists);

        GetAnimalRequest getAnimalRequest = new GetAnimalRequest();
        getAnimalRequest.setType("4");
        System.out.println(getTheAnimalController.getTheAnimalFee(getAnimalRequest));
    }
}
```

## 推荐写法

```java
package com.example.springbootact.Controller;

import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicObject;
import com.example.springbootact.LogicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetTheAnimalController {


  
    private List<LogicService> logicServiceLists;

 
    private List<LogicObject> logicObjects;



    @Autowired
    public void setLogicServiceLists(List<LogicService> logicServiceLists) {
        this.logicServiceLists = logicServiceLists;
    }

    @Autowired
    public void setLogicObjects(List<LogicObject> logicObjects) {
        this.logicObjects = logicObjects;
    }

    @PostMapping("/getthedogname")
    public String getTheAnimalFee(@RequestBody GetAnimalRequest getAnimalRequest){

        System.out.println(logicServiceLists);
        System.out.println(logicObjects);
        int theFee = 0;
        LogicService logicService = logicServiceLists
                .stream()
                .filter(p -> p.findService(getAnimalRequest))
                .findFirst().orElse(null);


        if(!ObjectUtils.isEmpty(logicService)){
            theFee = logicService.getTheFee(getAnimalRequest);
        }

        return theFee+"";
    }
}

```
## 三种注入方式的使用场景
构造器注入：强依赖性（即必须使用此依赖），不变性（各依赖不会经常变动）

Setter注入：可选（没有此依赖也可以工作），可变（依赖会经常变动）

Field注入：大多数情况下尽量少使用字段注入，一定要使用的话， @Resource相对@Autowired对IoC容器的耦合更低

