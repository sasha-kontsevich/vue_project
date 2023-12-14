import { formats } from "@/common/defaults";
import { clamp } from "@/common/utils";
import { minContentWidth, cmStep } from "@/common/settings";
import ParagraphElement from "./ParagraphElement";
import TextElement from "./TextElement";
import InputElement from "./InputElement";
import ImageElement from "./ImageElement";
import TableElement from "./TableElement";
import RowElement from "./RowElement";
import CellElement from "./CellElement";
import Case from "./Case";

//import DocumentSelection from "./DocumentSelection";
import ContainerElement from "./ContainerElement";
import RuleElement from "./RuleElement";

export default class DocumentTemplate extends ContainerElement {
  constructor(templateData) {
    super();
    this.type = "template";
    this.title = "Новый шаблон документа";
    this.description = "Описание";
    this.elements = [];
    this.rules = [];
    this.format = formats.a4;
    this.marginLeft = 2.25;
    this.marginRight = 1;
    this.marginTop = 1;
    this.marginBottom = 1;
    this.ruleRangeBuffer = [];
    this.editableAreaMarkers = [];
    this.addElement(new ParagraphElement());
    this.selectedElement = null;
    this.selectedParagraphs = [];
    this.selectedInlines = [];
    if (templateData) {
      this.load(templateData);
    }
    this.updateParagraphsSiblings();
    this.updateInlineElementsSiblings();
  }

  //Поля и размеры шаблона
  get width() {
    return this.format.width;
  }

  get height() {
    return this.format.height;
  }

  get contentWidth() {
    return this.width - this.marginLeft - this.marginRight;
  }

  set marginTop(value) {
    value = Number(value);
    value = clamp(value, 0, this.height - this.marginBottom - minContentWidth);
    value = Math.round(value / cmStep) * cmStep;
    this._marginTop = value;
  }

  get marginTop() {
    return this._marginTop;
  }

  set marginBottom(value) {
    value = Number(value);
    value = clamp(value, 0, this.height - this.marginTop - minContentWidth);
    value = Math.round(value / cmStep) * cmStep;
    this._marginBottom = value;
  }

  get marginBottom() {
    return this._marginBottom;
  }

  set marginLeft(value) {
    value = Number(value);
    value = clamp(value, 0, this.width - this.marginRight - minContentWidth);
    value = Math.round(value / cmStep) * cmStep;
    this._marginLeft = value;
  }

  get marginLeft() {
    return this._marginLeft;
  }

  set marginRight(value) {
    value = Number(value);
    value = clamp(value, 0, this.width - this.marginLeft - minContentWidth);
    value = Math.round(value / cmStep) * cmStep;
    this._marginRight = value;
  }

  get marginRight() {
    return this._marginRight;
  }

  //Настройки документа
  get symbolsEnabled() {
    return this._symbolsEnabled;
  }
  set symbolsEnabled(value) {
    this._symbolsEnabled = value;
  }

  addElement(elem, index) {
    elem.parent = this;
    if (index != null) {
      this.elements.splice(index, 0, elem);
    } else {
      this.elements.push(elem);
    }
    this.updateParagraphsSiblings();
    this.updateInlineElementsSiblings();
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
    //
    // const index = target.parent.elements.indexOf(target);
    this.elements.splice(index + shift, 0, elem);
    this.updateParagraphsSiblings();
  }

  removeElement(elem) {
    const elemIndex = this.elements.indexOf(elem);
    this.elements.splice(elemIndex, 1);
    this.updateParagraphsSiblings();
  }
  preOrder(elem) {
    if (!elem.elements) {
      if (this.prevElem != null) {
        this.prevElem.nextSibling = elem;
      }
      elem.prevSibling = this.prevElem;
      this.prevElem = elem;
      return;
    }
    elem.elements.forEach((element) => {
      this.preOrder(element);
    });
  }

  get paragraphs() {
    let paragraphs = [];
    this.elements.forEach((element) => {
      if (element.type == "paragraph") {
        paragraphs.push(element);
      } else if (element.type == "table") {
        paragraphs.push(...element.paragraphs);
      }
    });
    return paragraphs;
  }
  get inlineElements() {
    let inlineElements = [];
    let paragraphs = this.paragraphs;
    paragraphs.forEach((paragraph) => {
      inlineElements.push(...paragraph.elements);
    });
    return inlineElements;
  }

  updateParagraphsSiblings() {
    let paragraphs = this.paragraphs;

    for (let i = 0; i < paragraphs.length; i++) {
      paragraphs[i].prevSibling = paragraphs[i - 1] ?? null;
      paragraphs[i].nextSibling = paragraphs[i + 1] ?? null;
    }
  }

