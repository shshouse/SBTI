<script setup lang="ts">
import type { Question, SpecialQuestion } from '~/data/questions'

const props = defineProps<{
  question: Question | SpecialQuestion
  index: number
  selectedValue?: number
}>()

const emit = defineEmits<{
  select: [questionId: string, value: number]
}>()

const optionLetters = ['A', 'B', 'C', 'D']
</script>

<template>
  <article class="card p-5 transition-all duration-200">
    <div class="flex items-center justify-between mb-3">
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-3 py-1">
        {{ index + 1 }}
      </span>
      <span v-if="'special' in question && question.special" class="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
        补充题
      </span>
    </div>

    <p class="text-[15px] leading-relaxed text-gray-800 mb-4 whitespace-pre-wrap">
      {{ question.text }}
    </p>

    <div class="space-y-2.5">
      <label
        v-for="(opt, i) in question.options"
        :key="i"
        class="group flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150"
        :class="selectedValue === opt.value
          ? 'border-primary-300 bg-primary-50/60 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'"
      >
        <input
          type="radio"
          :name="question.id"
          :value="opt.value"
          :checked="selectedValue === opt.value"
          class="mt-0.5 accent-primary-600 scale-110 shrink-0"
          @change="emit('select', question.id, opt.value)"
        />
        <span
          class="text-xs font-bold shrink-0 w-5 mt-0.5"
          :class="selectedValue === opt.value ? 'text-primary-600' : 'text-gray-400'"
        >
          {{ optionLetters[i] }}
        </span>
        <span class="text-sm leading-relaxed" :class="selectedValue === opt.value ? 'text-primary-800' : 'text-gray-600'">
          {{ opt.label }}
        </span>
      </label>
    </div>
  </article>
</template>
