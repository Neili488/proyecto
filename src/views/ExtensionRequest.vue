<script setup>
import { computed, ref } from 'vue'
import { Toast } from 'bootstrap'
import { useAuthStore } from '@/store/auth'
import { useThesisStore } from '@/store/thesis'
import { useExtensionsStore } from '@/store/extensions'
import { etiquetasSolicitud, clasesSolicitud } from '@/data/mockData'
import ExtensionRequestModal from '@/components/ExtensionRequestModal.vue'

const auth = useAuthStore()
const thesis = useThesisStore()
const extensions = useExtensionsStore()

const modalRef = ref(null)
const toastEl = ref(null)

const misSolicitudes = computed(() =>
  extensions.solicitudes.filter(
    (solicitud) => solicitud.estudiante === auth.usuario?.nombre,
  ),
)

function manejarEnvio(payload) {
  extensions.addSolicitud({
    ...payload,
    estudiante: auth.usuario?.nombre ?? 'Estudiante',
  })

  if (toastEl.value) {
    Toast.getOrCreateInstance(toastEl.value).show()
  }
}
</script>

<template>
  <div class="container-fluid py-2">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-1">Solicitar prórroga</h1>
        <p class="text-secondary mb-0">
          Solicita una ampliación del plazo para entregar tu tesis.
        </p>
      </div>
      <span class="badge text-bg-primary">{{ misSolicitudes.length }} solicitudes</span>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex align-items-start gap-3">
              <span
                class="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0"
                style="width: 3rem; height: 3rem"
              >
                <i class="bi bi-calendar-plus"></i>
              </span>
              <div>
                <h2 class="h5 mb-1">Ampliación del plazo de entrega</h2>
                <p class="text-secondary mb-0">
                  Presenta una solicitud justificada. La coordinación revisará el caso y
                  notificará la decisión.
                </p>
              </div>
            </div>

            <dl class="row mt-4 mb-4 small">
              <dt class="col-sm-4 text-secondary">Tesis</dt>
              <dd class="col-sm-8">{{ thesis.tesis.id }} · {{ thesis.tesis.titulo }}</dd>

              <dt class="col-sm-4 text-secondary">Fecha límite actual</dt>
              <dd class="col-sm-8">{{ thesis.tesis.fechaLimite }}</dd>

              <dt class="col-sm-4 text-secondary mb-0">Plazo máximo</dt>
              <dd class="col-sm-8 mb-0">30 días por solicitud</dd>
            </dl>

            <button type="button" class="btn btn-primary" @click="modalRef?.abrir()">
              <i class="bi bi-plus-circle me-2"></i>Nueva solicitud
            </button>
          </div>
        </div>

        <div v-if="misSolicitudes.length" class="card border-0 shadow-sm mt-3">
          <div class="card-header bg-white py-3">
            <h2 class="h6 mb-0">
              <i class="bi bi-clock-history me-2 text-primary"></i>Mis solicitudes recientes
            </h2>
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="solicitud in misSolicitudes"
              :key="solicitud.id"
              class="list-group-item d-flex justify-content-between align-items-center gap-2"
            >
              <div>
                <div class="fw-semibold small">
                  {{ solicitud.id }} · {{ solicitud.dias }} días
                </div>
                <div class="small text-secondary">{{ solicitud.motivo }}</div>
              </div>
              <span class="badge" :class="clasesSolicitud[solicitud.estado]">
                {{ etiquetasSolicitud[solicitud.estado] }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3">
            <h2 class="h6 mb-0">
              <i class="bi bi-info-circle me-2 text-primary"></i>¿Cómo funciona?
            </h2>
          </div>
          <div class="card-body">
            <ol class="list-unstyled small mb-0">
              <li class="d-flex gap-2 mb-3">
                <span class="badge rounded-circle text-bg-primary">1</span>
                <span>Completa el formulario con el motivo y los días solicitados.</span>
              </li>
              <li class="d-flex gap-2 mb-3">
                <span class="badge rounded-circle text-bg-primary">2</span>
                <span>La coordinación académica revisa la solicitud.</span>
              </li>
              <li class="d-flex gap-2">
                <span class="badge rounded-circle text-bg-primary">3</span>
                <span>Recibes la notificación con la decisión.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <ExtensionRequestModal ref="modalRef" @enviada="manejarEnvio" />

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        ref="toastEl"
        class="toast align-items-center text-bg-success border-0"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-check-circle me-2"></i>Solicitud de prórroga enviada correctamente.
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Cerrar"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
