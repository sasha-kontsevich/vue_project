<template>
  <div class="absolute">
  <DocumentTemplateEditor :data="data" />
</div>
</template>

<script>
// @ is an alias to /src
import DocumentEditor from "../classes/DocumentTemplateEditor.js";
import DocumentTemplateEditor from "../components/DocumentTemplateEditor.vue";
export default {
  name: "EditorView",
  components: {
    DocumentTemplateEditor,
  },
  props: {
    data: DocumentEditor,
  },
};
</script>
<style lang="scss">

.absolute {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
} 
</style>
