<template>
  <div class="title title-flex" @click="updateRule">
    <i class="dropdown icon"></i>
    {{ data.title }}
    <div class="link-label-container" v-if="isLinked">
      <a class="ui mini blue circular label"
        ><i class="linkify icon link-label" style="visibility: visible"></i
      ></a>
    </div>
  </div>
  <div class="content">
    <div>
      <div class="rule-str-block">
        <label>Название правила</label>
        <div class="ui input rule-input">
          <input type="text" @change="updateDataTitle" />
        </div>
      </div>
      <div class="rule-str-block">
        <div class="accordion">
          <div class="title">
            <i class="dropdown icon"></i>
            Список опций
          </div>
          <div class="content">
            <div>
              <div v-for="option in data.options" :key="option.id">
                <div class="rule-option-input">
                  <div class="ui action input">
                    <input type="text" v-model="option.value" />
                    <button
                      class="ui button btn-sm"
                      @click="deleteOption(option.id)"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
              <div class="rule-option-input">
                <button
                  class="ui primary basic button rule-btn"
                  @click="addOption"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rule-str-block" v-if:="isLinkable">
        <div class="accordion">
          <div class="title">
            <i class="dropdown icon"></i>
            Целевые комбинации
          </div>
          <div class="content">
            <div>
              <div
                class="rule-str-block"
                v-for="(cs, index) in actualCases"
                :key="index"
              >
                <div class="rule-option-input">
                  <div class="ui action input">
                    <Dropdown
                      class="multiple"
                      :list="dropdownList"
                      :modelValue="cs.targetOptions"
                      @update:modelValue="(v) => updateCaseValue(v, index)"
                    />
                    <button
                      class="ui button btn-sm rule-btn"
                      @click="deleteCase(cs.id)"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
              <div class="rule-option-input">
                <button
                  class="ui primary basic button rule-btn"
                  @click="addCase"
                >
                  Добавить комбинацию
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rule-btn-block">
        <button
          class="ui primary basic button rule-btn main-btn"
          @click="deleteRule"
        >
          <i class="trash icon link-unlink" style="visibility: visible"></i>
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RuleElement from "@/classes/RuleElement";
import Case from "@/classes/Case";
import Dropdown from "@/common/Dropdown.vue";
import { uuidv4 } from "@/common/utils";

export default {
  components: {
    Dropdown,
  },
  props: { data: RuleElement, selectedRange: undefined },
  emits: ["update", "deleteRule", "clearBuffer"],
  data() {
    return {};
  },
  created() {},
  methods: {
    updateCaseValue(v, index) {
      this.data.cases[index].targetOptions = v.split(",");
    },
    updateDataTitle(v) {
      this.data.title = v.target.value;
      this.$emit("update", this.$el);
    },
    addOption() {
      let option = { id: uuidv4(), value: "Опция" };
      this.data.options.push(option);
    },
    deleteOption(id) {
      this.data.options = this.data.options.filter(function (option) {
        return option.id != id;
      });
    },
    deleteCase(id) {
      this.data.cases = this.data.cases.filter(function (cs) {
        return cs.id != id;
      });
    },
    test() {
      console.log(this.selectedInline);
    },
    updateRule() {
      $(".ui.accordion").accordion("refresh");
    },
    deleteRule() {
      this.$emit("deleteRule", this.$el);
    },
    addCase() {
      let cs = new Case();
      cs.rule = this.data;

      if (Array.isArray(this.selectedRange)) {
        cs.range = [...this.selectedRange];
      }

      this.$emit("clearBuffer");

      this.data.cases.push(cs);
    },
    checkRangeLink() {
      if (this.actualCases.length!==0) {
        return true;
      } else return false;
    },
    linkCaseWithRange() {
      this.data.cases.forEach((el) => {
        el.range = this.selectedRange;
      });
    },
  },
  computed: {
    dropdownList() {
      return this.data.options.map((el) => {
        return {
          name: el.value,
          value: el.id,
        };
      });
    },
    isLinked() {
      return this.checkRangeLink();
    },
    actualCases() {
      let actualCases = [];
      if (Array.isArray(this.selectedRange)) {
        actualCases = this.data.cases.filter(
          (cs) =>
            JSON.stringify(cs.range) === JSON.stringify(this.selectedRange)
        );
      } else if (typeof this.selectedRange === "string") {
        actualCases = this.data.cases.filter((cs) =>
          cs.range.includes(this.selectedRange)
        );
      }
      return actualCases;
    },
    isRangeSelected() {
      return this.selectedRange !== undefined;
    },
    isLinkable() {
      return this.selectedRange.length !== 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.ui.styled.accordion .accordion > .title,
.ui.styled.accordion > .title {
  /* margin: 0; */
  padding: 1.25em 1em;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 700;
  border-top: 1px solid rgba(34, 36, 38, 0.15);
  transition: background 0.1s ease, color 0.1s ease;
}
/* rule blocks styles */

.rule {
  width: 100%;
}
.rule-str-block {
  display: flex;
  flex-direction: column;
}
.title-flex {
  display: flex !important;
  flex-direction: row;
  align-items: center;
}
.rule-option-input {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  display: flex;
  flex-direction: column;
}

/* link label style */

.link-label {
  margin-right: 0em !important;
}
.link-label-container {
  display: flex !important;
  margin-left: auto;
}
.link-unlink {
  color: #2185d0;
}

/* button styles */

.rule-btn-block {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  justify-content: space-between;
}
.main-btn {
  margin-bottom: 0.25em !important;
  width: 48%;
}
.rule-btn:hover {
  background-color: #2184d074 !important;
  transition: 0.5s;
}
.ui.basic.primary.button,
.ui.basic.primary.buttons .button {
  margin-right: 0em;
}
</style>
