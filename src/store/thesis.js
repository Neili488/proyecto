import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { tesisDemo } from '@/data/mockData'

export const useThesisStore = defineStore('thesis', () => {
  const dobleCiego = ref(true)
  const tesis = ref({ ...tesisDemo })

  const aliasEstudiante = computed(() => tesis.value.alias)
  const estadoActual = computed(() => tesis.value.estado)

  return { dobleCiego, tesis, aliasEstudiante, estadoActual }
})
