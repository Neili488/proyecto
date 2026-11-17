<script setup>
import { computed } from 'vue'
import { useExtensionsStore } from '@/store/extensions'
import { etiquetasSolicitud, clasesSolicitud } from '@/data/mockData'

const extensions = useExtensionsStore()

const solicitudes = computed(() => extensions.solicitudes)
const pendientes = computed(
  () => solicitudes.value.filter((solicitud) => solicitud.estado === 'pendiente').length,
)

function aprobar(id) {
  extensions.actualizarEstado(id, 'aprobada')
}

function rechazar(id) {
  extensions.actualizarEstado(id, 'rechazada')
}
</script>

<template>
  <div class="container-fluid py-2">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-1">Prórrogas</h1>
        <p class="text-secondary mb-0">
          Revisa y resuelve las solicitudes de ampliación de plazo.
        </p>
      </div>
      <span class="badge text-bg-warning">{{ pendientes }} pendientes</span>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <h2 class="h6 mb-0">
          <i class="bi bi-calendar-check me-2 text-primary"></i>Solicitudes recibidas
        </h2>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Estudiante</th>
              <th scope="col">Motivo</th>
              <th scope="col" class="text-center">Días</th>
              <th scope="col" class="text-nowrap">Nueva fecha</th>
              <th scope="col">Estado</th>
              <th scope="col" class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="solicitud in solicitudes" :key="solicitud.id">
              <td class="fw-semibold text-nowrap">{{ solicitud.id }}</td>
              <td>{{ solicitud.estudiante }}</td>
              <td class="motivo-col">{{ solicitud.motivo }}</td>
              <td class="text-center">{{ solicitud.dias }}</td>
              <td class="text-nowrap">{{ solicitud.fecha }}</td>
              <td>
                <span class="badge" :class="clasesSolicitud[solicitud.estado]">
                  {{ etiquetasSolicitud[solicitud.estado] }}
                </span>
              </td>
              <td class="text-end text-nowrap">
                <button
                  type="button"
                  class="btn btn-outline-success btn-sm me-1"
                  :disabled="solicitud.estado !== 'pendiente'"
                  :title="`Aprobar ${solicitud.id}`"
                  @click="aprobar(solicitud.id)"
                >
                  <i class="bi bi-check-lg me-1"></i>Aprobar
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  :disabled="solicitud.estado !== 'pendiente'"
                  :title="`Rechazar ${solicitud.id}`"
                  @click="rechazar(solicitud.id)"
                >
                  <i class="bi bi-x-lg me-1"></i>Rechazar
                </button>
              </td>
            </tr>
            <tr v-if="!solicitudes.length">
              <td colspan="7" class="text-center text-secondary py-4">
                No hay solicitudes registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
