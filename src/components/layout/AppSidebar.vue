<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const route = useRoute()

const menu = [
  { label: 'Panel principal', to: '/', icon: 'bi-speedometer2' },
  { label: 'Mi tesis', to: '/tesis', icon: 'bi-journal-text' },
  {
    label: 'Subir documento',
    to: '/subir',
    icon: 'bi-cloud-arrow-up',
    roles: ['estudiante'],
  },
  {
    label: 'Solicitar prórroga',
    to: '/prorrogas/solicitar',
    icon: 'bi-calendar-plus',
    roles: ['estudiante'],
  },
  {
    label: 'Prórrogas',
    to: '/prorrogas',
    icon: 'bi-calendar-check',
    roles: ['coordinador'],
  },
  {
    label: 'Auditoría',
    to: '/auditoria',
    icon: 'bi-clipboard-data',
    roles: ['coordinador', 'docente'],
  },
  { label: 'Acta de defensa', to: '/acta', icon: 'bi-file-earmark-text' },
]

const items = computed(() =>
  menu.filter((item) => !item.roles || item.roles.includes(auth.rol)),
)

function estaActivo(to) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <aside class="col-12 col-md-3 col-lg-2 sidebar bg-white border-end p-3 d-print-none">
    <p class="text-uppercase text-secondary small fw-semibold mb-2">Navegación</p>
    <ul class="nav nav-pills flex-column gap-1">
      <li v-for="item in items" :key="item.to" class="nav-item">
        <RouterLink
          :to="item.to"
          class="nav-link d-flex align-items-center gap-2"
          :class="{ active: estaActivo(item.to) }"
        >
          <i :class="['bi', item.icon]"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>

    <div class="mt-4 pt-3 border-top small text-secondary d-none d-md-block">
      <i class="bi bi-info-circle me-1"></i>
      Fase 1 · Maquetación y lógica simulada
    </div>
  </aside>
</template>
