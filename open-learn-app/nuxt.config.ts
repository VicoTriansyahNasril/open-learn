export default defineNuxtConfig({
  devtools: { enabled: true },

  // SECARA EKSPLISIT MENENTUKAN LOKASI KOMPONEN
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  compatibilityDate: '2024-04-03',

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
      },
    },
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  },
})