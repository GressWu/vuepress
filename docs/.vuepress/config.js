const pluginsConfig = require("./config/pluginsConf")
const headConfig = require("./config/headConf")
const blogConfig = require("./config/blogConf")

module.exports = {
  title: '月牙弯弯',
  description: '路上见识世界，途中认识自己',
  plugins: pluginsConfig,
  head: headConfig,
  theme: 'reco',
  themeConfig: {
    author: 'YuWei Wu',
    authorAvatar: '/assets/img/rabbit.jpeg',
    type: 'blog',
    blogConfig: blogConfig,
    //logo: '/assets/img/hero.png',
    subSidebar: 'auto',
   // sidebar: 'auto',
    lastUpdated: '更新时间',
    nav: [
      { text: '首页', link: '/' },
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
      { text: '其他',
        ariaLabel: 'other',
        items: [
          {
            text: '语言',
            items: [
              {
                text: '计算机英语',
                link: '/language/computerenglish'
              }
            ]
          },
          {
            text: '影视',
            items: [
              {
                text: '《生死停留》-选题新颖的悬疑片',
                link: '/video/stay'
              }
            ]
          },
          {
            text: '读书',
            items: [
              {
                text: '2021读书分享',
                link: '/read/2021report'
              }
            ]
          },
          {
            text: '随笔',
            items: [
              {
                text: '《暗淡蓝点》',
                link: '/essay/thedarkbluepoint'
              },
              {
                text: '普京-铁汉柔情',
                link: '/essay/pujing'
              },
              {
                text: '别让任何人打乱你的生活节奏',
                link: '/essay/lifebelongstoyourself'
              }
            ]
          },
         
        ]
            
      },
      {
        text: '计算机技术',
        ariaLabel: 'computer',
        items: [
          {
            text: 'Java技术',
            items: [
              {
                text: '泛型',
                link: '/java/'
              },
              {
                text: '统一请求体与返回体',
                link: '/java/standardmessage'
              },
              {
                text: '正则表达式详解',
                link: '/java/regexp/info'
              },
              {
                text: '正则表达式案例',
                link: '/java/regexp/example'
              },
              {
                text: 'Optional类的应用',
                link: '/java/optional'
              },
              {
                text: 'crontab与cron语法规则',
                link: '/java/cron'
              },
              {
                text: 'Java序列化与反序列化',
                link: '/java/serializable'
              },
              {
                text: 'enum枚举类的使用',
                link: '/java/enum'
              },
              {
                text: 'Mybatis-Plus用法总结',
                link: '/java/mybatisplus'
              },
              {
                text: 'BigDecimal常见问题',
                link: '/java/bigdecimal'
              }
              
            ]
          },
          {
            text: '面试知识点',
            items: [
              {
                text: '@Component与@Bean的区别',
                link: '/interview/cptandbean'
              },
              {
                text: '控制反转(IOC)与依赖注入(DI)',
                link: '/interview/iocanddi'
              },
              {
                text: 'Spring中注册Bean的方式',
                link: '/interview/initbean'
              }
            ]
          },
          {
            text: 'Spring MVC',
            items: [
              {
                text: '什么是Spring MVC',
                link: '/springmvc/introduce'
              },
              {
                text: 'Servlet简介',
                link: '/springmvc/servlet'
              },
              {
                text: 'SpringMVC简单使用',
                link: '/springmvc/simpleuse'
              },
              {
                text: 'SpringMVC @RequestMapping注解',
                link: '/springmvc/requestmapping'
              },
              {
                text: 'SpringMVC取值与返回值',
                link: '/springmvc/requestandresponse'
              },
              {
                text: 'SpringMVC上传与下载功能',
                link: '/springmvc/upanddown'
              },
              {
                text: 'SpringMVC异常处理',
                link: '/springmvc/exception'
              },
              {
                text: 'SpringMVC注解配置',
                link: '/springmvc/annotion'
              },
            ]
          },
          {
            text: 'Spring Boot',
            items: [
              {
                text: 'SpringBoot解决跨域问题',
                link: '/springboot/crossorgin'
              },
              {
                text: 'SpringBoot事务处理Transactional',
                link: '/springboot/tansactional'
              },
              {
                text: 'SpringBoot读取配置文件的五种方式',
                link: '/springboot/property'
              },
              {
                text: 'SpringBoot validation参数校验',
                link: '/springboot/validation'
              },
              {
                text: 'SpringBoot h2数据库的使用',
                link: '/springboot/h2database'
              },
            ]
          },
          {
            text: 'Git版本控制',
            items: [
              {
                text: '上传本地文件至GitHub',
                link: '/git/'
              },
              {
                text: 'git基本操作',
                link: '/git/basic'
              },
              {
                text: 'git回退版本',
                link: '/git/gitback'
              },
              {
                text: 'git分支与工作流',
                link: '/git/gitbranch'
              },
              {
                text: 'git stash与git cherry-pick',
                link: '/git/gitstash'
              }
            ]
          },
          {
            text: '设计模式',
            items: [
              {
                text: '设计模式类型',
                link: '/designpattern/dptype'
              },
              {
                text: '设计模式七大原则',
                link: '/designpattern/dpprinciple'
              },
              {
                text: '《大话设计模式》—— 简单工厂模式',
                link: '/designpattern/factorypattern'
              }
            ]
          },
          {
            text: '计算机网络',
            items: [
              {
                text: 'RestTemplate的使用',
                link: '/internet/resttemplate/'
              }
            ]
          },
          {
            text: '前端知识',
            items: [
              {
                text: 'VuePress自定义页面',
                link: '/frontend/vuepresscustom/'
              }
            ]
          },
          {
            text: '编译器',
            items: [
              {
                text: 'vscode连接远程服务器',
                link: '/ide/vscodessh/'
              },
              {
                text: 'Idea快捷键',
                link: '/ide/ideakey/'
              },
              {
                text: 'Typora设置阿里云图床',
                link: '/ide/typoraaliyun/'
              }
            ]
          },
          {
            text: 'SpringBatch',
            items: [
              {
                text: 'SpringBatch所需准备',
                link: '/springbatch/springbatch/'
              }
            ]
          },
        ]
      }
    ]
  }
}