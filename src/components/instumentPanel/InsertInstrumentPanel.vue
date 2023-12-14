<template>
  <div class="column">
    <div class="row">
      <label for="insertImage" class="text-button">
        Изображение
        <input
          id="insertImage"
          type="file"
          @change="insertImage"
          accept="image/png, image/jpg, image/gif, image/jpeg"
        />
      </label>
    </div>
    <div class="row">
      <!-- <button class="text-button" @click="addInputField">Поле ввода</button> -->
      <button class="text-button" @click="insertImage">Test button</button>
    </div>
    <div class="row">
      <!-- <button class="text-button" @click="addInputField">Поле ввода</button> -->
      <button class="text-button" @click="insertEditableAreaMarker">
        Редактируемый текст
      </button>
    </div>
  </div>
</template>

<script>
import DocumentTemplateEditor from "@/classes/DocumentTemplateEditor";

export default {
  name: "InsertInstrumentPanel",
  props: { data: DocumentTemplateEditor },

  methods: {
    insertImage: function (e) {
      console.log(e);
      this.data.insertParagraph();
      this.data.insertParagraph();
      this.$nextTick(function () {
        const file = e.target.files[0];
        console.log(e.target.files[0]);
        const promise = new Promise(function (resolve, reject) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            console.log("onload  ", reader.result);
            resolve(reader.result);
          };
          reader.onerror = reject;
        });
        promise.then((result) => this.data.insertImage(result));
      });
      // (function() { /*this.data.insertImage()*/
      //  // console.log(e)
      //   const file = e.target.files[0];
      //   const promise = new Promise(function (resolve, reject) {
      //     const reader = new FileReader();
      //     reader.readAsDataURL(file);
      //     reader.onload = () => {
      //       resolve(reader.result);
      //     };
      //     reader.onerror = reject;
      //   });
      //   promise.then((result) => this.data.insertImage(result));})
      /////
    },
    insertEditableAreaMarker() {
      
      this.data.addEditableAreaMarker()
    },
    addInputField: function (e) {
      //this.data.selectedElement.addInputField();
    },
  },
};
</script>

<style lang="scss"></style>
