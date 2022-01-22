module.exports = {
    themeConfig: {
      logo: '/assets/img/hero.png',
      sidebar: 'auto',
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