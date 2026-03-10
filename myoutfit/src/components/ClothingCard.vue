<script setup>
import { useRouter } from 'vue-router'
import { CATEGORIES, STYLES } from '../lib/constants'

const props = defineProps({
  item: { type: Object, required: true },
})

const router = useRouter()

const categoryLabel = CATEGORIES.find(c => c.value === props.item.category)?.label || props.item.category
const styleLabel = STYLES.find(s => s.value === props.item.style)?.label || props.item.style
</script>

<template>
  <div
    class="card overflow-hidden cursor-pointer active:scale-95 transition-transform"
    @click="router.push(`/wardrobe/${item.id}/edit`)"
  >
    <div class="aspect-square bg-gray-100 relative">
      <img
        v-if="item.image_url"
        :src="item.image_url"
        :alt="item.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div
        v-if="!item.is_active"
        class="absolute inset-0 bg-black/40 flex items-center justify-center"
      >
        <span class="bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">Inactif</span>
      </div>
    </div>
    <div class="p-3">
      <p class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</p>
      <div class="flex items-center gap-1.5 mt-1 flex-wrap">
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ categoryLabel }}</span>
        <span v-if="item.style" class="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{{ styleLabel }}</span>
      </div>
    </div>
  </div>
</template>
