<template>
  <div class="settings-tab">
    <div class="tabs colored">
      <template v-for="tab in settingsTabs" :key="tab">
        <div
          class="tab"
          @click="selectTab(tab)"
          :class="{ selected: tab == selectedTab }"
        >
          {{ tab.title }}
        </div>
      </template>
    </div>
    <div class="body">
      <template v-if="selectedTab?.tabName == TAB_TEMPLATE_SETTINGS">
        <ComponentSettings :data="data" />
      </template>
      <template v-if="selectedTab?.tabName == TAB_USER_FORM">
        <UserFormPanel :data="data" />
      </template>
    </div>
  </div>
</template>

<script>
import { TABS } from "../common/defaults";
import DocumentTemplate from "@/classes/DocumentTemplate";
import ComponentSettings from "./settings/ComponentSettings.vue";
import ParagraphSettings from "./settings/ParagraphSettings.vue";
import DocumentSettings from "./settings/DocumentSettings.vue";
import UserFormPanel from "./settings/UserFormPanel.vue";

export default {
  components: {
    ComponentSettings,
    ParagraphSettings,
    DocumentSettings,
    UserFormPanel,
  },

  name: "DocumentUserFormSettings",
  props: { data: DocumentTemplate },

  data() {
    return {
      ...TABS,
      settingsTabs: [
        { tabName: TABS.TAB_TEMPLATE_SETTINGS, title: "Настройки компонента" },
        { tabName: TABS.TAB_USER_FORM, title: "Форма юзера" },
        { tabName: TABS.TAB_RULE_SETTINGS, title: "Правила" },
      ],
      selectedTab: null,
      doc: this.data,
    };
  },
  mounted() {
    this.selectTab(this.settingsTabs[0]);
    //console.log(this.selectedTab);
  },
  methods: {
    selectTab: function (tab) {
      this.selectedTab = tab;
      this.$store.commit("setActiveTab", tab.tabName);
      this.data.ruleRangeBuffer = [];
    },
  },
};
</script>

<style lang="scss">
.settings-tab {
  display: flex !important;

  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  height: 100%;
  .tabs {
    height: 25px;
    min-height: 25px;
    display: flex;
    justify-content: flex-start;
    .tab {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 20px;
      cursor: pointer;
      &:hover {
        background-color: #fff1;
      }
    }
    .selected {
      background-color: #fff;
      color: #587aa3;
      cursor: default;
      &:hover {
        background-color: #fff;
      }
    }
  }
  & > .body {
    padding: 10px 8px;
    overflow-y: scroll;
    overflow-x: hidden;
    overflow: visible;
  }
  & > .header {
    margin-bottom: 20px;
    background-color: #fdfdfd;
    border-bottom: 1px #eee solid;
    padding: 15px;
    border-radius: 5px;
  }
  & > .group {
    margin-bottom: 20px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    & > .header {
      padding: 7px;
    }
    & > .body {
      padding: 7px;
    }
  }
  .row input {
    width: 60px;
    margin-left: 7px;
  }

  .row {
    margin: 7px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 90%;
  }
}
</style>
