import webpack from 'webpack'
import colors from 'vuetify/es5/util/colors'
// import { createOidcAuth, SignInType } from 'vue-oidc-client/vue2';

// // note the ending '/'
// const appUrl = 'https://localhost:3000/';

// // SignInType could be Window or Popup
// const mainOidc = createOidcAuth('main', SignInType.Window, appUrl , {
//   authority: 'https://accounts.google.com',
//   client_id: "21519769802-l2n9e5um21n1onq27qnt2r4idh71kbd6.apps.googleusercontent.com",
//   redirect_uri: "http://localhost:3000/auth/callback",
//   response_type: 'id_token token',
//   scope: 'openid profile email api'
// });

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - beta',
    title: 'du. data. universal.',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  // plugins: [{ src: '@/plugins/vue-codemirror', ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  loadingIndicator: {
    name: 'circle',
    color: '#3B8070',
    background: 'white',
  },
  graphql: {
    /**
     * An Object of your GraphQL clients
     */
    clients: {},

    /**
     * Options
     * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
     */
    options: {
      // method: 'get', // Default to `POST`
    },

    // /**
    //  * Optional
    //  * default: false (this includes graphql-tag for node_modules folder)
    //  */
    // includeNodeModules: true,
  },
  alias: {
    'did-jwt':[]
  },

  /*
   ** Build configuration
   ** Doc: https://nuxtjs.org/api/configuration-build
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    
    extend(config, ctx) {
      // transpile .mjs too
      const babelRule = config.module.rules.find(
        (rule) => `${rule.test}` === '/\\.jsx?$/i'
      )
      if (babelRule) {
        babelRule.test = /\.mjs?$/i
      }
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
      
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/type-graphql$/, (resource) => {
        resource.request = resource.request.replace(
          /type-graphql/,
          'type-graphql/dist/browser-shim.js'
        )
      }),
    ],
  },
  alias: {
    
  },
  env: {
    AnconNFT: process.env.REACT_APP_AnconNFTAddress,
    AnconToken: process.env.REACT_APP_AnconTokenAddress,
    XDVNFT: '0xD6cE9d299E1899B4BBCece03D2ad44b41212f324',
    BSC_MAINNET: 'https://bsc-dataseed.binance.org/',
    Onramper: `pk_test_vce1UmxZ3fdhoOGiZBJHiUivX205TfsfAiyljF9LF_k0`,
    AnconAPI: 'https://api.ancon.did.pa',
    WakuRPC: 'https://api.ancon.did.pa/waku',
    InfuraIPFS: 'https://infura.ipfs.io:5001',
    IPFS: 'https://ipfs.xdv.digital/',
    Waku: 'https://waku.did.pa/',
    WakuLibp2p:
      '/dns4/waku.did.pa/tcp/8000/wss/p2p/16Uiu2HAmN96WgFsyepE3tLw67i3j6BdBo3xPF6MQ2hjmbaW5TUoB',
    WebAuthn:  'localhost' // , 'du.xdv.digital',
  },
}
