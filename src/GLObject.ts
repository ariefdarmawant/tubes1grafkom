import { multiplyMatrix } from "./utils/matrix";

class GLObject {
  public id: number;
  public vertexArray: number[];
  public shader: WebGLProgram;
  public pos: [number, number];
  public rot: number;
  public scale: [number, number];
  public gl: WebGL2RenderingContext;
  public projectionMat: number[];
  public type: string;
  public vbo: WebGLBuffer;
  public colorArr : number[];
  constructor(
    id: number,
    shader: WebGLProgram,
    gl: WebGL2RenderingContext,
    type: string
  ) {
    this.id = id;
    this.shader = shader;
    this.gl = gl;
    this.type = type;
  }
  setVertexArray(vertexArray: number[]) {
    this.vertexArray = vertexArray;
  }

  updateVertexArray(index : number, value: number){
    this.vertexArray[index] = value;
  }

  getVertexIndexValue(index: number): number{
    return this.vertexArray[index];
  }

  setPosition(x: number, y: number) {
    this.pos = [x, y];
  }

  setRotation(rot: number) {
    this.rot = rot;
  }

  setColorArr(colorArr:number){
    this.colorArr = colorArr; 
  }
  setScale(x: number, y: number) {
    this.scale = [x, y];
  }

  calcProjectionMatrix() {
    if (
      this.pos === undefined ||
      this.rot === undefined ||
      this.scale === undefined
    ) {
      return null;
    }
    const [u, v] = this.pos;
    const translateMat = [1, 0, 0, 0, 1, 0, u, v, 1];
    const degrees = this.rot;
    const rad = (degrees * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const rotationMat = [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
    const [k1, k2] = this.scale;
    const scaleMat = [k1, 0, 0, 0, k2, 0, 0, 0, 1];
    const projectionMat = multiplyMatrix(multiplyMatrix(rotationMat,scaleMat), translateMat);
    this.projectionMat = projectionMat;
  }

  bind() {
    const gl = this.gl;
    const vertexBufferObject = gl.createBuffer();
    this.vbo = vertexBufferObject;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertexArray),
      gl.STATIC_DRAW
    );
  }

  draw() {
    const gl = this.gl;
    gl.useProgram(this.shader);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    var vertexPos = gl.getAttribLocation(this.shader, "a_pos");
    var uniformCol = gl.getUniformLocation(this.shader, "u_fragColor");
    var uniformPos = gl.getUniformLocation(this.shader, "u_proj_mat");
    gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix3fv(uniformPos, false, this.projectionMat);
    gl.uniform4fv(uniformCol, this.colorArr);
    gl.enableVertexAttribArray(vertexPos);
    if (this.type === "lines") {
      gl.drawArrays(gl.LINES, 0, this.vertexArray.length - 1);
    } else if (this.type === "polygon" || this.type === "square") {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertexArray.length/2);
    }
  }
}

export default GLObject;
