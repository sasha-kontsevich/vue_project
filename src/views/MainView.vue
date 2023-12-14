<template>
  <div class="main">
    <div class="ui basic segments">
      <div class="ui segment">
        <div class="ui icon button" @click="$store.commit('setActiveView')">
          <i class="file alternate outline left labeled icon"></i>
          switch view
        </div>
      </div>
      <div class="ui segment">
        <transition name="fade" mode="out-in">
          <EditorView
            v-if="$store.state.activeView === VIEW_EDITOR"
            :data="template"
          />
          <UserView v-else :data="template" :mode="VIEW_USER"  />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
//   @ is an alias to /src
import EditorView from "@/views/EditorView.vue";
import UserView from "@/views/UserView.vue";
import DocumentEditor from "../classes/DocumentTemplateEditor.js";
import { VIEW_USER, VIEW_EDITOR } from "../common/defaults";
export default {
  name: "HomeView",
  components: {
    EditorView,
    UserView,
  },
  data() {
    return {
      template: new DocumentEditor(),
      VIEW_USER,
      VIEW_EDITOR,
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  > .segments {
    height: 100%;
    display: flex;
    flex-flow: column;
    > .segment {
      &:last-child {
        flex-grow: 1;
      }
    }
  }
}
</style>
