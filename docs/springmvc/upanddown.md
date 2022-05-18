---
title: SpringMVC上传与下载功能
date: 2022-04-04
categories:
 - backEnd
tags:
 - SpringMVC
---

## 前期准备

需要在`SpringMVC`配置文件中配置MultipartResolver处理器

```xml
    <!-- SpringMVC上传文件时，需要配置MultipartResolver处理器 -->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="defaultEncoding" value="utf-8" />
        <property name="maxUploadSize" value="10485760000" />
        <property name="maxInMemorySize" value="40960" />
    </bean>
```
pom文件中也需加入依赖

```xml
 <dependency>
       <groupId>commons-fileupload</groupId>
       <artifactId>commons-fileupload</artifactId>
       <version>1.3.1</version>
 </dependency>
```

## 上传文件

```java
@RequestMapping("/upload")
    public String upload(MultipartFile multipartFile,HttpSession session) throws IOException {
        //获得上传文件的文件名
        String filename = multipartFile.getOriginalFilename();
        //获取文件后缀名
        String suffixName = filename.substring(filename.lastIndexOf("."));
        //UUID作为文件名
        String uuId = UUID.randomUUID().toString().replaceAll("-","");
        filename = uuId+suffixName;
        //获取上传文件地址
        String photoPath = session.getServletContext().getRealPath("photo");
        File file = new File(photoPath);
        if(!file.isFile()){
            file.mkdir();
        }
        //最终要上传的路径
        String finalPath = photoPath+File.separator+filename;
        System.out.println(finalPath);
        //将multipartFile的数据传输到finalPath所指向的路径
        multipartFile.transferTo(new File(finalPath));
        return "success";
    }
```

## 下载文件

```java
@RequestMapping("/down")
    public ResponseEntity<byte[]> downTheMusic(HttpSession httpSession) throws IOException {
        //获取ServletContext对象
        ServletContext servletContext = httpSession.getServletContext();
        //获取服务器文件路径
        String realPath = servletContext.getRealPath("/static/music/bgm.mp3");
        //创建输入流
        FileInputStream is = new FileInputStream(realPath);
        //创建字符数组
        byte[] bytes = new byte[is.available()];
        //将流写道数组中
        is.read(bytes);
        //创建HTTPHEADER
        HttpHeaders httpHeaders = new HttpHeaders();
        //通知浏览器以下载的方式打开文件
        httpHeaders.setContentDispositionFormData("attachment","bgm.mp3");
        //设置状态码
        HttpStatus status = HttpStatus.OK;
        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(bytes, httpHeaders, status);
        //关闭流
        is.close();
        return responseEntity;

    }

    @RequestMapping("/down1")
    public ResponseEntity<byte[]> downTheMusic1(HttpServletRequest request) throws IOException{
        ServletContext servletContext = request.getSession().getServletContext();
        //获取服务器文件路径
        String realPath = servletContext.getRealPath("/static/music/bgm.mp3");
        //创建输入流
        FileInputStream is = new FileInputStream(realPath);
        //创建字符数组
        byte[] bytes = new byte[is.available()];
        //将流写道数组中
        is.read(bytes);
        //创建HTTPHEADER
        HttpHeaders httpHeaders = new HttpHeaders();
        //通知浏览器以下载的方式打开文件
        httpHeaders.setContentDispositionFormData("attachment","bgm.mp3");
        //设置状态码
        HttpStatus status = HttpStatus.OK;
        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(bytes, httpHeaders, status);
        //关闭流
        is.close();
        return responseEntity;
    }
```

