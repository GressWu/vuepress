---
title: 策略模式
date: 2024-08-10
categories:
- DesignPattern
tags:
- Java
---

## 策略模式的使用场景

策略模式是一种行为型设计模式，它用于在运行时根据不同的情况选择不同的算法或策略。该模式将算法封装成独立的策略类，使得它们可以互相替换，而不会影响到客户端的代码。

策略模式适用于以下场景：

1. 当一个系统中有**多个类似的算法**，但每个算法在实现上有所不同，并且需要在运行时动态选择其中一个算法时，可以使用策略模式。这样可以避免使用大量的条件语句来判断不同的情况。
2. 当需要在**不同的时间或条件下使用不同的算法时**，可以使用策略模式来实现算法的灵活切换。例如，在一个电商网站中，根据不同的促销活动，可以选择不同的折扣策略来计算商品的价格。
3. 当一个类中有**多个相关的行为**，但是不希望将这些行为都放在一个类中实现时，可以使用策略模式。通过将每个行为封装成一个独立的策略类，可以使代码更加清晰、可维护和可扩展。

## 具体实现

```java
package com.yuwei.strategy;

public interface Strategy {

    boolean preCheck(StrategyObject strategyObject);

    void handleSomething(StrategyObject strategyObject);

    void afterHandle(StrategyObject strategyObject);
}

```

```java
package com.yuwei.strategy;

public class MonStrategy implements Strategy{

    @Override
    public boolean preCheck(StrategyObject strategyObject) {
        return false;
    }

    @Override
    public void handleSomething(StrategyObject strategyObject) {
        System.out.println("正在处理"+strategyObject.getName());
    }

    @Override
    public void afterHandle(StrategyObject strategyObject) {

    }
}

```

```java
package com.yuwei.strategy;

public class ThuStrategy implements Strategy{
    @Override
    public boolean preCheck(StrategyObject strategyObject) {
        return false;
    }

    @Override
    public void handleSomething(StrategyObject strategyObject) {
        System.out.println("正在处理"+strategyObject.getName());
    }

    @Override
    public void afterHandle(StrategyObject strategyObject) {

    }
}

```

```java
package com.yuwei.strategy;

public class ThrStrategy implements Strategy{
    @Override
    public boolean preCheck(StrategyObject strategyObject) {
        return false;
    }

    @Override
    public void handleSomething(StrategyObject strategyObject) {
        System.out.println("正在处理"+strategyObject.getName());
    }

    @Override
    public void afterHandle(StrategyObject strategyObject) {

    }
}

```

```java
package com.yuwei.strategy;

public class StrategyObject {

    private String name;

    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

```

```java
package com.yuwei.strategy;

public class Context {
    private Strategy strategy;

    public Context(Strategy strategy){
        this.strategy = strategy;
    }

    public void executeStrategy(StrategyObject strategyObject){
        strategy.preCheck(strategyObject);
        strategy.handleSomething(strategyObject);
        strategy.afterHandle(strategyObject);
    }
}

```

```java
package com.yuwei.strategy;

public class StrategyTest {
    public static void main(String[] args) {
        MonStrategy monStrategy = new MonStrategy();
        StrategyObject strategyObject = new StrategyObject();
        strategyObject.setName("周一");
        Context context = new Context(monStrategy);
        context.executeStrategy(strategyObject);
    }
}

```

