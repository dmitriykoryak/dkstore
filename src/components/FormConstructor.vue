<template>
  <div>
    <v-container>
      <h1 class="my-5">Конструктор форм</h1>
      <div class="d-flex">
        <div>
          <v-tabs v-model="tab" color="blue">
            <v-tab>Конструктор</v-tab>
            <v-tab>Дизайн</v-tab>
            <v-tab>Настройки</v-tab>
            <v-tab>Публикация</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-card-text id="sort-wrapper-left">
                  <div class="d-flex align-center" data-com="v-text-field">
                    <v-text-field
                      label="Текстовое поле"
                      :outlined="formConfig.set.fieldsOutlined"
                      :dense="formConfig.set.fieldsDense"
                      readonly
                    />
                    <v-btn class="for-drag" icon>
                      <v-icon>touch_app</v-icon>
                    </v-btn>
                  </div>

                  <div class="d-flex align-center" data-com="v-textarea">
                    <v-textarea
                      label="Многострочное текстовое поле"
                      :outlined="formConfig.set.fieldsOutlined"
                      :dense="formConfig.set.fieldsDense"
                      readonly
                    />
                    <v-btn class="for-drag" icon>
                      <v-icon>touch_app</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-subheader>Форма</v-subheader>
                  <v-switch
                    v-model="formConfig.set.cardOutlined"
                    label="Очерченная форма"
                  ></v-switch>
                  <v-switch
                    v-model="formConfig.set.cardShadow"
                    label="С тенью"
                  ></v-switch>

                  <v-subheader>Поля</v-subheader>
                  <v-switch
                    v-model="formConfig.set.fieldsOutlined"
                    label="Очерченное поле"
                  ></v-switch>
                  <v-switch
                    v-model="formConfig.set.fieldsDense"
                    label="Компактрый вид"
                  ></v-switch>
                  <v-switch
                    v-model="formConfig.set.dark"
                    label="Темная тема"
                  ></v-switch>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </div>

        <v-divider vertical class="mr-4"></v-divider>

        <v-card
          id="sort-wrapper-right"
          class="flex-grow-1"
          :dark="formConfig.set.dark"
          :key="updateTrigger"
          :flat="!formConfig.set.cardShadow"
          :outlined="!formConfig.set.cardShadow && formConfig.set.cardOutlined"
        >
          <v-card-title>
            <v-text-field
              ref="formTitle"
              v-show="isEdit.formTitle"
              v-model="formConfig.set.formTitile"
              hide-details
              single-line
              class="mt-n2"
              clearable
            ></v-text-field>
            <div v-show="!isEdit.formTitle" class="flex-grow-1">
              {{ formConfig.set.formTitile }}
            </div>
            <v-btn icon @click="updateFormTitle">
              <v-icon>{{ isEdit.formTitle ? "done" : "create" }}</v-icon>
            </v-btn>
          </v-card-title>

          <v-list>
            <v-list-item
              v-for="(field, index) in formConfig.fields"
              :key="index"
              @click="
                dialog = true;
                editedField = { ...field };
                editedFieldIndex = index;
              "
            >
              <component
                :is="field.com"
                :label="field.label"
                :placeholder="field.placeholder"
                :outlined="formConfig.set.fieldsOutlined"
                :dense="formConfig.set.fieldsDense"
                :dark="formConfig.set.dark"
                disabled
              >
              </component>

              <v-list-item-icon>
                <v-btn icon @click.stop="deleteField(index)">
                  <v-icon class="">delete</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>

          <v-container v-if="formConfig.fields.length">
            <v-btn color="success" depressed block large>
              <v-text-field
                ref="buttonLabel"
                v-show="isEdit.buttonLabel"
                v-model="formConfig.set.buttonLabel"
                hide-details
                single-line
                clearable
                dark
                dense
                class="mt-n2"
              ></v-text-field>
              <div v-show="!isEdit.buttonLabel" class="flex-grow-1">
                {{ formConfig.set.buttonLabel }}
              </div>

              <v-btn icon dark @click="updateButtonLabel" class="ml-1">
                <v-icon>{{ isEdit.buttonLabel ? "done" : "create" }}</v-icon>
              </v-btn>
            </v-btn>
          </v-container>
        </v-card>
      </div>
    </v-container>

    <da-dialog
      v-model="dialog"
      width="500"
      title="Настройки поля"
      flatToolbar
      noRoute
    >
      <v-card tile>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="editedField.label"
            label="Наименование поля"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="editedField.placeholder"
            label="Подсказка"
            clearable
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="
              dialog = false;
              formConfig.fields[editedFieldIndex] = { ...editedField };
              updateFormConfig();
            "
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </da-dialog>
  </div>
</template>

<script>
/**
 * App
 */
import Vue from "vue";
import DaDialog from "@/components/DaDialog.vue";
import Sortable from "sortablejs";
import firebase from "firebase/app";

export default {
  components: {
    DaDialog,
  },
  name: "App",
  mounted() {
    this.sortInit();
    this.fetchFormConfig();
  },
  data() {
    return {
      tab: 0,
      updateTrigger: 1,
      formConfig: {
        fields: [],
        set: {
          formTitle: "Наименование формы",
          buttonLabel: "Сохранить",
          cardOutlined: true,
          cardShadow: false,
          fieldsOutlined: false,
          fieldsDense: false,
          dark: false,
          db: null,
        },
      },
      isEdit: {
        formTitle: false,
        buttonLabel: false,
      },
      editedField: {},
      editedFieldIndex: -1,
      dialog: false,
    };
  },
  methods: {
    sortInit() {
      const sortWrapperLeft = document.querySelector("#sort-wrapper-left");
      const sortWrapperRight = document.querySelector("#sort-wrapper-right");

      new Sortable(sortWrapperLeft, {
        animation: 150,
        group: {
          name: "fields",
          pull: "clone",
          put: false,
        },
        sort: false,
        handle: ".for-drag",
        onEnd({ item }) {
          context.updateTrigger = ++context.updateTrigger;

          context.formConfig.fields.push({
            com: item.dataset.com,
            label: "Поле",
            placeholder: "Подсказка",
          });

          context.updateFormConfig();
        },
      });

      const context = this;
      new Sortable(sortWrapperRight, {
        animation: 150,
        group: {
          name: "fields",
          pull: "clone",
          put: false,
        },
        sort: false,
        handle: ".for-drag",
      });
    },

    async fetchFormConfig() {
      const querySnapshot = await Vue.$db
        .collection("formConfig")
        .where("userUid", "==", firebase.auth().currentUser.uid)
        .get();

      querySnapshot.forEach((s) => {
        this.formConfig = s.data();
        this.formConfig.id = s.id;
      });
    },

    updateFormConfig() {
      Vue.$db
        .collection("formConfig")
        .doc(this.formConfig.id)
        .update({
          ...this.formConfig,
          userUid: firebase.auth().currentUser.uid,
        });
    },

    updateFormTitle() {
      this.isEdit.formTitle = !this.isEdit.formTitle;
      this.$nextTick(() => {
        if (this.isEdit.formTitle) {
          this.$refs.formTitle.focus();
        } else {
          this.updateFormConfig();
        }
      });
    },

    updateButtonLabel() {
      this.isEdit.buttonLabel = !this.isEdit.buttonLabel;
      this.$nextTick(() => {
        if (this.isEdit.buttonLabel) {
          this.$refs.buttonLabel.focus();
        } else {
          this.updateFormConfig();
        }
      });
    },

    deleteField(index) {
      this.formConfig.fields.splice(index, 1);
      this.updateFormConfig();
    },
  },
};
</script>
