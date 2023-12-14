<template>
  <div class="ui fluid selection dropdown">
    <input type="hidden" />
    <i class="dropdown icon"></i>
    <div class="text"></div>
    <div class="menu">
    </div>
  </div>
</template>

<script>
export default {
  name: "v-dropdown",
  props: {
    modelValue: undefined,
    list: Array,
  },
  emits: ["update:modelValue"],
  mounted() {
    $(this.$el).dropdown({
      values: this.list,
      onChange: (val) => {
        this.$emit("update:modelValue", val);
      }
    });
    if (this.modelValue) {
      $(this.$el).dropdown("set selected", this.modelValue);
    }
  },
  computed: {
    isClearable() {
      return $(this.el).hasClass("clearable");
    },
    isMultiple() {
      return $(this.el).hasClass("multiple");
    },
    actualValue () {

    }
  },
  watch: {
    list () {
        $(this.$el).dropdown('change values', this.list)
        $(this.$el).dropdown('set selected', this.modelValue);
    }
  }
};
</script>

<style lang="scss" scoped></style>
