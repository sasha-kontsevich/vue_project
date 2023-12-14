<template>
  <div class="instruments-panel">
    <div class="tabs colored">
      <template v-for="tab in instrumentTabs" :key="tab">
        <div
          class="tab"
          v-if="!tab.elems || data.template.selectedElement.type == tab.elems"
          @click="selectTab(tab)"
          :class="{ selected: tab == selectedTab }"
        >
          {{ tab.title }}
        </div>
      </template>
    </div>
    <div class="instruments">
      <div class="instrument-panel">
        <template v-if="selectedTab?.tabName == 'template'">
          <TemplateInstrumentPanel :data="data.template" />
        </template>
        <template v-if="selectedTab?.tabName == 'insert'">
          <InsertInstrumentPanel :data="data" />
        </template>
        <template v-if="selectedTab?.tabName == 'page'">
          <PageInstrumentPanel :data="data.template" />
        </template>
        <template v-if="selectedTab?.tabName == 'paragraph'">
          <ParagraphInstrumentPanel :data="data.template" />
        </template>
        <template v-if="selectedTab?.tabName == 'image'">
          <ImageInstrumentPanel :data="data.template" />
        </template>
        <template v-if="selectedTab?.tabName == 'debug'">
          <DebugInstrumentPanel :data="data" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ParagraphInstrumentPanel from "./ParagraphInstrumentPanel.vue";
import TemplateInstrumentPanel from "./TemplateInstrumentPanel.vue";
import InsertInstrumentPanel from "./InsertInstrumentPanel.vue";
import ImageInstrumentPanel from "./ImageInstrumentPanel.vue";
import DebugInstrumentPanel from "./DebugInstrumentPanel.vue";
import PageInstrumentPanel from "./PageInstrumentPanel.vue";
import DocumentTemplateEditor from "@/classes/DocumentTemplateEditor";

export default {
  name: "InstrumentsPanel",
  props: { data: DocumentTemplateEditor },
  components: {
    TemplateInstrumentPanel,
    InsertInstrumentPanel,
    PageInstrumentPanel,
    ParagraphInstrumentPanel,
    ImageInstrumentPanel,
    DebugInstrumentPanel,
  },
  data() {
    return {
      instrumentTabs: [
        { tabName: "template", title: "Шаблон" },
        { tabName: "insert", title: "Вставка" },
        { tabName: "page", title: "Страница" },
        { tabName: "paragraph", title: "Абзац" },
        { tabName: "image", title: "Изображение", elems: "image" },
        { tabName: "inputField", title: "Поле ввода" },
        { tabName: "table", title: "Таблица", elems: "table" },
        { tabName: "rules", title: "Правила" },
        { tabName: "debug", title: "Отладка" },
      ],
      selectedTab: null,
      doc: this.data,
    };
  },

  mounted() {
    this.selectTab(this.instrumentTabs[2]);
  },
  methods: {
    selectTab: function (tab) {
      this.selectedTab = tab;
    },
  },
};
</script>

<style lang="scss">
.instruments-panel {
  width: 100%;
  .tabs {
    height: 25px;
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
      color: #2a4d77;
      cursor: default;
      &:hover {
        background-color: #fff;
      }
    }
  }

  .instruments {
    background-color: #fff;
    height: 65px;
  }
  .instrument-panel {
    display: flex;
    justify-content: start;
    align-items: center;
    height: 100%;
    .group {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .column {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-evenly;
      margin-left: 9px;
      margin-right: 9px;
    }
    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .hor-group {
        display: flex;
        flex-direction: row;
        align-items: center;
        button {
          margin: 1px;
          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .small-button {
      height: 20px;
      width: 20px;
      border-radius: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #8cbcd5;
      cursor: pointer;
    }
    .checked {
      background-color: #2a4d77aa;
    }
    select {
      height: 22px;
      background-color: #fff;
      border: 1px solid #c4c4c4;
      border-radius: 1px;
    }
    input[type="number"] {
      width: 50px;
      height: 20px;
      border: 1px solid #c4c4c4;
      border-radius: 1px;
      padding-left: 2px;
    }
    .dropdown {
      height: 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin: 3px;
      margin-right: 6px;
      &::after {
        content: " ⯆";
        font-size: 10px;
        margin-left: 2px;
      }
    }
    .text-button {
      input[type="file"] {
        display: none;
      }
      border: 1px solid #c4c4c4;
      height: 21px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      width: 100%;
      cursor: pointer;
      justify-content: center;
    }
  }
}
</style>