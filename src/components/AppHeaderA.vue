<template>
  <v-app-bar app color="primary" dark>
    <router-link
      to="/admin"
      class="font-weight-bold white--text text-decoration-none"
      >DKStore</router-link
    >
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <da-dark-theme-button></da-dark-theme-button>

      <v-btn v-if="isUserAuth" text to="/admin/params">
        <v-icon left>widgets</v-icon>
        <span>Параметры</span>
      </v-btn>
      <v-btn v-if="isUserAuth" text to="/admin/products">
        <v-icon left>shopping_cart</v-icon>
        <span>Товары</span>
      </v-btn>
      <v-btn v-if="isUserAuth" text to="/admin/categories">
        <v-icon left>category</v-icon>
        <span>Категории</span>
      </v-btn>
      <v-btn v-if="isUserAuth" text to="/admin/profile">
        <v-icon left>person</v-icon>
        <span>Профиль</span>
      </v-btn>
      <v-btn v-if="isUserAuth" text to="/admin/settings">
        <v-icon left>settings</v-icon>
        <span>Настройки</span>
      </v-btn>
      <v-btn v-if="isUserAuth" text to="/">
        <v-icon left>inventory_2</v-icon>
        <span>Магазин</span>
      </v-btn>
      <v-btn v-if="isUserAuth" text @click="signOut">
        <v-icon left>logout</v-icon>
        <span>Выход</span>
      </v-btn>
      <template v-else>
        <v-btn text to="/reg">
          <v-icon left>how_to_reg</v-icon>
          <span>Регистрация</span>
        </v-btn>
        <v-btn text to="/login">
          <v-icon left>login</v-icon>
          <span>Вход</span>
        </v-btn>
      </template>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";
import DaDarkThemeButton from "@/components/DaDarkThemeButton.vue";

export default {
  components: {
    DaDarkThemeButton,
  },
  methods: {
    signOut() {
      this.$confirm("Вы действительно хотите выйти?").then((res) => {
        if (res) {
          this.$store.dispatch("signOutUser");
        }
      });
    },
  },
  computed: {
    ...mapState({
      isUserAuth: (state) => state.user.isUserAuth,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
