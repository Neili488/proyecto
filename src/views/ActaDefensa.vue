<script setup>
import { computed } from 'vue'
import { useThesisStore } from '@/store/thesis'
import { actaDemo } from '@/data/mockData'

const thesis = useThesisStore()

const notaFinal = computed(() =>
  actaDemo.criterios
    .reduce((total, criterio) => total + criterio.nota * (criterio.ponderacion / 100), 0)
    .toFixed(1),
)

const resultado = computed(() => (Number(notaFinal.value) >= 14 ? 'Aprobado por unanimidad' : 'Desaprobado'))

const fechaLarga = computed(() =>
  new Date(`${actaDemo.fecha}T12:00:00`).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)

const firmas = computed(() => [
  ...actaDemo.jurado.map((miembro) => ({
    nombre: miembro.nombre,
    cargo: miembro.rol,
  })),
  {
    nombre: thesis.tesis.estudiante.nombre,
    cargo: 'Estudiante',
  },
])

function imprimir() {
  window.print()
}
</script>

<template>
  <div class="container-fluid py-2">
    <div
      class="d-print-none d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"
    >
      <div>
        <h1 class="h3 mb-1">Acta de defensa</h1>
        <p class="text-secondary mb-0">
          Vista previa del acta legal. Usa el botón para imprimir o guardar como PDF.
        </p>
      </div>
      <button type="button" class="btn btn-primary" @click="imprimir">
        <i class="bi bi-printer me-2"></i>Imprimir
      </button>
    </div>

    <div class="d-flex justify-content-center">
      <article class="acta-documento d-print-block" aria-label="Acta de defensa de tesis">
        <header class="text-center border-bottom border-2 pb-3 mb-4">
          <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2 gap-sm-3">
            <i class="bi bi-mortarboard-fill fs-1" aria-hidden="true"></i>
            <div>
              <h2 class="h5 mb-1 text-uppercase">Universidad Nacional de Ciencias Aplicadas</h2>
              <p class="mb-0 small">Facultad de Ingeniería · Comité de Trabajos de Grado</p>
            </div>
          </div>
          <p class="small text-secondary mt-3 mb-0">
            Acta N.º {{ actaDemo.numero }} · Registro institucional
          </p>
        </header>

        <h3 class="h5 text-center text-uppercase mb-4">Acta de defensa de trabajo de grado</h3>

        <p class="small mb-4">
          En la ciudad de Lima, siendo las {{ actaDemo.hora }} horas del {{ fechaLarga }}, se
          reunieron los miembros del jurado evaluador con el fin de presenciar y calificar la
          defensa pública del trabajo de grado que se detalla a continuación.
        </p>

        <section class="mb-4 acta-tabla">
          <h4 class="h6 text-uppercase border-bottom pb-1 mb-2">1. Datos del trabajo de grado</h4>
          <table class="table table-sm table-borderless align-middle mb-0">
            <tbody>
              <tr>
                <th class="acta-etiqueta">Título</th>
                <td>{{ thesis.tesis.titulo }}</td>
              </tr>
              <tr>
                <th class="acta-etiqueta">Estudiante</th>
                <td>
                  {{ thesis.tesis.estudiante.nombre }} ·
                  {{ thesis.tesis.estudiante.correo }}
                </td>
              </tr>
              <tr>
                <th class="acta-etiqueta">Programa</th>
                <td>{{ thesis.tesis.carrera }}</td>
              </tr>
              <tr>
                <th class="acta-etiqueta">Asesor</th>
                <td>{{ thesis.tesis.asesor.nombre }}</td>
              </tr>
              <tr>
                <th class="acta-etiqueta">Modalidad</th>
                <td>{{ actaDemo.modalidad }}</td>
              </tr>
              <tr>
                <th class="acta-etiqueta">Fecha y hora</th>
                <td>{{ fechaLarga }} · {{ actaDemo.hora }}</td>
              </tr>
              <tr>
                <th class="acta-etiqueta">Lugar</th>
                <td>{{ actaDemo.lugar }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="mb-4 acta-tabla">
          <h4 class="h6 text-uppercase border-bottom pb-1 mb-2">2. Jurado evaluador</h4>
          <div class="table-responsive">
            <table class="table table-sm table-bordered align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col">Rol</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Cargo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="miembro in actaDemo.jurado" :key="miembro.nombre">
                  <td>{{ miembro.rol }}</td>
                  <td>{{ miembro.nombre }}</td>
                  <td>{{ miembro.cargo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mb-4 acta-tabla">
          <h4 class="h6 text-uppercase border-bottom pb-1 mb-2">3. Calificación</h4>
          <div class="table-responsive">
            <table class="table table-sm table-bordered align-middle mb-2">
              <thead class="table-light">
                <tr>
                  <th scope="col">Criterio</th>
                  <th scope="col" class="text-center">Ponderación</th>
                  <th scope="col" class="text-center">Nota (0–20)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="criterio in actaDemo.criterios" :key="criterio.criterio">
                  <td>{{ criterio.criterio }}</td>
                  <td class="text-center">{{ criterio.ponderacion }}%</td>
                  <td class="text-center">{{ criterio.nota }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="table-light fw-semibold">
                  <th colspan="2" class="text-end">Nota final ponderada</th>
                  <th class="text-center">{{ notaFinal }}</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <p class="small mb-0">
            <strong>Resultado:</strong>&nbsp;<span class="text-success fw-semibold">{{ resultado }}</span>
            · Escala vigesimal.
          </p>
        </section>

        <section class="mb-4">
          <h4 class="h6 text-uppercase border-bottom pb-1 mb-2">4. Observaciones</h4>
          <p class="small mb-0">{{ actaDemo.observaciones }}</p>
        </section>

        <section class="acta-firmas mt-5">
          <div class="row g-4 text-center">
            <div v-for="firma in firmas" :key="firma.nombre" class="col-12 col-sm-6">
              <div class="acta-linea-firma"></div>
              <div class="small fw-semibold">{{ firma.nombre }}</div>
              <div class="small text-secondary">{{ firma.cargo }}</div>
            </div>
          </div>
        </section>

        <footer class="mt-5 pt-3 border-top small text-secondary">
          <div class="d-flex flex-column flex-sm-row justify-content-between gap-2">
            <span>Documento emitido electrónicamente por el Sistema de Gestión de Tesis.</span>
            <span>Código de verificación: <code>{{ actaDemo.codigo }}</code></span>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>
