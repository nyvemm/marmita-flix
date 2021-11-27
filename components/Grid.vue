<template>
  <v-card class="pa-4">
    <v-row v-if="name">
      <v-col>{{ name }}</v-col>
    </v-row>
    <v-row justify="center">
      <v-col v-for="content in contentData" :key="content.name" cols="6" md="3">
        <v-sheet
          class="d-flex flex-column cursor pa-2"
          @click="changeDialog(content)"
        >
          <img
            style="max-width: 200px; width: 100%"
            class="mx-auto"
            :src="
              content.img ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
            "
          />
          <span class="content-name text-center px-3 mt-2">
            {{ content.name }}
          </span>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-if="$route.path === '/' && showPagination">
      <v-col align="center">
        <v-pagination
          v-model="page"
          :length="10"
          @input="handlePagination(page)"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="1200" :fullscreen="!getScreenSize">
      <v-card v-if="loadingDialog && !clickData.links">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div
          class="d-flex justify-center align-center"
          style="width: 100%; height: 300px"
        >
          <h1>Houve um erro inesperado ao encontrar o link.</h1>
        </div>
      </v-card>
      <v-card v-else-if="loadingDialog" class="pa-4">
        <v-row class="mx-0 my-0">
          <v-col cols="12" sm="11" order="1" order-sm="0">
            <span class="text-h6">
              {{ clickData.name }}
            </span>
          </v-col>
          <v-col
            cols="12"
            sm="1"
            order="0"
            order-sm="1"
            class="d-flex justify-end justify-md-center justify-sm-end align-center align-sm-start"
          >
            <v-btn icon dark large @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="dialog-row mx-4 mb-4">
          <v-col lg="3" md="4" cols="12" class="dialog-img">
            <img
              :src="clickData.img"
              :alt="clickData.name"
              style="width: 100%"
            />
          </v-col>
          <v-col lg="9" md="8" cols="12">
            <div class="px-md-5">
              <b>Sinopse:</b>
              {{ clickData.description }}
              <div class="flex-column">
                <div
                  v-for="link in clickData.links"
                  :key="link.name"
                  class="mt-8"
                >
                  <div class="d-flex flex-column">
                    <span class="font-weight-bold">{{ link.name }}</span>
                    <div class="d-flex">
                      <v-btn
                        class="mt-4 mr-2 d-flex justify-center"
                        @click="copyLink(link.url)"
                      >
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                      <v-btn
                        depressed
                        class="mt-4 mr-2 primary--text"
                        @click="openLink(link.url)"
                      >
                        <v-icon class="mr-2">mdi-download</v-icon>
                        <span>BAIXAR</span>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <v-card
        v-else
        class="d-flex justify-center align-center"
        min-height="300px"
        min-width="300px"
      >
        <v-progress-circular
          indeterminate
          color="red"
          :size="70"
          :width="7"
        ></v-progress-circular>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import movies from '@/scripts/movies'

export default {
  props: {
    fetch: Function,
    fetchLink: Function,
    max: Number,
    name: String,
    url: String,
    search: Boolean,
    directUrl: Boolean,
    showPagination: Boolean,
  },
  data() {
    return {
      contentData: [],
      loading: true,
      dialog: false,
      page: 1,
      clickData: {},
      loadingDialog: false,
    }
  },
  computed: {
    getScreenSize() {
      return this.$vuetify.breakpoint.mdAndUp
    },
  },
  created() {
    this.fetch(this.max, this.url).then((media) => {
      this.contentData = media
      this.loading = false

      if (this.contentData.length === 0) {
        this.$emit('noResults')
      }
    })
  },
  methods: {
    async handlePagination(page) {
      this.contentData = await movies.parseMovies(this.max, this.url, page)
    },
    handleImgError(img) {
      for (let i = 0; i < this.contentData.length; i++) {
        if (this.contentData[i].img === img) {
          this.contentData[i].img =
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
        }
      }
    },

    copyLink(magnet) {
      const clipboardData = window.clipboardData || navigator.clipboard
      clipboardData.writeText(magnet)
    },

    async changeDialog(content) {
      if (this.directUrl) {
        this.openLink(content.url)
      } else {
        // Gtag Event
        this.$gtag.event('open-modal', {
          event_category: 'modal',
          event_label: 'Opened Model for: ' + content.name,
          value: 1,
        })

        this.clickData = content
        this.loadingDialog = false
        this.dialog = !this.dialog

        const data = await this.fetchLink(content.url)
        if (data) {
          this.clickData.description = data.description
          this.clickData.links = data.links
        }

        this.loadingDialog = true
      }
    },

    openLink(url) {
      // Gtag Event
      this.$gtag.event('download-link', {
        event_category: 'download',
        event_label: 'Downloaded Content: ' + url,
        value: 1,
      })

      window.open(url, '_self')
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  border-radius: 8px;
}
</style>
