<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  label: { type: String, required: true },
  style: { type: String, default: '' },
  variant: { type: Object, default: null },
  emoji: { type: String, default: '✨' },
})

const router = useRouter()

const pieces = props.variant
  ? [
      props.variant.top,
      props.variant.bottom,
      props.variant.shoes,
      props.variant.layer,
    ].filter(Boolean)
  : []
</script>

<template>
  <div
    class="card min-w-[220px] p-4 cursor-pointer active:scale-95 transition-transform"
    @click="router.push('/generate')"
  >
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xl">{{ emoji }}</span>
      <div>
        <p class="font-bold text-gray-900 text-sm leading-tight">{{ label }}</p>
        <p v-if="style" class="text-xs text-primary-600 capitalize">{{ style }}</p>
      </div>
    </div>

    <div v-if="pieces.length" class="grid grid-cols-2 gap-1.5">
      <div
        v-for="(piece, i) in pieces.slice(0, 4)"
        :key="i"
        class="aspect-square bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          v-if="piece.image_url"
          :src="piece.image_url"
          :alt="piece.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    <div v-else class="h-24 flex items-center justify-center text-center">
      <p class="text-xs text-gray-400">Ajoute des vêtements<br>pour voir une suggestion</p>
    </div>
  </div>
</template>
