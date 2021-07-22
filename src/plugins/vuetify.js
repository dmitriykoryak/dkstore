import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ru from "@/utils/locale/ru";

Vue.use(Vuetify);

/**
 * vuetify Options
 */
let vuetifyOptions = {
  lang: {
    locales: { ru },
    current: "ru",
  },
  iconfont: "fa",
  theme: {
    themes: {
      light: {},
      dark: {},
    },
  },
};

export default new Vuetify(vuetifyOptions);
