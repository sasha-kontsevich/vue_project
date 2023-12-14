<template>
  <div class="group"></div>
  <div class="group">
    <button @click="data.selectedElement.switchList('numbered')">
      Нумерованный список 
    </button>
    <button @click="data.selectedElement.switchList('bulleted')">
      Маркированный  список 
    </button>
  </div>
  <div class="group" v-if="data.selectedElement == null">
    <div style="font-size: 9px; text-align: justify">
      {{ data.title }}<br />
      {{ data.description }}<br />
    </div>
  </div>
  <div class="group" v-if="data.selectedElement?.type == 'paragraph'">
    <div style="font-size: 9px; text-align: justify">
      <span v-for="chunk in data.selectedElement.chunks" :key="chunk.id">
        {{ chunk.toString() }}
      </span>
    </div>
  </div>
</template>

<script>
import Document from "@/classes/DocumentTemplate";

export default {
  name: "DebugPanel",
  props: { data: Document },
};
</script>

<style scoped>
</style>
