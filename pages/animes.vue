<template>
  <Grid
    :fetch="parseAnimes"
    :fetchLink="getAnimeLink"
    :max="-1"
    name="Lançamentos"
  />
</template>

<script>
import Grid from '@/components/Grid'
import animes from '@/scripts/animes'

export default {
  components: {
    Grid,
  },
  data() {
    return {
      parseAnimes: animes.parseAnimes,
      getAnimeLink: animes.getAnimeLink,
    }
  },
}
</script>
