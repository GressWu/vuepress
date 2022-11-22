---
title: 策略模式的使用
date: 2022-11-22
categories:
- BackEnd
tags:
- Java
---

## 业务背景
假设想根据不同的参数实现不同的业务逻辑，一开始我们可以使用if...else or else if进行判断，但是当业务不断膨胀。if...else 会越来越多，文件变大，可读性变低，代码丑陋。策略模式的出现可以消灭这种情况，并且做到业务上的解耦。

## 使用

### 实体类

```java
package com.example.springbootact.Dao;

import lombok.Data;

@Data
public class Animal {
    private String name;

    private String address;
}
```

### 枚举类

```java
package com.example.springbootact.Dto;

public enum AnimalEnum {

    Cat("1","猫"),
    Dog("2","狗"),
    Monkey("3","猴子");

    public final String id;
    public final String name;

    private AnimalEnum(String id,String name){
        this.id=id;
        this.name= name;
    }

    /**
     * 判断当前输入的参数值是否是枚举的一个值
     * @param id
     * @return
     */
    public static boolean isExist(String id) {          //判断是否
        return Cat.id.equals(id)
                || Dog.id.equals(id)
                || Monkey.id.equals(id);
    }


}
```

### 请求体

```java
package com.example.springbootact.Dto;

import lombok.Data;

@Data
public class GetAnimalRequest {

    String type;
}
```

### 接口

```java
package com.example.springbootact;

import com.example.springbootact.Dto.GetAnimalRequest;

public interface LogicService {


    Boolean findService(GetAnimalRequest getAnimalRequest);

    int getTheFee(GetAnimalRequest getAnimalRequest);
}

```

### 接口实现类1

```java
package com.example.springbootact.Service;

import com.example.springbootact.Dto.AnimalEnum;
import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicService;
import org.springframework.stereotype.Service;

@Service
public class GetTheCatService implements LogicService {

    @Override
    public Boolean findService(GetAnimalRequest getAnimalRequest ) {
        boolean flag = false;
        if(AnimalEnum.Cat.id.equals(getAnimalRequest.getType())){
            flag = true;
        }
        return flag;
    }

    @Override
    public int getTheFee(GetAnimalRequest getAnimalRequest ) {
        return 200;
    }
}
```

### 接口实现类2

```java
package com.example.springbootact.Service;

import com.example.springbootact.Dto.AnimalEnum;
import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicService;
import org.springframework.stereotype.Service;

@Service
public class GetTheDogService implements LogicService {

    @Override
    public Boolean findService(GetAnimalRequest getAnimalRequest ) {
        boolean flag = false;
        if(AnimalEnum.Dog.id.equals(getAnimalRequest.getType())){
            flag = true;
        }
        return flag;
    }

    @Override
    public int getTheFee(GetAnimalRequest getAnimalRequest ) {
        return 100;
    }
}
```

### 接口实现类3

```java
package com.example.springbootact.Service;

import com.example.springbootact.Dto.AnimalEnum;
import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicService;
import org.springframework.stereotype.Service;

@Service
public class GetTheMonkeyService implements LogicService {

    @Override
    public Boolean findService(GetAnimalRequest getAnimalRequest ) {
        boolean flag = false;

        if(AnimalEnum.Monkey.id.equals(getAnimalRequest.getType())){
            flag = true;
        }
        return flag;
    }

    @Override
    public int getTheFee(GetAnimalRequest getAnimalRequest ) {
        return 400;
    }
}
```

### 调用接口

```java
package com.example.springbootact.Controller;

import com.example.springbootact.Dto.GetAnimalRequest;
import com.example.springbootact.LogicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GetTheAnimalController {
	//注入所有的LogicService接口的实现类到list中
    @Autowired
    private List<LogicService> logicServiceLists;

    @PostMapping("/getthedogname")
    public String getTheDogName(@RequestBody GetAnimalRequest getAnimalRequest){
        //logicService.
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

