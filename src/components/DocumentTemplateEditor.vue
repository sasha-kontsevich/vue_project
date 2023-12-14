<template>
  <div class="document-editor" @click.alt="debug" @keydown="keydownHandler">
    <div class="header">
      <DocumentHeader :data="editor.template" />
    </div>
    <div class="instruments">
      <InstrumentsPanel :data="editor" />
    </div>
    <div class="view">
      <div class="ruler">
        <DocumentRuler :data="editor.template" />
      </div>
      <div class="document-container">
        <div class="scrolling absolute">
          <div class="document">
            <DocumentTemplate
              :data="editor.template"
              @beforeinput="beforeInputHandler"
              @mousemove="mouseMoveHandler"
              @mousedown.stop="mouseDownHandler"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="settings">
      <DocumentEditorSettings :data="editor.template" />
    </div>
    <div style="display: none" class="actions">
      {{ actions }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InstrumentsPanel from "./instumentPanel/InstrumentPanel.vue";
import DocumentEditorSettings from "./DocumentEditorSettings.vue";
import DocumentTemplate from "./DocumentTemplate.vue";
import DocumentHeader from "./DocumentHeader.vue";
import DocumentRuler from "./DocumentRuler.vue";
import { VIEW_USER, VIEW_EDITOR } from "../common/defaults";
import DocumentTemplateEditor from "@/classes/DocumentTemplateEditor";

export default {
  components: {
    DocumentEditorSettings,
    InstrumentsPanel,
    DocumentTemplate,
    DocumentHeader,
    DocumentRuler,
  },
  name: "DocumentTemplateEditor",
  props: { data: DocumentTemplate, mode: undefined },
  data() {
    return {
      editor: new DocumentTemplateEditor(),
      actions: 0,
      VIEW_USER,
      VIEW_EDITOR,
      isSelectionActive: false,
    };
  },
  updated() {
    console.log("call updated");
  },
  mounted() {
    this.editor.moveCaretToStart();
  },
  created() {
    document.addEventListener("mouseup", (e) => {
      this.mouseUpHandler(e);
    });
  },
  methods: {
    debug: function (e) {
    },
    keydownHandler: function (e) {
    },

    beforeInputHandler: function (e) {
      e.preventDefault();
      this.editor.input(e.inputType, e.data);
      //this.actions += this.actions + 1;
      this.$nextTick(() => this.editor.setCaret());
    },
    mouseMoveHandler: function (e) {
      // this.updateSelection(e);
    },
    mouseUpHandler: function (e) {
      if (this.isSelectionActive) {
        this.updateSelection(e);
        if (this.isRuleTabActive) {
          this.editor.setRuleBuffer();
          //console.log("set rule buff")
        }
        this.isSelectionActive = false;
      }
    },
    mouseDownHandler: function (e) {
      this.isSelectionActive = true;
      // this.updateSelection(e);
    },
    updateSelection: function (e) {
      this.editor.template.ruleRangeBuffer = [];
      let selection = window.getSelection();
      this.editor._selAnchorElem = this.editor.template.getParagraphById(
        this.getSelParagraphId(selection.anchorNode)
      );
      this.editor._selFocusElem = this.editor.template.getParagraphById(
        this.getSelParagraphId(selection.focusNode)
      );
      this.editor._selAnchorOffset = this.getSelParagraphOffset(
        selection.anchorNode,
        selection.anchorOffset
      );
      this.editor._selFocusOffset = this.getSelParagraphOffset(
        selection.focusNode,
        selection.focusOffset
      );
      this.editor.relativeOffset = selection.focusOffset;
      this.editor.relativeId = selection.focusNode.parentNode.id;
      this.editor.relativeFocusId = selection.focusNode.parentNode.id;
      this.editor.relativeAnchorId = selection.anchorNode.parentNode.id;
      this.editor.relativeFocus = selection.focusNode.parentNode;
      this.editor.relativeAnchor = selection.anchorNode.parentNode;
      //! LOG BLOCK///////////////////////////////////////////////////////////////
      // this.editor._selAnchorElem.elements.forEach((element) => {
      //   console.log("\x1b[35m%s\x1b[0m", element.length);
      // });
      // console.log("Focus node: ", this.editor._selAnchorElem);
      // console.log("Anchor node: ", this.editor._selFocusElem);
      // console.log("AnchorOffset: ", this.editor._selAnchorOffset);
      // console.log("FocusOffset: ", this.editor._selFocusOffset);
      //! LOG BLOCK///////////////////////////////////////////////////////////////
      this.editor.fillSelectedParagraphs();
      this.editor.fillSelectedInlines();
    },
    getSelNode: function (node, type) {
      if (!node) return;
      if (node.attributes?.elementType?.nodeValue != type) {
        node = node.parentNode;
      }
      if (node.attributes?.elementType?.nodeValue != type) {
        node = node.parentNode;
      }
      return node;
    },
    getSelParagraphId: function (node) {
      // console.log(this?.getSelNode(node, "paragraph"))
      return this?.getSelNode(node, "paragraph")?.attributes?.elementId
        ?.nodeValue;
    },
    getSelParagraphOffset: function (node, offset) {
      let paragraph = this.getSelNode(node, "paragraph");
      let inlineElement = this.getSelNode(node, "inlineElement");
      let result = 0;
      const getChildren = (node) => {
        const childElements = [...node?.children];
        for (let i = 0; i < childElements.length; i++) {
          if (childElements[i] == inlineElement) {
            result += inlineElement.attributes.isSelectable ? 0 : offset;
            return result;
          }
          if (childElements[i].attributes) {
            result += +(
              childElements[i].attributes.elementLength?.nodeValue ?? 0
            );
          }
        }
        return result;
      };
      return getChildren(paragraph);
    },
  },
  computed: {
    ...mapGetters(["isRuleTabActive"]),
    editorKey() {},
  },
  provide() {
    return {
      templateEditor: this.editor,
    };
  },
};
</script>

<style lang="scss">
.document-editor {
  width: 100%;
  height: 100%;
  font-size: 12px;

  display: grid;
  grid-template-columns: minmax(850px, 2000px) minmax(300px, 400px);
  grid-template-rows: min-content min-content min-content 1fr;
  grid-template-areas:
    "Header Header"
    "Instruments Settings"
    "Ruler Settings"
    "View Settings";
  & > .header {
    grid-area: Header;
  }

  > .ruler {
    grid-area: Ruler;
    display: flex;
    justify-content: center;
    padding: 0 10px;
    > div {
      background-color: #e3e9ee;
    }
  }

  & > .view {
    background: rgba(25, 25, 25, 0.08);
    grid-area: View;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    > div.document-container {
      flex-grow: 1;
      width: 100%;
      .document {
        .page {
          margin: 0 auto;
        }
      }
    }
  }

  & > .settings {
    grid-area: Settings;
  }

  & > .instruments {
    grid-area: Instruments;
  }

  button {
    background-color: #0000;
    border: none;
  }
  .colored {
    background-color: #2a4d77;
    color: #fff;
  }
  .colored_user_ver {
    background-color: #446691;
    color: #fff;
  }
}
</style>
