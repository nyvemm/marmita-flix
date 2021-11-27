<template>
  <v-row class="nav-row py-6 content_wrapper mx-auto" align="center">
    <v-col cols="12" md="3" align="left">
      <img
        width="200"
        class="mx-auto d-block"
        src="@/assets/marmitaflix.png"
        @click="changeRoute('/')"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
      class="px-0 px-md-3 d-flex justify-space-between align-center"
    >
      <v-btn text to="/" :color="currentRoute === '/' ? 'primary' : ''">
        Inicio
      </v-btn>
      <v-btn
        text
        to="/movies"
        :class="currentRoute === '/movies' ? 'focus' : ''"
      >
        Filmes
      </v-btn>
      <v-btn
        text
        to="/animes"
        :class="currentRoute === '/animes' ? 'focus' : ''"
      >
        Animes
      </v-btn>
      <v-btn text to="/games" :class="currentRoute === '/games' ? 'focus' : ''">
        Jogos
      </v-btn>
    </v-col>

    <v-col cols="12" md="5" align="center">
      <v-text-field
        v-model="query"
        color="red"
        class="d-flex justify-center align-center text-input"
        filled
        rounded
        append-icon="mdi-magnify"
        label="Pesquisar"
        hide-details
        @click:append="redirect"
        @keyup.enter="redirect"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      expand: false,
      currentRoute: '',
      query: '',
    }
  },
  watch: {
    $route(to) {
      this.currentRoute = to.path
    },
  },
  created() {
    this.currentRoute = this.$router.history.current.path
  },
  methods: {
    changeRoute(route) {
      if (this.$router.history.current.path !== route) {
        // Gtag Event
        this.$gtag.event('change-route', {
          event_category: 'routes',
          event_label: 'Changed route to: ' + route,
          value: 1,
        })

        this.$router.push(route)
        this.query = ''
        this.expand = false
      }
    },
    redirect() {
      // Gtag Event
      this.$gtag.event('search', {
        event_category: 'search',
        event_label: 'Search query: ' + this.query,
        value: 1,
      })

      this.$router.push({ path: '/search', query: { q: this.query } })
    },
  },
}
</script>

<style lang="scss" scoped>
.v-text-field--rounded {
  border-radius: 8px !important;
}
</style>
