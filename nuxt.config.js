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
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
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
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // {src: 'plugins/amplify.js',ssr: false},
    {src: 'plugins/vue-youtube.js',ssr: false},
    {src: 'plugins/vue-plyr.js',ssr: false},
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
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/google-gtag',
      {
        id: process.env.GA_ID, 
        debug: true 
      }
    ]
  ],

  axios: {
    baseURL: process.env.API_URL,
  },

  router:{
    middleware: ['init_auth']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
}
