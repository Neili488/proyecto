<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { etiquetasRol } from '@/data/mockData'

const auth = useAuthStore()
const router = useRouter()

const rolEtiqueta = computed(() => etiquetasRol[auth.rol] ?? 'Invitado')

function cerrarSesion() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="navbar navbar-expand navbar-dark bg-primary shadow-sm sticky-top d-print-none">
    <div class="container-fluid">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
        <i class="bi bi-mortarboard-fill"></i>
        <span class="fw-semibold">Gestión de Tesis</span>
      </RouterLink>

      <div class="d-flex align-items-center gap-3 ms-auto">
        <span class="badge rounded-pill text-bg-light d-none d-sm-inline">
          {{ rolEtiqueta }}
        </span>

        <div class="dropdown">
          <button
            class="btn btn-light btn-sm d-flex align-items-center gap-2 dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span
              class="avatar-iniciales rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
            >
              {{ auth.usuario?.iniciales ?? '?' }}
            </span>
            <span class="d-none d-md-inline">{{ auth.usuario?.nombre }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li class="px-3 py-2">
              <div class="fw-semibold">{{ auth.usuario?.nombre }}</div>
              <small class="text-secondary">{{ auth.usuario?.correo }}</small>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item text-danger" type="button" @click="cerrarSesion">
                <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
