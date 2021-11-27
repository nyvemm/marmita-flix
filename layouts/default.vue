<template>
  <v-app dark>
    <v-main class="px-5">
      <Navbar />
      <nuxt />
    </v-main>
  </v-app>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
  background: #121212;
}

.content_wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}
</style>
