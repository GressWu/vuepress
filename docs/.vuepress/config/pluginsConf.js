module.exports = [
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
          name: 'А зори здесь тихие-тихие',
          artist: 'Lube',
          url: '/assets/music/bgm.mp3',
          cover: 'http://imge.kugou.com/stdmusic/150/20190215/20190215054604117975.jpg'
        }
      ],
      // 是否默认缩小
      autoShrink: true,
      // 缩小时缩为哪种模式
      shrinkMode: 'float',
      // 悬浮窗样式
      floatStyle: { bottom: '10px', 'z-index': '999999' }
    }
  ]
]