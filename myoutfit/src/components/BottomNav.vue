<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/dashboard', icon: 'home', label: 'Accueil' },
  { to: '/wardrobe', icon: 'wardrobe', label: 'Dressing' },
  { to: '/generate', icon: 'sparkles', label: 'Générer' },
  { to: '/outfits', icon: 'bookmark', label: 'Tenues' },
]

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 z-50">
    <div class="flex items-center justify-around py-2 px-4">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
        :class="isActive(link.to) ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'"
      >
        <!-- Home -->
        <svg v-if="link.icon === 'home'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <!-- Wardrobe -->
        <svg v-if="link.icon === 'wardrobe'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <!-- Sparkles -->
        <svg v-if="link.icon === 'sparkles'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <!-- Bookmark -->
        <svg v-if="link.icon === 'bookmark'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span class="text-[10px] font-medium">{{ link.label }}</span>
      </RouterLink>
    </div>
    <!-- safe area iOS -->
    <div class="h-safe-bottom bg-white" style="height: env(safe-area-inset-bottom)"></div>
  </nav>
  <!-- spacer -->
  <div class="h-20"></div>
</template>
