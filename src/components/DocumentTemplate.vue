<template>
  <div
    class="page"
    ref="page"
    contenteditable="true"
    :style="pageStyles"
    @click="clickHandler"
  >
    <!-- Элементы документа -->
    <template v-for="el in data.elements" :key="el.id">
      <!-- <ParagraphElement
        v-if="el.type == 'paragraph'&&el.isRuleAffected()"
        :data="el"
        :class="generateClasses()"
        @selection-changed="selectElement(el)"
      /> -->
      <ParagraphElement
        v-if="el.type == 'paragraph'"
        :data="el"
        class="element"
        @selection-changed="selectElement(el)"
      />
      <TableElement
        v-if="el.type == 'table'"
        :data="el"
        class="table"
        @selection-changed="selectElement(el)"
      />
    </template>
  </div>
</template>

<script>
import { fromCmToPx, fromCmToPt } from "@/common/utils";
import DocumentTemplate from "@/classes/DocumentTemplate";
import ParagraphElement from "./ParagraphElement.vue";
import TableElement from "./TableElement.vue";


export default {
  components: { ParagraphElement, TableElement },

  name: "DocumentTemplate",
  props: { data: DocumentTemplate },
  computed: {
    pageStyles() {
      return {
        //Размер страницы
        height: "auto",
        width: fromCmToPt(this.data.width) + "pt",
        minWidth: fromCmToPt(this.data.width) + "pt",
        minHeight: fromCmToPt(this.data.height) + "pt",
        //Поля
        paddingTop: fromCmToPx(this.data.marginTop) + "px",
        paddingLeft: fromCmToPx(this.data.marginLeft) + "px",
        paddingRight: fromCmToPx(this.data.marginRight) + "px",
        paddingBottom: fromCmToPx(this.data.marginBottom) + "px",
      };
    },
  },
  updated(){
  console.log("Update template")
  },
  methods: {
    selectElement: function (element) {
      this.data.selectedElement = element;
    },
    generateClasses:function(){
      return 'rule-light'
    }
  },
};
</script>

<style lang="scss">
.page {
  height: 842pt;
  min-height: 842pt;
  width: 595pt;
  min-width: 595pt;
  background-color: #fff;
  padding: 50px 50px 100px 75px;
  margin-bottom: 10px;
  outline: none;
  overflow: hidden;
  box-shadow: #ddd 0 0 10px 0px;
  color: #000;
}

.element {
  // background-color: #f8f8f8;
  text-align: justify;
  font-family: "Times New Roman", Times, serif;
  font-size: 14pt;
  text-indent: 30pt;
  border-radius: 3px;
}
.rule-dark span {
   background-color: rgb(255, 105, 105);
  text-align: justify;
  font-family: "Times New Roman", Times, serif;
  font-size: 20pt;
  text-indent: 30pt;
  border-radius: 3px;
}
.rule-light span  {
   background-color: rgb(255, 105, 105);
  text-align: justify;
  font-family: "Times New Roman", Times, serif;
  font-size: 20pt;
  text-indent: 30pt;
  border-radius: 3px;
}
</style>
