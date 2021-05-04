<template>
  <Grid :fetch="parseMovies" :fetchLink="getMovieLink" :max="-1" name="Lançamentos" />
</template>

<script>
import Grid from "@/components/Grid";
import movies from "@/scripts/movies";

export default {
  data() {
    return {
      parseMovies: movies.parseMovies,
      getMovieLink: movies.getMovieLink,
    };
  },
  components: {
    Grid,
  },
};
</script>