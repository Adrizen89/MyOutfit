<script setup>
defineProps({
  item: { type: Object, required: true },
  role: { type: String, required: true },
})
</script>

<template>
  <div class="bg-gray-50 rounded-xl overflow-hidden">
    <div class="aspect-square bg-gray-100">
      <img
        v-if="item.image_url"
        :src="item.image_url"
        :alt="item.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    <div class="px-2.5 py-2">
      <p class="text-[10px] font-medium text-primary-600 uppercase tracking-wide">{{ role }}</p>
      <p class="text-xs font-semibold text-gray-800 truncate mt-0.5">{{ item.name }}</p>
    </div>
  </div>
</template>
