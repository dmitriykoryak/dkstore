<template>
  <v-container class="pt-12">
    <v-row>
      <v-col cols="4"> Темная тема </v-col>
      <v-col cols="8">
        <v-switch
          :input-value="$vuetify.theme.dark"
          @change="toggleDark"
          inset
          hide-details
          class="mt-n1"
        >
        </v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  created() {
    this.$vuetify.theme.dark = this.storage.get("is-dark") || false;
  },
  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.storage.set("is-dark", this.$vuetify.theme.dark);
    },
  },
  computed: mapGetters(["storage"]),
};
</script>

<style lang="scss" scoped></style>
