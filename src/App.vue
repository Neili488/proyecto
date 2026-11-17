<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
const esLayoutAuth = computed(() => route.meta.layout === 'auth')
</script>

<template>
  <RouterView v-if="esLayoutAuth" />

  <div v-else class="d-flex flex-column min-vh-100">
    <AppNavbar />
    <div class="container-fluid flex-grow-1">
      <div class="row">
        <AppSidebar />
        <main class="app-main col-12 col-md-9 col-lg-10 py-4 px-3 px-lg-4">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
