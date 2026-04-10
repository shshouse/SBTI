<script setup lang="ts">
import type { Level, DimensionKey } from '~/data/dimensions'
import { dimensionMeta, dimensionExplanations } from '~/data/dimensions'

const props = defineProps<{
  dim: DimensionKey
  level: Level
  score: number
}>()

const meta = computed(() => dimensionMeta[props.dim])
const explanation = computed(() => dimensionExplanations[props.dim][props.level])

const levelColor = computed(() => {
  switch (props.level) {
    case 'H': return 'text-primary-600 bg-primary-50 border-primary-100'
    case 'M': return 'text-amber-600 bg-amber-50 border-amber-100'
    case 'L': return 'text-gray-500 bg-gray-50 border-gray-100'
  }
})
</script>

<template>
  <div class="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow">
    <div class="flex items-baseline justify-between gap-3 mb-2">
      <h4 class="text-sm font-semibold text-gray-800">{{ meta.name }}</h4>
      <span class="text-xs font-bold px-2 py-0.5 rounded-full border" :class="levelColor">
        {{ level }} / {{ score }}分
      </span>
    </div>
    <p class="text-[13px] leading-relaxed text-gray-500">{{ explanation }}</p>
  </div>
</template>
