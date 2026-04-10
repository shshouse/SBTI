export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
  ],

  app: {
    head: {
      title: 'SBTI 人格测试',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'SBTI 人格测试 - 一个有趣的人格评估工具' },
      ],
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  devtools: { enabled: true },
})
