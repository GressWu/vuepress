---
title: SpringBoot统一返回体与统一请求体
date: 2021-01-28
categories:
 - backEnd
tags:
 - Java
---

## Stream流的生命周期

创建流 ----> 流的中间过程（零个或多个）------->流的终端操作（有且只能有一个）

## Stream流使用举例

代码：

```java
package Lamada;


import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamTest {
    public static void main(String[] args) {
        //创建List
        List<Person> Persons = Stream.of(new Person("zhangsan", 12, 23, 1000),
                new Person("lilei", 11, 23, 1000),
                new Person("lili", 2, 23, 1000)).
                collect(Collectors.toList());
        System.out.println("创建List:"+Persons);
        
        //升序排列
        Persons.sort((a,b)->a.age-b.age);
        System.out.println(Persons);
        //降序排列
        Persons.sort((a,b)->b.age-a.age);
        System.out.println(Persons);

        //创建List1
        List<Person> Persons1 = Stream.of(new Person("zhangsan", 12, 23, 1000),
                new Person("xiaozhang", 11, 23, 1000),
                new Person("xiaohong", 2, 23, 1000)).
                collect(Collectors.toList());
        System.out.println("创建List1:"+Persons1);

        //filter过滤器
        //找到年龄大于10岁的对象
        List<Person> collect = Persons.stream().
                filter(person -> person.age > 10).
                collect(Collectors.toList());
        System.out.println("年龄大于10的对象:"+collect);

        //map 惰性求值
        //求大于10岁同学的姓名
        List<String> personName = Persons.stream().
                filter(person -> person.age > 10).
                map(person -> person.getName()).
                collect(Collectors.toList());
        System.out.println("姓名:"+personName);

        //flatMap合并List
        List<Person> collect1 = Stream.of(Persons,Persons1).
                flatMap(people -> people.stream()).
                collect(Collectors.toList());
        System.out.println("合并后:"+collect1);


        //求最大值，最小值
        Optional<Person> max = Persons.stream().max(Comparator.comparing(person -> person.age));
        Optional<Person> min = Persons.stream().min(Comparator.comparing(person -> person.age));

        //判断有无最大值
        if(max.isPresent()){
            //获得最大值对象
            Person person = max.get();
            System.out.println("最大值对象："+person);
        }

        if(min.isPresent()){
            //获得最小值对象
            Person person = min.get();
            System.out.println("最小值对象："+person);
        }


        //count计数
        //年龄大于10岁的个数
        long count = Persons.stream().filter(person -> person.age > 10).count();
        System.out.println("年龄大于10的个数："+count);



    }
}

```

结果：

```
创建List:[Person{name='zhangsan', age=12, size=23, salary=1000}, Person{name='lilei', age=11, size=23, salary=1000}, Person{name='lili', age=2, size=23, salary=1000}]
创建List1:[Person{name='zhangsan', age=12, size=23, salary=1000}, Person{name='xiaozhang', age=11, size=23, salary=1000}, Person{name='xiaohong', age=2, size=23, salary=1000}]
年龄大于10的对象:[Person{name='zhangsan', age=12, size=23, salary=1000}, Person{name='lilei', age=11, size=23, salary=1000}]
姓名:[zhangsan, lilei]
合并后:[Person{name='zhangsan', age=12, size=23, salary=1000}, Person{name='lilei', age=11, size=23, salary=1000}, Person{name='lili', age=2, size=23, salary=1000}, Person{name='zhangsan', age=12, size=23, salary=1000}, Person{name='xiaozhang', age=11, size=23, salary=1000}, Person{name='xiaohong', age=2, size=23, salary=1000}]
最大值对象：Person{name='zhangsan', age=12, size=23, salary=1000}
最小值对象：Person{name='lili', age=2, size=23, salary=1000}
年龄大于10的个数：2
```

### java array stream

