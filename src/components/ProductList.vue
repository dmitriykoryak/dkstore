<template>
  <v-container>
    <v-row>
      <v-col v-for="(product, i) in products" :key="i">
        <product-preview :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProductPreview from "@/components/ProductPreview.vue";

export default {
  components: {
    ProductPreview,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
