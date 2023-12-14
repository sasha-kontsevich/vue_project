<template>
  <div>
    <div>
      <input type="file" @change="docInputChangeHandler" />
    </div>
  </div>
</template>

<script>
import DocumentTemplate from "@/classes/DocumentTemplate";

export default {
  name: "TemplateInstrumentPanel",
  props: { data: DocumentTemplate },
  methods: {
    docInputChangeHandler: function (e) {
      this.loadDocument(e.target);
    },
    // Загрузка документа из формы
    loadDocument: function (input) {
      const file = input.files[0];
      const promise = new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const documentData = JSON.parse(reader.result);
          resolve(documentData);
        };
        reader.onerror = reject;
      });
      promise.then((result) => (this.data.load(result)));
    },
  },
};
</script>

<style lang="scss">
</style>