<template>
  <span
    v-bind:class="{
      ruleRangeStart: isRangeStart,
      ruleRangeFinish: isRangeFinish,
      ruleSelectionStart: isRuleSelectionStart,
      ruleSelectionFinish: isRuleSelectionFinish,
    }"
    :elementLength="data.length"
    :id="data.id"
    :elementType="'inlineElement'"
    :style="{
      fontWeight: data.bold ? 700 : 400,
      textDecoration: data.underline ? 'underline' : 'none',
      fontStyle: data.italic ? 'italic' : 'normal',
      fontFamily: data.fontFamily,
      fontSize: data.fontSize + 'pt',
      color: data.fontColor,
      background: bgColor,
    }"
  >
    {{ data.data }}
  </span>
</template>

<script>
import TextElement from "@/classes/TextElement";

export default {
  props: { data: TextElement },
  data() {
    return {
      test: "text-element"
    };
  },
  computed: {
    text () {
      return this.data.data
    },
    isRangeStart() {
      return this.data.isFirstWithinRange;
    },
    isRangeFinish() {
      return this.data.isLastWithinRange;
    },
    isRuleSelectionStart() {
      return this.data.isFirstWithinSelectionForRule;
    },
    isRuleSelectionFinish() {
      return this.data.isLastWithinSelectionForRule;
    },
    bgColor() {
      const colors = [];
      if (this.data.isRuleAffected) {
        colors.push(
          "linear-gradient(rgb(223 78 78 / 30%), rgb(223 78 78 / 30%))"
        );
      }
      if (this.data.isSelectedForRule) {
        colors.push(
          "linear-gradient(rgb(43 43 230 / 30%), rgb(43 43 230 / 30%))"
        );
      }
      return colors.join(",");
    },
  }
};
</script>

<style lang="scss" scoped>
.ruleRangeStart {
  border-left: 2px solid white;
  position: relative;
  &::before {
    position: absolute;
    left: 0;
    display: inline-block;
    width: 5px;
    height: 1.1em;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: #de4b41;
    top: 0px;
    content: "";
    left: -2px;
  }
}
.ruleRangeFinish {
  position: relative;
  &::after {
    position: absolute;
    display: inline-block;
    width: 5px;
    height: 1.1em;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-right: 2px solid;
    border-color: #de4b41;
    bottom: 0px;
    content: "";
    margin-left: -5px;
  }
}
.ruleSelectionStart {
  border-left: 2px solid white;
  position: relative;
  &::before {
    position: absolute;
    left: 0;
    display: inline-block;
    width: 5px;
    height: 1.1em;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: #4b8bde;
    top: 0px;
    content: "";
    left: -2px;
  }
}
.ruleSelectionFinish {
  position: relative;
  &::after {
    position: absolute;
    display: inline-block;
    width: 5px;
    height: 1.1em;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-right: 2px solid;
    border-color: #4b8bde;
    bottom: 0px;
    content: "";
    margin-left: -5px;
  }
}
</style>
