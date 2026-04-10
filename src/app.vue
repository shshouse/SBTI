<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
