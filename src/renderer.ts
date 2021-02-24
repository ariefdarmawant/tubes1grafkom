import GLObject from "./GLObject";

class Renderer {
  public objectList: Array<GLObject>;
  public count: number;

  constructor() {
    this.objectList = new Array<GLObject>();
    this.count = 0;
  }

  addObject(obj: GLObject) {
    this.objectList.push(obj);
    this.count++;
  }

  objectListLength() {
    return this.objectList.length;
  }

  clearObject() {
    this.objectList = new Array<GLObject>();
  }

  render() {
    for (const obj of this.objectList) {
      obj.draw();
    }
  }
}

export default Renderer;
