import { createStore } from "vuex";
import { TAB_RULE_SETTINGS, TAB_TEMPLATE_SETTINGS } from "../common/defaults";
import { VIEW_EDITOR, VIEW_USER } from "../common/defaults";

export default createStore({
  state: {
    activeTab: TAB_TEMPLATE_SETTINGS,
    activeView: VIEW_EDITOR,
  },
  mutations: {
    setActiveTab(state, payload) {
      state.activeTab = payload;
    },
    setActiveView(state) {
      state.activeView =
        state.activeView === VIEW_EDITOR ? VIEW_USER : VIEW_EDITOR;
    },
  },
  actions: {},
  modules: {},
  getters: {
    isRuleTabActive(state) {
      return state.activeTab === TAB_RULE_SETTINGS;
    },
    activeView(state) {
      return state.activeView
    },
  },
});
