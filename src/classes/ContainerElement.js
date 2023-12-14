import Element from "@/classes/Element";
import { minContentWidth, cmStep } from "@/common/settings";
import { clamp } from "@/common/utils";
import BlockElement from "./BlockElement";

export default class ContainerElement extends BlockElement {
  constructor() {
    super();
    this.parent = null;
    this.type = "container";

    this._marginLeft = 0;
    this._marginRight = 0;
    this._marginTop = 0;
    this._marginBottom = 0;

    this.elements = [];
    // this._selectedElement = null;
  }

  get width() {
    if (this.parent == null) return this.indentLeft + this.parent.indentRight;
    return this.parent.contentWidth - this.indentLeft - this.parent.indentRight;
  }

  get contentWidth() {
    return this.width - this.marginLeft - this.marginRight;
  }

  // get selectedElement() {
  //   if (this._selectedElement != null) {
  //     return this._selectedElement;
  //   } else {
  //     if (this.parent?.selectedElement != null) {
  //       return this.parent.selectedElement;
  //     } else return null;
  //   }
  // }

  // set selectedElement(value) {
  //   if (this.type == "document") {
  //     this._selectedElement = value;
  //   } else {
  //     if (this.parent) this.parent.selectedElement = value;
  //   }
  // }

  /**
   * @param {number} value
   */
  set marginLeft(value) {
    value = Number(value);
    value = clamp(value, 0, this.width - this.marginRight - minContentWidth);
    value = Math.round(value / cmStep) * cmStep;
    this._marginLeft = value;
  }

  get marginLeft() {
    return this._marginLeft;
  }

  /**
   * @param {number} value
   */
  set marginRight(value) {
    value = Number(value);
    value = clamp(value, 0, this.width - this.marginLeft - minContentWidth);
    value = Math.round(value / cmStep) * cmStep;
    this._marginRight = value;
  }

  get marginRight() {
    return this._marginRight;
  }

  addElement(elem, index) {
    elem.parent = this;
    if (index != null) {
      this.elements.splice(index, 0, elem);
    } else {
      this.elements.push(elem);
    }
    this.updateParagraphSiblings();
  }

  insertAfter(elem, target) {
    this.insertRelative(elem, target, 1);
  }
  insertBefore(elem, target) {
    this.insertRelative(elem, target, 0);
  }
  /**
   * Добавление элемента относительно другого
   * @param {Element} elem - добавляемый элемент
   * @param {Element} target - элемент, относительно которого вставляется elem
   * @param {number} shift - смещение относительно target
   */
  insertRelative(elem, target, shift) {
    elem.parent = this;
    const index = this.elements.indexOf(target);
    this.elements.splice(index + shift, 0, elem);
    this.updateParagraphSiblings();
  }

  removeElement(elem) {
    const elemIndex = this.elements.indexOf(elem);
    this.elements.splice(elemIndex, 1);
    this.updateParagraphSiblings();
  }

  // updateSiblings() {
  //   for (let i = 0; i < this.elements.length; i++) {
  //     this.elements[i].prevSibling = this.elements[i - 1] ?? null;
  //     this.elements[i].nextSibling = this.elements[i + 1] ?? null;
  //   }
  // }
}