```java
import java.util.Arrays;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ArraysStream {
    public static void main(String[] args) {
        int[] ints={1,1,2,2,3,4,5,33,6};
        System.out.println(Arrays.toString(ints));

        //数组升序排序
        int[] ints1 = Arrays.stream(ints).sorted().toArray();
        System.out.println(Arrays.toString(ints1));


        //数组去重
        int[] ints2 = Arrays.stream(ints).distinct().toArray();
        System.out.println(Arrays.toString(ints2));

        //跳过n个数字
        int[] ints3 = Arrays.stream(ints).skip(1).toArray();
        System.out.println(Arrays.toString(ints3));

        //求和
        int sum = Arrays.stream(ints).sum();
        System.out.println(sum);

        //判断是否所有元素的值都大于5
        boolean result = Arrays.stream(ints).allMatch(p -> p >5 );
        System.out.println(result);

        //判断是否有值大于5
        boolean result2 = Arrays.stream(ints).anyMatch(p -> p > 5);
        System.out.println(result2);

        //取得平均值
        double v = Arrays.stream(ints).average().getAsDouble();
        //如果没有平均值则返回0.00
        double v1 = Arrays.stream(ints).average().orElse(0.00);
        System.out.println(v);

        //转换成Double的数据流
        Arrays.stream(ints).asDoubleStream();
        //转换成Long的数据流
        Arrays.stream(ints).asLongStream();

        //将数组转换为Integer List的包装类
        List<Integer> collect = Arrays.stream(ints).boxed().collect(Collectors.toList());
        System.out.println(collect);

        //求当前数组元素个数
        long count = Arrays.stream(ints).count();
        System.out.println(count);

        //过滤找出所有大于5的值
        int[] ints4 = Arrays.stream(ints).filter(p -> p > 5).toArray();
        System.out.println(Arrays.toString(ints4));

        //找出大于2 第一个元素
        int asInt = Arrays.stream(ints).filter(p -> p > 2).findFirst().getAsInt();
        System.out.println(asInt);
        //findAny和findFirst区别：findAny比findFirst效率高，findAny串行流的情况下一般会返回流中匹配的第一个元素，如果是并行流，那就不能确保是第一个
        int anyInt = Arrays.stream(ints).filter(p -> p > 2).findFirst().getAsInt();
        System.out.println(anyInt);

        //展示前五个元素
        int[] ints5 = Arrays.stream(ints).limit(5).toArray();
        System.out.println(Arrays.toString(ints5));

        //找到最大值
        int i = Arrays.stream(ints).max().orElse(0);
        System.out.println(i);
        //找到最小值
        int i1 = Arrays.stream(ints).min().orElse(0);
        System.out.println(i1);

        //Arrays.stream(ints).peek()
       // Arrays.stream(ints).map()
        //map改变映射操作
        int[] ints6 = Arrays.stream(ints).map(p -> p = p + 4).toArray();
        System.out.println(Arrays.toString(ints6));

        //数组类型改变
        double[] doubles = Arrays.stream(ints).mapToDouble(p -> p).toArray();
        System.out.println(Arrays.toString(doubles));
        //转换成object类型数组
        Object[] objects = Arrays.stream(ints).mapToObj(p -> String.valueOf(p)).toArray();
        System.out.println(Arrays.toString(objects));

        //reduce 进行两个数的累加或者累乘累减怎么样
        int asInt1 = Arrays.stream(ints).reduce((a, b) -> a + b).getAsInt();
        System.out.println(asInt1);

        //第一个累计的数字变为自定义的10
        int reduce = Arrays.stream(ints).reduce(10, (a, b) -> a + b);

        //一个方法点一点全能用
        IntSummaryStatistics intSummaryStatistics = Arrays.stream(ints).summaryStatistics();
        double average = intSummaryStatistics.getAverage();
        long count1 = intSummaryStatistics.getCount();
        long sum1 = intSummaryStatistics.getSum();
        int max = intSummaryStatistics.getMax();
        intSummaryStatistics.getMin();

        //遍历元素
        Arrays.stream(ints).forEach(System.out::println);

        //并行流
        Arrays.stream(ints).parallel();

    }
}
```

### java list stream

```java
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

public class StreamTest {
    public static void main(String[] args) {
        int[] a = {1, 2, 2, 2, 3, 4, 5};
        List<Integer> integers = Arrays.asList(1, 1, 2, 3, 4, 5);

        List<Car> cars = new ArrayList<>();
        Car car1 = new Car("BMW", "ae86", 12.0);
        Car car2 = new Car("BMW", "ae87", 112.0);
        Car car3 = new Car("BMW", "ae87", 122.0);
        Car car6 = new Car("BMW", "ae87", 124.0);
        Car car4 = new Car("bence", "ae89", 132.0);
        Car car5 = new Car("bence", "ae100", 142.0);
        cars.add(car1);
        cars.add(car2);
        cars.add(car3);
        cars.add(car4);
        cars.add(car5);
        cars.add(car6);

        //筛选价格小于130的汽车
        List<Car> collect = cars.stream().filter(car -> car.getPrice() < 130.0).collect(Collectors.toList());
        System.out.println(collect);
        //抽象出Car名字的集合
        List<String> collect1 = cars.stream().map(Car::getName).collect(Collectors.toList());
        System.out.println(collect1);
        //计算汽车的总价格
        double sum = cars.stream().flatMapToDouble(p -> DoubleStream.of(p.getPrice())).sum();
        System.out.println(sum);

        //根据品牌分类
        Map<String, List<Car>> collect2 = cars.stream().collect(Collectors.groupingBy(p -> p.getType()));
        for (String key : collect2.keySet()) {
            System.out.println(key + " ：" + collect2.get(key));
        }


    }
}
```



## Lambda表达式

**函数式接口：**

任何接口，如果只包含**唯一**一个抽象方法，那么它就是一个函数式接口;

对于函数式接口，我们可以通过lambda表达式来创建该接口的对象；

接口：

```java
package Test;

public interface Lambda {
    void test(int a,int b);
}

```

实现类对象：

```java
package Test;

public class LambdaImpl implements Lambda{
    @Override
    public void test(int a, int b) {
        System.out.println(a+b);
    }
}
```

主程序：

```java
package Test;

public class MainTest {
    public static void main(String[] args) {
        //一步步实现简化
        //实现类
        LambdaImpl lambda = new LambdaImpl();
        lambda.test(10,23);
        //匿名内部类
        Lambda lambda1 = new Lambda() {
            @Override
            public void test(int a, int b) {
                System.out.println(a+b+"dd");
            }
        };
        lambda1.test(10,20);
        //lambda表达式
        Lambda lambda2 =(a,b)-> System.out.println(a+b);
        lambda2.test(20,30);
    }
}
```

**简化形式**

简化参数类型，参数可以省略掉

简化括号（要去掉类型就都去掉，但是参数超过一个括号得加上）

去掉花括号(多行不可简化)

