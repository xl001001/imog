class Ticker {
  constructor() {
    this._tickList = { default: [] };
    this._labels = ['default'];

    this.remove = this.remove.bind(this);

    this._defineFunctions();
  }

  _defineFunctions() {
    const prefixes = ['ms', 'moz', 'webkit', 'o'];
    let i = prefixes.length;

    if (process.env.isNuxt && !process.client) return;
    while (--i > -1 && !window.requestAnimationFrame) {
      window.requestAnimationFrame =
        window[prefixes[i] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[prefixes[i] + 'CancelAnimationFrame'] ||
        window[prefixes[i] + 'CancelRequestAnimationFrame'];
    }

    this._tickHandler = () => {
      this._requestId = window.requestAnimationFrame(this._tickHandler);
      const time = this.time;
      this._labels.forEach((label) => {
        this._tickList[label].forEach((callback) => callback(time));
      });
    };
  }

  get time() {
    return Date.now() || new Date().getTime();
  }

  _start() {
    if (process.env.isNuxt && !process.client) return;

    this.running = true;
    this._startMs = this.time;
    this._nextMs = this._startMs + this._gap;
    this._requestId = window.requestAnimationFrame(this._tickHandler);
  }

  _stop() {
    if (process.env.isNuxt && !process.client) return;

    this.running = false;
    window.cancelAnimationFrame(this._requestId);
  }

  add(callback, label = 'default') {
    if (!this.running) {
      this._start();
    }
    if (!this._tickList[label]) {
      console.warn('Label does not Exist');
      return;
    }
    this._tickList[label].push(callback);
  }

  remove(callback, label = 'default') {
    if (!this._tickList[label]) {
      console.warn('Label does not Exist');
      return;
    }
    const index = this._tickList[label].indexOf(callback);
    if (index >= 0) {
      this._tickList[label].splice(index, 1);
    }
  }

  once(callback, label = 'default') {
    const wrap = (time) => {
      callback(time);
      this.remove(wrap, label);
    };
    this.add(wrap, label);
  }

  addLabel(labelName) {
    if (this._tickList[labelName]) {
      console.warn('Label Already Exists');
      return;
    }
    this._labels.push(labelName);
    this._tickList[labelName] = [];
  }
}

export { Ticker };

const ticker = new Ticker();

export default ticker;
