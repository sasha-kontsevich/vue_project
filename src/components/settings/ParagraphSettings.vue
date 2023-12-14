<template>
  <div class="group">
    <div class="header">
      <h5>Абзац</h5>
    </div>
    <div class="body">
      <div class="row space-between">
        <button
          class="icon-button"
          :class="{ checked: data.align == 'left' }"
          @click="data.align = 'left'"
        >
          L
        </button>
        <button
          class="icon-button"
          :class="{ checked: data.align == 'center' }"
          @click="data.align = 'center'"
        >
          C
        </button>
        <button
          class="icon-button"
          :class="{ checked: data.align == 'right' }"
          @click="data.align = 'right'"
        >
          R
        </button>
        <button
          class="icon-button"
          :class="{ checked: data.align == 'justify' }"
          @click="data.align = 'justify'"
        >
          J
        </button>

        <input
          name="Indent"
          step="0.25"
          type="number"
          v-model="data.firstLineIndent"
        />
        <input
          name="LineHeight"
          step="0.05"
          type="number"
          v-model="data.lineHeight"
        />
      </div>
      <div class="row">
        <label for="MarginTop">Сверху</label>
        <input
          name="MarginTop"
          step="0.25"
          type="number"
          v-model="data.spacingBefore"
        />
      </div>
      <div class="row">
        <label for="MarginBottom">Снизу</label>
        <input
          name="MarginBottom"
          step="0.25"
          type="number"
          v-model="data.spacingAfter"
        />
      </div>
      <div class="row">
        <label for="MarginLeft">Слева</label>
        <input
          name="MarginLeft"
          step="0.25"
          type="number"
          v-model="data.indentLeft"
        />
      </div>
      <div class="row">
        <label for="MarginRight">Справа</label>
        <input
          name="MarginRight"
          step="0.25"
          type="number"
          v-model="data.indentRight"
        />
      </div>
      <div class="row"><button @click="addInputField">Поле ввода 2</button></div>
    </div>
  </div>
</template>

<script>
import ParagraphElement from "@/classes/ParagraphElement";

export default {
  name: "ParagraphSettings",
  props: { data: ParagraphElement },
  methods: {
    addInputField: function (e) {
      this.data.addInputField();
      const sel = window.getSelection();
      sel.anchorNode.dispatchEvent(
        new Event("add-input-field", { bubbles: true })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.fontFamilies {
  width: 150px;
}
.space-between {
  display: flex;
  justify-content: space-between;
}
.icon-button {
  width: 20px;
}
button.checked {
  background-color: #ccc;
}
</style>
