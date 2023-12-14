<template>
  <div class="column">
    <div class="row">
      <!-- https://developer.mozilla.org/ru/docs/Web/HTML/Element/Input/number search options-->
      <select
        class="fontSizes"
        name="fontSizes"
        @click="testFontStyle()"
        v-model="currentFontSize"
      >
        <option v-for="fontSize in fontSizes" :key="fontSize" :value="fontSize">
          {{ fontSize }}
        </option>
      </select>
      <select class="fontFamilies" name="fontFamilies" v-model="currentFont">
        <option
          v-for="fontFamily in fontFamilies"
          :key="fontFamily.title"
          :value="fontFamily.value"
        >
          {{ fontFamily.title }}
        </option>
      </select>
    </div>

    <div class="row">
      <div class="hor-group">
        <button
          class="small-button"
          :class="{ checked: data.selectedElement.selectedChunk.bold }"
          @click="
            data.selectedElement.selectedChunk.bold =
              !data.selectedElement.selectedChunk.bold
          "
        >
          <span class="inscription bold">Ж</span>
        </button>
        <button
          class="small-button"
          :class="{ checked: data.selectedElement.selectedChunk.italic }"
          @click="
            data.selectedElement.selectedChunk.italic =
              !data.selectedElement.selectedChunk.italic
          "
        >
          <span class="inscription italic">К</span>
        </button>
        <button
          class="small-button"
          :class="{ checked: data.selectedElement.selectedChunk.underline }"
          @click="
            data.selectedElement.selectedChunk.underline =
              !data.selectedElement.selectedChunk.underline
          "
        >
          <span class="inscription underline">Ч</span>
        </button>
      </div>
      <div class="hor-group alignment-buttons">
        <button
          class="small-button"
          :class="{ checked: selectionBasedAlign == 'left' }"
          @click="alignContentLeft()"
        >
          <img src="@/assets/align_left_icon.svg" />
        </button>
        <button
          class="small-button"
          :class="{ checked: selectionBasedAlign == 'center' }"
          @click="alignContentCenter()"
        >
          <img src="@/assets/align_center_icon.svg" />
        </button>
        <button
          class="small-button"
          :class="{ checked: selectionBasedAlign == 'right' }"
          @click="alignContentRight()"
        >
          <img src="@/assets/align_right_icon.svg" />
        </button>
        <button
          class="small-button"
          :class="{ checked: selectionBasedAlign == 'justify' }"
          @click="alignContentJustify()"
        >
          <img src="@/assets/align_justify_icon.svg" />
        </button>
      </div>
    </div>
  </div>

  <div class="column">
    <div class="row">
      <div class="hor-group">
        <button class="small-button">
          <img src="@/assets/text_color_icon.svg" />
        </button>
      </div>
    </div>
    <div class="row">
      <div class="hor-group">
        <button
          class="small-button"
          :class="{ checked: data.symbolsEnabled }"
          @click="data.symbolsEnabled = !data.symbolsEnabled"
        >
          <img src="@/assets/pilcrow_icon.svg" />
        </button>
      </div>
    </div>
  </div>

  <div class="column margins">
    <div class="row">
      <div class="hor-group">
        <input
          name="marginTop"
          step="0.25"
          type="number"
          v-model="data.marginTop"
        />
        <label for="marginTop">Верхнее</label>
      </div>
      <div class="hor-group">
        <label for="marginLeft">Левое</label>
        <input
          name="marginLeft"
          step="0.25"
          type="number"
          v-model="data.marginLeft"
        />
      </div>
    </div>
    <div class="row">
      <div class="hor-group">
        <input
          name="marginBottom"
          step="0.25"
          type="number"
          v-model="data.marginBottom"
        />
        <label for="marginBottom">Нижнее</label>
      </div>
      <div class="hor-group">
        <label for="marginRight">Правое</label>
        <input
          name="marginRight"
          step="0.25"
          type="number"
          v-model="data.marginRight"
        />
      </div>
    </div>
  </div>
  <div class="column">
    <div class="row"><div class="dropdown">Разрывы</div></div>
    <div class="row"><div class="dropdown">Номер страницы</div></div>
  </div>
</template>

<script>
import { fontFamilies, fontSizes } from "@/common/defaults";
import Document from "@/classes/DocumentTemplate";
import { formats } from "@/common/defaults";
export default {
  name: "PageInstrumentPanel",
  props: { data: Document },
  data() {
    return {
      fontFamilies,
      fontSizes,
      formats,
    };
  },
  inject: ["templateEditor"],
  methods: {
    alignContentJustify() {
      this.data.selectedParagraphs.forEach((paragraph) => {
        paragraph.align = "justify";
      });
    },
    alignContentRight() {
      this.data.selectedParagraphs.forEach((paragraph) => {
        paragraph.align = "right";
      });
    },
    alignContentCenter() {
      this.data.selectedParagraphs.forEach((paragraph) => {
        paragraph.align = "center";
      });
    },
    alignContentLeft() {
      console.log("Left");
      this.data.selectedParagraphs.forEach((paragraph) => {
        paragraph.align = "left";
      });
    },
    testFontStyle() {
    },
  },
  computed: {
    selectionBasedAlign() {
      let mainAlign = this.data.selectedParagraphs[0].align;
      let alignsArray = this.data.selectedParagraphs.filter(
        (paragraph) => paragraph.align == mainAlign
      );
      if (alignsArray.length == this.data.selectedParagraphs.length) {
        return mainAlign;
      } else return "";
    },
    currentFont: {
      get() {
        let fonts = this.data.selectedInlines.filter(
          (inline) =>
            inline.fontFamily !== this.data.selectedInlines[0].fontFamily
        );
        if (fonts.length > 0) {
          return false;
        } else {
          return this.data.selectedInlines[0].fontFamily;
        }
      },
      set(fontFamily) {
        let inlines = this.templateEditor.createStyleRange();
        inlines.forEach((inline) => {
          inline.fontFamily = fontFamily;
        });
      },
    },
    currentFontSize: {
      get() {
        let fontsSizes = this.data.selectedInlines.filter(
          (inline) =>
            inline.fontSize !== this.data.selectedInlines[0].fontSize
        );
        if (fontsSizes.length > 0) {
          return false;
        } else {
          return this.data.selectedInlines[0].fontSize;
        }
      },
      set(fontSize) {
        let inlines = this.templateEditor.createStyleRange();
        inlines.forEach((inline) => {
          inline.fontSize = fontSize;
        });
      },
    },
    currentFontStyle: {
      get() {
        let fontsSizes = this.data.selectedInlines.filter(
          (inline) =>
            inline.fontSize !== this.data.selectedInlines[0].fontSize
        );
        if (fontsSizes.length > 0) {
          return false;
        } else {
          return this.data.selectedInlines[0].fontSize;
        }
      },
      set(fontSize) {
        let inlines = this.templateEditor.createStyleRange();
        inlines.forEach((inline) => {
          inline.fontSize = fontSize;
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.bold {
  font-weight: 700;
}
.italic {
  font-style: italic;
}
.underline {
  text-decoration: underline;
}
.inscription {
  font-family: sans-serif;
  font-size: 14px;
}
.alignment-buttons {
  margin-left: 16px;
}
label {
  margin: 3px;
  font-size: 11px;
}
.margins {
  width: 190px;
}
</style>
