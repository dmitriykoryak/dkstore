<template>
  <da-card icon="category" title="Категории" wideToolbar>
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
      <v-btn icon large color="info" class="ml-3 mb-n2" @click="createCat">
        <v-icon>add</v-icon>
      </v-btn>
    </template>

    <v-data-table
      :headers="headers"
      :items="categories"
      item-key="id"
      :search="search"
      :custom-filter="filter"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.label="props">
        <v-edit-dialog
          :return-value.sync="props.item.label"
          large
          persistent
          cancel-text="Отмена"
          save-text="Сохранить"
          @save="updateCatField(props.item, 'label')"
        >
          <div>{{ props.item.label }}</div>
          <template v-slot:input>
            <div class="mt-4 text-h6">Изменить название категории</div>
            <v-text-field
              v-model="props.item.label"
              label="Edit"
              single-line
              counter
              autofocus
              clearable
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.pId="{ item }">
        <v-edit-dialog
          :return-value.sync="item.pId"
          large
          persistent
          cancel-text="Отмена"
          save-text="Сохранить"
          @save="updateCatField(item, 'pId')"
        >
          <div>{{ findCatLabel(item.pId) }}</div>
          <template v-slot:input>
            <div class="mt-4 text-h6">Изменить вложенные категории</div>
            <v-select
              v-model="item.pId"
              :items="catForSelect(item.id)"
              label="Вложенные категории"
              single-line
              clearable
            ></v-select>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.icon="props">
        <v-edit-dialog
          :return-value.sync="props.item.icon"
          large
          persistent
          cancel-text="Отмена"
          save-text="Сохранить"
          @save="updateCatField(props.item, 'icon')"
        >
          <v-icon>{{ props.item.icon }}</v-icon>
          <template v-slot:input>
            <div class="mt-4 text-h6">Изменить иконку</div>
            <da-icon-picker v-model="props.item.icon"></da-icon-picker>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <a-popconfirm
          title="Вы действительно хотите удалить категорию?"
          ok-text="Да"
          cancel-text="Нет"
          @confirm="deleteCat(item.id)"
        >
          <v-icon> mdi-delete </v-icon>
        </a-popconfirm>
      </template>

      <template v-slot:footer.prepend>
        <span class="info--text"
          >* Допускается одиночная вложенность категорий</span
        >
      </template>
    </v-data-table>
  </da-card>
</template>

<script>
import Vue from "vue";
import DaIconPicker from "@/components/DaIconPicker.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    DaIconPicker,
  },
  async created() {
    this.loading = true;
    await this.fetchCategories({ reload: false });
    this.loading = false;
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Категория",
          value: "label",
        },
        {
          text: "Родительская категория *",
          sortable: false,
          value: "pId",
        },
        {
          text: "Иконка",
          sortable: false,
          value: "icon",
        },
        {
          text: "",
          sortable: false,
          value: "actions",
        },
      ],
      loading: false,
    };
  },

  methods: {
    findCatLabel(catId) {
      const category = this.categories.find((c) => c.id === catId);
      return (category && category.label) || null;
    },
    filter(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    updateCatField(cat, field) {
      Vue.$db
        .collection("category")
        .doc(cat.id)
        .update({ [field]: cat[field] });
    },
    createCat() {
      Vue.$db.collection("category").add({
        label: "A Новая категория",
        pId: null,
      });
      this.fetchCategories();
    },
    deleteCat(catId) {
      Vue.$db.collection("category").doc(catId).delete();
      this.fetchCategories();
      this.$message.success("Категория успешно удалена");
    },
    catForSelect(catId) {
      return this.categories
        .filter((c) => c.id !== catId && !c.pId)
        .map((c) => {
          return {
            value: c.id,
            text: c.label,
          };
        });
    },
    ...mapActions(["fetchCategories"]),
  },
  computed: {
    ...mapState({
      categories: (state) => state.common.categories,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
