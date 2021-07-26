<template>
  <div>
    <da-card icon="shopping_cart" title="Товары" wideToolbar>
      <template v-slot:toolbar-items>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по названию"
          single-line
          hide-details
          clearable
          style="max-width: 400px"
        ></v-text-field>
        <v-btn
          icon
          large
          color="info"
          class="ml-3 mb-n2"
          @click="
            $validator.reset();
            scenario = 'create';
            dialog = true;
            editedProd = {};
          "
        >
          <v-icon>add</v-icon>
        </v-btn>
      </template>
      <v-data-table
        :headers="headers"
        :items="products"
        item-key="id"
        :search="search"
        :custom-filter="filter"
        :items-per-page="-1"
        :loading="loading"
      >
        <template v-slot:item.img="{ item }">
          <da-img :src="item.img" width="70"> </da-img>
        </template>

        <template v-slot:item.catId="{ item }">
          <span>{{ findCategoryLabel(item.catId) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-3"
            @click="
              $validator.reset();
              editedProd = { ...item };
              scenario = 'update';
              dialog = true;
            "
          >
            edit
          </v-icon>
          <a-popconfirm
            title="Вы действительно хотите удалить товар?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="deleteProd(item)"
          >
            <v-icon> mdi-delete </v-icon>
          </a-popconfirm>
        </template>
      </v-data-table>
    </da-card>

    <da-dialog
      v-model="dialog"
      width="800"
      :title="scenario === 'create' ? 'Создать товар' : 'Редактировать товар'"
      flatToolbar
      noRoute
    >
      <v-card tile>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="editedProd.label"
            label="Название товара"
            placeholder="Мастер и Маргарита"
            clearable
            v-validate="'required'"
            name="prodLabel"
            :error-messages="errors.first('prodLabel')"
          ></v-text-field>

          <v-select
            v-model="editedProd.catId"
            :items="catForSelect"
            label="Категория"
            v-validate="'required'"
            name="catId"
            :error-messages="errors.first('catId')"
          ></v-select>

          <v-text-field
            v-model="editedProd.price"
            v-mask="'########'"
            placeholder="300"
            label="Цена"
            clearable
          ></v-text-field>

          <v-textarea
            v-model="editedProd.description"
            label="Описание товара"
            clearable
          ></v-textarea>

          <da-firebase-uploader
            v-model="editedProd.img"
            ref="uploader"
          ></da-firebase-uploader>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="scenario === 'create' ? createProd() : updateProd()"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </da-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import DaFirebaseUploader from "@/components/DaFirebaseUploader.vue";
import firebase from "firebase/app";

export default {
  inject: ["$validator"],
  components: {
    DaFirebaseUploader,
  },
  async created() {
    this.loading = true;
    await this.fetchCategories({ reload: false });
    await this.fetchProducts({ reload: false });
    this.loading = false;
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Изображение",
          value: "img",
        },
        {
          text: "Название",
          value: "label",
        },
        {
          text: "Категория",
          sortable: false,
          value: "catId",
        },
        {
          text: "Цена",
          value: "price",
        },
        {
          text: "",
          sortable: false,
          value: "actions",
        },
      ],
      loading: false,
      dialog: false,
      editedProd: {},
      scenario: "create",
    };
  },

  methods: {
    filter(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    findCategoryLabel(catId) {
      const category = this.categories.find((c) => c.id === catId);
      return (category && category.label) || null;
    },
    async createProd() {
      if (!(await this.$validator.validateAll())) return;

      this.dialog = false;
      await Vue.$db.collection("product").add(this.editedProd);
      this.fetchProducts();
      this.editedProd = {};
    },
    async updateProd() {
      if (!(await this.$validator.validateAll())) return;

      this.dialog = false;
      const { id, ...data } = this.editedProd;
      await Vue.$db.collection("product").doc(id).update(data);
      this.fetchProducts();
      this.editedProd = {};
    },
    async deleteProd(prod) {
      await Vue.$db.collection("product").doc(prod.id).delete();
      if (prod.img) {
        this.deleleFile(prod.img);
      }
      this.fetchProducts();
      this.$message.success("Товар успешно удален");
    },
    deleleFile(imgUrl) {
      const parts = imgUrl.split("?");
      const prts = parts[0].split("/");
      const filename = prts[prts.length - 1];

      firebase.storage().ref(`${filename}`).delete();
    },
    ...mapActions(["fetchProducts", "fetchCategories"]),
  },
  computed: {
    catForSelect() {
      return this.categories.map((c) => {
        return {
          value: c.id,
          text: c.label,
        };
      });
    },
    ...mapState({
      products: (state) => state.common.products,
      categories: (state) => state.common.categories,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
