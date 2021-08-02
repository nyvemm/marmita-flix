<template>
  <div>
    <v-container v-if="!loading" class="mb-4">
      <h2 class="mb-4">{{ name }}</h2>
      <v-row class="content-row" no-gutters>
        <v-col class="content-block" md="2" sm="2" xs="6" v-for="content in contentData" :key="content.name" @click="changeDialog(content)">
          <div class="img-block">
            <img
              :src="content.img ? content.img : 'http://actar.com/wp-content/uploads/2015/12/nocover.jpg'"
              @error="handleImgError(content.img)"
            />
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
            <span class="content-name text-center px-3">{{ content.name }}</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="loading" v-else>
      <v-progress-circular indeterminate color="red" :size="70" :width="7"></v-progress-circular>
    </v-container>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="1200" class="dialog">
        <v-card height="300px" v-if="loadingDialog && !clickData.links">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div class="d-flex justify-center align-center" style="width: 100%; height: 300px">
            <h1>Houve um erro inesperado ao encontrar o link.</h1>
          </div>
        </v-card>
        <v-card class="pb-4" v-else-if="loadingDialog">
          <v-row class="mx-0 my-0">
            <v-col cols="12" lg="11" md="11" sm="11" order="1" order-sm="0" order-md="0" order-lg="0" order-xl="0">
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
                <v-card-text class="text-body-1"> <b>Sinopse: </b>{{ clickData.description }} </v-card-text>
                <div class="flex-column mx-4">
                  <div class="dialog-button-block" v-for="link in clickData.links" :key="link.name">
                    <v-row>
                      <v-col cols="12" sm="1" class="d-none d-sm-flex justify-end">
                        <v-btn class="mt-4 d-flex justify-center " @click="copyLink(link.url)">
                          <v-icon class="d-flex justify-center"> mdi-content-copy </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="11" class="d-flex justify-center justify-sm-start">
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
        <v-card class="d-flex justify-center align-center" height="300px" v-else>
          <v-progress-circular indeterminate color="red" :size="70" :width="7"></v-progress-circular>
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
      loadingDialog: false
    };
  },
  props: {
    fetch: Function,
    fetchLink: Function,
    max: Number,
    name: String,
    url: String,
    search: Boolean,
    directUrl: Boolean
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
      for (let i = 0; i < this.contentData.length; i++) {
        if (this.contentData[i].img === img) {
          this.contentData[i].img = "http://actar.com/wp-content/uploads/2015/12/nocover.jpg";
        }
      }
    },

    copyLink(magnet) {
      const clipboardData = window.clipboardData || navigator.clipboard;
      clipboardData.writeText(magnet);
    },

    async changeDialog(content) {
      if (this.directUrl) {
        this.openLink(content.url);
      } else {
        //Gtag Event
        this.$gtag.event("open-modal", {
          event_category: "modal",
          event_label: "Opened Model for: " + content.name,
          value: 1
        });

        this.clickData = content;
        this.loadingDialog = false;
        this.dialog = !this.dialog;

        const data = await this.fetchLink(content.url);
        if (data) {
          this.clickData.description = data.description;
          this.clickData.links = data.links;
        }

        this.loadingDialog = true;
      }
    },

    openLink(url) {
      //Gtag Event
      this.$gtag.event("download-link", {
        event_category: "download",
        event_label: "Downloaded Content: " + url,
        value: 1
      });

      window.open(url, "_self");
    }
  }
};
</script>

<style lang="scss" scoped>
$bp-two: 624px;
$bp-three: 930px;
$bp-four: 1400px;
$bp-five: 1921px;

@media screen and (min-width: $bp-three) and (max-width: 1270px) {
  .dialog-button-block {
    margin-left: 2em;
    display: flex;
    justify-content: center;
    button {
      max-width: calc((100vw - 24px) / 1.9);
      display: flex;
      justify-content: flex-start;

      span {
        max-width: calc((100vw - 24px) / 2.1);
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
      }
    }
  }
}
/* For dialog pane */

@media screen and (max-width: $bp-three) {
  .headline {
    display: flex;
    justify-content: center;

    span {
      width: calc((100vw - 24px));
    }
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
  .dialog-button-block {
    button {
      max-width: 742px;
      display: flex;
      justify-content: flex-start;
    }

    span {
      max-width: 700px;
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
}

/////////////////////////////////////////

$vw-2: calc((100vw - 100px) / 2);
$vh-2: calc(((100vw - 100px) / 2) * 1.5068493150684932);
@media screen and (max-width: $bp-two) {
  .container {
    margin: 16px 0 16px 0;
    padding: 0 50px;
  }

  .content-block {
    max-width: $vw-2;
    height: $vh-2 !important;

    .img-block {
      width: $vw-2;
      height: $vh-2;
      img {
        width: 100%;
        height: $vh-2;
      }
    }
    .content-info {
      max-width: $vw-2;
      .content-name {
        max-width: $vw-2;
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}

$vw-3: calc((100vw - 120px) / 3);
$vh-3: calc(((100vw - 120px) / 3) * 1.5068493150684932);
@media screen and (min-width: $bp-two) and (max-width: $bp-three) {
  .container {
    margin: 16px 0 16px 0;
    padding: 0 50px;
    max-width: $bp-five;
  }

  .content-block {
    max-width: $vw-3;
    height: $vh-3 !important;

    .img-block {
      width: $vw-3;
      height: $vh-3;
      img {
        width: 100%;
        height: $vh-3;
      }
    }
    .content-info {
      max-width: $vw-3;
      .content-name {
        max-width: $vw-3;
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}

$vw-4: calc((100vw - 130px) / 4);
$vh-4: calc(((100vw - 130px) / 4) * 1.5068493150684932);
@media screen and (min-width: $bp-three) and (max-width: $bp-four) {
  .container {
    margin: 16px 0 16px 0;
    padding: 0 50px;
    max-width: $bp-five;
  }

  .content-block {
    max-width: $vw-4;
    height: $vh-4 !important;

    .img-block {
      width: $vw-4;
      height: $vh-4;
      img {
        width: 100%;
        height: $vh-4;
      }
    }
    .content-info {
      max-width: $vw-4;
      .content-name {
        max-width: $vw-4;
      }
    }
    .content-rating {
      display: none !important;
    }
  }
}

$vw-5: calc((100vw - 150px) / 5);
$vh-5: calc(((100vw - 150px) / 5) * 1.5068493150684932);
@media screen and (min-width: $bp-four) and (max-width: $bp-five) {
  .container {
    margin: 16px 0 16px 0;
    padding: 0 50px;
    max-width: $bp-five;
  }

  .content-block {
    max-width: $vw-5;
    height: $vh-5 !important;

    .img-block {
      width: $vw-5;
      height: $vh-5;
      img {
        width: 100%;
        height: $vh-5;
      }
    }
    .content-info {
      max-width: $vw-5;
      .content-name {
        max-width: $vw-5;
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
