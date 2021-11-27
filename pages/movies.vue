<template>
  <div class="content_wrapper">
    <Grid
      :fetch="parseMovies"
      :fetchLink="getMovieLink"
      :max="-1"
      name="Lançamentos"
    />
  </div>
</template>

<script>
import Grid from '@/components/Grid'
import movies from '@/scripts/movies'

export default {
  components: {
    Grid,
  },
  data() {
    return {
      parseMovies: movies.parseMovies,
      getMovieLink: movies.getMovieLink,
    }
  },
}
</script>
