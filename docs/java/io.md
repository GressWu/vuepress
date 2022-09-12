---
title: IO流的使用
date: 2020-09-23
categories:
 - BackEnd
tags:
 - Java
---

# IO流

## 简介

在对数据进行输入/输出操作是以“流”的方式进行

**数据源**（Data Source）：数据库、文件、其他程序、内存、网络...

source-------------->program------------>destination

​              输入流						输出流

参照物：program

## 分类

**按数据单元分类：**

* 字节流(重要)

  InputStream,OutputStream

* 字符流

  Reader,Writer

 **按处理对象不同分类：**

* 节点流：

  直接与数据源相连，必须有（水管）

* 处理流：

  可以没有，但是能提高性能与灵活性（自来水厂）

  FilterInputStream,FilterOutputStream

  FilterReader,FilterWriter



## File类

File类作用：获取文件或者文件夹的属性，实现对文件、文件夹的创建与删除。

相关代码：

```java
package com.yuwei.file;

import java.io.File;
import java.util.Date;

/**
 * 获取文件或文件夹属性
 */
public class test01 {
    public static void main(String[] args) {
        File file = new File("D:\\IOTEST\\io流.txt");
        File file1 = new File("D:\\");
        //基础属性
        //文件名
        System.out.println(file.getName());
        //长度
        System.out.println(file.length());
        //是否存在
        System.out.println(file.exists());
        //绝对路径
        System.out.println(file.getAbsolutePath());
        //最近修改时间
        System.out.println(new Date(file.lastModified()).toLocaleString());

        //文件权限
        //可读
        System.out.println(file.canRead());
        //可写
        System.out.println(file.canWrite());
        //可执行
        System.out.println(file.canExecute());

        //文件，文件夹
        //文件
        System.out.println(file.isFile());
        //文件夹
        System.out.println(file.isDirectory());
        //文件夹下的所有文件
        File[] files = file1.listFiles();
        for (File f : files) {
            System.out.println(f.getName());
        }


    }
}
```



```java
package com.yuwei.file;

import java.io.File;
import java.io.IOException;

/**
 * 实现对文件、文件夹的创建与删除
 * File类不能对文件的内容进行操作，内容操作要使用I/O流
 */
public class test02 {
    public static void main(String[] args) throws IOException {
        //创建一个File对象指向一个文件
        File file = new File("D:\\IOTEST\\test\\io流.txt");
        //如果文件存在就删除，不存在创建
        if(file.exists()){
            file.delete();
        }else{
            //获取上级文件夹
            File dir = file.getParentFile();  // D:IOTEST/test
            if(!dir.exists()){
                //新建一级文件夹
                dir.mkdir();
                //新建多级文件夹
                //dir.mkdirs();
            }
            //如果上级文件夹不存在就创建
            file.createNewFile();
        }

    }
}
```



## 输入输出流

#### 字节流

**1.单个字节输入输出**

```java
package com.yuwei.io;

import java.io.*;

public class test {
    public static void main(String[] args) throws IOException {
        //1.创建输入流和输出流
        File file = new File("D:\\IOTEST\\io流.txt");
        File file1 = new File("D:\\IOTEST\\copy.txt");

        FileInputStream fis = new FileInputStream(file);
        FileOutputStream fos = new FileOutputStream(file1);
        //2.使用输入流与输出流完成文件复制
        //定义一个中转站
        int n;
        //将读取到的数据放到中转站中
        n = fis.read();
        //将中转站的数据写入另一个文件
        //n==-q文件读到末尾
        while(n!=-1){
            //写一个字节
            fos.write(n);
            //再读一个字节
            n=fis.read();
        }

        //3.关闭输入、输出流
        fis.close();
        fos.close();
    }
}
```

**2.一兆字节输入输出**

```java
package com.yuwei.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class test2 {
    public static void main(String[] args) throws IOException {
        //1.创建输入流和输出流
        File file = new File("D:\\IOTEST\\io流.txt");
        File file1 = new File("D:\\IOTEST\\copy.txt");

        FileInputStream fis = new FileInputStream(file);
        //输出流追加
        //FileOutputStream fos = new FileOutputStream(file1,true);
        //输出流覆盖 默认为覆盖
        // FileOutputStream fos = new FileOutputStream(file1,false);
        FileOutputStream fos = new FileOutputStream(file1);

        /**
        FileInputStream fis = new FileInputStream("D:\\IOTEST\\io流.txt");
        FileOutputStream fos = new FileOutputStream("D:\\IOTEST\\copy.txt");
        最简化
         **/

        //2.使用输入流与输出流完成文件复制
        //定义一个中转站
        byte[] buf = new byte[1024];
        //将读取到的数据放到中转站中
        //读文件的内容放到字节数组中，返回读取的字节数
        int len = fis.read(buf);
        //将中转站的数据写入另一个文件
        //n==-q文件读到末尾
        while(len!=-1){
            //将字节数组的内容写入文件   从0开始写len个
            fos.write(buf,0,len);
            //再读一个字节数组
            len =fis.read(buf);
        }

        //3.关闭输入、输出流
        fis.close();
        fos.close();
    }
}
```

**3.try-catch-finally异常处理**

```java
package com.yuwei.io;

import java.io.*;

public class test3 {
    public static void main(String[] args) {
        File file = new File("D:\\IOTEST\\io流.txt");
        File file1 = new File("D:\\IOTEST\\copy.txt");
        FileInputStream fis=null;
        FileOutputStream fos=null;

        try {
            fis = new FileInputStream(file);
            fos = new FileOutputStream(file1);

            byte[] bytes = new byte[1024];

            int len = fis.read(bytes);
            if(len!=-1){
                fos.write(bytes,0,len);
                len = fis.read(bytes);
            }


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            //关闭流要分开处理
            try {
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }


    }
}
```

