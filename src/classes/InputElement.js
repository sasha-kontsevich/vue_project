import InlineElement from './InlineElement';

export default class InputElement extends InlineElement {
  constructor () {
    super();
    this.title = "Поле ввода";
    this.type = "input";
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.fontColor = "#000000";
    this.fontFamily = "Times";
    this.fontSize = 14;
    this.pos = 0
  }

  toString () {
    return "[" + this.title + "]";
  }

  get length () {
    return 1;
  }

  load (data) {
    Object.assign(this, data);
  }
}
