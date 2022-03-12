export class Watcher<T> {
  //set types
  private callbackFunctions: ((value: T) => void)[];
  private rules: ((value: T) => boolean)[];
  private InternalValue: T;

  //constructor
  constructor(initialValue: T) {
    this.callbackFunctions = [];
    this.rules = [];
    this.InternalValue = initialValue;
  }

  //functions
  addListener(callback: (value: T) => void) {
    this.callbackFunctions.push(callback);
  }

  removeListener(callback: (value: T) => void) {
    this.callbackFunctions = this.callbackFunctions.filter(
      (ele) => ele !== callback
    );
  }

  addRule(rule: (value: T) => boolean) {
    this.rules.push(rule);
  }

  removeRule(callback: (value: T) => boolean) {
    this.rules = this.rules.filter((ele) => ele !== callback);
  }

  set value(value: T) {
    this.rules.forEach((rule) => {
      if (rule(value) === false) {
        throw `A rule was broken while trying to set a Watched value`;
      }
    });

    this.InternalValue = value;
    this.callbackFunctions.forEach((fn) => {
      fn(value);
    });
  }

  get value() {
    return this.InternalValue;
  }
}
