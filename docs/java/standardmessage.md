## SpringBoot统一返回体与统一请求体

### 需求背景

假设现在微信小程序需要调用我们系统的接口，其中它会给我们传来以下参数：

```json
{
    "sysId": "",
    "transCode": "",
    "transName": "",
    "requestParams": {
        "productName": "",
        "productAddress": "",
        "price": 100
    }
}
```

它又需要以下返回值：

```json
{
    "rtnCode": "",
    "rtnMessage": "",
    "result": {
        "evaluate": "",
        "stars": 5
    },
    "success": true
}
```

### 需求分析

前端传来的是一个Json数据，那么我们可以使用FastJson中的JsonObject进行接收，解析后完成业务处理。再将返回值通过Map<key,value>进行包装进行返回。

但是这样做一是代码不够美观，二是会造成代码冗余。尤其是像requestParams这种里面参数不确定使得我们dto写起来很不舒服。

那么我们可以使用统一的请求体，返回体进行包装，使得代码变得优雅且更容易使用

### 实现

1. 项目结构：

![image-20220124215012456](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220124215012456.png)

* controller:存放后端对外暴露接口
* dto:存放dto类
* template：存放统一返回体，统一请求体模板
* DemoApplication:SpringBoot启动类

2. 统一请求体与返回体

```java
package com.example.demo.template;

import jdk.jfr.Description;
import lombok.Data;

/**
 * 微信支付请求体包装类
 * @author wuyuwei
 */
@Data
public class WeChatRequestMessage<T> {

    @Description("请求内容")
    private T requestParams;

    @Description("系统Id")
    private String sysId;

    @Description("交易代码")
    private String transCode;

    @Description("交易名称")
    private String transName;
}
```

```java
package com.example.demo.template;

import jdk.jfr.Description;
import lombok.Data;

/**
 * 微信支付统一返回包装类
 * @author wuyuwei
 * @param <T>
 */
@Data
public class WeChatResponseMessage<T> {
    @Description("是否成功")
    private boolean isSuccess;
    @Description("返回代码")
    private String rtnCode;
    @Description("返回信息")
    private String rtnMessage;
    @Description("返回详细信息")
    private T result;
}
```

利用泛型T,实现信息的自由扩展。

3. dto类

```java
package com.example.demo.dto;

import lombok.Data;

@Data
public class RequestDto {
    private String productName;

    private String productAddress;

    private double price;
}
```

```java
package com.example.demo.dto;

import lombok.Data;

@Data
public class ResponseDto {
    private String evaluate;

    private Integer stars;

}
```

4. controller类

```java
package com.example.demo.controller;

import com.example.demo.dto.RequestDto;
import com.example.demo.dto.ResponseDto;
import com.example.demo.template.WeChatRequestMessage;
import com.example.demo.template.WeChatResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @RequestMapping(value = "/test",method = RequestMethod.POST)
    public ResponseEntity<WeChatResponseMessage<ResponseDto>> test(@RequestBody WeChatRequestMessage<RequestDto> req){
        //返回值
        WeChatResponseMessage<ResponseDto> rsp = new WeChatResponseMessage<>();
        //获取请求参数
        RequestDto requestParams = req.getRequestParams();
        System.out.println(requestParams.getPrice());
        System.out.println(requestParams.getProductName());
        System.out.println(requestParams.getProductAddress());

        System.out.println(req.getSysId());
        System.out.println(req.getTransCode());
        System.out.println(req.getTransName());
        /**
         * 业务处理。。。。
         */
        //拼装返回参数
        ResponseDto responseDto = new ResponseDto();
        responseDto.setEvaluate("非常好吃，孩子已经吃了两箱了");
        responseDto.setStars(5);

        rsp.setRtnCode("200");
        rsp.setSuccess(true);
        rsp.setRtnMessage("交易完成");
        rsp.setResult(responseDto);

        return ResponseEntity.ok(rsp);

    }
}
```

5. 利用postMan进行测试

![image-20220124220116032](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220124220116032.png)

