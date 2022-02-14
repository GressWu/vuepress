module.exports = {
  title: 'yuwei的知识库',
  description: '路上见识世界，途中认识自己',
  plugins: [
    [
      '@vuepress/back-to-top'
    ],
    [
      '@vuepress/nprogress'
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
      socialLinks: [     // 信息栏展示社交信息
        { icon: 'reco-github', link: 'https://github.com/recoluan' },
        { icon: 'reco-npm', link: 'https://www.npmjs.com/~reco_luan' }
      ]
    },
    //logo: '/assets/img/hero.png',
    subSidebar: 'auto',
   // sidebar: 'auto',
    lastUpdated: '更新时间',
    nav: [
      { text: '首页', link: '/' },
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
      { text: '其他', link: '/other/' },
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
        ]
      }
    ]
  }
}