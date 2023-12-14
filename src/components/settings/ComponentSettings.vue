<template>
  <div class="field">
    <label for="docTitle">Заголовок шаблона</label>
    <input type="text" id="docTitle" v-model="data.title" />
  </div>
  <div class="field">
    <label for="docDescription">Описание шаблона</label>
    <textarea
      name=""
      id="docDescription"
      rows="10"
      v-model="data.description"
    ></textarea>
  </div>
</template>

<script>
import Document from "@/classes/DocumentTemplate";

export default {
  name: "ComponentSettings",
  props: { data: Document },
};
</script>

<style lang="scss" scoped>
.field {
  margin-bottom: 10px;
  label {
    display: block;
    text-align: left;
    font-size: 12px;
    margin-bottom: 2px;
  }
  input {
    display: block;
    width: 100%;
    font-size: 12px;
    padding: 9px 12px;
    outline: none;
    border: 1px solid #c4c4c4;
    border-radius: 1px;
  }
  textarea {
    display: block;
    width: 100%;
    resize: none;
    font-size: 12px;
    padding: 9px 12px;
    outline: none;
    border: 1px solid #c4c4c4;
    border-radius: 1px;
  }
}
</style>
