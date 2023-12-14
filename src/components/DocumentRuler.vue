<template>
  <div
    class="document-ruler"
    :style="{
      width: values.widthPt + 'pt',
      gridTemplateColumns: values.gridTemplateColumns,
    }"
  >
    <div class="left-field-rect"></div>
    <div class="right-field-rect"></div>
    <div class="secondary-markup" :class="modeBasedClass">
      <div class="cm" v-for="i in getSecondaryMarkup()" :key="i">
        <div class="cm-25"></div>
        <div class="cm-50"></div>
        <div class="cm-75"></div>
        <div class="cm-100">
          <span v-if="i != getSecondaryMarkup().length">{{ i }}</span>
        </div>
      </div>
    </div>
    <div class="main-markup" :class="modeBasedClass">
      <div class="cm" v-for="i in getMainMarkup()" :key="i">
        <div class="cm-25"></div>
        <div class="cm-50"></div>
        <div class="cm-75"></div>
        <div class="cm-100">
          <span>{{ i }}</span>
        </div>
      </div>
    </div>
    <div
      class="left-field-marker"
      @mousedown.stop="markerMouseDown($event, 'left-field')"
    ></div>
    <div
      class="right-field-marker"
      @mousedown.stop="markerMouseDown($event, 'right-field')"
    ></div>
    <div
      class="left-abs-margin-marker"
      v-if="data.selectedElement"
      :style="{
        left: values.leftMargin + 'pt',
      }"
    >
      <Icon
        @mousedown.stop="markerMouseDown($event, 'left-margin')"
        icon="fluent:rectangle-landscape-24-regular"
        color="#222"
        height="12"
        :class="modeBasedClass"
      />
    </div>
    <div
      class="left-rel-margin-marker"
      v-if="data.selectedElement"
      :style="{
        left: values.leftMargin + 'pt',
      }"
    >
      <Icon
        @mousedown="markerMouseDown($event, 'left-margin')"
        icon="akar-icons:triangle"
        color="#222"
        height="12"
        :class="modeBasedClass"
      />
    </div>
    <div
      class="right-margin-marker"
      v-if="data.selectedElement"
      :style="{
        right: values.rightMargin + 'pt',
      }"
    >
      <Icon
        @mousedown="markerMouseDown($event, 'right-margin')"
        icon="akar-icons:triangle"
        color="#222"
        height="12"
        :class="modeBasedClass"
      />
    </div>
    <div
      class="indent-marker"
      v-if="data.selectedElement"
      :style="{
        left: values.indent + 'pt',
      }"
    >
      <Icon
        @mousedown="markerMouseDown($event, 'indent')"
        icon="akar-icons:triangle"
        color="#222"
        height="12"
        :rotate="2"
        :class="modeBasedClass"
      />
    </div>
  </div>
</template>

<script>
import { VIEW_EDITOR } from "../common/defaults";
import Document from "@/classes/DocumentTemplate";
import { fromCmToPt, fromPxToCm } from "@/common/utils";
import { Icon } from "@iconify/vue";

