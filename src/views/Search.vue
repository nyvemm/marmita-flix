<template>
  <div>
    <div v-if="hasMovies || hasAnimes || hasGames">
      <v-tabs v-model="tab" background-color="transparent" color="white" grow>
        <v-tab v-if="hasMovies">Filmes</v-tab>
        <v-tab v-if="hasAnimes">Animes</v-tab>
        <v-tab v-if="hasGames">Jogos</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-if="hasMovies">
          <Grid
            :key="query"
            :fetch="parseMovies"
            :fetchLink="getMovieLink"
            :max="-1"
            :url="`https://media-api-nyvemm.vercel.app/api/movies?s=${this.query}`"
            v-on:noResults="hasMovies = false"
          />
        </v-tab-item>
        <v-tab-item v-if="hasAnimes">
          <Grid
            :key="query"
            :fetch="parseAnimes"
            :fetchLink="getAnimeLink"
            :max="-1"
            :url="`https://media-api-nyvemm.vercel.app/api/animes?s=${this.query}`"
            :search="true"
            v-on:noResults="hasAnimes = false"
          />
        </v-tab-item>
        <v-tab-item v-if="hasGames">
          <Grid
            :key="query"
            :fetch="parseGames"
            :max="-1"
            :url="`https://media-api-nyvemm.vercel.app/api/games?s=${this.query}`"
            :search="true"
            :directUrl="true"
            v-on:noResults="hasGames = false"
          />
        </v-tab-item>
      </v-tabs-items>
    </div>
    <div
      class="d-flex justify-center align-center container-no-results"
      style="width: 100vw; height: 90vh"
      v-else
    >
      <div class="d-flex flex-column no-results">
        <img src="@/assets/marmiteiro.svg" alt="Marmiteiro das galáxias" />
        <h1>A marmita ficou leve...</h1>
        <v-btn color="error" dark large @click="$router.push('/')">
          Voltar ao Início
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Grid from '@/components/Grid'
import movies from '@/scripts/movies'
import animes from '@/scripts/animes'
import parseGames from '@/scripts/games'

export default {
  data() {
    return {
      query: '',
      tab: null,

      hasAnimes: true,
      hasMovies: true,
      hasGames: true,

      parseAnimes: animes.parseAnimes,
      getAnimeLink: animes.getAnimeLink,
      parseMovies: movies.parseMovies,
      getMovieLink: movies.getMovieLink,
      parseGames: parseGames,
    }
  },
  components: {
    Grid,
  },
  watch: {
    $route(to) {
      this.query = to.query.q
      this.hasAnimes = true
      this.hasMovies = true
      this.hasGames = true
    },
  },

  created() {
    this.parseGames = parseGames
    const url = new URLSearchParams(window.location.search)
    this.query = url.get('q')
  },
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 650px) {
  .container-no-results {
    height: 70vh !important;
    .no-results {
      padding: 30px;

      img {
        width: calc((100vw - 24px) / 1.5) !important;
        margin: 0 auto;
      }
    }
  }
}

.no-results {
  h1 {
    text-align: center;
    margin-top: 10%;
  }
  button {
    margin-top: 5%;
    background: #ff040c !important;
  }
  img {
    width: calc((100vh - 24px) / 1.5);
  }
}
</style>
