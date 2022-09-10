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
          //url: '/assets/music/bgm.mp3',  本地歌曲上传
          url: 'https://md-img-market.oss-cn-beijing.aliyuncs.com/music/%D0%B7%D0%BE%D1%80%D0%B8.mp3',
          cover: 'http://imge.kugou.com/stdmusic/150/20190215/20190215054604117975.jpg'
        },
        {
          name: '手写的从前',
          artist: '周杰伦',
          //url: '/assets/music/bgm.mp3',  本地歌曲上传
          url: 'https://md-img-market.oss-cn-beijing.aliyuncs.com/music/%E6%89%8B%E5%86%99%E7%9A%84%E4%BB%8E%E5%89%8D.mp3',
          cover: 'https://th.bing.com/th/id/OIP.t6JQrDpw-P1hV8iErO9vpwHaHa?w=169&h=180&c=7&r=0&o=5&pid=1.7'
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