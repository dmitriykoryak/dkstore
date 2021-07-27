<template>
  <da-card icon="widgets" title="Категории" wideToolbar>
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
      <v-btn icon large color="info" class="ml-3 mb-n2" @click="createParam">
        <v-icon>add</v-icon>
      </v-btn>
    </template>

    <v-data-table
      :headers="headers"
      :items="params"
      item-key="id"
      :search="search"
      :custom-filter="filter"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.paramName="props">
        <v-edit-dialog
          :return-value.sync="props.item.paramName"
          large
          persistent
          cancel-text="Отмена"
          save-text="Сохранить"
          @save="updateParam(props.item)"
        >
          <div>{{ props.item.paramName }}</div>
          <template v-slot:input>
            <div class="mt-4 text-h6">Изменить название категории</div>
            <v-text-field
              v-model="props.item.paramName"
              label="Edit"
              single-line
              counter
              autofocus
              clearable
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <a-popconfirm
          title="Вы действительно хотите удалить параметр?"
          ok-text="Да"
          cancel-text="Нет"
          @confirm="deleteParam(item.id)"
        >
          <v-icon> mdi-delete </v-icon>
        </a-popconfirm>
      </template>
    </v-data-table>
  </da-card>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";

export default {
  created() {
    this.fetchParams({ reload: false });
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Параметр",
          value: "paramName",
        },
        {
          text: "",
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
    updateParam(param) {
      Vue.$db
        .collection("param")
        .doc(param.id)
        .update({ paramName: param.paramName });
    },
    createParam() {
      Vue.$db.collection("param").add({
        paramName: "A новый параметр",
      });
      this.fetchParams();
    },
    deleteParam(paramId) {
      Vue.$db.collection("param").doc(paramId).delete();
      this.fetchParams();
      this.$message.success("Параметр успешно удален");
    },
    ...mapActions(["fetchParams"]),
  },
  computed: {
    ...mapState({
      params: (state) => state.common.params,
    }),
  },
};
</script>

<style lang="scss" scoped></style>
