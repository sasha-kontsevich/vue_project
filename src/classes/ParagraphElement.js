import { minContentWidth, cmStep } from "@/common/settings";
import { clamp } from "@/common/utils";
import BlockElement from "./BlockElement";
import TextElement from "./TextElement";
import InputElement from "./InputElement";
import ImageElement from "./ImageElement";

export default class ParagraphElement extends BlockElement {
  constructor() {
    super();
    this.type = "paragraph";
    this.elements = [new TextElement("")];
    this.lineHeight = 1.15;
    this.align = "justify";
    this._firstLineIndent = 1.25;
    this.listType = "none";
    this.listLevel = 1;
    this.listBullet = "●";
  }
  isEndOfParagraph(offset) {
    return this.length == offset;
  }
  isBeginOfParagraph(offset) {
    return 0 == offset;
  }
  getInlineElemByPos(pos) {
    if (pos < 0 && this.prevSibling) {
      return this.prevSibling.getInlineElemByPos(
        this.prevSibling.length + pos + 1
      );
    }
    if (pos > this.length && this.nextSibling) {
      return this.nextSibling.getInlineElemByPos(pos - this.length - 1);
    }
    if (pos >= 0 && pos <= this.length) {
      let offset = 0;
      for (let i = 0; i < this.elements.length; i++) {
        offset += this.elements[i].length;
        if (offset >= pos) {
          return this.elements[i];
        }
      }
    }
  }
  getInlineElementOffset(pos) {
    let targetElem = this.getInlineElemByPos(pos);
    console.log(targetElem);
    let firstElem = this.elements[0];
    let prevElementsLength = 0;
    while (targetElem != firstElem) {
      prevElementsLength += targetElem.length;
      targetElem = targetElem.prevSibling;
    }
    console.log("тот самый отступ тупой",pos - prevElementsLength);
    return pos - prevElementsLength;
  }

  splitParagraph(start, end) {
    end = end === null || end === undefined ? start : end;
    let newParagraph = new ParagraphElement();
    let splitIndex = this.deleteContent(start, end);
    newParagraph.elements = this.deleteElements(splitIndex);
    newParagraph.copyStyles(this);
    this.refineInlineElements();
    newParagraph.parent = this.parent;
    return newParagraph;
  }

  insertText(text, start, end /*= null*/) {
    if (end === null) end = start;
    let newElement = new TextElement(text);

    let insertIndex = this.deleteContent(start, end);
    if (this.elements[insertIndex]) {
      newElement.copyStyles(this.elements[insertIndex]);
    }
    this.insertElement(newElement, insertIndex);
    this.refineInlineElements();
  }

  rmLastInput(startId, endId) {
    let startInline = this.find((el) => el.id === startId);
    let endInline = this.find((el) => el.id === endId);
    if (endInline.type === "input") {
      this.elements.filter((el) => el.id !== endId);
    }
  }
  deleteContent(start, end, endId) {
    let inputEnd = this.elements.find((el) => el.id === endId);
    //console.log("Конечный инпут: ", inputEnd);
    if (inputEnd?.type === "input") {
      this.elements = this.elements.filter((el) => el.id !== endId);
    }
    let caretOffset = -1;
    let startInline = this.getInlineElemByPos(start);
    const absoluteLength = this.elements
      .filter((el, idx) => this.elements.indexOf(startInline) >= idx)
      .filter((el) => el instanceof TextElement)
      .reduce((a, b) => a + b.length, 0);
    //console.log(startInline, start, end, absoluteLength);
    if (
      start === absoluteLength &&
      startInline.nextSibling instanceof InputElement
    ) {
      this.elements = this.elements.filter(
        (el) => el !== startInline.nextSibling
      );
      return;
    }
    if (startInline instanceof InputElement) {
      if (!(end - start)) {
        this.elements = this.elements.filter((el) => el !== startInline);
      } else {
        startInline = startInline.nextSibling;
      }
    }
    let startElem = this.splitElementAtPosition(start, startInline);
    let startIndex = this.elements.indexOf(startElem);
    if (start != end) {
      let endInline = this.getInlineElemByPos(end);
      let endElem = this.splitElementAtPosition(end, endInline);
      let endIndex = this.elements.indexOf(endElem) - 1;
      this.deleteElements(startIndex, endIndex);
    }
    return startIndex;
  }

