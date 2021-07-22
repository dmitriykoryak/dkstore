import firebase from "firebase";
import $router from "@/router/index";

export default {
  state: {
    isUserAuth: false,
    uid: null,
  },
  mutations: {
    setSignIn(store) {
      store.isUserAuth = true;
    },
    setSignOut(store) {
      store.isUserAuth = false;
    },
    setUid(store, payload) {
      store.uid = payload;
    },
    unsetUid(store) {
      store.uid = null;
    },
  },
  actions: {
    async createUser({ commit }, payload) {
      commit("clearError");
      await firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          commit("setUid", userCredential.user.uid);
        })
        .catch((error) => {
          commit("setError", error.message);
        });
    },
    async signInUser({ commit }, payload) {
      commit("clearError");
      await firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          commit("setUid", userCredential.user.uid);
        })
        .catch((error) => {
          commit("setError", error.message);
        });
    },
    async signOutUser({ commit }) {
      commit("clearError");
      await firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setSignOut");
          commit("unsetUid");
          $router.push("/login");
        })
        .catch((error) => {
          commit("setError", error.message);
        });
    },
    authStateChanged({ commit }, payload) {
      if (payload) {
        commit("setSignIn");
        commit("setUid", payload.uid);
      } else {
        commit("setSignOut");
      }
    },
  },
};
