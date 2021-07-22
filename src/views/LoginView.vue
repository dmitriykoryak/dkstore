<template>
  <div
    class="d-flex align-center justify-center"
    style="height: calc(100vh - 128px)"
  >
    <v-card width="400">
      <v-toolbar color="primary white--text" flat>
        Вход пользователя
      </v-toolbar>
      <v-alert v-if="error" type="warning" elevation="2">
        {{ error }}
      </v-alert>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            v-validate="'required|email'"
            name="email"
            :error-messages="errors.first('email')"
            label="Email"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="pass"
            v-validate="'required|min:6'"
            name="pass"
            :error-messages="errors.first('pass')"
            type="password"
            label="Пароль"
            clearable
          ></v-text-field>

          <div class="d-flex justify-center mt-6">
            <v-btn
              color="primary"
              :loading="loading"
              type="submit"
              :disabled="errors.any()"
              >Войти</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  inject: ["$validator"],
  data() {
    return {
      email: null,
      pass: null,
      loading: false,
    };
  },

  methods: {
    async login() {
      if (!(await this.$validator.validateAll())) return;

      this.loading = true;
      await this.$store
        .dispatch("signInUser", {
          email: this.email,
          password: this.pass,
        })
        .finally(() => (this.loading = false));

      if (this.isUserAuth) {
        this.$router.push("/");
      }
    },
  },
  computed: mapState({
    error: (state) => state.common.error,
    isUserAuth: (state) => state.user.isUserAuth,
  }),
};
</script>

<style lang="scss" scoped></style>
