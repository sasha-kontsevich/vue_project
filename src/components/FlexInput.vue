<template>
  <div class="field">
    <input
      ref="input"
      type="text"
      :value="value"
      @input="inputHandler($event.target.value)"
      @change="inputHandler($event.target.value)"
      @focus="this.$emit('focus')"
      @blur="this.$emit('blur')"
    />
    <div ref="buffer" class="input-buffer"></div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  props: ["value"],

  data () {
    return {
      inputWidth: 0
    };
  },

  updated () {
    this.changeWidth();
  },

  methods: {
    inputHandler: function (val) {
      this.$emit("input", val);
      this.changeWidth();
    },
    changeWidth: function () {
      $(this.$refs.buffer).text($(this.$refs.input).val());
      $(this.$refs.input).width($(this.$refs.buffer).width() + 1);
    }
  },

  mounted () {
    this.changeWidth();
  }
};
</script>

<style lang="scss" scoped>
.field {
  display: inline;
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
