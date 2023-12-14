import DocumentTemplate from "./DocumentTemplate";
import DefaultDocumentTemplate from "@/static/DefaultDocumentTemplate.json";

export default class DocumentEditor {
  constructor() {
    this.template = new DocumentTemplate().load(DefaultDocumentTemplate);
    this._selAnchorElem = null;
    this._selAnchorOffset = 0;
    this._selFocusElem = null;
    this._selFocusOffset = 0;
  }

  get isSelCollapsed() {
    return (
      this._selAnchorElem == this._selFocusElem &&
      this._selAnchorOffset == this._selFocusOffset
    );
  }

  get isEndOfParagraph() {
    return this.isSelCollapsed
      ? this._selAnchorElem.isEndOfParagraph(this._selAnchorOffset)
      : false;
  }

  get isBeginOfParagraph() {
    return this.isSelCollapsed
      ? this._selAnchorElem.isBeginOfParagraph(this._selAnchorOffset)
      : false;
  }

  moveCaretToStart() {
    this._selAnchorElem = this.template.paragraphs[0];
    this._selAnchorOffset = 0;
    this._selFocusElem = this.template.paragraphs[0];
    this._selFocusOffset = 0;
  }

  input(inputType, inputData) {
    if (inputType == "insertParagraph") {
      this.insertParagraph();
    }
    if (inputType == "insertText") {
      this.insertText(inputData);
    }
    if (inputType == "deleteContentForward") {
      this.deleteContentForward();
    }
    if (inputType == "deleteContentBackward") {
      this.deleteContentBackward();
    }
  }

  setRuleBuffer() {
    this.template.refineAll();
    if (this.isSelCollapsed) return;
    this.normalizeSelectionRange();
    let currentEl = this._selAnchorElem.getInlineElemByPos(
      this._selAnchorOffset
    );
    currentEl = this._selAnchorElem.splitElementAtPosition(
      this._selAnchorOffset,
      currentEl
    );
    let focusEl = this._selFocusElem.getInlineElemByPos(this._selFocusOffset);
    this._selFocusElem.splitElementAtPosition(this._selFocusOffset, focusEl);
    this.template.updateInlineElementsSiblings();
    this.template.ruleRangeBuffer = [];
    while (focusEl.id !== currentEl.id) {
      this.template.ruleRangeBuffer.push(currentEl.id);
      currentEl = currentEl.nextSibling;
    }
    this.template.ruleRangeBuffer.push(focusEl.id);
    const sel = window.getSelection();
    sel.removeAllRanges();
  }

