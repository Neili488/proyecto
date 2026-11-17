<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useThesisStore } from '@/store/thesis'
import { etiquetasEstado, estadosTesis } from '@/data/mockData'
import Stepper from '@/components/Stepper.vue'

const auth = useAuthStore()
const thesis = useThesisStore()

const esEvaluador = computed(() => ['docente', 'coordinador'].includes(auth.rol))
const estadoEtiqueta = computed(
  () => etiquetasEstado[thesis.tesis.estado] ?? thesis.tesis.estado,
)
</script>

<template>
  <div class="container-fluid py-2">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-1">
          {{ auth.rol === 'estudiante' ? 'Mi tesis' : 'Panel de tesis' }}
        </h1>
        <p class="text-secondary mb-0">Seguimiento del trabajo de grado.</p>
      </div>

      <span v-if="thesis.dobleCiego" class="badge text-bg-dark">
        <i class="bi bi-eye-slash me-1"></i>Doble ciego activo
      </span>
      <span v-else class="badge text-bg-warning">
        <i class="bi bi-eye me-1"></i>Identidad visible
      </span>
    </div>

    <div v-if="esEvaluador" class="card border-0 shadow-sm mb-4">
      <div
        class="card-body d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
      >
        <div>
          <h2 class="h6 mb-1">
            <i class="bi bi-incognito me-2 text-primary"></i>Modo doble ciego
          </h2>
          <p class="small text-secondary mb-0">
            Oculta nombres, correos y avatares del estudiante durante la evaluación.
          </p>
        </div>
        <div class="form-check form-switch m-0">
          <input
            id="switch-doble-ciego"
            v-model="thesis.dobleCiego"
            class="form-check-input"
            type="checkbox"
            role="switch"
          />
          <label class="form-check-label" for="switch-doble-ciego">
            {{ thesis.dobleCiego ? 'Activado' : 'Desactivado' }}
          </label>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info d-flex align-items-start gap-2" role="status">
      <i class="bi bi-shield-check mt-1"></i>
      <div>
        <strong>Doble ciego activo.</strong>
        <span class="d-block small">
          Tu identidad permanece oculta para los evaluadores durante la revisión.
        </span>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h2 class="h6 mb-0">
            <i class="bi bi-diagram-3 me-2 text-primary"></i>Fase de la tesis
          </h2>
          <span class="badge text-bg-primary">{{ estadoEtiqueta }}</span>
        </div>
        <Stepper :estados="estadosTesis" :actual="thesis.estadoActual" />
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h2 class="h6 mb-0">Información de la tesis</h2>
            <span class="badge text-bg-primary">{{ estadoEtiqueta }}</span>
          </div>
          <div class="card-body">
            <p class="small text-secondary mb-1">
              {{ thesis.tesis.id }} · {{ thesis.tesis.carrera }}
            </p>
            <h3 class="h5">{{ thesis.tesis.titulo }}</h3>
            <p class="text-secondary mb-0">{{ thesis.tesis.resumen }}</p>

            <h4 class="h6 text-uppercase text-secondary mt-4 mb-2">
              Identidad del estudiante
            </h4>
            <div class="d-flex align-items-center gap-3 rounded border bg-light p-3">
              <span
                v-if="!thesis.dobleCiego"
                class="avatar-iniciales avatar-lg rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
              >
                {{ thesis.tesis.estudiante.iniciales }}
              </span>
              <span
                v-else
                class="avatar-iniciales avatar-lg rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center"
              >
                EA
              </span>

              <div>
                <div v-if="!thesis.dobleCiego" class="fw-semibold">
                  {{ thesis.tesis.estudiante.nombre }}
                </div>
                <div v-else class="fw-semibold">{{ thesis.aliasEstudiante }}</div>

                <div v-if="!thesis.dobleCiego" class="small text-secondary">
                  {{ thesis.tesis.estudiante.correo }}
                </div>
                <div v-else class="small text-secondary">
                  Correo oculto por doble ciego
                </div>
              </div>
            </div>

            <dl class="row mt-4 mb-0 small">
              <dt class="col-sm-4 text-secondary">Asesor</dt>
              <dd class="col-sm-8">{{ thesis.tesis.asesor.nombre }}</dd>

              <dt class="col-sm-4 text-secondary">Correo del asesor</dt>
              <dd class="col-sm-8">{{ thesis.tesis.asesor.correo }}</dd>

              <dt class="col-sm-4 text-secondary">Fecha de inicio</dt>
              <dd class="col-sm-8">{{ thesis.tesis.fechaInicio }}</dd>

              <dt class="col-sm-4 text-secondary mb-0">Fecha límite</dt>
              <dd class="col-sm-8 mb-0">{{ thesis.tesis.fechaLimite }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-header bg-white py-3">
            <h2 class="h6 mb-0">
              <i class="bi bi-file-earmark-pdf me-2 text-danger"></i>Documento actual
            </h2>
          </div>
          <div class="card-body">
            <p class="fw-semibold mb-1">{{ thesis.tesis.documento.nombre }}</p>
            <p class="small text-secondary mb-3">
              Actualizado el {{ thesis.tesis.documento.actualizado }}
            </p>
            <RouterLink
              v-if="auth.rol === 'estudiante'"
              to="/subir"
              class="btn btn-outline-primary btn-sm w-100"
            >
              <i class="bi bi-cloud-arrow-up me-1"></i>Subir nueva versión
            </RouterLink>
            <span v-else class="badge text-bg-light w-100 py-2">Solo lectura</span>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3">
            <h2 class="h6 mb-0">
              <i class="bi bi-shield-lock me-2 text-primary"></i>Privacidad
            </h2>
          </div>
          <div class="card-body">
            <p class="small text-secondary mb-2">
              Con el doble ciego activo se ocultan al evaluador:
            </p>
            <ul class="list-unstyled small mb-0">
              <li class="mb-1"><i class="bi bi-check2-circle text-success me-2"></i>Nombre del estudiante</li>
              <li class="mb-1"><i class="bi bi-check2-circle text-success me-2"></i>Correo institucional</li>
              <li><i class="bi bi-check2-circle text-success me-2"></i>Avatar e iniciales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
