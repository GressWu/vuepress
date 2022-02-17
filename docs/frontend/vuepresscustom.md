---
title: VuePress创建自定义页面
date: 2022-02-17
categories:
 - frontEnd
tags:
 - VuePress
---
##  VuePress路由逻辑

VuePress与正常的Vue项目存在一些差异。普通Vue项目路由一般通过router.js进行配置，但是VuePress不存在router.js这种类似的文件，内部已经进行了封装，他是以项目的目录结构区分路由的。

**路由配置文件：**

`docs/.vuepress/config.js`

```js
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
      { text: '其他', link: '/other/' },
      { text: '自定义页面', link: '/flex/' },
   
    ]
  }
```

通过配置nav进行路由配置

**目录路由映射结构：**

![image-20220217203239333](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220217203239333.png)

如图所示docs下flex目录下的`README.md`对应 /flex的路由

如果flex目录下存在一个比如叫`test.md`的文件 那么就对应/flex/test的路由

## 自定义全局组件

在`.vuepress/components`下的页面都为该项目的**全局组件**，在该路径下创建的文件为我们正常的Vue文件。

例如:`.vuepress/components/Apple.vue`

```vue
<template>
        <div>
            <h1 class="test01">自定义页面</h1>
            <p>
                下雪了，天气好冷
            </p>
        </div>   
   
</template>
<style scoped>
    .test01{
        color: red;
        font-family: 'Courier New', Courier, monospace
    }
</style>
```

## 引入自定义组件

以/flex为例，flex目录下的README.md

```markdown
---
date: 2022-02-17
author: gress
categories:
 - backEnd
tags:
 - Java
---

<Apple/>

```

上面还是正常的Front Matter，下面通过`<Apple/>`将组件引入

效果图：

![image-20220217204256827](https://md-img-market.oss-cn-beijing.aliyuncs.com/img/image-20220217204256827.png)