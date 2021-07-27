<template>
  <div>
    <p>Изображение:</p>

    <a-upload
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :action="prepare"
    >
      <da-img v-if="value" :src="value" width="102" />

      <div v-else>
        <a-icon :type="!!uploadValue ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data() {
    return {
      imageData: null,
      uploadValue: 0,
    };
  },
  props: {
    value: String,
  },
  methods: {
    prepare(file) {
      this.uploadValue = 0;
      if (this.value) {
        this.deleleFile(this.value);
      }

      this.$emit("input", null);
      this.imageData = file;
      this.uploadImg();
    },

    uploadImg() {
      this.loading = true;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        () => {},
        (error) => {
          console.log(error.message);
        },
        () => {
          this.loading = false;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.$emit("input", url);
          });
        }
      );
    },

    deleleFile(imgUrl) {
      const parts = imgUrl.split("?");
      const prts = parts[0].split("/");
      const filename = prts[prts.length - 1];

      firebase.storage().ref(`${filename}`).delete();
    },
  },
};
</script>

<style lang="scss" scoped></style>
