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
        <v-form @submit.prevent="reg">
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
            ref="password"
            v-validate="'required|min:6'"
            name="pass"
            :error-messages="errors.first('pass')"
            label="Пароль"
            type="password"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="passConfirm"
            v-validate="'required|confirmed:password'"
            name="passConfirm"
            :error-messages="errors.first('passConfirm')"
            label="Подтверждение пароля"
            type="password"
            clearable
          ></v-text-field>

          <div class="d-flex justify-center mt-6">
            <v-btn
              color="primary"
              :loading="loading"
              type="submit"
              :disabled="errors.any()"
              >Зарегистрироватся</v-btn
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
      passConfirm: null,
      loading: false,
    };
  },

  methods: {
    async reg() {
      if (!(await this.$validator.validateAll())) return;

      this.loading = true;
      await this.$store
        .dispatch("createUser", {
          email: this.email,
          password: this.pass,
        })
        .then(() => this.$router.push("/person"))
        .finally(() => (this.loading = false));
    },
  },
  computed: mapState({
    error: (state) => state.common.error,
  }),
};
</script>

<style lang="scss" scoped></style>
