import Element from "./Element";
import CellElement from "./CellElement";

export default class RowElement extends Element {
  constructor(data) {
    super();
    this.type = "row";
    this.cells = [];
    Object.assign(this, data);
    this.elements = this.elements.map((el) => new CellElement(el));
    this.setParent();
  }
  get paragraphs() {
    let paragraphs = [];
    this.elements.forEach((cell) => {
      paragraphs.push(...cell.paragraphs);
    });
    return paragraphs;
  }

  get index() {
    return this.parent.elements.indexOf(this);
  }
  get height() {
    return this.parent.yLength[this.index];
  }
}
