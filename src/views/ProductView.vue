<template>
  <v-container>
    <v-card height="248">
      <v-row no-gutters>
        <v-col cols="6">
          <v-img :src="product.img" height="248" contain> </v-img>
        </v-col>
        <v-col cols="6" class="pl-3">
          <div class="font-weight-bold text-h4">{{ product.label }}</div>
          <div class="mt-3">
            Цена:
            <span class="font-weight-bold">{{ product.price | currency }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <div class="mt-6">{{ product.description }}</div>

    <v-btn color="success" class="mt-3" depressed @click="$router.go(-1)"
      >Вернуться</v-btn
    >
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  created() {
    this.fetchProducts({ reload: false });
  },
  methods: {
    ...mapActions(["fetchProducts"]),
  },
  computed: {
    ...mapState({
      product() {
        return this.products.find((p) => p.id === this.$route.params.id);
      },
      products: (state) => state.common.products,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
