<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

const emit = defineEmits(['enviada'])

const modalEl = ref(null)
const formEl = ref(null)
const motivo = ref('')
const dias = ref(7)
const fecha = ref('')
const validado = ref(false)

const hoy = new Date().toISOString().slice(0, 10)
const restantes = computed(() => 300 - motivo.value.length)

let instanciaModal = null

onMounted(() => {
  instanciaModal = new Modal(modalEl.value)
})

onBeforeUnmount(() => {
  instanciaModal?.dispose()
  instanciaModal = null
})

function abrir() {
  validado.value = false
  instanciaModal?.show()
}

function cerrar() {
  instanciaModal?.hide()
}

function enviar() {
  if (!formEl.value.checkValidity()) {
    validado.value = true
    return
  }

  emit('enviada', {
    motivo: motivo.value.trim(),
    dias: Number(dias.value),
    fecha: fecha.value,
  })

  formEl.value.reset()
  motivo.value = ''
  dias.value = 7
  fecha.value = ''
  validado.value = false
  cerrar()
}

defineExpose({ abrir, cerrar })
</script>

<template>
  <Teleport to="body">
    <div
      ref="modalEl"
      class="modal fade"
      id="modal-prorroga"
      tabindex="-1"
      aria-labelledby="modal-prorroga-titulo"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form
            ref="formEl"
            class="needs-validation"
            :class="{ 'was-validated': validado }"
            novalidate
            @submit.prevent="enviar"
          >
            <div class="modal-header">
              <h2 id="modal-prorroga-titulo" class="modal-title h5">
                Nueva solicitud de prórroga
              </h2>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label for="prorroga-motivo" class="form-label">Motivo</label>
                <textarea
                  id="prorroga-motivo"
                  v-model.trim="motivo"
                  class="form-control"
                  rows="3"
                  maxlength="300"
                  minlength="10"
                  placeholder="Describe el motivo de la prórroga..."
                  required
                ></textarea>
                <div class="invalid-feedback">
                  Indica un motivo de al menos 10 caracteres.
                </div>
                <div class="form-text">{{ restantes }} caracteres restantes.</div>
              </div>

              <div class="row g-3">
                <div class="col-12 col-sm-5">
                  <label for="prorroga-dias" class="form-label">Días solicitados</label>
                  <input
                    id="prorroga-dias"
                    v-model.number="dias"
                    type="number"
                    class="form-control"
                    min="1"
                    max="30"
                    required
                  />
                  <div class="invalid-feedback">Solicita entre 1 y 30 días.</div>
                </div>

                <div class="col-12 col-sm-7">
                  <label for="prorroga-fecha" class="form-label">Nueva fecha límite</label>
                  <input
                    id="prorroga-fecha"
                    v-model="fecha"
                    type="date"
                    class="form-control"
                    :min="hoy"
                    required
                  />
                  <div class="invalid-feedback">Selecciona una fecha válida.</div>
                </div>
              </div>

              <p class="small text-secondary mt-3 mb-0">
                La solicitud será revisada por la coordinación académica.
              </p>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-send me-2"></i>Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
