<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { usuariosDemo, etiquetasRol } from '@/data/mockData'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const opciones = Object.keys(usuariosDemo)
const clave = ref('estudiante')
const correo = ref(usuariosDemo[clave.value].correo)
const errorCorreo = ref('')

const correoValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()))

watch(clave, (nuevaClave) => {
  correo.value = usuariosDemo[nuevaClave]?.correo ?? ''
  errorCorreo.value = ''
})

async function iniciarSesion() {
  if (!correoValido.value) {
    errorCorreo.value = 'Ingresa un correo institucional válido.'
    return
  }

  errorCorreo.value = ''
  await auth.loginWithSSO({ correo: correo.value, rol: clave.value })

  const destino = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(destino)
}
</script>

<template>
  <div class="login-fondo min-vh-100">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100 py-4">
        <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div class="card shadow-lg border-0 login-card">
            <div class="card-body p-4 p-sm-5">
              <div class="text-center mb-4">
                <i class="bi bi-mortarboard-fill display-5 text-primary"></i>
                <h1 class="h4 mt-3 mb-1">Gestión de Tesis</h1>
                <p class="text-secondary mb-0">Portal institucional</p>
              </div>

              <div class="alert alert-light border d-flex align-items-start gap-2 small" role="note">
                <i class="bi bi-shield-lock text-primary mt-1"></i>
                <span>Serás redirigido al proveedor de identidad de la universidad.</span>
              </div>

              <form novalidate @submit.prevent="iniciarSesion">
                <div class="mb-3">
                  <label for="correo" class="form-label">Correo institucional</label>
                  <input
                    id="correo"
                    v-model="correo"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errorCorreo }"
                    placeholder="nombre@universidad.edu"
                    autocomplete="email"
                    :disabled="auth.cargando"
                    @input="errorCorreo = ''"
                  />
                  <div v-if="errorCorreo" class="invalid-feedback">{{ errorCorreo }}</div>
                </div>

                <div class="mb-4">
                  <label for="rol" class="form-label">Perfil institucional</label>
                  <select
                    id="rol"
                    v-model="clave"
                    class="form-select"
                    :disabled="auth.cargando"
                  >
                    <option v-for="opcion in opciones" :key="opcion" :value="opcion">
                      {{ etiquetasRol[opcion] }} · {{ usuariosDemo[opcion].nombre }}
                    </option>
                  </select>
                  <div class="form-text">Selecciona el perfil simulado para la demostración.</div>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="auth.cargando">
                  <span
                    v-if="auth.cargando"
                    class="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ auth.cargando ? 'Redirigiendo al proveedor…' : 'Iniciar sesión con SSO' }}
                </button>
              </form>

              <p class="small text-secondary text-center mt-4 mb-0">
                Simulación de SSO: no se envía información a un proveedor real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
