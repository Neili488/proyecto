# AGENTS.md

## Stack & commands

- Vue 3 (`<script setup>`), Vite 8, JavaScript only (no TypeScript). Pinia 4, Vue Router 4, Bootstrap 5.3 + Bootstrap Icons.
- `npm install`, `npm run dev` (default port 5173), `npm run build`, `npm run preview`.
- There are no test, lint, typecheck, or format scripts. `npm run build` is the only automated check.
- `@` is aliased to `src` in `vite.config.js`; use `@/...` imports.
- Existing style: 2-space indent, single quotes, no semicolons. UI text is Spanish.

## Wiring

- `src/main.js` imports Bootstrap CSS/icons, `import 'bootstrap'`, global CSS, then Pinia and the router.
- Do not add `bootstrap/dist/js/bootstrap.bundle.min.js`; it duplicates the ESM Bootstrap already loaded. Use named imports in components (`import { Modal, Toast } from 'bootstrap'`).
- Routes and role gates live in `src/router/index.js`:
  - `/login` standalone; `/`, `/tesis`, `/acta` for any authenticated user.
  - `/subir` and `/prorrogas/solicitar` are student-only.
  - `/prorrogas` is coordinator-only.
  - `/auditoria` allows coordinator and docente.
  - Unknown routes and role mismatches redirect to `/`.
- `App.vue` renders auth routes alone and the navbar/sidebar shell for the rest. Sidebar items are filtered by role; below 768px it wraps as horizontal pills (not an offcanvas).

## State & data quirks

- All data is simulated in `src/data/mockData.js`; there is no backend, API, or network layer.
- Auth is in-memory only (no persistence): `loginWithSSO()` waits 1.2s, assigns `usuariosDemo[rol]`, and never checks a password. The login form's «Perfil institucional» select is the real role switch; after login it redirects to `?redirect` or `/`. A browser reload or direct URL load logs out, so exercise authenticated routes through in-app navigation.
- `store/thesis.js`: `dobleCiego` defaults to `true`; `estadoActual` is a read-only computed of `tesis.estado`. The mock state is `en_revision`, which intentionally disables the upload submit; change `tesisDemo.estado` in `mockData.js` to test other states. Upload blocks only `en_revision`, and `estadosTesis` has just 4 stages, so a state not in it (e.g. `observado`) makes `Stepper` fall back to index 0.
- `store/extensions.js` owns extension requests; new requests are prepended with `PR-###` IDs starting at `PR-004` (hardcoded `siguienteId = 4`).
- `UploadForm.vue`'s `buildFormData()` and its preview are local demo code; nothing is uploaded.

## Feature map

- Double-blind UI: `views/PanelTesis.vue` (`v-if="!thesis.dobleCiego"`); the switch is only shown to docente/coordinador.
- Stepper: `components/Stepper.vue` (`estados: [{ clave, etiqueta }]`, `actual`).
- Plagiarism levels: `components/PlagiarismScore.vue` (<15 success, 15–30 warning, >30 danger).
- Extensions: `views/ExtensionRequest.vue` plus `components/ExtensionRequestModal.vue` (Bootstrap `Modal` inside `Teleport`; parent calls `modalRef.abrir()`), and `views/ExtensionList.vue`.
- Audit: `views/AuditLog.vue` (client-side filtering and pagination).
- Acta: `views/ActaDefensa.vue`; A4/print rules are in `assets/styles/main.css`. Keep the `app-main` class in `App.vue` or print layout breaks.

## Verification

- Run `npm run build` after changes.
- Manual smoke path: log in as each demo role, verify sidebar visibility and route guards, student upload blocked, double-blind toggle, extension modal validation/toast, audit search/pagination, and acta print preview (navbar/sidebar/actions hidden).
- `README.md` is a chronological build log and partly stale (e.g. it mentions an offcanvas sidebar and a different Bootstrap import). Trust the source and `package.json` over it.
