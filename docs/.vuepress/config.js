module.exports = {
  title: 'yuwei的知识库',
  description: '啦啦啦',
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
  themeConfig: {
    logo: '/assets/img/hero.png',
    sidebar: 'auto',
    lastUpdated: '更新时间',
    nav: [
      { text: '首页', link: '/' },
      { text: '导航', link: '/guide/' },
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
        ]
      }
    ]
  }
}