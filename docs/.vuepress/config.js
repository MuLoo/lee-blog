module.exports = {
  title: '维罗妮卡号',
  description: '宁在一思进，莫在一思停',
  // host: '0.0.0.0', // dev主机名
  // port: 8080, // 默认端口
  // dest: '.vuepress/dist', // 指定 vuepress build 的输出目录
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ['link', { rel: 'apple-touch-icon', href: '/photo.jpg' }],
  ],
  serviceWorker: true, // 是否开启 PWA
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav:[ // 导航栏配置
      {text: '前端相关', link: '/skill/' },
      {text: '生活随笔', link: '/life/'},
      {text: '微博', link: 'https://baidu.com'}      
    ],
    // sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 0, // 侧边栏显示2级
    sidebar: {
      '/skill/': [
        {
          title: 'JS相关',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/skill/aboutjs/js-1.md',
            '/skill/aboutjs/js-2.md'
          ]
        },
        {
          title: '工具相关',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/skill/tools/markdown.md',
            '/skill/tools/vscode.md',
            '/skill/tools/antd-vue.md',
          ]
        },
        {
          title: '项目相关',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/skill/program/rotate-image.md',
            '/skill/program/extension.md'
          ]
        },

      ],
      '/life/': [
        {
          title: '随笔',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/life/novels/novels-1.md',
            '/life/novels/novels-2.md',
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md'
          ]
        },
        {
          title: '小说',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md'
          ]
        },
        {
          title: '闲聊',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md',
            '/life/novels/novels-1.md'
          ]
        },
        {
          title: '经典',
          collapsable: true,
          sidebarDepth: 1,
          children: [
            '/life/classic/classic-1.md',
          ]
        },
      ]
    },
    lastUpdated: '最后更新于'
  },
  markdown: {
    lineNumbers: false
  },
  configureWebpack: {
    // 修改内部的webpack配置，将会合并
    // module: {
      // loaders: [{
      //   test: /\.styl$/,
      //   loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      // }]
    // }
  },

};