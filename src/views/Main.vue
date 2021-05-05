<template>
  <div>
    <Grid
      :fetch="parseMovies"
      :fetchLink="getMovieLink"
      :max="max"
      name="Filmes"
      :key="1"
    />
    <Grid
      :fetch="parseAnimes"
      :fetchLink="getAnimeLink"
      :max="max"
      name="Animes"
      :key="2"
    />
    <!-- <Grid
      :fetch="parseGames"
      :max="max"
      name="Jogos"
      :directUrl="true"
      :key="3"
    /> -->
  </div>
</template>

<script>
import Grid from "@/components/Grid";
import movies from "@/scripts/movies";
import animes from "@/scripts/animes";
import parseGames from "@/scripts/games";

export default {
  data() {
    return {
      parseMovies: movies.parseMovies,
      getMovieLink: movies.getMovieLink,
      parseAnimes: animes.parseAnimes,
      getAnimeLink: animes.getAnimeLink,
      parseGames: parseGames,
      max: 0,
    };
  },
  components: {
    Grid,
  },
  created() {
    if (930 < window.innerWidth && window.innerWidth < 1400) {
      this.max = 4;
    } else if (1400 < window.innerWidth && window.innerWidth < 1921) {
      this.max = 5;
    } else {
      this.max = 6;
    }
  },
};
</script>