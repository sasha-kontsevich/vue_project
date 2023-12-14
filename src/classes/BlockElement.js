import Element from "./Element";
import { minContentWidth, cmStep } from "@/common/settings";
import { clamp } from "@/common/utils";

export default class BlockElement extends Element {
  constructor() {
    super();
    this._indentLeft = 0;
    this._indentRight = 0;
    this._spacingBefore = 0;
    this._spacingAfter = 0;

    this.elements = [];
  }

  get firstInlineElement() {
    // console.log(this.elements[0])
      return this.firstElement.firstInlineElement??this.elements[0];
  }
  get lastInlineElement() {
      return this.elements.slice(-1).firstElement??this.elements.slice(-1);
  }

  get firstElement() {
    return this.elements[0];
  }

  get contentWidth() {
    return this.parent.contentWidth - this.indentLeft - this.indentRight;
  }

  //Отступы
  get indentLeft() {
    return this._indentLeft;
  }
  set indentLeft(value) {
    value = Number(value);
    if (this.parent != null) {
      value = clamp(
        value,
        -this.parent.marginLeft - Math.min(this.firstLineIndent, 0),
        this.parent.contentWidth -
          Math.max(this.firstLineIndent, 0) -
          this.indentRight -
          minContentWidth
      );
    }
    value = Math.round(value / cmStep) * cmStep;
    this._indentLeft = value;
  }

  get indentRight() {
    return this._indentRight;
  }
  set indentRight(value) {
    value = Number(value);
    if (this.parent != null) {
      value = clamp(
        value,
        -this.parent.marginRight,
        this.parent.contentWidth -
          this.indentLeft -
          this.firstLineIndent -
          minContentWidth
      );
    }
    value = Math.round(value / cmStep) * cmStep;
    this._indentRight = value;
  }

  get spacingBefore() {
    return this._spacingBefore;
  }
  set spacingBefore(value) {
    this._spacingBefore = Math.max(0, value);
  }

  get spacingAfter() {
    return this._spacingAfter;
  }
  set spacingAfter(value) {
    this._spacingAfter = Math.max(0, value);
  }

  copyStyles(element) {
    this._indentLeft = element._indentLeft;
    this._indentRight = element._indentRight;
    this._spacingBefore = element._spacingBefore;
    this._spacingAfter = element._spacingAfter;
    this._firstLineIndent = element._firstLineIndent;
  }
}
