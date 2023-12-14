export default class DocumentSelection {
  constructor(document) {
    this._document = document;
    this.moveCaretToStart();
    this._selStartPos = 0;
    this._selEndPos = 0;
    this._isCollapsed = true;
  }

  get selectedElements() {
      let elements = [];
      return elements;
  }
  get selectedElement() {
      return this._focusElement;
  }


  collapseToEnd() {
    this._anchorElement = this._focusElement;
    this._anchorOffset = this._focusOffset;
  }
  collapseToStart() {
    this._focusElement = this._anchorElement;
    this._focusOffset = this._anchorOffset;
  }

  moveCaretToStart() {
    this._focusElement = this._document.firstInlineElement;
    this._focusOffset = 0;
    // console.log(this._focusElement)
    this.collapseToEnd();
  }
  moveCaretToEnd() {
    this._focusElement = this._document.lastInlineElement;
    this._focusOffset = this._focusElement.length;
    this.collapseToEnd();
  }

  get selStartPos() {
    return this._selStartPos;
  }
  set selStartPos(value) {
    this._selStartPos = value;
    let elem = this._document.firstInlineElement;
    let currentPos = 0;
    while (elem!=null) {
      if(value-currentPos<=elem.length){
        this._anchorElement = elem;
        this._anchorOffset = value-currentPos;
        break;
      }
      currentPos += elem.length+1;
      elem = elem.nextSibling;
    }
    if(this.isCollapsed) {
      this._selEndPos = value;
    }
  }
  
  get selEndPos() {
    return this._selEndPos;
  }
  set selEndPos(value) {
    this._selEndPos = value;
    let elem = this._document.firstInlineElement;
    let currentPos = 0;
    while (elem!=null) {
      if(value-currentPos<=elem.length){
        // console.log(elem.getNextSymbol(value-currentPos))
        this._focusElement = elem;
        this._focusOffset = value-currentPos;
        break;
      }
      currentPos += elem.length+1;
      elem = elem.nextSibling;
    }
    if(this.isCollapsed) {
      this._selStartPos = value;
    }
  }

  get isCollapsed() {
    return this._isCollapsed;
  }
  set isCollapsed(value) {
    this._isCollapsed = value;
    this.selStartPos = this.selEndPos;
  }
}
