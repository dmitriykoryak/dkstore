<template>
  <product-list :products="productsInCategory"></product-list>
</template>

<script>
import ProductList from "@/components/ProductList.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    ProductList,
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    ...mapActions(["fetchProducts"]),
  },
  computed: {
    ...mapState({
      productsInCategory() {
        return this.products.filter((p) => p.catId === this.$route.params.id);
      },
      products: (state) => state.common.products,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
