<script setup>
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useThesisStore } from '@/store/thesis'
import { etiquetasEstado, estadosTesis } from '@/data/mockData'
import Stepper from '@/components/Stepper.vue'
import PlagiarismScore from '@/components/PlagiarismScore.vue'

const auth = useAuthStore()
const thesis = useThesisStore()

const estado = computed(() => thesis.estadoActual)
const estadoEtiqueta = computed(() => etiquetasEstado[estado.value] ?? estado.value)
const bloqueado = computed(() => estado.value === 'en_revision')
const tituloBoton = computed(() =>
  bloqueado.value
    ? 'No puedes subir documentos mientras la tesis está en revisión'
    : 'Subir el documento de la tesis',
)

const archivo = ref(null)
const puntajePlagio = ref(18)
const previewFormData = ref([])

const dc = reactive({
  title: thesis.tesis.titulo,
  creator: auth.usuario?.nombre ?? '',
  subject: thesis.tesis.carrera,
  description: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'Tesis de grado',
  format: 'application/pdf',
  identifier: thesis.tesis.id,
  language: 'es',
  rights: 'Acceso abierto',
})

function seleccionarArchivo(event) {
  archivo.value = event.target.files?.[0] ?? null
}

function buildFormData() {
  const formData = new FormData()

  Object.entries(dc).forEach(([campo, valor]) => {
    formData.append(`dc.${campo}`, valor ?? '')
  })

  if (archivo.value) {
    formData.append('archivo', archivo.value)
  }

  return formData
}

function previsualizarFormData() {
  const formData = buildFormData()
  const entradas = []

  formData.forEach((valor, campo) => {
    entradas.push({
      campo,
      valor:
        valor instanceof File
          ? `${valor.name} · ${(valor.size / 1024).toFixed(1)} KB`
          : valor || '—',
    })
  })

  console.table(entradas)
  previewFormData.value = entradas
}
</script>

