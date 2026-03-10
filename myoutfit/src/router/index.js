import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    component: () => import('../views/auth/ForgotPasswordView.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wardrobe',
    component: () => import('../views/WardrobeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wardrobe/add',
    component: () => import('../views/AddClothingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wardrobe/:id/edit',
    component: () => import('../views/EditClothingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/generate',
    component: () => import('../views/GenerateOutfitView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/outfits',
    component: () => import('../views/SavedOutfitsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.user) {
    return '/login'
  }
  if (to.meta.guest && auth.user) {
    return '/dashboard'
  }
})

export default router
