<template>
  <div class="absolute">
    User Side
  <DocumentTemplateUserForm :data="data"  />
</div>
</template>

<script>
// @ is an alias to /src
import DocumentEditor from "../classes/DocumentTemplateEditor.js";
import DocumentTemplateUserForm from "../components/DocumentTemplateUserForm.vue";
export default {
  name: "UserView",
  components: {
    DocumentTemplateUserForm,
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