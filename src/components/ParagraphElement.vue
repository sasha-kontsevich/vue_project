<template>
  <div
    lang="ru"
    ref="paragraph"
    class="paragraph"
    :elementType="'paragraph'"
    :id="data.id"
    :elementId="data.id"
    :style="paragraphStyles"
    @dragstart="dragHandler"
    @add-input-field="addInputField"
  >
    <span
      class="list-marker"
      :style="listMarkStyle"
      v-if="data.listType != 'none'"
      :elementLength="0"
      :elementType="'inlineElement'"
      :isSelectable="false"
    >
      {{ listIndex }}
      <span style="float: right">{{ "\n" }}</span>
    </span>
    <template v-for="element in data.elements" :key="element.id">
      <TextElement
        v-if="element.type == 'text'"
        :data="element"
        @selection-changed="selectElement(element)"
      />

      <InputElement
        v-if="element.type == 'input'"
        :data="element"
        @selection-changed="selectElement(data)"
      />

      <ImageElement
        v-if="element.type == 'image'"
        :data="element"
        @selection-changed="selectElement(el)"
      />
    </template>
    <span class="line-break" :elementLength="0">
      <template v-if="data.symbolsEnabled"> {{ "¶" }} </template>
      <template v-if="!data.symbolsEnabled"> {{ "\n" }} </template>
    </span>
    <a
      class="ui violet inverted tag label"
      contenteditable="false"
      @click="deleteEditableAreaMarker"
      v-if="hasEditableMarker"
      >╸</a
    >
  </div>
</template>

<script>
import ParagraphElement from "@/classes/ParagraphElement";
import InputElement from "./InputElement.vue";
import ImageElement from "./ImageElement.vue";
import TextElement from "./TextElement.vue";
import { fromCmToPx } from "@/common/utils";

export default {
  components: { InputElement, ImageElement, TextElement },

  props: { data: ParagraphElement },

  mounted() {
    this.data.domElement = this.$refs.paragraph;
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
    hasEditableMarker() {
      let template = "";
      this.data.parent.type === "template"
        ? (template = this.data.parent)
        : (template = this.data.parent.parent.parent.parent);
      return template.editableAreaMarkers.includes(this.data.id);
    },
  },

  methods: {
    selectElement: function (element) {
      this.data.selectedElement = element;
    },
    deleteEditableAreaMarker() {
      let template = "";
      this.data.parent.type === "template"
        ? (template = this.data.parent)
        : (template = this.data.parent.parent.parent.parent);
      template.editableAreaMarkers = template.editableAreaMarkers.filter(
        (item) => item !== this.data.id
      );
    },
    getCaretPosition() {},

    setCaret: function (pos) {},
  },
};
</script>

<style lang="scss" scoped>
.paragraph {
  position: relative;
  outline: none;
  white-space: break-spaces;
  span {
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    word-wrap: break-word;
  }
  .list-marker {
    display: inline-block;
    text-indent: 0;
    text-align: left;
    user-select: none;
    &::before {
      content: none;
    }
  }
  .line-break {
    display: inline-block;
    max-width: 0;
    text-indent: 0;
  }

  .ui.tag.label::after,
  .ui.tag.labels .label::after {
    position: absolute;
    content: none !important;
  }
  .ui.tag.label::before,
  .ui.tag.labels .label::before {
    position: absolute;
    transform: translateY(-50%) translateX(50%) rotate(-45deg);
    top: 50%;
    right: 100%;
    content: "";
    background-color: inherit;
    background-image: none;
    width: 1.2em;
    height: 1.2em;
    transition: none;
    z-index: -1;
  }
  .ui.tag.label,
  .ui.tag.labels .label {
    width: 20px;
    height: 20px;
  }
  ui.inverted.labels .violet.label,
  .ui.ui.ui.inverted.violet.label {
    display: inline-flex;
    text-indent: 0;
    justify-content: left;
    align-items: center;
    /* height: 0; */
    /* left: 100%; */
    position: absolute;
    z-index: 1000;
    padding: 5px;
    color: white;
    font-weight: 900 !important;
  }
}
</style>
