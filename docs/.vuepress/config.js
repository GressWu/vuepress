module.exports = {
  title: '月牙弯弯',
  description: '路上见识世界，途中认识自己',
  plugins: [
    [
      '@vuepress/back-to-top'
    ],
    [
      '@vuepress/nprogress'
    ],
    [
      '@vuepress-reco/vuepress-plugin-bgm-player',
      {
        audios: [
          {
            name: '搁浅',
            artist: '周杰伦',
            url: 'http://www.ytmp3.cn/down/69839.mp3',
            cover: 'https://t15.baidu.com/it/u=3058534094,3799576610&fm=179&app=42&size=w931&n=0&f=JPEG&fmt=auto?s=2F113BC89E72B5F554EC4D1E030050D2&sec=1645203600&t=d2730f587fd0ad05c02aeafeecaebec6'
          }
        ] ,
        // 是否默认缩小
        autoShrink: true ,
        // 缩小时缩为哪种模式
        shrinkMode: 'float',
        // 悬浮窗样式
        floatStyle:{ bottom: '10px', 'z-index': '999999' }
      }
    ]
  ],
  head: [
    ['link', { rel: 'icon', href: '/assetes/img/icon.png' }]
  ],
  theme: 'reco',
  themeConfig: {
    author: 'YuWei Wu',
    authorAvatar: '/assets/img/rabbit.jpeg',
    type: 'blog',
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      },
      // socialLinks: [     // 信息栏展示社交信息
      //   { icon: 'reco-github', link: 'https://github.com/recoluan' },
      //   { icon: 'reco-npm', link: 'https://www.npmjs.com/~reco_luan' }
      // ]
    },
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
              }
            ]
          },
          {
            text: 'Git版本控制',
            items: [
              {
                text: '上传本地文件至GitHub',
                link: '/git/'
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
              }
            ]
          },
        ]
      }
    ]
  }
}