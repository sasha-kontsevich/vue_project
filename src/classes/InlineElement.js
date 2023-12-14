/**
 * Общий класс для объектов, которые могут быть размещены внутри параграфа: TextChunk, ImageElement, InputElement
 */import { uuidv4 } from "@/common/utils";
import Element from "./Element";

export default class InlineElement extends Element {
  constructor() {
   // this.id = uuidv4();
    super();
  }

  copy(element) {
    
  }

  
}
