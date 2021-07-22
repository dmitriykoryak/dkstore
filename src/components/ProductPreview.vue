<template>
  <v-card
    class="mx-auto"
    max-width="344"
    min-height="520"
    :to="'/product/' + product.id"
  >
    <v-img height="250" :src="product.img"></v-img>

    <v-card-title class="font-weight-bold align-start">
      <div class="line-height-11" :style="{ wordBreak: 'normal' }">
        {{ product.label }}
      </div>
    </v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0">
        {{ product.description }}
      </v-row>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-subtitle
      >Цена:
      <span class="font-weight-bold">{{
        product.price | currency
      }}</span></v-card-subtitle
    >
  </v-card>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
