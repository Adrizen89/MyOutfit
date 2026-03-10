<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    errorMsg.value = 'Email ou mot de passe incorrect.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center px-6 py-12 bg-gray-50">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900">MyOutfit</h1>
      <p class="text-gray-500 mt-2 text-sm">Ton dressing intelligent</p>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Connexion</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="ton@email.com"
            autocomplete="email"
            required
          />
        </div>

        <div>
          <label class="label">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="errorMsg" class="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <div class="mt-4 text-center">
        <RouterLink to="/forgot-password" class="text-sm text-primary-600 hover:underline">
          Mot de passe oublié ?
        </RouterLink>
      </div>
    </div>

    <p class="text-center text-sm text-gray-500 mt-6">
      Pas encore de compte ?
      <RouterLink to="/register" class="text-primary-600 font-semibold hover:underline">
        Créer un compte
      </RouterLink>
    </p>
  </div>
</template>
