import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { layout: 'auth', titulo: 'Iniciar sesión' },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, titulo: 'Panel principal' },
  },
  {
    path: '/tesis',
    name: 'tesis',
    component: () => import('@/views/PanelTesis.vue'),
    meta: { requiresAuth: true, titulo: 'Mi tesis' },
  },
  {
    path: '/subir',
    name: 'subir',
    component: () => import('@/views/UploadForm.vue'),
    meta: { requiresAuth: true, roles: ['estudiante'], titulo: 'Subir documento' },
  },
  {
    path: '/prorrogas/solicitar',
    name: 'solicitar-prorroga',
    component: () => import('@/views/ExtensionRequest.vue'),
    meta: { requiresAuth: true, roles: ['estudiante'], titulo: 'Solicitar prórroga' },
  },
  {
    path: '/prorrogas',
    name: 'prorrogas',
    component: () => import('@/views/ExtensionList.vue'),
    meta: { requiresAuth: true, roles: ['coordinador'], titulo: 'Prórrogas' },
  },
  {
    path: '/auditoria',
    name: 'auditoria',
    component: () => import('@/views/AuditLog.vue'),
    meta: {
      requiresAuth: true,
      roles: ['coordinador', 'docente'],
      titulo: 'Auditoría',
    },
  },
  {
    path: '/acta',
    name: 'acta',
    component: () => import('@/views/ActaDefensa.vue'),
    meta: { requiresAuth: true, titulo: 'Acta de defensa' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.rol)) {
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.titulo
    ? `${to.meta.titulo} · Gestión de Tesis`
    : 'Gestión de Tesis'
})

export default router
