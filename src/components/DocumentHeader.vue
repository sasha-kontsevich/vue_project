<template>
  <div class="document-header colored">
    <div class="buttons">
      <a @click="saveCurrentDocument">
        <button @mouseup="unfocus">
          <img src="@/assets/save_icon.svg" alt="Сохранить" />
        </button>
      </a>
      <button @mouseup="unfocus">
        <img src="@/assets/undo_icon.svg" alt="Отменить" />
      </button>
      <button @mouseup="unfocus">
        <img src="@/assets/redo_icon.svg" alt="Повторить" />
      </button>
    </div>
    <div class="title">{{ data.title }}</div>
    <div style="width: 200px">
    </div>
  </div>
</template>

<script>
import DocumentTemplate from "@/classes/DocumentTemplate";
import DocumentTemplateData from "@/classes/DocumentTemplateData";

export default {
  props: { data: DocumentTemplate },
  methods: {
    // Сохранение документа в файл
    saveCurrentDocument: function (e) {
      const json = JSON.stringify(new DocumentTemplateData(this.data));
      const blob = new Blob([json], { type: "text/plain" });
      e.currentTarget.setAttribute("href", URL.createObjectURL(blob));
      e.currentTarget.setAttribute("download", "my-text.json");
    },
    unfocus: function (e) {
      e.currentTarget.blur();
    },
  },
};
</script>

<style lang="scss">
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 30px;
  .buttons {
    display: flex;
    height: 100%;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      height: 100%;
      padding: 5px;
      &:hover {
        background-color: #fff1;
      }
      &:focus {
        background-color: #0002;
      }
    }
  }
  .title {
    height: 100%;
    display: flex;
    align-items: flex-end;
    padding-bottom: 3px;
  }
}
</style>