  createStyleRange() {
    this.template.refineAll();
    if (this.isSelCollapsed) return;
    this.normalizeSelectionRange();
    let currentEl = this._selAnchorElem.getInlineElemByPos(
      this._selAnchorOffset
    );
    currentEl = this._selAnchorElem.splitElementAtPosition(
      this._selAnchorOffset,
      currentEl
    );
    let focusEl = this._selFocusElem.getInlineElemByPos(this._selFocusOffset);
    this._selFocusElem.splitElementAtPosition(this._selFocusOffset, focusEl);
    this.template.updateInlineElementsSiblings();
    let inlines = [];
    while (focusEl.id !== currentEl.id) {
      inlines.push(currentEl);
      currentEl = currentEl.nextSibling;
    }
    inlines.push(focusEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    return inlines;
  }

  addEditableAreaMarker() {
    this.template.editableAreaMarkers.push(this._selAnchorElem.id);
  }

  insertText(data) {
    console.log(data, this._selFocusElem, this._selAnchorOffset);
    this.normalizeSelectionRange();
    if (this.isSelCollapsed) {
      this._selAnchorElem.insertText(
        data,
        this._selAnchorOffset,
        this._selAnchorOffset
      );
      this.moveCaret(data.length);
    } else {
      if (this._selAnchorElem == this._selFocusElem) {
        this._selAnchorElem.insertText(
          data,
          this._selAnchorOffset,
          this._selFocusOffset
        );
        this.collapseSelectionToStart();
        this.moveCaret(data.length);
      } else {
        this._selAnchorElem.insertText(
          data,
          this._selAnchorOffset,
          this._selAnchorElem.length
        );
        this._selFocusElem.deleteContent(0, this._selFocusOffset);
        let currentParagraph = this._selAnchorElem.nextSibling;
        while (currentParagraph != this._selFocusElem) {
          currentParagraph.remove();
          currentParagraph = currentParagraph.nextSibling;
        }
        this._selAnchorElem.attachNextParagraph();
        this.collapseSelectionToStart();
        this.moveCaret(data.length);
      }
    }
  }
  insertParagraph() {
    this.normalizeSelectionRange();
    if (this.isSelCollapsed) {
      let newParagraph = this._selAnchorElem.splitParagraph(
        this._selAnchorOffset
      );
      this._selAnchorElem.parent.insertAfter(newParagraph, this._selAnchorElem);
      this._selAnchorElem = newParagraph;
      this._selAnchorOffset = 0;
      this.collapseSelectionToStart();
    } else {
      if (this._selAnchorElem == this._selFocusElem) {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selFocusOffset
        );
        this.collapseSelectionToStart();
        let newParagraph = this._selAnchorElem.splitParagraph(
          this._selAnchorOffset
        );
        this._selAnchorElem.parent.insertAfter(
          newParagraph,
          this._selAnchorElem
        );
        this._selAnchorElem = newParagraph;
        this._selAnchorOffset = 0;
        this.collapseSelectionToStart();
      } else {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selAnchorElem.length
        );
        this._selFocusElem.deleteContent(0, this._selFocusOffset);
        let currentParagraph = this._selAnchorElem.nextSibling;
        while (currentParagraph != this._selFocusElem) {
          currentParagraph.remove();
          currentParagraph = currentParagraph.nextSibling;
        }
        this._selAnchorElem.attachNextParagraph();
        this.collapseSelectionToStart();
        let newParagraph = this._selAnchorElem.splitParagraph(
          this._selAnchorOffset
        );
        this._selAnchorElem.parent.insertAfter(
          newParagraph,
          this._selAnchorElem
        );
        this._selAnchorElem = newParagraph;
        this._selAnchorOffset = 0;
        this.collapseSelectionToStart();
      }
    }
    return;
  }

  insertImage(src) {
    let targetInlineElemId = this._selAnchorElem.prevSibling.elements[0].id;
    let inlineElemOffset = this._selAnchorElem.getInlineElementOffset(
      this._selAnchorOffset
    );
    const targetDomElem = document.getElementById(targetInlineElemId);
    const relativeOffset = this.relativeOffset ?? 0;
    const range = document.createRange();
    const sel = window.getSelection();
    const selectionElement = document.getElementById(this.relativeId);
    this.relativeOffset = selectionElement.lenght;
    range.setStart(targetDomElem?.childNodes[0] ?? targetDomElem, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    this.relativeOffset = 0;
    console.log(this);
    this._selAnchorElem = this._selAnchorElem.prevSibling;
    this._selFocusElem = this._selAnchorElem;
    this._selAnchorOffset = 0;
    this._selFocusOffset = 0;
    this.relativeFocusId = targetDomElem.id;
    console.log(src);
    console.log(this._selAnchorElem);
    this.normalizeSelectionRange();
    if (this.isSelCollapsed) {
      this._selAnchorElem.insertImage(src, this._selAnchorOffset);
    }
  }

  deleteContentForward() {
    console.log(this._selAnchorElem.elements.length);
    this.normalizeSelectionRange();
    if (this.isSelCollapsed) {
      if (this.isEndOfParagraph) {
        this._selAnchorElem.attachNextParagraph();
      } else {
        this._selAnchorElem.deleteChar(this._selAnchorOffset);
      }
    } else {
      if (this._selAnchorElem == this._selFocusElem) {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selFocusOffset
        );
        this.collapseSelectionToStart();
      } else {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selAnchorElem.length
        );
        this._selFocusElem.deleteContent(0, this._selFocusOffset);
        let currentParagraph = this._selAnchorElem.nextSibling;
        while (currentParagraph != this._selFocusElem) {
          currentParagraph.remove();
          currentParagraph = currentParagraph.nextSibling;
        }
        this._selAnchorElem.attachNextParagraph();
        this.collapseSelectionToStart();
      }
    }
  }

  setCaret() {
    const sel = window.getSelection();
    const range = document.createRange();
    let anchorParagraph = this._selAnchorElem.domElement;
    let focusParagraph = this._selFocusElem.domElement;
    const anchorElem = this._selAnchorElem;
    const anchorInlineEl = anchorElem.getInlineElemByPos(this._selAnchorOffset);

    if (anchorInlineEl?.type === "input") {
      console.log("Input set caret");
      const node = document.getElementById(anchorInlineEl.id);
      node && range.setStart(node.childNodes[2], 0);
      return;
    }

    let inlineEl = null;
    let offset = this._selAnchorOffset;
    for (const node of anchorParagraph.children) {
      const elementLength = +node.attributes.elementLength.value;
      const isNodeSelectable = !(
        node.attributes.isSelectable?.value === "false"
      );
      if (offset === elementLength && offset === 0 && isNodeSelectable) {
        inlineEl = node.firstChild ?? node;
        break;
      } else if (elementLength < 1) {
        continue;
      } else if (offset > elementLength) {
        offset -= elementLength;
      } else {
        inlineEl = node.firstChild ?? node;
        break;
      }
    }
    this.relativeOffset = offset;
    range.setStart(inlineEl, offset);

    inlineEl = null;
    offset = this._selFocusOffset;
    for (const node of focusParagraph.children) {
      const elementLength = +node.attributes.elementLength.value;
      const isNodeSelectable = !(
        node.attributes.isSelectable?.value === "false"
      );
      if (offset === elementLength && offset === 0 && isNodeSelectable) {
        inlineEl = node.firstChild ?? node;
        break;
      } else if (elementLength < 1) {
        continue;
      } else if (offset > elementLength) {
        offset -= elementLength;
      } else {
        inlineEl = node.firstChild ?? node;
        break;
      }
    }
    range.setEnd(inlineEl, offset);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  deleteContentBackward() {
    //! LOG BLOCK///////////////////////////////////////////////////////////////
    // console.log("DeleteContentBackward")
    // console.log("Абсолютный фокус: ", this._selFocusElem);
    // console.log("Абсолютный отступ до начала: ", this._selAnchorOffset);
    // console.log("Абсолютный отступ до конца: ", this._selFocusOffset);
    // console.log("Абсолютный якорь: ", this._selAnchorElem);
    //! LOG BLOCK///////////////////////////////////////////////////////////////
    this.normalizeSelectionRange();
    if (this.isSelCollapsed) {
      if (this.isBeginOfParagraph && !this._selAnchorElem.isList) {
        console.log("\x1b[35m%s\x1b[0m", "Соединение параграфов");
        if (
          !this._selAnchorElem.prevSibling ||
          this._selAnchorElem.prevSibling.parent.type == "cell"
        ) {
          return;
        }
        //! LOG BLOCK///////////////////////////////////////////////////////////////
        // console.log("-------------------------------------------------------");
        // console.log("Тип элемента: ", currentInlineElement.type);
        // console.log("Id: ", currentInlineElement.id);
        // console.log("Абсолютный отступ: ", this._selAnchorOffset);
        // console.log("относительный фокусный элемент: ", this.relativeFocusId);
        // console.log("Относительный якорный элемент': ", this.relativeAnchorId);
        // console.log("Относительный отступ: ", this.relativeOffset);
        //! LOG BLOCK///////////////////////////////////////////////////////////////
        let offset = this._selAnchorElem.prevSibling.length;
        let paragraph = this._selAnchorElem.attachPrevParagraph();
        this._selAnchorElem = paragraph;
        this._selAnchorOffset = offset;
        //this.relativeOffset = this._selAnchorElem.getInlineElementOffset(offset);
        this.collapseSelectionToStart();
      } else if (this._selAnchorElem.isList && this._selAnchorOffset == 0) {
        console.log("Удаление маркера списка");
        this._selAnchorElem.listType = "none";
      } else {
        let currentInlineElement = this._selAnchorElem.getInlineElemByPos(
          this._selAnchorOffset
        );
        //! LOG BLOCK///////////////////////////////////////////////////////////////
        // console.log("-------------------------------------------------------");
        // console.log("Тип элемента: ", currentInlineElement.type);
        // console.log("Id: ", currentInlineElement.id);
        // console.log("Абсолютный отступ: ", this._selAnchorOffset);
        // console.log("Абсолютный focus: ", this._selFocusOffset);
        // console.log("Абсолютный фокусный элемент: ", this.relativeFocusId);
        // console.log("Относительный якорный элемент': ", this.relativeAnchorId);
        // console.log("Относительный отступ: ", this.relativeOffset);
        //! LOG BLOCK///////////////////////////////////////////////////////////////
        if (currentInlineElement.type === "input") {
          this._selAnchorElem.elements = this._selAnchorElem.elements.filter(
            (el) => el !== currentInlineElement
          );
          this.moveCaret(-1);
          this.relativeOffset =
            this.relativeOffset + currentInlineElement.prevSibling.length;
        } else {
          if (this.relativeOffset == 0) {
            this.relativeOffset = currentInlineElement.length;
          }
          currentInlineElement.deleteChar(Math.max(this.relativeOffset - 1, 0));
          this.moveCaret(-1);
        }
      }
    } else {
      if (this._selAnchorElem == this._selFocusElem) {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selFocusOffset,
          this.relativeFocusId
        );
        this.collapseSelectionToStart();
      } else if (
        !this._selFocusElem.isList ||
        (this._selFocusElem.isEndOfParagraph(this._selFocusOffset) &&
          this._selFocusElem.isList)
      ) {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selAnchorElem.length,
          this.relativeFocusId
        );
        this._selFocusElem.deleteContent(
          0,
          this._selFocusOffset,
          this.relativeFocusId
        );
        let currentParagraph = this._selAnchorElem.nextSibling;
        while (currentParagraph != this._selFocusElem) {
          currentParagraph.remove();
          currentParagraph = currentParagraph.nextSibling;
        }
        this._selAnchorElem.attachNextParagraph();
        this.collapseSelectionToStart();
      } else {
        this._selAnchorElem.deleteContent(
          this._selAnchorOffset,
          this._selAnchorElem.length,
          this.relativeFocusId
        );
        this._selFocusElem.deleteContent(
          0,
          this._selFocusOffset,
          this.relativeFocusId
        );
        let currentParagraph = this._selAnchorElem.nextSibling;
        while (currentParagraph != this._selFocusElem) {
          currentParagraph.remove();
          currentParagraph = currentParagraph.nextSibling;
        }
        this.collapseSelectionToStart();
      }
    }
  }
  fillSelectedParagraphs() {
    this.normalizeSelectionRange();
    this.template.selectedParagraphs = this._selAnchorElem
      ? []
      : this.template.selectedParagraphs;
    let anchor = this._selAnchorElem;
    while (anchor !== this._selFocusElem) {
      this.template.selectedParagraphs.push(anchor);
      anchor = anchor.nextSibling;
      if (!anchor.nextSibling) return false;
    }
    if (this._selFocusElem) {
      this.template.selectedParagraphs.push(this._selFocusElem);
    }
  }
  fillSelectedInlines() {
    this.normalizeSelectionRange();
    if (this._selAnchorElem) {
      this.template.selectedInlines = [];
      let anchorInline = this._selAnchorElem.getInlineElemByPos(
        this._selAnchorOffset
      );
      let focusInline = this._selFocusElem.getInlineElemByPos(
        this._selFocusOffset
      );
      while (anchorInline !== focusInline) {
        this.template.selectedInlines.push(anchorInline);
        anchorInline = anchorInline.nextSibling;
        if (!anchorInline.nextSibling) return false;
      }
      if (this._selFocusElem) {
        this.template.selectedInlines.push(focusInline);
      }
    }
    console.log(this.template.selectedInlines);
  }
  normalizeSelectionRange() {
    let anchorElemIndex = this.template.paragraphs.indexOf(this._selAnchorElem);
    let focusElemIndex = this.template.paragraphs.indexOf(this._selFocusElem);
    if (anchorElemIndex > focusElemIndex) {
      this.invertSelRangeDirection();
    } else if (
      anchorElemIndex == focusElemIndex &&
      this._selAnchorOffset > this._selFocusOffset
    ) {
      this.invertSelRangeDirection();
    }
  }
  invertSelRangeDirection() {
    let tempOffset = this._selFocusOffset;
    let tempElem = this._selFocusElem;
    this._selFocusOffset = this._selAnchorOffset;
    this._selFocusElem = this._selAnchorElem;
    this._selAnchorOffset = tempOffset;
    this._selAnchorElem = tempElem;
  }
  moveCaret(offset) {
    if (this.isSelCollapsed) {
      this._selAnchorOffset += offset;
      this._selFocusOffset = this._selAnchorOffset;
      this.relativeOffset += offset;
      this.relativeOffset = this.relativeOffset < 0 ? 0 : this.relativeOffset;
    }
  }

  collapseSelectionToStart() {
    this._selFocusOffset = this._selAnchorOffset;
    this._selFocusElem = this._selAnchorElem;
  }

  collapseSelectionToEnd() {
    this._selAnchorOffset = this._selFocusOffset;
    this._selAnchorElem = this._selFocusElem;
  }
}
