module.exports = {
    title:'武宇威的博客',
    description:'啦啦啦',
    head: [
      ['link', { rel: 'icon', href: '/assetes/img/icon.png' }]
    ],
    themeConfig: {
      logo: '/assets/img/hero.png',
      sidebar: 'auto',
      lastUpdated: '更新时间',
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'External', link: 'https://google.com' },
        {
          text: '计算机技术',
          ariaLabel: 'computer',
          items: [
            { text: 'Java技术', 
              items: [
                {text: '泛型', 
                link: '/guide/'}
              ]  },
            { text: 'Japanese', link: '/language/japanese/' }
          ]
        }
      ]
    }
  }