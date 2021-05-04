<template>
  <div>
    <v-container v-if="!loading" class="mb-4">
      <h2 class="mb-4">{{ name }}</h2>
      <v-row class="content-row" no-gutters>
        <v-col
          class="content-block"
          md="2"
          sm="2"
          xs="6"
          v-for="content in contentData"
          :key="content.name"
          @click="changeDialog(content)"
        >
          <div class="img-block">
            <img :src="content.img" @error="handleImgError(content.img)" />
          </div>
          <div class="content-info">
            <span class="content-genre blue--text" v-if="content.genre"
              ><p>{{ content.genre }}</p></span
            >
            <v-rating
              v-model="content.rating"
              v-if="content.rating"
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              hover
              medium
              readonly
              class="d-flex justify-center mb-2 content-rating"
            ></v-rating>
            <span class="content-name text-center px-3">{{
              content.name
            }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="loading" v-else>
      <v-progress-circular
        indeterminate
        color="red"
        :size="70"
        :width="7"
      ></v-progress-circular>
    </v-container>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="1200" class="dialog">
        <v-card class="pb-4" v-if="loadingDialog">
          <v-card-title class="headline">
            {{ clickData.name }}
          </v-card-title>
          <v-row class="dialog-row mx-4">
            <v-col lg="3" md="4" xs="12" class="dialog-img">
              <img :src="clickData.img" :alt="clickData.name" />
            </v-col>
            <v-col lg="9" md="8" xs="12">
              <div>
                <v-card-text class="text-body-1">
                  <b>Sinopse: </b>{{ clickData.description }}
                </v-card-text>
                <div class="flex-column mx-4">
                  <div
                    class="dialog-button-block"
                    v-for="link in clickData.links"
                    :key="link.name"
                  >
                    <v-btn depressed class="mt-4" @click="openLink(link.url)">
                      <span>
                        {{ link.name }}
                      </span>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          class="d-flex justify-center align-center"
          height="300px"
          v-else
        >
          <v-progress-circular
            indeterminate
            color="red"
            :size="70"
            :width="7"
          ></v-progress-circular>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contentData: [],
      loading: true,
      dialog: false,

      clickData: {},
      loadingDialog: false,
    };
  },
  props: {
    fetch: Function,
    fetchLink: Function,
    max: Number,
    name: String,
    url: String,
    search: Boolean,
    directUrl: Boolean,
  },
  created() {
    this.fetch(this.max, this.url, this.search).then((media) => {
      this.contentData = media;
      this.loading = false;

      if (this.contentData.length === 0) {
        this.$emit("noResults");
      }
    });
  },
  methods: {
    handleImgError(img) {
      this.contentData = this.contentData.filter((x) => x.img !== img);
    },

    async changeDialog(content) {
      if (this.directUrl) {
        this.openLink(content.url);
      } else {
        this.clickData = content;
        this.loadingDialog = false;
        this.dialog = !this.dialog;

        const data = await this.fetchLink(content.url);
        this.clickData.description = data.description;
        this.clickData.links = data.links;
        this.loadingDialog = true;
      }
    },

    openLink(url) {
      window.open(url, "_self");
    },
  },
};
</script>


<style lang="scss" scoped>
$bp-two: 624px;
$bp-three: 930px;
$bp-four: 1400px;
$bp-five: 1921px;

/* For dialog pane */
@media screen and (max-width: $bp-three) {
  .headline {
    display: flex;
    justify-content: center;
  }
  .dialog-row {
    .dialog-img {
      display: flex;
      justify-content: center;
      img {
        max-width: calc((100vw - 24px) / 1.3);
        max-height: 430px;
        margin: 0 auto;
      }
    }
    .dialog-button-block {
      display: flex;
      justify-content: center;
      button {
        max-width: calc((100vw - 24px) / 1.3);
        display: flex;
        justify-content: flex-start;

        span {
          max-width: calc((100vw - 24px) / 1.5);
          white-space: nowrap;
          overflow: hidden !important;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .v-card__text {
    text-align: justify;
  }
}

@media screen and (min-width: $bp-three) {
  .dialog-img {
    img {
      width: 100%;
    }
  }
}

/////////////////////////////////////////

@media screen and (max-width: $bp-two) {
  .content-block {
    max-width: calc((100vw - 24px) / 2);
    max-height: calc(100vh / 2);

    .img-block {
      width: calc((100vw - 24px) / 2);
      height: calc(100vh / 2);
      img {
        width: calc((100vw - 24px) / 2);
        height: calc(100vh / 2);
      }
    }
    .content-info {
      max-width: calc((100vw - 24px) / 2);
      .content-name {
        max-width: calc((100vw - 24px) / 2);
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}
@media screen and (min-width: $bp-two) and (max-width: $bp-three) {
  .content-block {
    max-width: calc((100vw - 24px) / 3);
    max-height: calc(100vh / 2);

    .img-block {
      width: calc((100vw - 24px) / 3);
      height: calc(100vh / 2);
      img {
        width: calc((100vw - 24px) / 3);
        height: calc(100vh / 2);
      }
    }
    .content-info {
      max-width: calc((100vw - 24px) / 3);
      .content-name {
        max-width: calc((100vw - 24px) / 3);
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}

@media screen and (min-width: $bp-three) and (max-width: $bp-four) {
  .container {
    margin: 16px 0 8px 0;
    max-width: $bp-four;
  }
  .content-block {
    max-width: calc((100vw - 24px) / 4);
    max-height: calc(100vh / 2);

    .img-block {
      width: calc((100vw - 24px) / 4);
      height: calc(100vh / 2);
      img {
        width: calc((100vw - 24px) / 4);
        height: calc(100vh / 2);
      }
    }
    .content-info {
      max-width: calc((100vw - 24px) / 4);
      .content-name {
        max-width: calc((100vw - 24px) / 4);
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}

@media screen and (min-width: $bp-four) and (max-width: $bp-five) {
  .container {
    margin: 16px 0 16px 0;
    max-width: $bp-five;
  }
  .content-block {
    max-width: calc((100vw - 24px) / 5);
    max-height: calc(100vh / 2);

    .img-block {
      width: calc((100vw - 24px) / 5);
      height: calc(100vh / 2);
      img {
        width: calc((100vw - 24px) / 5);
        height: calc(100vh / 2);
      }
    }
    .content-info {
      max-width: calc((100vw - 24px) / 5);
      .content-name {
        max-width: calc((100vw - 24px) / 5);
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}

@media screen and (min-width: $bp-five) {
  .content-block {
    height: 440px;
    .img-block {
      width: 292px;
      height: 440px;
      img {
        width: 292px;
        height: 440px;
      }
    }
  }
}

.loading {
  width: 100vw;
  height: 500px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.content-row {
  .content-block {
    .img-block {
      cursor: pointer;
      img {
        filter: brightness(50%);
      }
    }

    .content-info {
      transform: translateY(-100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: 20px;

      .content-name {
        font-size: 1.5em;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
      }

      .content-genre {
        font-size: 1.2em;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
        text-align: center;
        p {
          color: #0feffd;
          background-color: rgba($color: #000000, $alpha: 0.5);
          padding: 0.5em;
          margin: 0;
          display: inline;
          border-radius: 15px;
        }
      }
    }
  }
}
</style>
