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
        
      }
    },
    false
  );
}

main();
