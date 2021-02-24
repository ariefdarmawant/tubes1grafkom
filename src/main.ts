import { initShaderProgram } from "./loaders/shaders";
import GLObject from "./GLObject";
import Renderer from "./renderer";

const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");
let appState = {
  mousePos: {
    x: 0,
    y: 0,
  },
};

async function main() {
  if (!gl) {
    alert("WebGL not supported");
    return;
  }

  var program = await initShaderProgram(
    gl,
    "vertexShader.glsl",
    "fragmentShader.glsl"
  );
  gl.useProgram(program);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const u_resolution = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);

  //   var lineData = [];
  //   const glObject = new GLObject(0, program, gl, "triangle");
  //   glObject.setVertexArray(triangleData);
  //   glObject.setPosition(0, 0);
  //   glObject.setRotation(0);
  //   glObject.setScale(1, 1);
  //   glObject.calcProjectionMatrix();
  //   glObject.bind();

  //   const glObject2 = new GLObject(2, program, gl, "triangle");
  //   glObject2.setVertexArray(triangleData);
  //   glObject2.setPosition(600, 400);
  //   glObject2.setRotation(180);
  //   glObject2.setScale(1, 1);
  //   glObject2.calcProjectionMatrix();
  //   glObject2.bind();
  //   const glObject2 = new GLObject(2, program, gl, "lines");
  //   glObject2.setVertexArray(lineData);
  //   glObject2.setPosition(0, 0);
  //   glObject2.setRotation(0);
  //   glObject2.setScale(1, 1);
  //   glObject2.calcProjectionMatrix();
  //   glObject2.bind();

  const renderer = new Renderer();
  //   renderer.addObject(glObject);
  function render() {
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.render();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  canvas.addEventListener(
    "mousemove",
    (event) => {
      const bound = canvas.getBoundingClientRect();
      const res = {
        x: ((event.clientX - bound.left) / canvas.width) * 2 - 1,
        y: -((event.clientY - bound.top) / canvas.height) * 2 + 1,
      };
      appState.mousePos = res;
    },
    false
  );
  var lines = [];
  canvas.addEventListener(
    "click",
    (event) => {
      if ((document.getElementById("type") as HTMLInputElement).value == "lines") {
        lines.push(appState.mousePos.x);
        lines.push(appState.mousePos.y);
        if (lines.length == 4) {
          const lineObject = new GLObject(renderer.count, program, gl, "lines");
          lineObject.setVertexArray(lines);
          lineObject.setPosition(0, 0);
          lineObject.setRotation(360);
          lineObject.setScale(1, 1);
          lineObject.calcProjectionMatrix();
          lineObject.bind();
          lines = [];
          renderer.addObject(lineObject);
          console.log(renderer.objectList);
        }
      }
      else if((document.getElementById("type") as HTMLInputElement).value == "square"){
        lines.push(appState.mousePos.x);
        lines.push(appState.mousePos.y);
        if (lines.length == 4) {
          var square = [];
          square[0] = lines[0];
          square[2] = lines[0];
          square[1] = lines[1];
          square[7] = lines[1];
          square[4] = lines[2];
          square[6] = lines[2];
          square[3] = lines[3];
          square[5] = lines[3];
          var line1 =[]
          var line2 =[]
          var line3 =[]
          var line4 =[]
          line1.push(square[0]);
          line1.push(square[1]);
          line1.push(square[2]);
          line1.push(square[3]);
          line2.push(square[2]);
          line2.push(square[3]);
          line2.push(square[4]);
          line2.push(square[5]);
          line3.push(square[4]);
          line3.push(square[5]);
          line3.push(square[6]);
          line3.push(square[7]);
          line4.push(square[6]);
          line4.push(square[7]);
          line4.push(square[0]);
          line4.push(square[1]);
          const line1Object = new GLObject(renderer.count, program, gl, "lines");
          line1Object.setVertexArray(line1);
          line1Object.setPosition(0, 0);
          line1Object.setRotation(360);
          line1Object.setScale(1, 1);
          line1Object.calcProjectionMatrix();
          line1Object.bind();
          lines = [];
          renderer.addObject(line1Object);
          console.log(renderer.objectList);
          const line2Object = new GLObject(renderer.count, program, gl, "lines");
          line2Object.setVertexArray(line2);
          line2Object.setPosition(0, 0);
          line2Object.setRotation(360);
          line2Object.setScale(1, 1);
          line2Object.calcProjectionMatrix();
          line2Object.bind();
          lines = [];
          renderer.addObject(line2Object);
          console.log(renderer.objectList);
          const line3Object = new GLObject(renderer.count, program, gl, "lines");
          line3Object.setVertexArray(line3);
          line3Object.setPosition(0, 0);
          line3Object.setRotation(360);
          line3Object.setScale(1, 1);
          line3Object.calcProjectionMatrix();
          line3Object.bind();
          lines = [];
          renderer.addObject(line3Object);
          console.log(renderer.objectList);
          const line4Object = new GLObject(renderer.count, program, gl, "lines");
          line4Object.setVertexArray(line4);
          line4Object.setPosition(0, 0);
          line4Object.setRotation(360);
          line4Object.setScale(1, 1);
          line4Object.calcProjectionMatrix();
          line4Object.bind();
          lines = [];
          renderer.addObject(line4Object);
          console.log(renderer.objectList);
        }
      }
    },
    false
  );
}

main();
