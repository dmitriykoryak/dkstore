<template>
  <div>
    <v-app-bar app color="primary" dark>
      <router-link
        to="/"
        class="font-weight-bold white--text text-decoration-none"
        >DKStore</router-link
      >
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <da-dark-theme-button></da-dark-theme-button>
        <v-btn v-if="isUserAuth" text to="/admin">
          <v-icon left>manage_accounts</v-icon>
          <span>Админ панель</span>
        </v-btn>
        <v-btn v-if="isUserAuth" text @click="signOut">
          <v-icon left>logout</v-icon>
          <span>Выход</span>
        </v-btn>
        <template v-else>
          <v-btn text to="/reg">
            <v-icon left>how_to_reg</v-icon>
            <span>Регистрация</span>
          </v-btn>
          <v-btn text to="/login">
            <v-icon left>login</v-icon>
            <span>Вход</span>
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>

    <!--Боковой sidebar-->
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndUp"
      v-model="drawer"
      app
      left
      :mini-variant.sync="mini"
      permanent
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Магазин</v-list-item-title>
          <v-list-item-subtitle>товаров</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="mini = true">
            <v-icon color="grey lighten-1">arrow_back</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-divider />

      <v-list>
        <template v-for="cat in catTree">
          <v-list-item
            v-if="!cat.child"
            :key="cat.id"
            :to="'/category/' + cat.id"
          >
            <v-list-item-icon>
              <v-icon>{{ cat.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ cat.label }}</v-list-item-title>
          </v-list-item>

          <v-list-group
            v-else
            :key="cat.id"
            :value="false"
            :prepend-icon="cat.icon"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ cat.label }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="childCat in cat.child"
              :key="childCat.id"
              :to="'/category/' + childCat.id"
            >
              <v-list-item-icon>
                <v-icon v-text="childCat.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="childCat.label"></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!--Боковой sidebar end-->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DaDarkThemeButton from "@/components/DaDarkThemeButton.vue";

export default {
  components: {
    DaDarkThemeButton,
  },
  async created() {
    await this.fetchCategories({ reload: false });
  },
  data() {
    return {
      drawer: false,
      mini: true,
      admins: [
        ["Management", "mdi-account-multiple-outline"],
        ["Settings", "mdi-cog-outline"],
      ],
    };
  },
  methods: {
    signOut() {
      this.$confirm("Вы действительно хотите выйти?").then((res) => {
        if (res) {
          this.$store.dispatch("signOutUser");
        }
      });
    },
    ...mapActions(["fetchCategories"]),
  },
  computed: {
    ...mapState({
      isUserAuth: (state) => state.user.isUserAuth,
      categories: (state) => state.common.categories,
      catTree() {
        let categories = JSON.parse(JSON.stringify(this.categories));
        this.categories.forEach((cat) => {
          if (cat.pId) {
            const parentCatIndex = categories.findIndex(
              (c) => c.id === cat.pId
            );
            if (!categories[parentCatIndex].child) {
              categories[parentCatIndex].child = [];
            }
            categories[parentCatIndex].child.push(cat);
            const index = categories.findIndex((c) => c.id === cat.id);
            categories.splice(index, 1);
          }
        });
        return categories;
      },
    }),
  },
};
</script>

<style lang="scss" scoped></style>
