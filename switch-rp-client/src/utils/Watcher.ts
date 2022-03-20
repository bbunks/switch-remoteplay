export class Watcher<T> {
  //set types
  protected callbackFunctions: ((value: T) => void)[];
  protected rules: ((value: T) => void)[];
  protected InternalValue: T;

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

  addRule(rule: (value: T) => void) {
    this.rules.push(rule);
  }

  removeRule(callback: (value: T) => void) {
    this.rules = this.rules.filter((ele) => ele !== callback);
  }

  set value(value: T) {
    this.rules.forEach((rule) => {
      rule(value);
    });

    this.InternalValue = value;

    this.callbackFunctions.forEach(async (fn) => {
      fn(value);
    });
  }

  get value() {
    return this.InternalValue;
  }
}
