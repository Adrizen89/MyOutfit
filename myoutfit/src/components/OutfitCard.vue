<script setup>
import { STYLES, SEASONS } from '../lib/constants'

const props = defineProps({
  outfit: { type: Object, required: true },
})

defineEmits(['delete'])

const styleLabel = STYLES.find(s => s.value === props.outfit.style)?.label || props.outfit.style
const seasonLabel = SEASONS.find(s => s.value === props.outfit.season)?.label || props.outfit.season

const images = props.outfit.outfit_items
  ?.slice(0, 4)
  .map(i => i.clothes?.image_url)
  .filter(Boolean) || []
</script>

<template>
  <div class="card p-4">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="font-semibold text-gray-900">{{ outfit.name }}</h3>
        <div class="flex gap-1.5 mt-1">
          <span v-if="styleLabel" class="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{{ styleLabel }}</span>
          <span v-if="seasonLabel" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ seasonLabel }}</span>
        </div>
      </div>
      <button
        class="text-gray-400 hover:text-red-500 transition-colors p-1"
        @click="$emit('delete', outfit.id)"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-4 gap-1.5">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="aspect-square bg-gray-100 rounded-lg overflow-hidden"
      >
        <img :src="img" class="w-full h-full object-cover" :alt="`piece ${i + 1}`" />
      </div>
      <div
        v-for="i in Math.max(0, Math.min(4, outfit.outfit_items?.length || 0) - images.length)"
        :key="`empty-${i}`"
        class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <p class="text-xs text-gray-400 mt-3">
      {{ outfit.outfit_items?.length || 0 }} pièce{{ (outfit.outfit_items?.length || 0) > 1 ? 's' : '' }}
    </p>
  </div>
</template>
