<script setup lang="ts">
import { useTestStore } from '~/stores/test'

const router = useRouter()
const store = useTestStore()

if (store.shuffledQuestions.length === 0) {
  store.startTest()
}

function handleSelect(questionId: string, value: number) {
  store.setAnswer(questionId, value)
}

function handleSubmit() {
  store.computeResult()
  router.push('/result')
}

function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8 pb-16">
    <!-- Header -->
    <div class="card p-5 mb-6">
      <div class="flex items-center justify-between gap-4 mb-4">
        <h2 class="text-lg font-bold text-gray-800">SBTI 人格测试</h2>
        <span class="text-xs text-gray-400">请依次作答</span>
      </div>
      <ProgressBar
        :progress="store.progress"
        :answered="store.answeredCount"
        :total="store.totalQuestions"
      />
    </div>

    <!-- Questions -->
    <div class="space-y-4">
      <TransitionGroup name="question-list" appear>
        <QuestionCard
          v-for="(q, i) in store.visibleQuestions"
          :key="q.id"
          :question="q"
          :index="i"
          :selected-value="store.answers[q.id]"
          :style="{ '--delay': `${Math.min(i * 40, 800)}ms` }"
          @select="handleSelect"
        />
      </TransitionGroup>
    </div>

    <!-- Bottom actions -->
    <div class="card p-5 mt-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p class="text-[13px] text-gray-400 leading-relaxed">
          {{ store.isComplete
            ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
            : '全选完才会放行。世界已经够乱了，起码把题做完整。'
          }}
        </p>
        <div class="flex gap-3 shrink-0">
          <button class="btn-secondary text-sm" @click="handleBack">
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-1.5" />
            返回首页
          </button>
          <button
            class="btn-primary text-sm"
            :disabled="!store.isComplete"
            @click="handleSubmit"
          >
            提交并查看结果
            <Icon name="lucide:arrow-right" class="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-list-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: var(--delay, 0ms);
}
.question-list-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.question-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.question-list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
