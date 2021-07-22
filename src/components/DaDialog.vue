<template>
  <div>
    <v-dialog
      class="da-dialog"
      :value="value"
      @input="updateValue($event)"
      :fullscreen="fullscreen"
      :width="width"
      :max-width="maxWidth"
      :eager="eager"
      :transition="calcTrancition"
      :key="dialogKey"
      :hide-overlay="hideOverlay"
      :content-class="contentClassComputed"
      :persistent="persistent"
      :dark="dark"
      :scrollable="scrollable"
    >
      <slot name="toolbar">
        <da-toolbar
          v-if="!hideToolbar"
          :color="color"
          :dark="randImg ? true : darkToolbar"
          :randImg="randImg"
          :prominent="prominent"
          :title="title"
          :icon="icon"
          :left-arrow="leftArrow"
          :close-icon="closeIcon"
          :spacer="toolbarSpacer"
          :height="toolbarHeight"
          :title-center="titleCenter"
          :flat="flatToolbar"
          @dialog:close="
            updateValue(false);
            $emit('dialog:close');
          "
        >
          <template v-slot:title>
            <slot name="title"></slot>
          </template>

          <template v-slot:default>
            <slot name="toolbar-default"></slot>
          </template>

          <template v-slot:toolbar-items>
            <slot name="toolbar-items"></slot>
          </template>
        </da-toolbar>
      </slot>

      <slot name="default"></slot>

      <div v-if="closeButton">
        <v-btn
          color="info"
          @click="updateValue(false)"
          dark
          fixed
          bottom
          right
          fab
        >
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import DaToolbar from "./DaToolbar";

export default {
  name: "da-dialog",

  components: { DaToolbar },

  mounted() {
    if (this.$router) {
      this.savePrevRoute();

      this.goBackHistoryEvent();
      this.rand = Math.floor(Math.random() * 100000).toString();
    }
  },

  data() {
    return {
      dialogKey: 1,
      rand: null,
      prevRoute: null,
    };
  },

  props: {
    value: [Boolean, Event],
    title: String,
    // расположить title по центру
    titleCenter: Boolean,
    randImg: Boolean,
    prominent: Boolean,
    // цвет toolbar
    color: String,
    fullscreen: Boolean,
    width: [String, Number],
    maxWidth: [String, Number],
    eager: Boolean,
    // Показать иконку "Стрелка влево" в хеадер
    leftArrow: Boolean,
    icon: String,
    // Показать иконку "Закрыть" в хеадер
    closeIcon: {
      type: Boolean,
      default: true,
    },
    // Показать кнопку "Закрыть" внизу контента
    closeButton: Boolean,
    transition: String,
    reRenderOnOpen: Boolean,
    toolbarSpacer: {
      type: Boolean,
      default: true,
    },
    toolbarHeight: [String, Number],
    hideOverlay: Boolean,
    // Отступ контента от низа документа, чтобы кнопка position absolute / fixed не закрывала контент
    paddingBottom: Boolean,
    persistent: Boolean,
    dark: Boolean,
    darkToolbar: {
      type: Boolean,
      default: false,
    },
    flatToolbar: {
      type: Boolean,
      default: false,
    },
    hideToolbar: {
      type: Boolean,
      default: false,
    },
    // Не дописывать в url '#'
    noRoute: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    contentClass: String,
  },

  methods: {
    savePrevRoute() {
      this.$router.beforeEach(async (to, from, next) => {
        this.prevRoute = from;
        next();
      });
    },
    /**
     * При нажатии кнопоки браузера назад - закрыть модальное окно
     * */
    goBackHistoryEvent() {
      if (window.history && window.history.pushState) {
        window.addEventListener("popstate", () => {
          if (this.prevRoute.query.modal === this.rand) {
            this.updateValue(false);
          }
        });
      }
    },

    updateValue(val) {
      // при каждом закрытии окна изменить dialogKey для re-render dialog
      // - задержка нужна для завершения анимации закыртия окна .3s
      if (this.reRenderOnOpen && !val) {
        setTimeout(() => this.dialogKey++, 400);
      }
      this.$emit("input", val);
    },
  },

  computed: {
    calcTrancition() {
      if (this.transition) {
        return this.transition;
      }

      return this.fullscreen ? "dialog-right-transition" : "dialog-transition";
    },

    /**
     * Классы контента диалогового окна
     * @returns {string}
     */
    contentClassComputed() {
      let out = this.contentClass
        ? `da-dialog-content ${this.contentClass}`
        : "da-dialog-content";
      out += this.prominent ? " prominent" : " not-prominent";
      if (this.hideOverlay) {
        out += " hide-overlay";
      }
      if (this.paddingBottom) {
        out += " pad-bottom";
      }
      return out;
    },
  },

  watch: {
    // При открытии / закрытии модального окна - изменить url(запись в историю перехода браузера)
    value(val) {
      if (this.noRoute) return;

      if (val) {
        this.$router.push({
          query: { ...this.$route.query, modal: this.rand },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.da-dialog-content {
  &.prominent {
    &.v-dialog--fullscreen > .v-card {
      min-height: calc(100% - 128px);
    }
  }

  // для коррекции прокручиваемого контента
  &.v-dialog--scrollable {
    display: block;
  }

  &.not-prominent {
    &.v-dialog--fullscreen > .v-card {
      min-height: calc(100% - 56px);
    }
  }
  &.hide-overlay {
    overflow: hidden;
  }
  &.pad-bottom .v-stepper__content,
  &.pad-bottom > .v-card {
    padding-bottom: 80px;
  }
}

/* transitions */
.dialog-right-transition {
  &-enter,
  &-leave-to {
    transform: translateX(100%);
  }
}
</style>
