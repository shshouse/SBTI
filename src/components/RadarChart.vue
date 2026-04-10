<script setup lang="ts">
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import type { DimensionKey } from '~/data/dimensions'
import { dimensionOrder, dimensionMeta } from '~/data/dimensions'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  rawScores: Record<DimensionKey, number>
}>()

const chartData = computed(() => ({
  labels: dimensionOrder.map(d => dimensionMeta[d].name.replace(/^(S\d|E\d|A\d|Ac\d|So\d)\s/, '')),
  datasets: [
    {
      label: '维度得分',
      data: dimensionOrder.map(d => props.rawScores[d]),
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'rgba(99, 102, 241, 0.7)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(99, 102, 241, 0.9)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const dim = dimensionOrder[ctx.dataIndex]
          return `${dimensionMeta[dim].name}: ${ctx.raw}分`
        },
      },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 6,
      ticks: {
        stepSize: 1,
        display: false,
      },
      pointLabels: {
        font: { size: 11 },
        color: '#6b7280',
      },
      grid: {
        color: 'rgba(0,0,0,0.06)',
      },
      angleLines: {
        color: 'rgba(0,0,0,0.06)',
      },
    },
  },
}))
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>
