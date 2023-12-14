<template>
  <tr
    lang="ru"
    ref="row"
    class="row"
    :elementType="'row'"
    :id="data.id"
    :elementId="data.id"
    :style="paragraphStyles"
    @dragstart="dragHandler"
    @add-input-field="addInputField"
  >
    <template v-for="el in data.elements" :key="el.id">
      <CellElement
        v-if="el.type == 'cell'"
        :data="el"
        class="cell"
      />
    </template>
  </tr>
</template>

<script>
import RowElement from "@/classes/RowElement.js";
import CellElement from "./CellElement.vue";
import { fromCmToPx } from "@/common/utils";

export default {
  components: { CellElement },

  props: { data: RowElement },

  mounted() {
    this.data.domElement = this.$refs.row;
  },

  computed: {
    // Вычисление отступов
    paragraphStyles() {
      return {
        marginTop: fromCmToPx(this.data.spacingBefore) + "px",
        marginBottom: fromCmToPx(this.data.spacingAfter) + "px",
        marginLeft: fromCmToPx(this.data.indentLeft) + "px",
        marginRight: fromCmToPx(this.data.indentRight) + "px",
        textIndent: fromCmToPx(this.data.firstLineIndent) + "px",
        lineHeight: this.data.lineHeight,
        textAlign: this.data.align,
      };
    },
    listMarkStyle() {
      return {
        width: fromCmToPx(1.25) + "px",
        fontWeight: this.data.elements[0].bold ? 700 : 400,
        textDecoration: this.data.elements[0].underline ? "underline" : "none",
        fontStyle: this.data.elements[0].italic ? "italic" : "normal",
        fontFamily: this.data.elements[0].fontFamily,
        fontSize: this.data.elements[0].fontSize + "pt",
      };
    },
    listIndex() {
      if (this.data.listType == "numbered") {
        let str = "";
        this.data.listValue.forEach((number) => {
          str += number + ".";
        });
        return str;
      } else {
        return this.data.listBullet;
      }
    },
  },

  methods: {
    selectElement: function (element) {
      this.data.selectedElement = element;
    },
  },
};
</script>

<style lang="scss" scoped>

table,
th,
td {
  border: 1px solid;
  height: 100%;
  border-collapse: collapse;
}
</style>
