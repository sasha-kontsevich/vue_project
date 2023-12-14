<template>
  <span
    class="image-container"
    @custom-input="inputHandler"
    :id="data.id"
    :elementLength="data.length"
    :elementType="'inlineElement'"
  >
    <img contenteditable="true" :src="data.src" :alt="data.src" />
  </span>
</template>

<script>
import ImageElement from "@/classes/ImageElement";
import { fromCmToPx } from "@/common/utils";

export default {
  props: { data: ImageElement },
  computed: {
    // Вычисление отступов
    values() {
      return {
        top: fromCmToPx(this.data.margin.top),
        left: fromCmToPx(this.data.margin.left),
        right: fromCmToPx(this.data.margin.right),
        bottom: fromCmToPx(this.data.margin.bottom),
      };
    },
  },
  methods: {
    getCaretPosition: function () {
      const sel = window.getSelection();
      return sel.anchorOffset;
    },
    inputHandler: function (e) {
      if (e.inputType == "deleteContentForward") {
        if (this.data.isBegin(this.getCaretPosition())) {
          this.data.delete();
        }
      }
      if (e.inputType == "deleteContentBackward") {
        if (this.data.isEnd(this.getCaretPosition())) {
          this.data.delete();
        }
      }
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.image-container {
  img {
    display: inline-block;
    width: 300px;
    height: auto;
  }
}
</style>
