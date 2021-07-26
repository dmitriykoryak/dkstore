import Vue from "vue";

import VeeValidate from "vee-validate";
import dictionaryRu from "vee-validate/dist/locale/ru";
const veeValidateOptions = {
  inject: false,
};
Vue.use(VeeValidate, veeValidateOptions);
VeeValidate.Validator.localize("ru", dictionaryRu);

import VueCookie from "vue-cookie";
Vue.use(VueCookie);

import VueLocalStorage from "vue-localstorage";
Vue.use(VueLocalStorage);

import { VueMaskDirective } from "v-mask";
Vue.directive("mask", VueMaskDirective);

import VueCurrencyFilter from "vue-currency-filter";
Vue.use(VueCurrencyFilter, {
  symbol: "Грн.",
  thousandsSeparator: " ",
  fractionCount: 2,
  fractionSeparator: ".",
  symbolPosition: "",
  symbolSpacing: true,
  avoidEmptyDecimals: undefined,
});

// Ant design for Vue
import { Popconfirm, message } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Popconfirm);
Vue.prototype.$message = message;
