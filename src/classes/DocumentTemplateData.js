export default class DocumentTemplateData {
  constructor(_template) {
    this.id = _template.id;
    this.title = _template.title;
    this.description = _template.description;

    this.marginLeft = _template.marginLeft;
    this.marginRight = _template.marginRight;
    this.marginTop = _template.marginTop;
    this.marginBottom = _template.marginBottom;
    this.format = _template.format;

    this.elements = [];
    // console.log("ww")
    _template.elements.forEach((element) => {
      const newElem = {};
      newElem.id = element.id;
      newElem.type = element.type;
      newElem.leftIndent = element.indentLeft;
      newElem.rightIndent = element.indentRight;
      newElem.spacingBefore = element.spacingBefore;
      newElem.spacingAfter = element.spacingAfter;
      newElem.firstLineIndent = element.firstLineIndent;

      if (element.type == "paragraph") {
        newElem.chunks = element.chunks;
        newElem.lineHeight = element.lineHeight;
        newElem.align = element.align;
        newElem.listType = element.listType;
        newElem.listLevel = element.listLevel;
        newElem.listBullet = element.listBullet;
      }
      this.elements.push(newElem);
    });
  }
}
