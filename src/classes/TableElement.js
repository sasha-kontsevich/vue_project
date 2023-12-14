import BlockElement from "./BlockElement";
import RowElement from "./RowElement";

export default class TableElement extends BlockElement {
  constructor(data) {
    super();
    this.rows = [];
    this.type="table";
    this.xLength = []
    this.yLength = []
    Object.assign(this, data)
    this.elements = this.elements.map(el => new RowElement(el))
    this.setParent()
  }
  get paragraphs() {
    let paragraphs = [];
    this.elements.forEach((row) => {
      paragraphs.push(...row.paragraphs);
    });
    return paragraphs;
  }
  get tableConteinerWidth(){
    
  }

}