<template>
  <div class="container-fluid py-2">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-1">Subir documento</h1>
        <p class="text-secondary mb-0">
          Carga una nueva versión del avance de tu tesis con sus metadatos.
        </p>
      </div>
      <span class="badge text-bg-primary">{{ estadoEtiqueta }}</span>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <h2 class="h6 mb-3">
          <i class="bi bi-diagram-3 me-2 text-primary"></i>Fase de la tesis
        </h2>
        <Stepper :estados="estadosTesis" :actual="thesis.estadoActual" />
      </div>
    </div>

    <div
      v-if="estado === 'en_revision'"
      id="aviso-bloqueo"
      class="alert alert-warning d-flex gap-2"
      role="alert"
    >
      <i class="bi bi-lock-fill mt-1"></i>
      <div>
        <strong>Subida bloqueada.</strong>
        La tesis se encuentra en revisión; no se pueden cargar nuevas versiones hasta que
        finalice esta etapa.
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3">
            <h2 class="h6 mb-0">
              <i class="bi bi-file-earmark-arrow-up me-2 text-primary"></i>Nueva versión
            </h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="previsualizarFormData">
              <div class="mb-4">
                <label for="archivo" class="form-label">Archivo de la tesis</label>
                <input
                  id="archivo"
                  type="file"
                  class="form-control"
                  accept=".pdf,.doc,.docx"
                  aria-describedby="archivo-ayuda"
                  @change="seleccionarArchivo"
                />
                <div id="archivo-ayuda" class="form-text">
                  Formatos permitidos: PDF, DOC o DOCX.
                  <span v-if="archivo">
                    Seleccionado: <strong>{{ archivo.name }}</strong>
                    ({{ (archivo.size / 1024).toFixed(1) }} KB).
                  </span>
                </div>
              </div>

              <hr class="my-4" />

              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <h3 class="h6 mb-1">Metadatos del documento</h3>
                  <p class="small text-secondary mb-0">
                    Campos alineados al estándar Dublin Core.
                  </p>
                </div>
                <span class="badge text-bg-light">Dublin Core</span>
              </div>

              <div class="row g-3">
                <div class="col-12">
                  <label for="dc-title" class="form-label">
                    Título <small class="text-secondary">dc:title</small>
                  </label>
                  <input
                    id="dc-title"
                    v-model="dc.title"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-12 col-md-6">
                  <label for="dc-creator" class="form-label">
                    Autor <small class="text-secondary">dc:creator</small>
                  </label>
                  <input
                    id="dc-creator"
                    v-model="dc.creator"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="col-12 col-md-6">
                  <label for="dc-subject" class="form-label">
                    Materia <small class="text-secondary">dc:subject</small>
                  </label>
                  <input id="dc-subject" v-model="dc.subject" type="text" class="form-control" />
                </div>

                <div class="col-12">
                  <label for="dc-description" class="form-label">
                    Descripción <small class="text-secondary">dc:description</small>
                  </label>
                  <textarea
                    id="dc-description"
                    v-model="dc.description"
                    class="form-control"
                    rows="3"
                    placeholder="Breve resumen del documento..."
                  ></textarea>
                </div>

                <div class="col-12 col-md-4">
                  <label for="dc-date" class="form-label">
                    Fecha <small class="text-secondary">dc:date</small>
                  </label>
                  <input id="dc-date" v-model="dc.date" type="date" class="form-control" />
                </div>

                <div class="col-12 col-md-4">
                  <label for="dc-type" class="form-label">
                    Tipo <small class="text-secondary">dc:type</small>
                  </label>
                  <select id="dc-type" v-model="dc.type" class="form-select">
                    <option>Tesis de grado</option>
                    <option>Artículo científico</option>
                    <option>Proyecto de investigación</option>
                  </select>
                </div>

                <div class="col-12 col-md-4">
                  <label for="dc-format" class="form-label">
                    Formato <small class="text-secondary">dc:format</small>
                  </label>
                  <select id="dc-format" v-model="dc.format" class="form-select">
                    <option value="application/pdf">PDF</option>
                    <option value="application/msword">DOC</option>
                    <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                      DOCX
                    </option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label for="dc-identifier" class="form-label">
                    Identificador <small class="text-secondary">dc:identifier</small>
                  </label>
                  <input
                    id="dc-identifier"
                    v-model="dc.identifier"
                    type="text"
                    class="form-control"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <label for="dc-language" class="form-label">
                    Idioma <small class="text-secondary">dc:language</small>
                  </label>
                  <select id="dc-language" v-model="dc.language" class="form-select">
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                    <option value="pt">Portugués</option>
                  </select>
                </div>

                <div class="col-12 col-md-3">
                  <label for="dc-rights" class="form-label">
                    Derechos <small class="text-secondary">dc:rights</small>
                  </label>
                  <select id="dc-rights" v-model="dc.rights" class="form-select">
                    <option>Acceso abierto</option>
                    <option>Acceso restringido</option>
                    <option>Confidencial</option>
                  </select>
                </div>
              </div>

              <div class="d-flex flex-wrap align-items-center gap-2 mt-4">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="estado === 'en_revision'"
                  :title="tituloBoton"
                  :aria-describedby="bloqueado ? 'aviso-bloqueo' : undefined"
                >
                  <i class="bi bi-cloud-arrow-up me-2"></i>Subir documento
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  title="Construye el FormData localmente sin enviarlo al servidor"
                  @click="previsualizarFormData"
                >
                  <i class="bi bi-code-square me-2"></i>Previsualizar FormData
                </button>
                <span v-if="bloqueado" class="small text-secondary">
                  El botón se habilita cuando la tesis salga del estado «En revisión».
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <PlagiarismScore :score="puntajePlagio" class="mb-3" />

        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body">
            <label for="simular-plagio" class="form-label small fw-semibold">
              Simulación del análisis (demo)
            </label>
            <input
              id="simular-plagio"
              v-model.number="puntajePlagio"
              type="range"
              class="form-range"
              min="0"
              max="60"
              step="1"
            />
            <div class="d-flex justify-content-between small text-secondary">
              <span>0%</span>
              <span>{{ puntajePlagio }}%</span>
              <span>60%</span>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white py-3">
            <h2 class="h6 mb-0">
              <i class="bi bi-info-circle me-2 text-primary"></i>Reglas de subida
            </h2>
          </div>
          <div class="card-body small text-secondary">
            <ul class="list-unstyled mb-0">
              <li class="mb-2">
                <i class="bi bi-check2-circle text-success me-2"></i>
                Puedes subir nuevas versiones en estado Borrador.
              </li>
              <li class="mb-2">
                <i class="bi bi-lock text-warning me-2"></i>
                Durante la Revisión la carga queda bloqueada.
              </li>
              <li>
                <i class="bi bi-arrow-repeat text-primary me-2"></i>
                Si la tesis es observada, podrás volver a subir correcciones.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="previewFormData.length" class="card border-0 shadow-sm mt-4">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h2 class="h6 mb-0">
          <i class="bi bi-code-square me-2 text-primary"></i>Vista previa del FormData
        </h2>
        <span class="badge text-bg-secondary">{{ previewFormData.length }} campos</span>
      </div>
      <div class="table-responsive">
        <table class="table table-sm table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Campo</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entrada in previewFormData" :key="entrada.campo">
              <td><code>{{ entrada.campo }}</code></td>
              <td class="text-break">{{ entrada.valor }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer bg-white small text-secondary">
        Construido con <code>FormData</code> nativo. Revisa también la consola del navegador
        (<code>console.table</code>). Esta demostración no envía datos al servidor.
      </div>
    </div>
  </div>
</template>
