<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { etiquetasRol } from '@/data/mockData'

const auth = useAuthStore()

const rolEtiqueta = computed(() => etiquetasRol[auth.rol] ?? 'Invitado')

const indicadores = [
  { titulo: 'Estado de la tesis', valor: 'En revisión', icono: 'bi-diagram-3', clase: 'text-bg-primary' },
  { titulo: 'Avance del documento', valor: '60%', icono: 'bi-graph-up-arrow', clase: 'text-bg-info' },
  { titulo: 'Índice de plagio', valor: '12%', icono: 'bi-shield-check', clase: 'text-bg-success' },
  { titulo: 'Prórrogas activas', valor: '1', icono: 'bi-calendar-event', clase: 'text-bg-warning' },
]

const accesos = [
  { label: 'Mi tesis', to: '/tesis', icono: 'bi-journal-text', roles: ['estudiante', 'docente', 'coordinador'] },
  { label: 'Subir documento', to: '/subir', icono: 'bi-cloud-arrow-up', roles: ['estudiante'] },
  { label: 'Solicitar prórroga', to: '/prorrogas/solicitar', icono: 'bi-calendar-plus', roles: ['estudiante'] },
  { label: 'Gestionar prórrogas', to: '/prorrogas', icono: 'bi-calendar-check', roles: ['coordinador'] },
  { label: 'Auditoría', to: '/auditoria', icono: 'bi-clipboard-data', roles: ['coordinador', 'docente'] },
  { label: 'Acta de defensa', to: '/acta', icono: 'bi-file-earmark-text', roles: ['estudiante', 'docente', 'coordinador'] },
]

const accesosVisibles = computed(() =>
  accesos.filter((acceso) => acceso.roles.includes(auth.rol)),
)
</script>

<template>
  <div class="container-fluid py-2">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-1">Panel principal</h1>
        <p class="text-secondary mb-0">
          Bienvenido/a, {{ auth.usuario?.nombre }}.
        </p>
      </div>
      <span class="badge rounded-pill text-bg-primary">{{ rolEtiqueta }}</span>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="item in indicadores" :key="item.titulo" class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body d-flex align-items-center gap-3">
            <span
              class="rounded-circle d-inline-flex align-items-center justify-content-center fs-5"
              :class="item.clase"
              style="width: 3rem; height: 3rem"
            >
              <i :class="['bi', item.icono]"></i>
            </span>
            <div>
              <div class="small text-secondary">{{ item.titulo }}</div>
              <div class="fs-5 fw-semibold">{{ item.valor }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <h2 class="h6 mb-0">
          <i class="bi bi-lightning-charge me-2 text-primary"></i>Accesos rápidos
        </h2>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div v-for="acceso in accesosVisibles" :key="acceso.to" class="col-12 col-sm-6 col-lg-4">
            <RouterLink
              :to="acceso.to"
              class="btn btn-outline-primary w-100 d-flex align-items-center gap-2 text-start"
            >
              <i :class="['bi', acceso.icono]"></i>
              {{ acceso.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
