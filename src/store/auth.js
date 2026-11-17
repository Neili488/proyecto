import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usuariosDemo } from '@/data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const cargando = ref(false)

  const isAuthenticated = computed(() => Boolean(usuario.value))
  const rol = computed(() => usuario.value?.rol ?? null)

  function loginWithSSO({ correo, rol: rolSeleccionado }) {
    cargando.value = true

    return new Promise((resolve) => {
      setTimeout(() => {
        const base = usuariosDemo[rolSeleccionado] ?? usuariosDemo.estudiante
        usuario.value = {
          ...base,
          correo: correo?.trim() || base.correo,
        }
        cargando.value = false
        resolve(usuario.value)
      }, 1200)
    })
  }

  function logout() {
    usuario.value = null
  }

  return { usuario, cargando, isAuthenticated, rol, loginWithSSO, logout }
})
