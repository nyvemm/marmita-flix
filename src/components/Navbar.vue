<template>
  <div class="cbox">
    <div class="nav">
      <v-row class="nav-row ps-4">
        <v-col cols="3" class="d-flex justify-end align-center"
          ><img @click="changeRoute('/')" src="@/assets/marmitaflix.png" />
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-center align-center"
          @click="changeRoute('/')"
          ><span :class="currentRoute === '/' ? 'focus' : ''">Início</span>
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-center align-center"
          @click="changeRoute('/movies')"
          ><span :class="currentRoute === '/movies' ? 'focus' : ''"
            >Filmes</span
          >
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-center align-center"
          @click="changeRoute('/animes')"
          ><span :class="currentRoute === '/animes' ? 'focus' : ''"
            >Animes</span
          >
        </v-col>
        <v-col
          cols="1"
          class="d-flex justify-center align-center"
          @click="changeRoute('/games')"
          ><span :class="currentRoute === '/games' ? 'focus' : ''">Jogos</span>
        </v-col>
        <v-col cols="5" class="d-flex justify-center align-center">
          <v-scroll-x-transition>
            <v-col cols="11" v-show="expand">
              <v-text-field
                color="red"
                class="d-flex justify-center align-center text-input"
                v-model="query"
                v-on:keyup.enter="redirect"
              ></v-text-field>
            </v-col>
          </v-scroll-x-transition>
          <v-col cols="1" class="d-flex justify-center align-center">
            <v-btn icon @click="redirect">
              <v-icon large>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expand: false,
      currentRoute: "",
      query: "",
    };
  },
  watch: {
    $route(to) {
      this.currentRoute = to.path;
    },
  },
  created() {
    this.currentRoute = this.$router.history.current.path;
  },
  methods: {
    changeRoute(route) {
      if (this.$router.history.current.path !== route) {
        //Gtag Event
        this.$gtag.event("change-route", {
          event_category: "routes",
          event_label: "Changed route to: " + route,
          value: 1,
        });

        this.$router.push(route);
        this.query = "";
        this.expand = false;
      }
    },
    redirect() {
      if (this.expand) {
        //Gtag Event
        this.$gtag.event("search", {
          event_category: "search",
          event_label: "Search query: " + this.query,
          value: 1,
        });

        this.$router.push({ path: "/search", query: { q: this.query } });
      } else {
        this.expand = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 520px) {
  .cbox {
    display: block !important;
  }
  .nav {
    width: auto !important;
  }
  .nav-row {
    height: auto !important;
    display: grid;
    grid-template-columns: 50% 50%;
    margin: 0;

    div {
      width: 100%;
      max-width: 100%;
      padding: 0;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }

    div:first-child {
      grid-column: span 2;
    }

    div:last-child {
      grid-column: span 2;
      width: 75%;
      margin: 0 auto;

      div:last-child {
        padding: 15px;
      }
    }
  }
}

@media screen and (min-width: 520px) and (max-width: 1280px) {
  .cbox {
    display: block !important;
    .nav {
      width: auto !important;
      .nav-row {
        height: auto !important;
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
        margin: 0;

        div {
          width: 100%;
          max-width: 100%;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }

        div:first-child {
          grid-column: span 4;
        }

        div:last-child {
          grid-column: span 4;

          width: 75%;
          margin: 0 auto;
        }
      }
    }
  }
}

.cbox {
  display: flex;
  justify-content: center;
  .nav {
    width: 1400px;
    max-width: 1400px;
    .nav-row {
      flex-wrap: nowrap;
      .focus {
        color: #e50913;
        font-weight: bold;
      }
      img {
        height: 5vh;
        cursor: pointer;
      }
      .text-input {
        font-size: 1.5em;
        margin: 0;
      }
      span {
        font-size: 1.5em;
        cursor: pointer;
      }
      div {
        height: 10vh;
      }
    }
  }
}
</style>
