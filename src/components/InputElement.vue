<template>
  <span
    class="input-field"
    :elementLength="data.length"
    :elementType="'inlineElement'"
    :id="data.id"
    :style="{
      fontWeight: data.bold ? 700 : 400,
      textDecoration: data.underline ? 'underline' : 'none',
      fontStyle: data.italic ? 'italic' : 'normal',
      fontFamily: data.fontFamily,
      fontSize: data.fontSize + 'pt',
    }"
  >
   <span class="text-element" contenteditable="false"></span>
    <div class="field">
      <input
        ref="input"
        type="text"
        :value="data.title"
        @input="inputHandler($event.target.value)"
        @change="inputHandler($event.target.value)"
        @focus="this.$emit('focus')"
        @blur="this.$emit('blur')"
        readonly
      />
      <div ref="buffer" class="input-buffer"></div>
    </div>
    <span class="text-element" @mousedown="setPos(2)"></span>
  </span>
</template>

<script>
import $ from "jquery";
export default {
  props: ["data"],

  data() {
    return {
      inputWidth: 0,
    };
  },

  updated() {
    this.changeWidth();
  },

  methods: {
    setPos(pos) {
      console.log(pos)
    },
    inputHandler: function (val) {
      this.$emit("input", val);
      this.changeWidth();
    },
    changeWidth: function () {
      $(this.$refs.buffer).text($(this.$refs.input).val());
      $(this.$refs.input).width($(this.$refs.buffer).width() + 1);
    },
  },

  mounted() {
    this.changeWidth();
  },
};
</script>

<style lang="scss" scoped>

.field {
  display: inline;
  cursor: pointer;
}

.field * {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  font-weight: inherit;
  white-space: pre;
  text-align: left;
  text-indent: 0;
}
.field input {
  border: none;
  min-width: 20px;
  background-color: #ddd;
  border: 1px solid #aaa;
  // border-radius: 2px;
  cursor: pointer;

  &:focus {
    outline: none;
    background-color: #eee;
  }
}

.input-buffer {
  position: absolute;
  top: -1000px;
  left: -1000px;
  visibility: hidden;
}
</style>
