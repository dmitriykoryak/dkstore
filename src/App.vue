<template>
  <v-app>
    <component :is="$route.meta.admin ? 'AppHeaderA' : 'AppHeader'" />

    <v-main>
      <v-fade-transition hide-on-leave>
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppHeaderA from "@/components/AppHeaderA.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",

  created() {
    this.vLocalize();
  },

  components: {
    AppHeader,
    AppHeaderA,
  },

  data: () => ({
    //
  }),

  methods: {
    vLocalize() {
      const labels = {
        pass: "Пароль",
        passConfirm: "Подтверждение пароля",
        email: "Электронная почта",
        catId: "Категория",
        prodLabel: "Название товара",
      };
      this.validationLocalize(labels);
    },
  },
  computed: mapGetters(["validationLocalize"]),
};
</script>
