import { uuidv4 } from "@/common/utils";
export default class Case {
    constructor (data) {
        this.id = uuidv4();
        this.targetOptions = []
        this.range = []
        this.rule = null
        Object.assign(this, data)
      }
      get isActive () {
        return this.targetOptions.sort().join() === this.rule.selectedValues.sort().join()
      }
}
