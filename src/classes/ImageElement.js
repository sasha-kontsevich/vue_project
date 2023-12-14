import InlineElement from './InlineElement';

export default class ImageElement extends InlineElement {
  constructor (src) {
    super();
    this.type = "image";
    this.src = src;
  }

  delete () {
    this.parent.removeElement(this);
  }

  isBegin (pos) {
    if (pos == 0) return true;
    return false;
  }

  isEnd (pos) {
    if (pos == 1) return true;
    return false;
  }

  split(pos) {
    if(pos==0) {
      let image = new ImageElement(this);
      image.src = this.src;
      this.src=null;
      return image
    } else {
      return new ImageElement(null);
    }
  }
}
