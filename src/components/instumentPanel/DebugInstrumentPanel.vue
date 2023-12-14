<template>
  <div class="column">
    <div class="row">
      <div class="hor-group">
        <input
          name="selStartPos"
          step="1"
          type="number"
          v-model="data.template.selection.selStartPos"
        />
        <label for="selStartPos">selStartPos</label>
      </div>
    </div>
    <div class="row">
      <div class="hor-group">
        <input
          name="selEndPos"
          step="1"
          type="number"
          v-model="data.template.selection.selEndPos"
        />
        <label for="selEndPos">selEndPos</label>
      </div>
    </div>
  </div>

  <div class="column">
    <div class="row">
      <div class="hor-group">
        <input
          type="checkbox"
          name="isCollapsed"
          v-model="data.template.selection.isCollapsed"
        />
        <label for="isCollapsed">isCollapsed</label>
      </div>
    </div>
  </div>
</template>

<script>
import DocumentEditor from "@/classes/DocumentTemplateEditor";
export default {
  name: "DebugInstrumentPanel",
  props: { data: DocumentEditor },
};
</script>

<style>
</style>