  splitElementAtPosition(pos, element) {
    let offset = this.getElementOffset(element);
    let newElement = element.split(pos - offset); //новый элемент будет содержать все до курсора
    this.insertElement(newElement, this.elements.indexOf(element) + 1);
    return newElement;
    let templ = findCurrentDocTemplate(this);
    console.log(templ);
  }
  // deleteContent(start, end) {
  //   let startElem=this.getInlineElemByPos(start);
  //   let inputMarker=-1;
  //   if (startElem.type === 'input') {
  //     startElem = startElem.nextSibling
  //     console.log('trapped');
  //     inputMarker=startElem.nextSibling.length
  //   }
  //   let startSplittedElem = this.splitElementAtPosition(startElem,start);

  //   let startIndex = this.elements.indexOf(startSplittedElem);
  //   if (start != end) {

  //     let endElem=this.getInlineElemByPos(end);
  //     if (endElem.type === 'input') {
  //       endElem = endElem.nextSibling
  //       inputMarker=endElem.nextSibling.lengh
  //     }
  //     let endSplittedElem = this.splitElementAtPosition(endElem,end); //получение теста от конца до конца элемента//обрезка изначального элемента
  //     let endIndex = this.elements.indexOf(endSplittedElem) - 1; ///!TODO могут ли вообще эти значения отличаться?
  //     this.deleteElements(startIndex, endIndex);
  //     this.refineInlineElements()
  //   }
  //    return -1

  // }

  // splitElementAtPosition(el,pos) {
  //   //if (type === 'input') {
  //   //  element = nextSibling
  //   //}
  //   let offset = this.getElementOffset(el); //получение расстояния до курсора
  //   let newElement = el.split(pos - offset); //новый элемент будет содержать все до курсора
  //   this.insertElement(newElement, this.elements.indexOf(el) + 1);
  //   return newElement;
  // }

  // getElementByPos(pos) {
  //   let offset = 0;
  //   for (let i = 0; i < this.elements.length; i++) {
  //     if (offset + this.elements[i].length >= pos) {
  //       return this.elements[i];
  //     } else {
  //       offset += this.elements[i].length;
  //     }
  //   }
  // }

  getElementOffset(element) {
    //возвращает расстояние от начала параграфа до начала инлайн элемента
    let offset = 0;
    for (let i = 0; i < this.elements.indexOf(element); i++) {
      offset += this.elements[i].length;
    }
    return offset;
  }

  insertElement(element, index) {
    this.elements.splice(index, 0, element);
  }

  deleteElements(start, end) {
    if (!end) end = this.elements.length;
    return this.elements.splice(start, end - start + 1);
  }

  attachNextParagraph() {
    if (this.nextSibling?.type != "paragraph") return;
    if (!this.nextSibling.isEmpty()) {
      this.elements.push(...this.nextSibling.elements);
    }
    this.parent.removeElement(this.nextSibling);
    this.refineInlineElements();
    return this;
  }
  attachToNextParagraph() {
    if (this.nextSibling?.type != "paragraph") return;
    if (!this.nextSibling.isEmpty()) {
      this.nextSibling.elements.unshift(...this.elements);
    }
    this.nextSibling.refineInlineElements();
    this.parent.removeElement(this);
    return this.nextSibling;
  }
  remove() {
    this.parent.removeElement(this);
  }
  attachPrevParagraph() {
    if (this.prevSibling?.type != "paragraph") return;
    this.prevSibling.attachNextParagraph();
    return this.prevSibling;
  }
  insertImage(src, pos) {
    this.insertElement(new ImageElement(src), pos);
  }

  insertInput(src, pos) {
    this.insertElement(new ImageElement(src), pos);
  }

  deleteChar(pos) {
    let charsCount = 0;
    console.log("Тип списка ", this.listType);
    for (let i = 0; i < this.elements.length; i++) {
      if (charsCount + this.elements[i].length > pos) {
        if (this.elements[i].type == "text") {
          this.elements[i].deleteChar(pos - charsCount);
        }
        if (this.elements[i].type == "input") {
          this.elements.splice(i, 1);
        }
        break;
      } else {
        charsCount += this.elements[i].length;
      }
    }
  }

