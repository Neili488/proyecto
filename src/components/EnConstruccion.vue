<script setup>
defineProps({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  icono: { type: String, default: 'bi-tools' },
})
</script>

<template>
  <div class="container-fluid py-2">
    <h1 class="h3 mb-3">{{ titulo }}</h1>
    <div class="card border-0 shadow-sm">
      <div class="card-body text-center py-5">
        <i :class="['bi', icono, 'display-4 text-primary']"></i>
        <p class="text-secondary mt-3 mb-3">{{ descripcion }}</p>
        <span class="badge text-bg-secondary">Pendiente de implementación</span>
      </div>
    </div>
  </div>
</template>
