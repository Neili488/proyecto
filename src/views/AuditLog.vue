<script setup>
import { computed, ref, watch } from 'vue'
import { auditoriaDemo, clasesAccion } from '@/data/mockData'

const CAMPOS_BUSQUEDA = ['fecha', 'usuario', 'rol', 'accion', 'entidad', 'detalle']

const busqueda = ref('')
const page = ref(1)
const pageSize = ref(8)

function normalizar(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const filtrados = computed(() => {
  const termino = normalizar(busqueda.value.trim())

  if (!termino) return auditoriaDemo

  return auditoriaDemo.filter((registro) =>
    CAMPOS_BUSQUEDA.some((campo) => normalizar(registro[campo]).includes(termino)),
  )
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(filtrados.value.length / pageSize.value)),
)

const paginados = computed(() => {
  const inicio = (page.value - 1) * pageSize.value
  return filtrados.value.slice(inicio, inicio + pageSize.value)
})

const inicioRango = computed(() =>
  filtrados.value.length ? (page.value - 1) * pageSize.value + 1 : 0,
)

const finRango = computed(() =>
  Math.min(page.value * pageSize.value, filtrados.value.length),
)

watch([busqueda, pageSize], () => {
  page.value = 1
})

watch(totalPaginas, (total) => {
  if (page.value > total) page.value = total
})

function irA(pagina) {
  page.value = Math.min(Math.max(pagina, 1), totalPaginas.value)
}
</script>

<template>
  <div class="container-fluid py-2">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-1">Auditoría</h1>
        <p class="text-secondary mb-0">
          Trazabilidad de las acciones realizadas en el sistema.
        </p>
      </div>
      <span class="badge text-bg-secondary">{{ auditoriaDemo.length }} registros</span>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <div class="row g-2 align-items-center">
          <div class="col-12 col-lg-7">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                id="auditoria-busqueda"
                v-model="busqueda"
                type="search"
                class="form-control"
                placeholder="Buscar por usuario, rol, acción, entidad o detalle..."
                aria-label="Buscar en el registro de auditoría"
              />
              <button
                v-if="busqueda"
                type="button"
                class="btn btn-outline-secondary"
                aria-label="Limpiar búsqueda"
                @click="busqueda = ''"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div class="col-12 col-lg-5 d-flex justify-content-lg-end align-items-center gap-2">
            <label for="auditoria-page-size" class="small text-secondary text-nowrap">
              Filas por página
            </label>
            <select
              id="auditoria-page-size"
              v-model.number="pageSize"
              class="form-select form-select-sm w-auto"
            >
              <option :value="5">5</option>
              <option :value="8">8</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="25">25</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Usuario</th>
              <th scope="col">Rol</th>
              <th scope="col">Acción</th>
              <th scope="col">Entidad</th>
              <th scope="col">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in paginados" :key="registro.id">
              <td class="text-nowrap small text-secondary">{{ registro.fecha }}</td>
              <td class="fw-semibold">{{ registro.usuario }}</td>
              <td class="small text-secondary">{{ registro.rol }}</td>
              <td>
                <span class="badge" :class="clasesAccion[registro.tipo]">
                  {{ registro.accion }}
                </span>
              </td>
              <td><code>{{ registro.entidad }}</code></td>
              <td class="small">{{ registro.detalle }}</td>
            </tr>
            <tr v-if="!paginados.length">
              <td colspan="6" class="text-center text-secondary py-4">
                No se encontraron registros para «{{ busqueda }}».
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="card-footer bg-white d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2"
      >
        <span class="small text-secondary">
          Mostrando {{ inicioRango }}–{{ finRango }} de {{ filtrados.length }} registros
        </span>

        <nav aria-label="Paginación del registro de auditoría">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button type="button" class="page-link" @click="irA(page - 1)">
                Anterior
              </button>
            </li>
            <li
              v-for="numero in totalPaginas"
              :key="numero"
              class="page-item"
              :class="{ active: numero === page }"
            >
              <button
                type="button"
                class="page-link"
                :aria-current="numero === page ? 'page' : undefined"
                @click="irA(numero)"
              >
                {{ numero }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: page >= totalPaginas }">
              <button type="button" class="page-link" @click="irA(page + 1)">
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
