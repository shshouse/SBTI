<script setup lang="ts">
import { useHistory } from '~/composables/useHistory'
import type { HistoryRecord } from '~/composables/useHistory'
import { typeLibrary, typeImages } from '~/data/types'
import { dimensionOrder, dimensionMeta, dimensionExplanations, modelGroups } from '~/data/dimensions'
import type { DimensionKey, Level } from '~/data/dimensions'

const router = useRouter()
const { records, removeRecord, clearAll } = useHistory()

const expandedId = ref<string | null>(null)
const confirmClear = ref(false)

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function getTypeInfo(code: string) {
  return typeLibrary[code]
}

function getDimExplanation(dim: DimensionKey, level: string) {
  return dimensionExplanations[dim]?.[level as Level] ?? ''
}

function handleClearAll() {
  if (!confirmClear.value) {
    confirmClear.value = true
    setTimeout(() => { confirmClear.value = false }, 3000)
    return
  }
  clearAll()
  confirmClear.value = false
}

function levelColor(level: string) {
  switch (level) {
    case 'H': return 'text-primary-600 bg-primary-50'
    case 'M': return 'text-amber-600 bg-amber-50'
    case 'L': return 'text-gray-500 bg-gray-50'
    default: return 'text-gray-400 bg-gray-50'
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8 pb-16">
    <!-- Header -->
    <div class="card p-5 mb-6 fade-up" style="--delay: 0ms">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button class="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors" @click="router.push('/')">
            <Icon name="lucide:arrow-left" class="w-4 h-4 text-gray-500" />
          </button>
          <div>
            <h2 class="text-lg font-bold text-gray-800">历史记录</h2>
            <p class="text-xs text-gray-400 mt-0.5">共 {{ records.length }} 条记录 · 数据保存在本地</p>
          </div>
        </div>
        <button
          v-if="records.length > 0"
          class="text-xs px-3 py-1.5 rounded-lg transition-colors"
          :class="confirmClear ? 'bg-red-50 text-red-600 font-semibold' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
          @click="handleClearAll"
        >
          {{ confirmClear ? '确认清空？' : '清空全部' }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="records.length === 0" class="card p-12 text-center fade-up" style="--delay: 80ms">
      <Icon name="lucide:inbox" class="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p class="text-sm text-gray-400 mb-4">还没有测试记录</p>
      <button class="btn-primary text-sm" @click="router.push('/')">
        <Icon name="lucide:play" class="w-4 h-4 mr-1.5" />
        去测试
      </button>
    </div>

    <!-- Records -->
    <TransitionGroup name="record-list">
      <div
        v-for="(record, i) in records"
        :key="record.id"
        class="card mb-3 fade-up group overflow-hidden"
        :style="{ '--delay': `${Math.min(i * 60, 600)}ms` }"
      >
        <!-- Summary row (clickable) -->
        <div
          class="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
          @click="toggle(record.id)"
        >
          <div class="flex items-start gap-4">
            <!-- Type image -->
            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-50 to-white flex items-center justify-center shrink-0 overflow-hidden">
              <img
                v-if="typeImages[record.typeCode]"
                :src="typeImages[record.typeCode]"
                :alt="record.typeCn"
                class="w-14 h-14 object-contain"
              />
              <span v-else class="text-lg font-bold text-primary-400">{{ record.typeCode.charAt(0) }}</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 mb-1">
                <h3 class="text-base font-bold text-gray-800">{{ record.typeCode }}</h3>
                <span class="text-sm text-gray-500">{{ record.typeCn }}</span>
                <span v-if="record.special" class="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                  特殊
                </span>
              </div>
              <p class="text-xs text-gray-400 mb-2">{{ record.date }}</p>

              <!-- Dimension levels compact -->
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="dim in dimensionOrder"
                  :key="dim"
                  class="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  :class="levelColor(record.levels[dim])"
                  :title="dimensionMeta[dim].name"
                >
                  {{ dim }}:{{ record.levels[dim] }}
                </span>
              </div>
            </div>

            <!-- Expand / Delete -->
            <div class="flex items-center gap-1 shrink-0">
              <button
                class="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="删除此记录"
                @click.stop="removeRecord(record.id)"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
              <Icon
                name="lucide:chevron-down"
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedId === record.id }"
              />
            </div>
          </div>
        </div>

        <!-- Expanded detail panel -->
        <Transition name="expand">
          <div v-if="expandedId === record.id" class="border-t border-gray-100">
            <!-- Type intro -->
            <div v-if="getTypeInfo(record.typeCode)" class="px-5 pt-4 pb-2">
              <p class="text-sm text-gray-600 italic text-center mb-3">
                "{{ getTypeInfo(record.typeCode).intro }}"
              </p>
              <p class="text-[13px] leading-[1.8] text-gray-500">
                {{ getTypeInfo(record.typeCode).desc }}
              </p>
            </div>

            <!-- Radar chart -->
            <div class="px-5 py-4">
              <ClientOnly>
                <RadarChart :raw-scores="record.rawScores as any" />
              </ClientOnly>
            </div>

            <!-- Dimension details -->
            <div class="px-5 pb-5">
              <div v-for="group in modelGroups" :key="group.name" class="mb-4 last:mb-0">
                <div class="flex items-center gap-2 mb-2">
                  <Icon :name="group.icon" class="w-3.5 h-3.5 text-gray-400" />
                  <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ group.name }}</span>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="dim in group.dims"
                    :key="dim"
                    class="p-3 rounded-xl border border-gray-100 bg-white"
                  >
                    <div class="flex items-baseline justify-between gap-3 mb-1">
                      <span class="text-sm font-semibold text-gray-800">{{ dimensionMeta[dim].name }}</span>
                      <span
                        class="text-xs font-bold px-2 py-0.5 rounded-full border"
                        :class="levelColor(record.levels[dim]) + ' border-current/20'"
                      >
                        {{ record.levels[dim] }} / {{ record.rawScores[dim] }}分
                      </span>
                    </div>
                    <p class="text-[13px] leading-relaxed text-gray-500">
                      {{ getDimExplanation(dim, record.levels[dim]) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-up {
  animation: fadeUp 0.5s ease both;
  animation-delay: var(--delay, 0ms);
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.record-list-leave-active {
  transition: all 0.3s ease;
}
.record-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 3000px;
}
</style>
