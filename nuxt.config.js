require('dotenv').config();
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  watchers: {
    webpack: {
      poll: true
    }
  },
  head: {
    title: "PulScreen | YouTube動画のリアルタイム共有(同期再生)サービス",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    // script: [{src: "cordova/cordova.js"}]
  },

  server: {
    port: 80,
    host: '0.0.0.0',
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: 'plugins/vue-youtube.js',ssr: false},
    {src: 'plugins/vue-plyr.js',ssr: false},
    {src: 'plugins/firebase.js',ssr: false},
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    // '@nuxtjs/pwa',
    'bootstrap-vue/nuxt',
    'nuxt-user-agent',
    'nuxt-fontawesome',
    [
      '@nuxtjs/google-gtag',
      {
        id: process.env.GA_ID, 
        debug: true 
      }
    ],
    ['nuxt-twa-module', {
      /* module options */
      defaultUrl: 'https://pulscreen.com',
      hostName: 'pulscreen.com',
      sha256Fingerprints: ['91:75:A7:D1:FF:3C:CF:52:A3:4F:9A:F7:0A:1A:37:91:40:8C:AE:D7:37:B9:CB:26:02:78:36:ED:53:21:DE:69'],
      applicationId: 'com.rusian0.pulscreen',
      launcherName: 'PulScreen',
      versionCode: 5,
      versionName: '1.2',
      statusBarColor: '#dc3b69',
      iconPath: '/static/icon.png',
      distFolder: '.nuxt/dist',
    }],
  ],

  //この部分を追記
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },

  axios: {
    baseURL: process.env.API_URL,
  },

  router:{
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'notFound',
        path: '*',
        component: resolve(__dirname, 'pages/errors/404.vue')
      })
    }
  },
  /*
  ** Build configuration
  */
  build: {
    terser: {
      terserOptions: {
        compress: { drop_console: true }
      },
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    publicPath: "/nuxt/"
  },
  generate: {
    subFolders: false
  },
  manifest: {
    name: 'PulScreen',
    short_name: 'プルスク',
    lang: 'ja'
  
  },
}
