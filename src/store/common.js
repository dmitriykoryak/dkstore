import Vue from "vue";
import VeeValidate from "vee-validate";
import dictionaryRu from "vee-validate/dist/locale/ru";

export default {
  state: {
    error: null,
    categories: [],
    products: [],
    params: [],
  },

  mutations: {
    setError(store, payload) {
      store.error = payload;
    },
    clearError(store) {
      store.error = null;
    },
    setCategories(store, payload) {
      store.categories = payload;
    },
    setProducts(store, payload) {
      store.products = payload;
    },
    setParams(store, payload) {
      store.params = payload;
    },
  },

  actions: {
    async fetchCategories({ commit, state }, payload) {
      payload = payload || { reload: true };
      if (!payload.reload && state.categories.length) return;

      const querySnapshot = await Vue.$db
        .collection("category")
        .orderBy("label", "asc")
        .get();

      let categories = [];
      querySnapshot.forEach((s) => {
        categories.push({
          id: s.id,
          ...s.data(),
        });
      });
      commit("setCategories", categories);
    },

    async fetchProducts({ commit, state }, payload) {
      payload = payload || { reload: true };
      if (!payload.reload && state.products.length) return;

      const querySnapshot = await Vue.$db
        .collection("product")
        .orderBy("label", "asc")
        .get();

      let products = [];
      querySnapshot.forEach((s) => {
        products.push({
          id: s.id,
          ...s.data(),
        });
      });
      commit("setProducts", products);
    },

    async fetchParams({ commit, state }, payload) {
      payload = payload || { reload: true };
      if (!payload.reload && state.params.length) return;

      const querySnapshot = await Vue.$db
        .collection("param")
        .orderBy("paramName", "asc")
        .get();

      let params = [];
      querySnapshot.forEach((s) => {
        params.push({
          id: s.id,
          ...s.data(),
        });
      });

      commit("setParams", params);
    },
  },

  getters: {
    /**
     * ?????????????????????? ??????????????????
     * ?????????? ?????????? ?????????????????? ?????????????????? ?? ???????????? ?????????????????????????????????? labels ?? ?????????????????? ????????????
     * */
    validationLocalize: () => (labels) => {
      VeeValidate.Validator.localize("ru", {
        ...dictionaryRu,
        attributes: labels,
      });
    },
  },
};
