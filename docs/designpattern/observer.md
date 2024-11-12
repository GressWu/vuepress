---
title: 观察者模式
date: 2024-09-10
categories:
- DesignPattern
tags:
- Java
---

## 什么是观察者模式

观察者模式是一种行为设计模式，其中一个对象（称为主题或可观察对象）维护一组依赖于它的对象（称为观察者），当主题的状态发生变化时，它会通知所有的观察者，使它们能够自动更新。

## 观察者模式的使用场景

1. **事件处理**：当一个事件发生时，需要通知多个对象做出相应的处理。观察者模式可以用于事件驱动的系统中，例如 GUI 应用程序中的按钮点击事件、键盘事件等。
2. **发布-订阅系统**：观察者模式常被用于实现发布-订阅系统，其中发布者（主题）负责发布消息，而订阅者（观察者）订阅感兴趣的消息。
3. **模型-视图-控制器（MVC）模式**：在 MVC 模式中，观察者模式常用于实现模型（数据）和视图（UI）之间的解耦。当模型改变时，视图可以自动更新以反映这些变化。
4. **实时数据更新**：当需要实时更新数据或状态时，观察者模式可以确保相关的对象及时获得最新的信息。
5. **电子商务系统**：在电子商务系统中，当商品价格发生变化时，可以使用观察者模式通知所有关联的用户。
6. **游戏开发**：在游戏开发中，观察者模式可以用于处理游戏中的事件、状态变化等，例如玩家状态变化、敌人行为等。
7. **股票市场**：在股票市场中，当股价变化时，可以使用观察者模式通知所有关注该股票的投资者。

## 实例

```java
package com.yuwei.observer;

/**
 * 观察者
 */
public abstract class Observer {
    protected Subject subject;
    public abstract void update();
}

```

```java
package com.yuwei.observer;

/**
 * 具体观察者
 */
public class BinaryObserver extends Observer{

    public BinaryObserver(Subject subject){
        this.subject = subject;
        this.subject.attach(this);
    }

    @Override
    public void update() {
        System.out.println("BinaryObserver"+subject.getState());
    }
}

```

```java
package com.yuwei.observer;

/**
 * 具体观察者
 */
public class OctalObserver extends Observer{

    public OctalObserver(Subject subject){
        this.subject = subject;
        this.subject.attach(this);
    }

    @Override
    public void update() {
        System.out.println("OctalObserver"+subject.getState());
    }
}

```

```java
package com.yuwei.observer;

import java.util.ArrayList;
import java.util.List;

/**
 * 被观察者
 */
public class Subject {
    private List<Observer> observers=new ArrayList<Observer>();

    private int state;

    public int getState(){
        return state;
    }

    public void setState(int state){
        this.state = state;

    }

    public void attach(Observer observer){
        observers.add(observer);
    }

    //这里用线程池异步处理可能效率更高
    public void notifyAllObservers(){
        for (Observer observer : observers) {
            observer.update();
        }
    }

}

```

```java
package com.yuwei.observer;

public class ObserverDemo {
    public static void main(String[] args) {
        Subject subject = new Subject();
        new BinaryObserver(subject);
        new OctalObserver(subject);
        subject.setState(12);
        subject.notifyAllObservers();

    }
}

```

