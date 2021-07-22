<template>
  <div>
    <div>
      <p>Изображение:</p>
      <da-img class="preview" :src="value" width="200" />
      <input
        :key="value"
        type="file"
        @change="previewImage"
        accept="image/*"
        class="mt-3"
      />
    </div>
    <div>
      <p class="mt-1">
        {{ uploadValue.toFixed() + "%" }}
        <progress id="progress" :value="uploadValue" max="100"></progress>
      </p>
    </div>
    <div></div>
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
    previewImage(event) {
      this.uploadValue = 0;
      if (this.value) {
        this.deleleFile(this.value);
      }

      this.$emit("input", null);
      this.imageData = event.target.files[0];
      this.uploadImg();
    },

    uploadImg() {
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
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
