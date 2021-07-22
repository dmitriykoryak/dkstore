import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegView from "@/views/RegView.vue";
import CategoryView from "@/views/CategoryView.vue";
import ProductView from "@/views/ProductView.vue";
import MainViewA from "@/views/admin/MainViewA.vue";
import ProfileViewA from "@/views/admin/ProfileViewA.vue";
import СategoryViewA from "@/views/admin/СategoryViewA.vue";
import ProductViewA from "@/views/admin/ProductViewA.vue";
import SettingsViewA from "@/views/admin/SettingsViewA.vue";
import $store from "@/store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/reg",
    component: RegView,
  },
  {
    path: "/category/:id",
    component: CategoryView,
  },
  {
    path: "/product/:id",
    component: ProductView,
  },
  {
    path: "/admin",
    component: MainViewA,
    meta: {
      admin: true,
    },
    beforeEnter: AuthGuard,
  },
  {
    path: "/admin/profile",
    component: ProfileViewA,
    meta: {
      admin: true,
    },
  },
  {
    path: "/admin/categories",
    component: СategoryViewA,
    meta: {
      admin: true,
    },
  },
  {
    path: "/admin/products",
    component: ProductViewA,
    meta: {
      admin: true,
    },
  },
  {
    path: "/admin/settings",
    component: SettingsViewA,
    meta: {
      admin: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

function AuthGuard(from, to, next) {
  if ($store.state.user.isUserAuth) {
    next();
  } else {
    next("/");
  }
}

export default router;
