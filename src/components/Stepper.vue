<script setup>
import { computed } from 'vue'

const props = defineProps({
  estados: { type: Array, required: true },
  actual: { type: String, required: true },
})

const indiceActual = computed(() => {
  const indice = props.estados.findIndex(
    (estado) => clave(estado) === props.actual,
  )
  return indice === -1 ? 0 : indice
})

const progreso = computed(() => {
  if (props.estados.length <= 1) return 100
  return Math.round((indiceActual.value / (props.estados.length - 1)) * 100)
})

const etiquetaActual = computed(() => etiqueta(props.estados[indiceActual.value]))

function clave(estado) {
  return typeof estado === 'string' ? estado : estado.clave
}

function etiqueta(estado) {
  return typeof estado === 'string' ? estado : estado.etiqueta
}

function claseBadge(indice) {
  if (indice < indiceActual.value) return 'text-bg-success'
  if (indice === indiceActual.value) return 'text-bg-primary'
  return 'text-bg-secondary'
}

function claseConector(indice) {
  return indice < indiceActual.value ? 'bg-success' : 'bg-secondary-subtle'
}
</script>

<template>
  <div class="stepper">
    <div class="stepper-scroll">
      <div class="stepper-track d-flex align-items-start">
        <template v-for="(estado, indice) in estados" :key="clave(estado)">
          <div class="stepper-paso flex-shrink-0 text-center">
            <span
              class="stepper-badge badge rounded-circle d-inline-flex align-items-center justify-content-center"
              :class="claseBadge(indice)"
            >
              <i v-if="indice < indiceActual" class="bi bi-check-lg"></i>
              <span v-else>{{ indice + 1 }}</span>
            </span>
            <div
              class="small mt-2"
              :class="indice <= indiceActual ? 'fw-semibold text-dark' : 'text-secondary'"
            >
              {{ etiqueta(estado) }}
            </div>
          </div>

          <div
            v-if="indice < estados.length - 1"
            class="stepper-line flex-grow-1"
            :class="claseConector(indice)"
            aria-hidden="true"
          ></div>
        </template>
      </div>
    </div>

    <div
      class="progress mt-3"
      role="progressbar"
      :aria-valuenow="progreso"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Avance del proceso: ${progreso}%`"
      style="height: 0.5rem"
    >
      <div class="progress-bar bg-primary" :style="{ width: `${progreso}%` }"></div>
    </div>

    <p class="small text-secondary mt-2 mb-0">
      Fase actual: <strong class="text-dark">{{ etiquetaActual }}</strong>
      · {{ progreso }}% del proceso
    </p>
  </div>
</template>
