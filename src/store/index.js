import Vue from "vue";
import Vuex from "vuex";
import common from "@/store/common.js";
import user from "@/store/user.js";
import storage from "@/store/storage.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    user,
    storage,
  },
});
