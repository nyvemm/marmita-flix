<template>
  <v-card class="pa-4">
    <v-row justify="center">
      <v-col>
        {{ name }}
      </v-col>
      <v-col v-for="content in contentData" :key="content.name" cols="12">
        <v-sheet
          class="d-flex flex-column cursor"
          @click="changeDialog(content)"
        >
          <img
            :src="
              content.img ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
            "
          />
          <span class="content-name text-center px-3">
            {{ content.name }}
          </span>
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="1200" class="dialog">
      <v-card v-if="loadingDialog && !clickData.links" height="300px">
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
      <v-card v-else-if="loadingDialog" class="pb-4">
        <v-row class="mx-0 my-0">
          <v-col cols="12">
            <v-card-title class="headline">
              <span>
                {{ clickData.name }}
              </span>
            </v-card-title>
          </v-col>
          <v-col
            cols="12"
            lg="1"
            md="1"
            sm="1"
            order="0"
            order-sm="1"
            order-md="1"
            order-lg="1"
            order-xl="1"
            class="d-flex justify-end justify-md-center justify-sm-end align-center align-sm-start"
          >
            <v-btn icon dark large @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="dialog-row mx-4 mb-4">
          <v-col lg="3" md="4" xs="12" class="dialog-img">
            <img :src="clickData.img" :alt="clickData.name" />
          </v-col>
          <v-col lg="9" md="8" xs="12">
            <div>
              <v-card-text class="text-body-1">
                <b>Sinopse:</b>
                {{ clickData.description }}
              </v-card-text>
              <div class="flex-column mx-4">
                <div
                  v-for="link in clickData.links"
                  :key="link.name"
                  class="dialog-button-block"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      sm="1"
                      class="d-none d-sm-flex justify-end"
                    >
                      <v-btn
                        class="mt-4 d-flex justify-center"
                        @click="copyLink(link.url)"
                      >
                        <v-icon class="d-flex justify-center">
                          mdi-content-copy
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="11"
                      class="d-flex justify-center justify-sm-start"
                    >
                      <v-btn depressed class="mt-4" @click="openLink(link.url)">
                        <span>
                          {{ link.name }}
                        </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else class="d-flex justify-center align-center" height="300px">
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
export default {
  props: {
    fetch: Function,
    fetchLink: Function,
    max: Number,
    name: String,
    url: String,
    search: Boolean,
    directUrl: Boolean,
  },
  data() {
    return {
      contentData: [],
      loading: true,
      dialog: false,

      clickData: {},
      loadingDialog: false,
    }
  },
  created() {
    this.fetch(this.max, this.url, this.search).then((media) => {
      this.contentData = media
      this.loading = false

      if (this.contentData.length === 0) {
        this.$emit('noResults')
      }
    })
  },
}
</script>

<style lang="scss" scoped></style>
