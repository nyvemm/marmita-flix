<template>
  <div class="content_wrapper">
    <v-row>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="2">
        <Sidebar
          :fetch="parseAnimes"
          :fetchLink="getAnimeLink"
          :max="max"
          name="Animes"
        />
      </v-col>
      <v-col cols="12" md="8" class="px-5">
        <Grid
          :fetch="parseMovies"
          :fetchLink="getMovieLink"
          :max="max"
          showPagination
          name="Filmes"
        />
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="2">
        <Sidebar :fetch="parseGames" :max="max" name="Games" />
      </v-col>
    </v-row>

    <!-- <Grid
      :fetch="parseAnimes"
      :fetchLink="getAnimeLink"
      :max="max"
      name="Animes"
      :key="2"
    />
    <Grid
      :fetch="parseGames"
      :max="max"
      name="Jogos"
      :directUrl="true"
      :key="3"
    /> -->
  </div>
</template>

<script>
import Grid from '@/components/Grid'
import movies from '@/scripts/movies'
import animes from '@/scripts/animes'
import parseGames from '@/scripts/games'

export default {
  components: {
    Grid,
    Sidebar: () => import('@/components/Sidebar'),
  },
  data() {
    return {
      parseMovies: movies.parseMovies,
      getMovieLink: movies.getMovieLink,
      parseAnimes: animes.parseAnimes,
      getAnimeLink: animes.getAnimeLink,
      parseGames,
      max: 20,
    }
  },
}
</script>

<style lang="scss">
@import url(@/assets/scss/globals.scss);
</style>
