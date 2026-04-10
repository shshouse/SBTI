<script setup lang="ts">
import type { TestResult } from '~/stores/test'
import { typeImages } from '~/data/types'

const props = defineProps<{
  result: TestResult
}>()

const cardRef = ref<HTMLElement>()
const generating = ref(false)
const showToast = ref(false)

async function handleShare() {
  if (!cardRef.value || generating.value) return
  generating.value = true
  try {
    const { default: html2canvas } = await import('html2canvas-pro')
    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `SBTI-${props.result.finalType.code}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2000)
  } catch (e) {
    console.error('Share card generation failed:', e)
  } finally {
    generating.value = false
  }
}

async function handleCopyImage() {
  if (!cardRef.value || generating.value) return
  generating.value = true
  try {
    const { default: html2canvas } = await import('html2canvas-pro')
    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })
    canvas.toBlob(async (blob) => {
      if (blob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        showToast.value = true
        setTimeout(() => { showToast.value = false }, 2000)
      }
    }, 'image/png')
  } catch (e) {
    console.error('Copy to clipboard failed:', e)
  } finally {
    generating.value = false
  }
}

const imageSrc = computed(() => typeImages[props.result.finalType.code] || '')
</script>

<template>
  <div>
    <!-- Capturable card area -->
    <div
      ref="cardRef"
      class="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto shadow-sm border border-gray-100"
    >
      <div class="text-center mb-4">
        <span class="text-xs font-medium text-primary-600 tracking-wider uppercase">SBTI 人格测试结果</span>
      </div>

      <div v-if="imageSrc" class="flex justify-center mb-4">
        <img :src="imageSrc" :alt="result.finalType.cn" class="h-36 w-auto object-contain rounded-xl" />
      </div>

      <div class="text-center mb-3">
        <h2 class="text-2xl font-bold text-gray-900">{{ result.finalType.code }}</h2>
        <p class="text-base text-gray-500">{{ result.finalType.cn }}</p>
      </div>

      <p class="text-center text-sm text-gray-600 italic mb-4 leading-relaxed px-2">
        "{{ result.finalType.intro }}"
      </p>

      <div class="flex items-center justify-center gap-2 text-xs text-primary-700 bg-primary-50 rounded-full px-3 py-1.5 w-fit mx-auto">
        {{ result.badge }}
      </div>

      <div class="mt-4 pt-4 border-t border-gray-100 text-center">
        <p class="text-[11px] text-gray-400">扫码或搜索 SBTI 人格测试</p>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-center gap-3 mt-4">
      <button
        class="btn-secondary text-sm"
        :disabled="generating"
        @click="handleShare"
      >
        <Icon name="lucide:download" class="w-4 h-4 mr-1.5" />
        {{ generating ? '生成中...' : '保存图片' }}
      </button>
      <button
        class="btn-primary text-sm"
        :disabled="generating"
        @click="handleCopyImage"
      >
        <Icon name="lucide:copy" class="w-4 h-4 mr-1.5" />
        {{ generating ? '生成中...' : '复制到剪贴板' }}
      </button>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50"
      >
        操作成功
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
