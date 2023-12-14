import { uuidv4 } from "@/common/utils";
import Case from "@/classes/Case";

export default class RuleElement {
  constructor(data) {
    this.id = uuidv4();
    this.title = null;
    this.options = [];
    this.cases = [];
    this.selectedValues = [];
    Object.assign(this, data);
    this.options = [...this.options];
    this.cases = this.cases.map((el) => new Case({ ...el, rule: this }));
  }
  getCasesForRange(range) {
    return this.cases.filter(function (cs) {
      return JSON.stringify(cs.range) === JSON.stringify(range)
    });
  }
  // { id: 1, title: 'option'}
}
