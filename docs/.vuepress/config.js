const pluginsConfig = require("./config/pluginsConf")
const headConfig = require("./config/headConf")
const blogConfig = require("./config/blogConf")
const otherArtical = require("./config/otherArtical")
const javaArtical = require("./config/javaArtical")
const databaseArtical = require("./config/databaseArtical")
const frameworkArtical = require("./config/frameworkArtical")
const computerArtical = require("./config/computerArtical")

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
      otherArtical,
      javaArtical,
      frameworkArtical,
      databaseArtical,
      computerArtical
    ]
  }
}