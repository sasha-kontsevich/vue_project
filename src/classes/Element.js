import { uuidv4 } from "@/common/utils";

export default class Element {
  constructor() {
    this.id = uuidv4();
    this.type = "element";
    this.parent = null;
    this._prevSibling = null;
    this._nextSibling = null;
    this.elements = [];
  }

  setParent() {
    this.elements.forEach((el) => {
      el.parent = this;
    });
  }

  deleteContentAfter(pos) {}

  deleteContentBefore(pos) {}

  deleteContent(start, end) {
    console.log($`Удалено содержимое с ${start} по ${end} позицию`);
  }

  input(type, pos) {
    console.log(type + " " + pos);
  }

  insertBefore(elem) {
    if (this.parent == null) return;
    console.log("###", this.parent);
    this.parent.insertRelative(elem, this, 0);
  }

  insertAfter(elem) {
    // if (this.parent == null) return;
    console.log("###", this.parent);
    this.insertRelative(elem, this, 1);
  }

  insertRelative(elem, target, shift) {
    elem.parent = this;
    const index = this.elements.indexOf(target);
    //
    // const index = target.parent.elements.indexOf(target);
    this.elements.splice(index + shift, 0, elem);
    this.updateParagraphsSiblings();
  }

  get length() {
    return 1;
  }

  get prevSibling() {
    return this._prevSibling;
  }
  set prevSibling(value) {
    this._prevSibling = value;
  }

  get nextSibling() {
    return this._nextSibling;
  }
  set nextSibling(value) {
    this._nextSibling = value;
  }
get document(){
  this.findCurrentDocTemplate(this)
}
  findCurrentDocTemplate(elem) {
    if (elem.parent?.type == "template") {
      return elem.parent;
    } else {
      return this.findCurrentDocTemplate(elem.parent);
    }
  }
}
