<template>
  <div class="column">
    <div class="row">
      <!-- https://developer.mozilla.org/ru/docs/Web/HTML/Element/Input/number search options-->
      <select
        class="fontSizes"
        name="fontSizes"
        v-model="data.selectedElement.selectedChunk.fontSize"
      >
        <option v-for="fontSize in fontSizes" :key="fontSize" :value="fontSize">
          {{ fontSize }}
        </option>
      </select>
      <select
        class="fontFamilies"
        name="fontFamilies"
        v-model="data.selectedElement.selectedChunk.fontFamily"
      >
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
          :class="{ checked: data.selectedElement.align == 'left' }"
          @click="data.selectedElement.align = 'left'"
        >
          <img src="@/assets/align_left_icon.svg" />
        </button>
        <button
          class="small-button"
          :class="{ checked: data.selectedElement.align == 'center' }"
          @click="data.selectedElement.align = 'center'"
        >
          <img src="@/assets/align_center_icon.svg" />
        </button>
        <button
          class="small-button"
          :class="{ checked: data.selectedElement.align == 'right' }"
          @click="data.selectedElement.align = 'right'"
        >
          <img src="@/assets/align_right_icon.svg" />
        </button>
        <button
          class="small-button"
          :class="{ checked: data.selectedElement.align == 'justify' }"
          @click="data.selectedElement.align = 'justify'"
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
          id="indentLeft"
          step="0.25"
          type="number"
          v-model="data.selectedElement.indentLeft"
        />
        <label for="indentLeft">Слева</label>
      </div>
      <div class="hor-group">
        <label for="spacingBefore">До</label>
        <input
          id="spacingBefore"
          step="0.25"
          type="number"
          v-model="data.selectedElement.spacingBefore"
        />
      </div>
    </div>
    <div class="row">
      <div class="hor-group">
        <input
          id="indentRight"
          step="0.25"
          type="number"
          v-model="data.selectedElement.indentRight"
        />
        <label for="indentRight">Справа</label>
      </div>
      <div class="hor-group">
        <label for="spacingAfter">После</label>
        <input
          id="spacingAfter"
          step="0.25"
          type="number"
          v-model="data.selectedElement.spacingAfter"
        />
      </div>
    </div>
  </div>
  <div class="column">
    <div class="row">
      <div class="hor-group">
        <div class="dropdown">Отступ</div>
        <input
          id="firstLineIndent"
          step="0.25"
          type="number"
          v-model="data.selectedElement.firstLineIndent"
        />
      </div>
    </div>
    <div class="row">
      <div class="hor-group">
        <div class="dropdown">Интервал</div>
        <input
          id="lineHeight"
          step="0.05"
          type="number"
          v-model="data.selectedElement.lineHeight"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fontFamilies, fontSizes } from "@/common/defaults";
import DocumentTemplate from "@/classes/DocumentTemplate";

export default {
  name: "ParagraphInstrumentPanel",
  props: { data: DocumentTemplate },
  data() {
    return {
      fontFamilies,
      fontSizes,
    };
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