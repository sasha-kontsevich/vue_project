<template>
  <td
    lang="ru"
    ref="cell"
    class="cell"
    :elementType="'cell'"
    :id="data.id"
    :elementId="data.id"
    :style="cellStyles"
    @dragstart="dragHandler"
    @add-input-field="addInputField"
  >
    <div
      class="cell"
      :style="{
        minHeight: data.parent.height + 'px',
      }"
    >
      <template v-for="el in data.elements" :key="el.id">
        <ParagraphElement
          v-if="el.type == 'paragraph'"
          :data="el"
          class="element"
          @selection-changed="selectElement(el)"
        />
      </template>
    </div>
    <div
      contenteditable="false"
      class="cell-border vertical col-resize"
      @mousedown.stop="this.setHorizontalResizeEvent($event, true)"
    ></div>
    <div
      contenteditable="false"
      class="cell-border horizontal"
      @mousedown.stop="this.setVerticalResizeEvent($event, true)"
    >
  ghjgjgy</div>
  </td>
</template>

<script>
import CellElement from "@/classes/CellElement.js";
import ParagraphElement from "./ParagraphElement.vue";
import { fromCmToPx } from "@/common/utils";

export default {
  components: { ParagraphElement },

  props: { data: CellElement },

  mounted() {
    document.body.addEventListener(
      "mouseup",
      this.setHorizontalResizeEvent,
      true
    );
    document.body.addEventListener(
      "mouseup",
      this.setVerticalResizeEvent,
      true
    );
    document.body.addEventListener("mousemove", this.handleMouseMove, true);
    this.data.domElement = this.$refs.cell;
  },
  beforeUnmount() {
    document.body.removeEventListener(
      "mouseup",
      this.setHorizontalResizeEvent,
      true
    );
    document.body.removeEventListener(
      "mouseup",
      this.setVerticalResizeEvent,
      true
    );
    document.body.addEventListener("mousemove", this.handleMouseMove, true);
  },
  data() {
    return {
      horizontalResizeEvent: {
        isActive: false,
        startPosX: 0,
      },
      verticalResizeEvent: {
        isActive: false,
        startPosY: 0,
      },
    };
  },

  computed: {
    // Вычисление отступов
    cellStyles() {
      return {
        marginTop: fromCmToPx(this.data.spacingBefore) + "px",
        marginBottom: fromCmToPx(this.data.spacingAfter) + "px",
        marginLeft: fromCmToPx(this.data.indentLeft) + "px",
        marginRight: fromCmToPx(this.data.indentRight) + "px",
        textIndent: fromCmToPx(this.data.firstLineIndent) + "px",
        lineHeight: this.data.lineHeight,
        textAlign: this.data.align,
      };
    },
    listIndex() {
      if (this.data.listType == "numbered") {
        let str = "";
        this.data.listValue.forEach((number) => {
          str += number + ".";
        });
        return str;
      } else {
        return this.data.listBullet;
      }
    },
  },

  methods: {
    handleMouseMove(e) {
      if (this.horizontalResizeEvent.isActive) {
        const { clientX } = e;
        const { startPosX } = this.horizontalResizeEvent;
        const diff = clientX - startPosX;
        const x = this.data.x;
        this.data.table.xLength[x] = Math.max(
          10,
          this.data.table.xLength[x] + diff * 1.2
        );
        this.horizontalResizeEvent.startPosX = clientX;
        e.preventDefault();
      } else if (this.verticalResizeEvent.isActive) {
        const { clientY } = e;
        const { startPosY } = this.verticalResizeEvent;
        const diff = clientY - startPosY;
        const y = this.data.y;
        if (
          this.data.table.yLength[y] > 10 &&
          this.data.table.yLength[y + 1] > 10
        ) {
          this.data.table.yLength[y] = Math.max(
            10,
            this.data.table.yLength[y] + diff
          );
          this.data.table.yLength[y + 1] = Math.max(
            10,
            this.data.table.yLength[y + 1] - diff
          );
        }

        this.verticalResizeEvent.startPosY = clientY;
        e.preventDefault();
      }
    },
    setHorizontalResizeEvent(e, active = false) {
      this.horizontalResizeEvent.isActive = active;
      if (e) {
        this.horizontalResizeEvent.startPosX = e.clientX;
      }
    },
    setVerticalResizeEvent(e, active = false) {
      this.verticalResizeEvent.isActive = active;

      if (e) {
        //console.log(e.target);
        this.verticalResizeEvent.startPosY = e.clientY;
      }
    },
    selectElement: function (element) {
      this.data.selectedElement = element;
    },
  },
};
</script>

<style lang="scss" scoped>
.cell-border-horizontal {
  display: flex;
}
.col-resize {
  cursor: col-resize;
}
.row-resize {
  cursor: row-resize;
}
.no-corner-horizontal {
  width: 100%;
}

.no-corner-vertical {
  height: auto;
}
td {
  border: 1px solid;
  border-collapse: collapse;
  position: relative;
}

.cell-border {
  position: absolute;
  background-color: transparent;
  font-size: 0;
  &.vertical {
    cursor: col-resize;

    z-index: 100;
    top: 0;
    right: -3px;
    width: 6px;
    height: 100%;
  }
  &.horizontal {
    z-index: 100;
    cursor: row-resize;
    bottom: -3px;
    left: 0;
    height: 6px;
    width: 100%;
  }
}
</style>
