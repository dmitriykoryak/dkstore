import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/plugins";
import "./utils/extend/comLoader";
import firebaseConfig from "@/config/firebase.js";
import firebase from "firebase/app";
import "firebase/firestore";

import VuetifyConfirm from "vuetify-confirm";
Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: "Да",
  buttonFalseText: "Нет",
  buttonTrueColor: "primary",
  buttonFalseColor: "grey",
  buttonTrueFlat: false,
  buttonFalseFlat: true,
});

Vue.config.productionTip = false;
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
db.settings({
  timestampsInStapshots: true,
});
Vue.$db = db;

const vm = new Vue({
  router,
  store,
  vuetify,
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        vm.$store.dispatch("authStateChanged", user);
      }
    });
  },
  render: (h) => h(App),
}).$mount("#app");

export default { db };
