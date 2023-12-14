import InlineElement from "./InlineElement";
import { uuidv4 } from "@/common/utils";
export default class TextElement extends InlineElement {
  constructor(text) {
    super();
    this.data = text ?? "";
    this.type = "text";
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.fontColor = "#000000";
    this.backgroundColor = 0x000000;
    this.fontFamily = "Times";
    this.fontSize = 14;
    this.template = null;
  }

  get length() {
    return this.data.length;
  }
  get ruleRangeList() {
    return this.template.rules.reduce(
      (a, b) =>
        a.concat(
          b.cases.reduce(
            (c, d) => c.concat(d.range.includes(this.id) ? [d.range] : []),
            []
          )
        ),
      []
    );
  }
  get isRuleAffected() {
    return Boolean(this.ruleRangeList[0]);
  }
  get isSelectedForRule() {
    return this.template.ruleRangeBuffer.includes(this.id);
  }
  get isFirstWithinRange() {
    if (this.ruleRangeList.length)
      return this.ruleRangeList.some((el) => !el.indexOf(this.id));
  }
  get isFirstWithinSelectionForRule() {
    return this.template.ruleRangeBuffer[0] === this.id;
  }
  get isLastWithinSelectionForRule() {
    return (
      this.template.ruleRangeBuffer[
        this.template.ruleRangeBuffer.length - 1
      ] === this.id
    );
  }
  markerTest() {
    if (this.isFirstWithinRange) {
      return "red";
    }
  }
  get isLastWithinRange() {
    return this.ruleRangeList.some(
      (el) => el.lastIndexOf(this.id) === el.length - 1
    );
  }
  toString() {
    return this.data;
  }

  addText(text) {
    this.data += text;
  }

  deleteChar(pos) {
    this.data = this.data.slice(0, pos) + this.data.slice(pos + 1);
  }

  insertText(pos, text) {
    this.data = this.data.slice(0, pos) + text + this.data.slice(pos);
  }

  getNextSymbol(pos) {
    return this.data.slice(pos, pos + 1);
  }

  split(pos) {
    let self=this
    let text = this.data;
    let newElement = new TextElement();
   // console.log(this.parent.parent)
    newElement.template = this.parent.parent;
    this.data = text.slice(0, pos); //возвращает новый массив, в который копирует элементы, начиная с индекса start и до end (не включая end
    //фактически копирует часть текстового элемента до позиции каретки и записывает в себя.
    newElement.data = text.slice(pos); //получает часть символов с позиции и до конца
    newElement.copyStyles(this);
    newElement.parent = this.parent;
    if (this.isRuleAffected) {
      this.ruleRangeList.forEach(function(range) {
        range.splice(
         range.indexOf(self.id)+1,
          0,
          newElement.id
        );
      });
    }
    return newElement; //возвращает отрезанную от строки часть
  }

  copy() {
    let newElement = new TextElement();
    newElement.data = this.text;
    newElement.copyStyles(this);
    return newElement;
  }

  load(data) {
    this.data = data.data;
    this.copyStyles(data);
    this.id = data?.id ?? this.id;
  }

  copyStyles(textElement) {
    this.bold = textElement.bold;
    this.italic = textElement.italic;
    this.underline = textElement.underline;
    this.fontColor = textElement.fontColor;
    this.fontFamily = textElement.fontFamily;
    this.fontSize = textElement.fontSize;
  }

  changeStyle(field, value) {
    if (field == "Bold") {
      this.bold = !this.bold;
    }
    if (field == "Italic") {
      this.italic = !this.italic;
    }
    if (field == "Underline") {
      this.underline = !this.underline;
    }
    if (field == "fontSize") {
      this.fontSize = value;
    }
    if (field == "fontFamily") {
      this.fontFamily = value;
    }
    if (field == "fontColor") {
      this.fontColor = value;
    }
  }

  isStyleEquals(textElement) {
    return (
      this.bold == textElement.bold &&
      this.italic == textElement.italic &&
      this.underline == textElement.underline &&
      this.fontColor == textElement.fontColor &&
      this.fontColor == textElement.fontColor &&
      this.fontSize == textElement.fontSize
    );
  }
}
