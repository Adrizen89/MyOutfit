<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import BottomNav from './components/BottomNav.vue'

const auth = useAuthStore()
const route = useRoute()

const showNav = computed(() => auth.user && !route.meta.guest)
</script>

<template>
  <div class="page-container">
    <RouterView />
    <BottomNav v-if="showNav" />
  </div>
</template>