  addInputField() {
    if (this.caretPos === null) return;
    let element, elementPos;
    [element, elementPos] = this.getInlineElemByPos(this.caretPos);
    const index = this.splitElement(element, elementPos);
    this.insertElement(new InputElement(), index);
  }

  mergeTextElements(first, second) {
    const firstElement = this.elements[first];
    const secondElement = this.elements[second];
    if (firstElement.type == "text" && secondElement.type == "text") {
      if (firstElement.isStyleEquals(secondElement)) {
        firstElement.data += secondElement.data;
        this.elements.splice(second, 1);
        return true;
      }
    }
    return false;
  }

  changeStyle(sel, field, value) {
    const elements = this.splitParagraph(sel);
    elements.forEach((index) => {
      this.elements[index].changeStyle(field, value);
    });
  }

  addText(text) {
    this.elements[this.elements.length - 1].addText(text);
  }

  divideParagraph(pos) {
    const newParagraph = new ParagraphElement();
    newParagraph.elements = [];
    newParagraph.listType = this.listType;
    newParagraph.listLevel = this.listLevel;
    let element, posInElement;
    [element, posInElement] = this.getInlineElemByPos(pos);
    const elementsCount = this.splitElement(element, posInElement);
    for (let i = 0; i < elementsCount; i++) {
      let newTextElement;
      if (this.elements[0].type == "text") newTextElement = new TextElement();
      if (this.elements[0].type == "input") newTextElement = new InputElement();
      newTextElement.copy(this.elements[0]);
      newParagraph.elements.push(newTextElement);
      this.elements.splice(0, 1);
    }
    return newParagraph;
  }

  copyStyles(paragraph) {
    this.listType = paragraph.listType;
    this.listLevel = paragraph.listLevel;
    this.lineHeight = paragraph.lineHeight;
    this.align = paragraph.align;
    this.firstLineIndent = paragraph.firstLineIndent;
    this.indentLeft = paragraph.indentLeft;
    this.indentRight = paragraph.indentRight;
  }

  refineInlineElements() {
    let i = 0;
    while (i < this.elements.length - 1) {
      if (!this.mergeTextElements(i, i + 1)) {
        i++;
      }
    }
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].type == "image" && this.elements[i].src == null) {
        this.elements.splice(i, 1);
        i--;
      }
    }
  }

  isEmpty() {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i]._data != "") {
        return false;
      }
    }
    return true;
  }

  get length() {
    let length = 0;
    this.elements.forEach((element) => {
      length += element.length;
    });
    return length;
  }

  get listValue() {
    if (this.listType == "numbered") {
      if (
        this.prevSibling?.type == "paragraph" &&
        this.prevSibling?.listType == "numbered"
      ) {
        const prevValue = this.prevSibling.listValue;
        const newValue = [];
        for (let i = 0; i < this.listLevel; i++) {
          if (this.listLevel == i + 1) {
            newValue.push((prevValue[i] ?? 0) + 1);
          } else {
            newValue.push(prevValue[i] ?? 1);
          }
        }
        return newValue;
      } else {
        const newValue = [];
        for (let i = 0; i < this.listLevel; i++) {
          newValue.push(1);
        }
        return newValue;
      }
    }
    if (this.listType == "bulleted") {
      return this.listBullet;
    }
  }

  get isList() {
    return this.listType != "none";
  }

  switchList(type) {
    if (this.listType != type) {
      if (type == "numbered") {
        this.listType = "numbered";
      }
      if (type == "bulleted") {
        this.listType = "bulleted";
      }
    } else {
      this.listType = "none";
    }
  }

  increaseListLevel() {
    this.listLevel++;
  }

  decreaseListLevel() {
    if (this.listLevel > 1) {
      this.listLevel--;
    } else {
      this.listType = "none";
    }
  }

  get firstLineIndent() {
    return this._firstLineIndent;
  }

  set firstLineIndent(value) {
    value = Number(value);
    if (this.parent != null) {
      value = clamp(
        value,
        -this.indentLeft - this.parent.marginLeft,
        this.contentWidth - minContentWidth
      );
    }
    value = Math.round(value / cmStep) * cmStep;
    this._firstLineIndent = value;
  }
}
