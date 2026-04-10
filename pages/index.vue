<script setup lang="ts">
import { useTestStore } from '~/stores/test'

const router = useRouter()
const store = useTestStore()

function handleStart() {
  store.startTest()
  router.push('/test')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-2xl text-center">
      <!-- Hero -->
      <div class="card px-8 py-16 relative overflow-hidden">
        <!-- Decorative circles -->
        <div class="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-b from-primary-100/40 to-primary-50/10 pointer-events-none" />
        <div class="absolute -left-12 -bottom-12 w-36 h-36 rounded-full bg-gradient-to-t from-primary-100/30 to-transparent pointer-events-none" />

        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 mb-8">
            <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
            SBTI Personality Test
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
            MBTI已经过时，<br />SBTI来了。
          </h1>

          <p class="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-10">
            5 大模型 · 15 个维度 · 31 道题目<br />
            一次不那么正经的人格审判
          </p>

          <button class="btn-primary text-base px-8 py-4" @click="handleStart">
            <Icon name="lucide:play" class="w-4 h-4 mr-2" />
            开始测试
          </button>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid sm:grid-cols-2 gap-4 mt-6">
        <div class="card p-5 text-left">
          <h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="lucide:layers" class="w-4 h-4 text-primary-600" />
            五大模型
          </h3>
          <ul class="text-[13px] text-gray-500 space-y-1.5">
            <li>自我模型 -- 自尊、清晰度、核心价值</li>
            <li>情感模型 -- 依恋、投入度、边界</li>
            <li>态度模型 -- 世界观、规则、意义感</li>
            <li>行动驱力模型 -- 动机、决策、执行</li>
            <li>社交模型 -- 主动性、边界、真实度</li>
          </ul>
        </div>
        <div class="card p-5 text-left">
          <h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="lucide:info" class="w-4 h-4 text-primary-600" />
            关于测试
          </h3>
          <ul class="text-[13px] text-gray-500 space-y-1.5">
            <li>26 种独特人格类型</li>
            <li>基于维度匹配的结果算法</li>
            <li>包含隐藏人格机制</li>
            <li>本测试仅供娱乐</li>
            <li>数据不会上传，完全本地运算</li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-xs text-gray-400 space-y-1">
        <p>
          原作者：<a href="https://space.bilibili.com/417038183" target="_blank" class="text-primary-600 hover:underline">B站@蛆肉儿串儿</a>
        </p>
        <p>
          开源地址：<a href="https://github.com/shshouse/SBTI" target="_blank" class="text-primary-600 hover:underline">GitHub</a>
        </p>
      </div>
    </div>
  </div>
</template>
