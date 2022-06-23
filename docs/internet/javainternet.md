---
title: Java网络编程
date: 2021-04-11
categories:
 - backEnd
tags:
 - Java
 - internet
---

## IP地址

```java
//查询本机地址
InetAddress byName11 = InetAddress.getByName("localhost");
InetAddress byName12 = InetAddress.getByName("127.0.0.1");
InetAddress byName13 = InetAddress.getLocalHost();
System.out.println(byName13);

//查询网站地址
InetAddress inetAddress = InetAddress.getByName("www.baidu.com");
System.out.println(inetAddress);

//常用方法
System.out.println(inetAddress.getHostAddress());
//获得规范名
System.out.println(inetAddress.getCanonicalHostName());
//获得域名
System.out.println(inetAddress.getHostName());
```

## 端口

* 端口表示程序的一个地址 区分软件

* 0~65535

* TCP UDP:协议可以使用相同端口 但是同一个协议只能一个
* 公有端口 0~1023
  * HTTP：80
  * HTTPS: 443
  * FTP：21
  * SSH ： 22
  * Telent : 23
* 程序注册端口：2014~49151 分配程序
  * Tomcat : 8080 
  * MySQL : 3306
  * Oracle : 1521
* 私有端口：49152-65535

```
netstat -ano 查看所有端口
netstat -ano | findstr "8080"
```



## TCP根据Socket连接服务器

### Socket发送信息

Server端

```java
package com.socket.yuwei;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * 利用TCP Socket套接字来实行通讯  服务端
 */
public class SocketServer {
    public static void main(String[] args) throws IOException {
        InputStream in=null;
        ServerSocket serverSocket=null;
        Socket accept=null;
        try {
            //创建端口号为 9999的服务
             serverSocket = new ServerSocket(9999);
            //获得客户端连接
            accept = serverSocket.accept();
            //读取客户端消息
             in = accept.getInputStream();

            byte[] bytes = new byte[1024];
            int len;
            StringBuilder stringBuilder = new StringBuilder();
            while((len=in.read(bytes))!=-1){
                stringBuilder.append(new String(bytes,0,len));
            }
            String s = stringBuilder.toString();
            System.out.println(s);

        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            in.close();
            serverSocket.close();
            accept.close();
        }
    }
}
```

客户端

```java
package com.socket.yuwei;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

public class SocketClient {
    public static void main(String[] args) throws IOException {
        Socket socket=null;
        OutputStream os=null;
        try {
            InetAddress hostName = InetAddress.getByName("127.0.0.1");
            int port = 9999;
            //创建Socket链接
             socket = new Socket(hostName, port);
            //发送消息
            os = socket.getOutputStream();
            os.write("瞧你吗".getBytes());

        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            socket.close();
            os.close();
        }
    }
}
```

### Socket传输文件

Server

```java
package com.socket.file;

import com.socket.yuwei.SocketServer;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(9999);
        Socket accept = serverSocket.accept();
        InputStream inputStream = accept.getInputStream();
        byte[] bytes = new byte[1024];
        int len=inputStream.read(bytes);
        StringBuilder stringBuilder = new StringBuilder();
        while(len!=-1){
            String s = new String(bytes, 0, len);
            stringBuilder.append(s);
            len = inputStream.read(bytes);
        }
        String s1 = stringBuilder.toString();
        System.out.println(s1);

        serverSocket.close();
        accept.close();
        inputStream.close();
    }
}
```

client

```java
package com.socket.yuwei;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

public class SocketClient {
    public static void main(String[] args) throws IOException {
        Socket socket=null;
        OutputStream os=null;
        try {
            InetAddress hostName = InetAddress.getByName("127.0.0.1");
            int port = 9999;
            //创建Socket链接
             socket = new Socket(hostName, port);
            //发送消息
            os = socket.getOutputStream();
            os.write("瞧你吗".getBytes());

        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            socket.close();
            os.close();
        }
    }
}
```

## UDP传送数据

### UDP发送端

```java
package com.socket.udp;

import java.io.IOException;
import java.net.*;

//不需要连接服务器
public class UdpClient {
    public static void main(String[] args) throws IOException {
        //1,建立一个Socket
        DatagramSocket datagramSocket = new DatagramSocket();
        //2.建个包
        String msg = "你好啊，服务器";
        InetAddress byName = InetAddress.getByName("127.0.0.1");
        int port = 9999;

        //数据，数据的长度起始，要发送给谁
        DatagramPacket datagramPacket = new DatagramPacket(msg.getBytes(), 0, msg.length(), byName, port);

        //3. 发送包
        datagramSocket.send(datagramPacket);
        datagramSocket.close();
    }
}
```

#### UDP接收端

```java
package com.socket.udp;



import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

//还是要连接
public class UdpServer {
    public static void main(String[] args) throws IOException {
        DatagramSocket socket = new DatagramSocket(9999);
        byte[] bytes = new byte[1024];
        //接手
        DatagramPacket datagramPacket = new DatagramPacket(bytes, 0, bytes.length);
        socket.receive(datagramPacket);

        //获得包裹
        byte[] data = datagramPacket.getData();
        System.out.println(datagramPacket.getData().toString());
        String string = new String(data, 0, datagramPacket.getLength());
        System.out.println(string);
        //关闭连接
        socket.close();
    }
}
```



## SOCKET 连接 与 UDP连接

socket连接需要三次握手 有连接 需要客户端 服务端

UDP是无连接发送  可以直接发送 不需要连接
