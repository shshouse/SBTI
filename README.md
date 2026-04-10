# SBTI 人格测试

一个基于 Nuxt 3 构建的 SBTI 人格测试 Web 应用。

## 简介

SBTI 是一个有趣的人格测试工具，通过 5 大模型、15 个维度、31 道题目，将你匹配到 26 种独特的人格类型之一。

**本测试仅供娱乐，请勿当真。**

原作者：[B站@蛆肉儿串儿](https://space.bilibili.com/417038183)

## 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/)
- **UI**: [TailwindCSS](https://tailwindcss.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **图标**: [Nuxt Icon](https://github.com/nuxt/icon) (Lucide Icons)
- **语言**: TypeScript

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 生成静态站点
npm run generate
```

## 项目结构

```
├── app.vue                 # 应用入口
├── pages/
│   ├── index.vue          # 首页
│   ├── test.vue           # 测试页
│   └── result.vue         # 结果页
├── components/
│   ├── QuestionCard.vue   # 题目卡片组件
│   ├── ProgressBar.vue    # 进度条组件
│   └── DimensionItem.vue  # 维度评分组件
├── stores/
│   └── test.ts            # Pinia 测试状态管理
├── data/
│   ├── questions.ts       # 题目数据
│   ├── types.ts           # 人格类型数据
│   └── dimensions.ts      # 维度元数据
├── assets/css/
│   └── tailwind.css       # TailwindCSS 入口
└── public/image/          # 人格类型图片
```

## 人格类型

共 26 种人格类型，包括 CTRL(拿捏者)、BOSS(领导者)、SHIT(愤世者) 等，以及隐藏人格 DRUNK(酒鬼) 和兜底人格 HHHH(傻乐者)。

## License

MIT