  updateInlineElementsSiblings() {
    let inlineElements = this.inlineElements;
    for (let i = 0; i < inlineElements.length; i++) {
      inlineElements[i].prevSibling = inlineElements[i - 1] ?? null;
      inlineElements[i].nextSibling = inlineElements[i + 1] ?? null;
    }
  }
  getParagraphById(id) {
    return this.paragraphs.filter((p) => p.id == id)[0];
  }
  refineAll() {
    //console.log(this.elements)
    // this.elements.forEach(element => {
    // element.refineInlineElements()
    // });
  }
  // Загрузка документа из DocumentTemplateData.js либо из сохраненного
  load(templateData) {
    //инициализация свойств шаблона
    this.id = templateData.id;
    this.title = templateData.title;
    this.description = templateData.description;
    this.format = templateData.format ?? formats.a4;
    this.marginLeft = templateData.marginLeft;
    this.marginRight = templateData.marginRight;
    this.marginTop = templateData.marginTop;
    this.marginBottom = templateData.marginBottom;
    this.editableAreaMarkers = templateData.editableAreaMarkers;
    this.elements = [];
    this.rules = [];
    // templateData.rules.forEach((rule) => {
    //   let newRule;
    //   newRule = new RuleElement();
    //   newRule.title = rule.title;
    //   newRule.options=rule.options;
    //   newRule.selectedValues=rule.selectedValues;
    //   newRule.cases = [];
    //   rule.cases.forEach((cs) => {
    //     let newCase = new Case();
    //     newCase.targetOptions = cs.targetOptions;
    //     newCase.range = cs.range;
    //     newCase.rule=rule;
    //     newRule.cases.push(newCase);
    //   });
    //   this.rules.push(newRule);
    // });
    this.rules = templateData.rules.map((el) => new RuleElement(el));
    ///инициализация массива элементов шаблона
    templateData.elements.forEach((element) => {
      let newElem;
      if (element.type == "paragraph") {
        //paragraph
        newElem = new ParagraphElement();
        newElem.lineHeight = element.lineHeight;
        newElem.align = element.align;
        newElem.listType = element.listType;
        newElem.listLevel = element.listLevel;
        newElem.listBullet = element.listBullet;
        newElem.elements = [];
        element.elements.forEach((chunkData) => {
          let newChunk;
          if (chunkData.type == "text") {
            newChunk = new TextElement();
          }
          if (chunkData.type == "input") {
            newChunk = new InputElement();
          }
          if (chunkData.type == "image") {
            newChunk = new ImageElement(element.src);
          }
          newChunk.load(chunkData);
          newChunk.template = this;
          newChunk.parent = newElem;
          newElem.elements.push(newChunk);
        });
        newElem.selectedChunk = newElem.elements[0];
      } else if (element.type == "table") {
        ///Инициализация таблицы
        newElem = new TableElement(element);
        const cells = newElem.elements.reduce((a, b) => {
          return a.concat(b.elements);
        }, []);
        cells.forEach((el) => {
          const elements = [];
          el.elements.forEach((c) => {
            let newParagraph;
            if (c.type == "paragraph") {
              ///инициализация параграфа
              newParagraph = new ParagraphElement();
              newParagraph.lineHeight = c.lineHeight;
              newParagraph.align = c.align;
              newParagraph.listType = c.listType;
              newParagraph.listLevel = c.listLevel;
              newParagraph.listBullet = c.listBullet;
              newParagraph.elements = [];
              c.elements.forEach((inline) => {
                let newInline;
                if (inline.type == "text") {
                  newInline = new TextElement();
                }
                if (inline.type == "input") {
                  newInline = new InputElement();
                }
                if (inline.type == "image") {
                  newInline = new ImageElement(inline.src);
                }
                newInline.template = this;
                newInline.load(inline);
                newParagraph.elements.push(newInline);
              });
              newParagraph.selectedChunk = newParagraph.elements[0];
              newParagraph.parent = el;
              elements.push(newParagraph);
            }
          });
          el.elements = [...elements];
        });
      }
      newElem.id = element.id;
      newElem.type = element.type;
      newElem.indentRight = element.indentRight ?? 0;
      newElem.indentLeft = element.indentLeft ?? 0;
      newElem.spacingAfter = element.spacingAfter ?? 0;
      newElem.firstLineIndent = element.firstLineIndent ?? 0;
      this.addElement(newElem);
    });
    this.selectedElement = this.elements[0];
    this.selectedParagraphs.push(this.elements[0]);
    this.selectedInlines.push(this.elements[0].elements[0]);
    return this;
  }
}