export default {
  props: {
    data: Document,
  },
  components: {
    Icon,
  },
  inject: ["templateEditor"],
  data() {
    return {
      isActive: false,
      type: "left-abs-margin",
      startPos: 0,
      startValue: 0,
      indentStartValue: 0,
    };
  },
  computed: {
    values() {
      return {
        widthPt: fromCmToPt(this.data.width),
        leftFieldPt: fromCmToPt(this.data.marginLeft),
        rightFieldPt: fromCmToPt(this.data.marginRight),
        gridTemplateColumns:
          fromCmToPt(this.data.marginLeft) +
          "pt 1fr " +
          fromCmToPt(this.data.marginRight) +
          "pt",
        leftMargin: fromCmToPt(
          this.data.selectedParagraphs[0]?.indentLeft + this.data.marginLeft
        ),
        rightMargin: fromCmToPt(
          this.data.selectedParagraphs[0]?.indentRight + this.data.marginRight
        ),
        indent: fromCmToPt(
          this.data.selectedParagraphs[0]?.firstLineIndent +
            this.data.selectedParagraphs[0]?.indentLeft +
            this.data.marginLeft
        ),
        modeBasedClass() {
          return $store.state.activeView === VIEW_EDITOR
            ? "editor_mode"
            : "user_mode";
        },
      };
    },
    modeBasedClass() {
      return this.$store.state.activeView === VIEW_EDITOR
        ? "editor_mode"
        : "user_mode";
    },
  },
  mounted() {
    document.addEventListener("mouseup", this.onMouseUp, false);
    document.addEventListener("mousemove", this.onMouseMove, false);
  },
  beforeUnmount() {
    document.removeEventListener("mouseup", this.onMouseUp, false);
    document.removeEventListener("mousemove", this.onMouseMove, false);
  },
  methods: {
    getMainMarkup: function () {
      const a = [];
      for (let i = 1; i < this.data.width + 1; i++) {
        a.push(i);
      }
      return a;
    },
    getSecondaryMarkup: function () {
      const a = [];
      for (let i = 1; i < this.data.marginLeft + 1; i++) {
        a.push(i);
      }
      return a;
    },
    markerMouseDown: function (e, type) {
      this.isActive = true;
      this.type = type;
      this.startPos = e.pageX;
      switch (type) {
        case "left-margin":
          this.startValue = this.data.selectedParagraphs[0]?.indentLeft;
          break;
        case "right-margin":
          this.startValue = this.data.selectedParagraphs[0]?.indentRight;
          break;
        case "indent":
          console.log("MouseDown - indent")
          this.indentStartValue = this.data.selectedParagraphs[0]?.firstLineIndent;
          break;
        case "left-field":
          this.startValue = this.data.marginLeft;
          break;
        case "right-field":
          this.startValue = this.data.marginRight;
          break;
        default:
          break;
      }
      e.preventDefault();
    },
    onMouseMove: function (e) {
      if (this.isActive) {
        const diff = fromPxToCm(e.pageX - this.startPos);
        switch (this.type) {
          case "left-margin":
            this.data.selectedParagraphs.forEach((paragraph) => {
              paragraph.indentLeft = this.startValue + diff;
            });
            break;
          case "right-margin":
            this.data.selectedParagraphs.forEach((paragraph) => {
              paragraph.indentRight = this.startValue - diff;
            });
            break;
          case "indent":
            this.data.selectedParagraphs.forEach((paragraph) => {
              paragraph.firstLineIndent = this.indentStartValue + diff;
            });
            break;
          case "left-field":
            this.data.marginLeft = this.startValue + diff;
            break;
          case "right-field":
            this.data.marginRight = this.startValue - diff;
            break;
          default:
            break;
        }
      }
    },
    onMouseUp: function (e) {
      this.isActive = false;
      // e.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.document-ruler {
  display: grid;
  grid-template-rows: 1fr;
  height: 13px;
  min-height: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: #ddd 0 0 10px 0px;
  position: relative;
  & > .left-field-rect {
    background-color: #ccc;
    height: 100%;
    grid-area: 1/1/1/1;
  }

  & > .right-field-rect {
    background-color: #ccc;
    height: 100%;
    grid-area: 1/3/1/3;
  }
  .secondary-markup {
    grid-area: 1/1/1/1;
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    flex-direction: row-reverse;
    .cm {
      div {
        right: 0;
      }
      .cm-25 {
        transform: translateX(-7.08pt);
      }
      .cm-50 {
        transform: translateX(-14.16pt);
      }
      .cm-75 {
        transform: translateX(-21.24pt);
      }
      .cm-100 {
        transform: translateX(-28.346pt);
        span {
          transform: translateX(50%);
        }
      }
    }
  }
  .main-markup {
    grid-area: 1/2/1/4;
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
    .cm {
      div {
        left: 0;
      }
      .cm-25 {
        transform: translateX(7.08pt);
      }
      .cm-50 {
        transform: translateX(14.16pt);
      }
      .cm-75 {
        transform: translateX(21.24pt);
      }
      .cm-100 {
        transform: translateX(28.346pt);
        span {
          transform: translateX(-50%);
        }
      }
    }
  }
  .editor_mode {
    color: #4d4d4d !important;
  }
  .user_mode {
    color: #4d4d4d !important;
  }
  .cm {
    min-width: 28.346pt;
    width: 28.346pt;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 100;
    div {
      position: absolute;
    }
    .cm-25 {
      height: 2px;
      width: 1px;
      background-color: #666;
    }
    .cm-50 {
      height: 5px;
      width: 1px;
      background-color: #666;
      transform: translateX(14.16pt);
    }
    .cm-75 {
      height: 2px;
      width: 1px;
      background-color: #666;
      transform: translateX(21.24pt);
    }
    .cm-100 {
      span {
        display: block;
        font-size: 10px;
        font-weight: 700;
        cursor: default;
      }
    }
  }
  .left-abs-margin-marker {
    height: 0;
    width: 0;
    position: absolute;
    color: #000;
    top: 13px;
    left: 0;
    svg {
      cursor: pointer;
      z-index: 0;
      transform: translateX(-50%);
    }
  }

  .left-rel-margin-marker {
    height: 0;
    width: 0;
    position: absolute;
    color: #000;
    top: 6px;
    left: 0;
    svg {
      z-index: 2;
      cursor: pointer;
      transform: translateX(-50%);
    }
  }
  .right-margin-marker {
    height: 0;
    width: 0;
    position: absolute;
    color: #000;
    top: 6px;
    svg {
      z-index: 2;
      cursor: pointer;
      transform: translateX(-50%);
    }
  }
  .indent-marker {
    height: 0;
    width: 0;
    position: absolute;
    color: #000;
    top: -7px;
    left: 0;
    svg {
      z-index: 2;
      cursor: pointer;
      transform: translateX(-50%);
    }
  }
  .left-field-marker {
    height: 100%;
    cursor: w-resize;
    grid-area: 1/1/1/1;
    z-index: 0;
    margin-right: -10px;
  }
  .right-field-marker {
    height: 100%;
    cursor: w-resize;
    grid-area: 1/3/1/3;
    z-index: 0;
    margin-left: -10px;
  }
}
</style>
