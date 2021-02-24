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

  var triangleData = [400, 400.0, 400.0, 200.0, 200.0, 400.0];
  const glObject = new GLObject(0, program, gl, "triangle");
  glObject.setVertexArray(triangleData);
  glObject.setPosition(0, 0);
  glObject.setRotation(0);
  glObject.setScale(1, 1);
  glObject.calcProjectionMatrix();
  glObject.bind();

  const glObject2 = new GLObject(2, program, gl, "triangle");
  glObject2.setVertexArray(triangleData);
  glObject2.setPosition(600, 400);
  glObject2.setRotation(180);
  glObject2.setScale(1, 1);
  glObject2.calcProjectionMatrix();
  glObject2.bind();

  const renderer = new Renderer();
  renderer.addObject(glObject);
  renderer.addObject(glObject2);
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
        x: event.clientX - bound.left,
        y: event.clientY - bound.top,
      };
      appState.mousePos = res;
    },
    false
  );

  canvas.addEventListener(
    "click",
    (event) => {
      console.log("test");
    },
    false
  );
}

main();
