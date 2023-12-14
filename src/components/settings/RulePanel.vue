<template>
  <div class="rule-btn">
    <button class="ui mini primary basic button" @click="addRule()">
      Добавить правило
    </button>
    <a class="ui mini blue circular label" @click="debug()">?</a>
  </div>
  <div class="ui styled accordion" v-for="(rule, k) in data.rules" :key="k">
    <RuleElement
      :selectedRange="selectedRange"
      :data="rule"
      @clearBuffer="clearRuleRangeBuffer"
      @update="updateAccordion"
      @deleteRule="deleteRule(rule)"
    ></RuleElement>
  </div>
</template>

<script>
import RuleElement from "../RuleElement.vue";
import Rule from "@/classes/RuleElement";
import DocumentTemplate from "../DocumentTemplate.vue";
export default {
  name: "RulePanel",
  props: { data: DocumentTemplate },
  mounted() {
    $(".ui.accordion").accordion();
  },
  data() {
    return {};
  },
  inject: ["templateEditor"],
  components: { RuleElement },
  methods: {
    //Rules
    addRule: function () {
      this.data.rules.unshift(new Rule());
    },
    deleteRule(el) {
      this.data.rules = this.data.rules.filter(function (rule) {
        return rule.id != el.id;
      });
    },
    //Accordion
    updateAccordion(el) {
      $(el).parent().accordion("open", 0);
    },
    clearRuleRangeBuffer() {
      const ruleBuffer = this.templateEditor.template.ruleRangeBuffer;
      const affectedCases = this.templateEditor.template.rules
        .reduce((a, b) => a.concat(b.cases), [])
        .filter(
          (el) =>
            (ruleBuffer.includes(el.range[0]) ||
              ruleBuffer.includes(el.range[el.range.length - 1])) &&
            !(
              ruleBuffer.includes(el.range[0]) &&
              ruleBuffer.includes(el.range[el.range.length - 1])
            )
        );

      console.log("Affected Case", affectedCases);

      affectedCases.forEach((el) => {
        el.range = el.range.filter((v) => !ruleBuffer.includes(v));
      });
      console.log("Affected Case 2", affectedCases);
      // !ruleBuffer.includes(el.range[0]) ||
      //   !ruleBuffer.includes(el.range[el.range.length - 1]) ===
      //     !ruleBuffer.join().includes(el.range.join());

      this.templateEditor.template.ruleRangeBuffer = [];
    },
    //Test
    debug() {
      console.log(this.templateEditor.template);
    },
  },
  computed: {
    selectedRange() {
      const range = this.templateEditor.template.ruleRangeBuffer;
      let rangeByInline = [];

      if (
        this.templateEditor._selFocusElem.getInlineElemByPos(
          this.templateEditor._selFocusOffset
        )?.isRuleAffected
      ) {
        rangeByInline = this.templateEditor._selFocusElem.getInlineElemByPos(
          this.templateEditor._selFocusOffset
        )?.ruleRangeList[0];
      }
      return range.length ? range : rangeByInline;
    },
  },
};
</script>

<style scoped>
.ui.fluid.dropdown {
  display: flex !important;
  width: 100% !important;
  min-width: 0;
}
.ui.label > .icon,
.ui.left.icon.label > .icon {
  width: auto;

  margin-top: 0px;
  margin-right: 0em;
  margin-bottom: 0px;
  margin-left: 0px;
}

.link {
  margin-top: 1em !important;
}

.ui.fluid.dropdown {
  display: flex !important;
  width: 100% !important;
  min-width: 0;
  flex-direction: column;
}
.ui.multiple.dropdown > .label {
  display: flex !important;
  white-space: normal;
  font-size: 1em;
  padding: 0.35714286em 0.78571429em;
  margin: 0.14285714rem 0.28571429rem 0.14285714rem 0;
  box-shadow: 0 0 0 1px rgb(34 36 38 / 15%) inset;
  justify-content: space-between;
}

.custom {
  margin-top: 0.5em !important;
}
.ui.accordion .accordion {
  margin-top: 0.5em !important;
  padding: 0;
}
.custom-label {
  margin-top: 1.5em !important;
}
.ui.basic.primary.button,
.ui.basic.primary.buttons .button {
  background: 0 0;
  box-shadow: 0 0 0 1px #2185d0 inset;
  color: #2185d0;
  margin-right: 0em;
}
.rule-input {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: center;
}
.ui.accordion .title:not(.ui) {
  padding: 0.5em 0;
  font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.87);
}
.ui.circular.label,
.ui.circular.labels .label {
  min-width: 2em;
  min-height: 2em;
  padding: 0.5em !important;
  line-height: 1em;
  text-align: center;
  border-radius: 500rem;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}
.ui.styled.accordion .accordion .content,
.ui.styled.accordion .content {
  margin: 0;
  padding: 0.5em 1em 1.5em;
  padding-top: 0.5em;
  padding-right: 0.5em;
  padding-bottom: 1.5em;
  padding-left: 1em;
}

.rule-btn {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1em;
}
.add-btn {
  align-items: flex-end;
  display: inline-flex;
  flex-direction: column;
}
.btn-sm {
  padding-left: 1em !important;
  padding-right: 1em !important;
}
.list-options {
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  align-items: right;
}
.text-button {
  border: 1px solid #c4c4c4;
  height: 21px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  cursor: pointer;
  justify-content: center;
  color: rgba(0, 136, 255, 0.431);
}
.ruleList {
  display: flex;
}
.ui.styled.accordion,
.ui.styled.accordion .accordion {
  border-radius: 0.28571429rem;
  text-align: left;
  box-shadow: 0 1px 2px 0 rgb(34 36 38 / 15%), 0 0 0 1px rgb(34 36 38 / 15%);
}
element.style {
  display: flex;
  align-content: flex-start;
  flex-direction: column;
}

.list-options[data-v-7abc4d28] {
  margin-bottom: 1em;
  display: flex !important;
  flex-direction: column;
  align-items: right;
}
</style>
