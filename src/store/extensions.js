import { ref } from 'vue'
import { defineStore } from 'pinia'
import { solicitudesDemo } from '@/data/mockData'

export const useExtensionsStore = defineStore('extensions', () => {
  const solicitudes = ref([...solicitudesDemo])

  let siguienteId = 4

  function addSolicitud({ motivo, dias, fecha, estudiante = 'Estudiante' }) {
    const nueva = {
      id: `PR-${String(siguienteId++).padStart(3, '0')}`,
      estudiante,
      motivo,
      dias,
      fecha,
      estado: 'pendiente',
      creada: new Date().toISOString().slice(0, 10),
    }

    solicitudes.value.unshift(nueva)
    return nueva
  }

  function actualizarEstado(id, estado) {
    const solicitud = solicitudes.value.find((item) => item.id === id)
    if (solicitud) {
      solicitud.estado = estado
    }
  }

  return { solicitudes, addSolicitud, actualizarEstado }
})
