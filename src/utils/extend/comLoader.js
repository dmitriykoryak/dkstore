/**
 * Глобальная регистрация компонентов
 */
import Vue from "vue";
import DaCard from "@/components/DaCard.vue";
import DaCardIcon from "@/components/DaCardIcon.vue";
import DaImg from "@/components/DaImg.vue";
import DaDialog from "@/components/DaDialog.vue";

Vue.component("DaCard", DaCard);
Vue.component("DaCardIcon", DaCardIcon);
Vue.component("DaImg", DaImg);
Vue.component("DaDialog", DaDialog);
