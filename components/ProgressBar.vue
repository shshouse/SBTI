<script setup lang="ts">
const props = defineProps<{
  progress: number
  answered: number
  total: number
}>()
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <span class="text-sm text-gray-400 tabular-nums whitespace-nowrap">
      {{ answered }} / {{ total }}
    </span>
  </div>
</template>
