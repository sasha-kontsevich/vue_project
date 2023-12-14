<template>
  <div
    lang="ru"
    ref="table"
    class="table"
    :elementType="'table'"
    :id="data.id"
    :elementId="data.id"
    :style="tableStyles"
    @dragstart="dragHandler"
    @add-input-field="addInputField"
  >
    <table>
      <colgroup>
        <col v-for="(x, k) in data.xLength" :width="x" :key="k" />
      </colgroup>
      <tbody>
        <template v-for="el in data.elements" :key="el.id">
          <RowElement
            v-if="el.type == 'row'"
            :data="el"
            class="row"
            :style="{
             minHeight: data.yLength[data.elements.indexOf(el)]+'px',
            }"
            @selection-changed="selectElement(el)"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableElement from "@/classes/TableElement";
import RowElement from "./RowElement.vue";
import { fromCmToPx } from "@/common/utils";

export default {
  components: { RowElement },

  props: { data: TableElement },

  mounted() {
    this.data.domElement = this.$refs.row;
  },

  computed: {
    // Вычисление отступов
    tableStyles() {
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
  },

  methods: {
    selectElement: function (element) {
      this.data.selectedElement = element;
    },
  },
};
</script>

<style lang="scss" scoped>
.table{
  height: 100%;
}
table,
th,
td {
  border: 1px solid;
  border-collapse: collapse;
  height: 100%;
}
</style>
<!-- <template v-for="(y,key) in data.yLength" :minHeight="y" :key="key">
  <RowElement
    v-if="key.type == 'row'"
    :data="key"
    class="row"
    @selection-changed="selectElement(key)"
  />
</template> -->
