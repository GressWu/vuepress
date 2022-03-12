---
title: Java序列化与反序列化
date: 2021-11-13
categories:
 - backEnd
tags:
 - Java
---

## 使用场景

Java序列化与反序列化一般与Java对象输出/输入流 ObjectOutputStream/ObjectInputStream相关。目的是将一个JavaBean对象以二进制流对象的形式持久化到硬盘上，并支持解析该文件转换为JavaBean对象。

第二种也可以将对象以二进制流的形式写到数据库类似于Blob或者Clob中的大字段中进行持久化。

同时也可以设置serialVersionUID用来控制版本的一致性，如果版本不一致则无法解析。

## 代码使用

**实体类：**	

```java
package com;

import java.io.Serializable;

public class Person implements Serializable{
private static final long serialVersionUID = 1L;

private String name;

private int age;

public String getName() {
	return name;
}

public void setName(String name) {
	this.name = name;
}

public int getAge() {
	return age;
}

public void setAge(int age) {
	this.age = age;
}

@Override
public String toString() {
	return "Person [name=" + name + ", age=" + age + "]";
}

public Person(String name, int age) {
	super();
	this.name = name;
	this.age = age;
}

public Person() {
	
	}
}
```

**测试类：**

```java
package com;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;

public class SerialTest {
	public static void main(String[] args) throws IOException, ClassNotFoundException {
		//Java对象序列化
		OutputStream op=new FileOutputStream("C:\\Users\\dxiao\\Desktop\\a.txt");
		ObjectOutputStream ops =new ObjectOutputStream(op);
		ops.writeObject(new Person("lucy",1));
		ops.close();
		//Java对象反序列化
		InputStream in =new FileInputStream("C:\\Users\\dxiao\\Desktop\\a.txt");
		ObjectInputStream ois=new ObjectInputStream(in);
		Person p = (Person) ois.readObject();
		
		System.out.println(p);
	}

}

```

### 二进制流文件 a.txt

```txt
 sr 
com.Person        I ageL namet Ljava/lang/String;xp   t lucy
```

注意：如果将一个对象以对象输出流的形式写入文件，实体类是必须要实现Serializable接口的，如果该对象没有实现Serializable接口而去调用了对象输出输入流的对象，就会报以下错误：

```java
Exception in thread "main" java.io.NotSerializableException: com.Person
	at java.base/java.io.ObjectOutputStream.writeObject0(ObjectOutputStream.java:1197)
	at java.base/java.io.ObjectOutputStream.writeObject(ObjectOutputStream.java:354)
	at com.SerialTest.main(SerialTest.java:17)
```

### 版本号控制

```java
private static final long serialVersionUID = 1L;
```

现在我们的Person类输出到a.txt的二进制流 serialVersionUID是1

```java
private static final long serialVersionUID = 2L;
```

如果这时候我们版本发生了变化，比如Person类中增加或减少了几个字段，将serialVersionUID更新为2，那么原来的二进制流将不会被解析，并报以下错误：

```java
Exception in thread "main" java.io.InvalidClassException: com.Person; local class incompatible: stream classdesc serialVersionUID = 1, local class serialVersionUID = 2
	at java.base/java.io.ObjectStreamClass.initNonProxy(ObjectStreamClass.java:728)
	at java.base/java.io.ObjectInputStream.readNonProxyDesc(ObjectInputStream.java:2060)
	at java.base/java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1907)
	at java.base/java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:2209)
	at java.base/java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1742)
	at java.base/java.io.ObjectInputStream.readObject(ObjectInputStream.java:514)
	at java.base/java.io.ObjectInputStream.readObject(ObjectInputStream.java:472)
	at com.SerialTest.main(SerialTest.java:22)
```

从某种程度上来说，Java的序列化和反序列化可以保证数据传输时的一致性。