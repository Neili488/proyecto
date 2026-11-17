<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, default: 0 },
  umbralAceptable: { type: Number, default: 15 },
  umbralCritico: { type: Number, default: 30 },
})

const porcentaje = computed(() => Math.min(Math.max(props.score, 0), 100))

const nivel = computed(() => {
  if (porcentaje.value < props.umbralAceptable) return 'bajo'
  if (porcentaje.value <= props.umbralCritico) return 'medio'
  return 'alto'
})

const estilos = {
  bajo: {
    texto: 'text-success',
    barra: 'bg-success',
    badge: 'text-bg-success',
    icono: 'bi-check-circle-fill',
    veredicto: 'Originalidad aceptable',
  },
  medio: {
    texto: 'text-warning',
    barra: 'bg-warning',
    badge: 'text-bg-warning',
    icono: 'bi-exclamation-triangle-fill',
    veredicto: 'Requiere revisión',
  },
  alto: {
    texto: 'text-danger',
    barra: 'bg-danger',
    badge: 'text-bg-danger',
    icono: 'bi-x-octagon-fill',
    veredicto: 'Similitud crítica',
  },
}

const estilo = computed(() => estilos[nivel.value])
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h6 mb-0">
        <i class="bi bi-shield-check me-2 text-primary"></i>Widget antiplagio
      </h2>
      <span class="badge" :class="estilo.badge">{{ estilo.veredicto }}</span>
    </div>
    <div class="card-body">
      <div class="d-flex align-items-end justify-content-between mb-2">
        <div>
          <div class="display-6 fw-bold lh-1" :class="estilo.texto">
            {{ porcentaje }}<span class="fs-5">%</span>
          </div>
          <div class="small text-secondary mt-1">similitud detectada</div>
        </div>
        <i :class="['bi', estilo.icono, estilo.texto, 'fs-3']" aria-hidden="true"></i>
      </div>

      <div
        class="progress"
        role="progressbar"
        :aria-valuenow="porcentaje"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Similitud detectada: ${porcentaje}%`"
        style="height: 0.5rem"
      >
        <div class="progress-bar" :class="estilo.barra" :style="{ width: `${porcentaje}%` }"></div>
      </div>

      <p class="small fw-semibold mt-2 mb-1" :class="estilo.texto">{{ estilo.veredicto }}</p>
      <p class="small text-secondary mb-0">
        Umbrales: &lt;15% aceptable, 15–30% en revisión, &gt;30% crítico.
      </p>
    </div>
  </div>
</template>
