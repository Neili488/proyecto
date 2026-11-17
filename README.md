Paso 0 — Inicialización
npm create vite@latest . -- --template vue, instalar vue-router@4 pinia bootstrap bootstrap-icons, limpiar boilerplate, configurar main.js (importar bootstrap/dist/css/bootstrap.min.css, bootstrap-icons/font/bootstrap-icons.css, import * as bootstrap from 'bootstrap') y vite.config.js.
Paso 1 — RNF-07 Layout
App.vue con grilla (container-fluid/row/col), AppNavbar (brand + dropdown usuario) y AppSidebar (links filtrados por rol, offcanvas en móvil). Rutas registradas y guard en router/index.js.
Paso 2 — RF-01.1 Login
Login.vue centrado (row justify-content-center min-vh-100), card con form-control/btn-primary, botón "Iniciar sesión con SSO" que dispara auth.loginWithSSO() (simula redirección y setea usuario/rol). Redirección a /.
Paso 3 — RF-01.3 Doble Ciego
ref/store dobleCiego (default true). En PanelTesis los nombres, correos y avatares se envuelven en v-if="!dobleCiego", con alias anónimo (Estudiante A, avatar con iniciales) como fallback. Switch de demostración para el rol docente/coordinador.
Paso 4 — RF-02.1 / RF-02.2
Stepper.vue con props: estados[], actual; computeds para progress-bar %, badges (text-bg-success/secondary/primary) y conectores. En UploadForm, botón :disabled="estado === 'en_revision'" + alerta explicativa y title accesible.
Paso 5 — RF-03.2 / RF-03.3
PlagiarismScore.vue con props.score; computed nivel (<15 success, 15–30 warning, >30 danger) aplicada a text-* y bg-*, barra y veredicto. UploadForm.vue con objeto dc = { title, creator, subject, description, date, type, format, identifier, language, rights } en v-model, file ref y función buildFormData() que adjunta dc.* + archivo (con console.table/preview de campos para demostrar el FormData).
Paso 6 — RF-05.2 Prórrogas
ExtensionRequest.vue: card + botón que abre ExtensionRequestModal (instancia bootstrap.Modal), formulario motivo/días/fecha con validación Bootstrap; al enviar hace extensions.addSolicitud y muestra toast. ExtensionList.vue: tabla table table-striped table-hover del store, badges de estado y botones Aprobar/Rechazar maquetados.
Paso 7 — RF-06.1 Auditoría
AuditLog.vue: input-group de búsqueda con v-model + filtro sobre columnas (computed), table-responsive, paginación pagination con estado page/pageSize y 20+ filas mock.
Paso 8 — RF-06.2 Acta
ActaDefensa.vue: documento A4 simulado, encabezado institucional, tabla de jurado/calificaciones, firmas; d-print-block, botón "Imprimir" (window.print()), y en main.css @media print para ocultar navbar/sidebar/botones.
Paso 9 — Cierre
Prueba manual de todas las rutas y ambos roles, revisión responsive, npm run build para validar compilación. (No hay lint configurado; se puede añadir ESLint si se desea.)
Criterios de aceptación
- Cada RF/RNF tiene su componente y se navega desde el sidebar.
- npm run dev y npm run build sin errores.
- Doble ciego, bloqueo por estado y clases dinámicas de plagio funcionan con datos simulados.
- Acta imprime limpia (sin chrome del layout).