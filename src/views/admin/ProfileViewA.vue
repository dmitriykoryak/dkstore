<template>
  <v-container>
    <div>
      Ваш Email: <span class="font-weight-bold">{{ user && user.email }}</span>
      <span
        v-if="user && user.emailVerified"
        class="success--text font-weight-bold"
      >
        - подтвержден</span
      >
      <span v-else>
        <span v-if="emailSended">
          <span class="info--text font-weight-bold">
            - письмо для подтверждения отправлено</span
          >
        </span>
        <span v-else>
          <span class="warning--text font-weight-bold"> - не подтвержден</span>
          <v-btn
            color="success"
            class="ml-3"
            depressed
            :loading="loading"
            @click="verifyEmail"
            >подтвердить</v-btn
          >
        </span>
      </span>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase/app";

export default {
  created() {
    this.user = firebase.auth().currentUser;
  },
  data() {
    return {
      user: null,
      emailSended: false,
      loading: false,
    };
  },
  methods: {
    verifyEmail() {
      this.loading = true;
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          this.loading = false;
          this.emailSended = true;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error.message);
          // ...
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