**4.try-catch直接处理**

```java
package com.yuwei.io;

import java.io.*;

public class test4 {
    public static void main(String[] args) {
        File file = new File("D:\\IOTEST\\io流.txt");
        File file1 = new File("D:\\IOTEST\\copy.txt");

        //放到括号里可以自动关闭，不用再finally抛异常了
        try(FileInputStream fis = new FileInputStream(file);
            FileOutputStream fos = new FileOutputStream(file1);) {
            byte[] bytes = new byte[1024];
            int len = fis.read(bytes);
            while(len!=-1){
                fos.write(bytes,0,len);
                len = fis.read(bytes);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }
}
```

## 文件字符流

只可以读写文本文件（记事本打开的文件）

好处：处理非英文方便

字符流的底层就是字节流

```java
package com.yuwei.iozifu;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class test01 {
    public static void main(String[] args) throws IOException {
        //1.创建输入流与输出流
        FileReader fr = new FileReader("D:\\IOTEST\\io流.txt");
        FileWriter fw = new FileWriter("D:\\IOTEST\\copy.txt");

        //2.数据传输
        char[] chars = new char[1024];
        int len = fr.read(chars);
        while(len!=-1){
            fw.write(chars,0,len);
            len = fr.read(chars);
        }

        //3.关闭流
        fr.close();
        fw.close();


    }
}
```

## 字节缓冲流

1. 使用缓冲流可以提高读写效率
2. 关闭高层流即可
3. 实际上是在内存中开辟缓冲区，读取内存速度高于硬盘

```java
package com.yuwei.iobuff;

import java.io.*;

public class test {
    public static void main(String[] args) throws IOException {
        //1.创建输入流与输出流
        FileInputStream fis = new FileInputStream("D:\\IOTEST\\io流.txt");
        FileOutputStream fos = new FileOutputStream("D:\\IOTEST\\copy.txt");

        //2.创建缓冲字节输出流 提高效率
        BufferedInputStream bis = new BufferedInputStream(fis);
        BufferedOutputStream bos = new BufferedOutputStream(fos);

        //3.数据传输
        byte[] bytes = new byte[1024];
        int len = bis.read(bytes);
        while(len!=-1){
            bos.write(len);
            len = bis.read(bytes);
        }

        //4.关闭流
        bis.close();
        bos.close();
    }
}

```

## 缓冲字符流

原理：StringBuilder.append() 遇到回车停止

```java
package com.yuwei.iozifubuff;

import java.io.*;

public class test {
    public static void main(String[] args) throws IOException {
        //1.创建输入流与输出流
        BufferedReader br = new BufferedReader(new FileReader("D:\\IOTEST\\io流.txt"));
        BufferedWriter bw = new BufferedWriter(new FileWriter("D:\\IOTEST\\Copyio流.txt"));


        //2.读数据
        //直接读一行
        String str = br.readLine();
        while(str!=null){
            //写一行
            bw.write(str);
            //换行
            bw.newLine();
            //读一行
            str = br.readLine();
        }

        //3.关闭流
        br.close();
        bw.close();

    }
}
```

## 数据处理流(字节流)

只可读基本数据类型

```java
package com.yuwei.ioshuju;

import java.io.*;

/**
 * 希望方便的将数据类型或者是引用数据类型写入到文件方便读写  String int ....
 */
public class testDataStream {
    public static void main(String[] args) throws IOException {
        write();
        read();
    }

    public static void write() throws IOException {
        //字节流
        FileOutputStream fos = new FileOutputStream("D:\\IOTEST\\datatest\\iotest.txt");
        //字节缓冲流
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        //数据处理流
        DataOutputStream dos = new DataOutputStream(bos);
        dos.writeInt(12);
        dos.writeUTF("哈哈");
        //关闭流
        dos.close();
    }

    public static void read() throws IOException {
        //字节流
        FileInputStream fis = new FileInputStream("D:\\IOTEST\\datatest\\iotest.txt");
        //字节缓冲流
        BufferedInputStream bis = new BufferedInputStream(fis);
        //数据处理流
        DataInputStream dis = new DataInputStream(bis);
        System.out.println(dis.readInt());
        System.out.println(dis.readUTF());
        //关闭流
        dis.close();
    }
}
```

可以读基本数据类型和对象

```java
package com.yuwei.ioshuju;

import java.io.*;
import java.util.Date;

public class testObjectStream {
    public static void main(String[] args) throws IOException {
        write();
        read();
    }

    public static void write() throws IOException {
        //字节流
        FileOutputStream fos = new FileOutputStream("D:\\IOTEST\\datatest\\iotest.txt");
        //字节缓冲流
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        //数据处理流
        ObjectOutputStream dos = new ObjectOutputStream(bos);
        dos.writeInt(12);
        dos.writeUTF("哈哈");
        //对象
        dos.writeObject(new Date());
        //关闭流
        dos.close();
    }

    public static void read() throws IOException {
        //字节流
        FileInputStream fis = new FileInputStream("D:\\IOTEST\\datatest\\iotest.txt");
        //字节缓冲流
        BufferedInputStream bis = new BufferedInputStream(fis);
        //数据处理流
        ObjectInputStream dis = new ObjectInputStream(bis);
        System.out.println(dis.readInt());
        System.out.println(dis.readUTF());
        //关闭流
        dis.close();
    }
}
```
