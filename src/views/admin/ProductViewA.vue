<template>
  <v-container>
    <product-list-a></product-list-a>
  </v-container>
</template>

<script>
import ProductListA from "@/components/ProductListA.vue";

export default {
  components: { ProductListA },
  data() {
    return {
      src: null,
    };
  },
};
</script>

<style lang="scss" scoped></style>
