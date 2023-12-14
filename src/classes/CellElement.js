import Element from "./Element";

export default class CellElement extends Element {
  constructor(data) {
    super();
    this.type = "cell";
    Object.assign(this, data)
    this.setParent()
  }

  removeElement() {}
  get paragraphs() {
    let paragraphs = [];
    this.elements.forEach((element) => {
      if (element.type == "paragraph") {
        paragraphs.push(element);
      } else {
        console.log("Элемент не является параграфом");
      }
    });
    return paragraphs;
  }
  get x() {
    return this.parent.elements.indexOf(this);
  }
  get y() {
    return this.parent.parent.elements.indexOf(this.parent);
  }
  get table () {
    return this.parent.parent
  }
}
