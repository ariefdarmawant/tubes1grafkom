import { initShaderProgram } from "./loaders/shaders";
import GLObject from "./GLObject";
import Renderer from "./renderer";
import {saveAs} from ""
const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
var type = (document.getElementById("type") as HTMLInputElement).value;
var mode = (document.getElementById("mode") as HTMLInputElement).value;
var teta: number;
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

  const renderer = new Renderer();

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
  var coordinates = [];
  var countCoordinates: number;
  canvas.addEventListener(
    "click",
    (event) => {
      if (type === "lines") {
        coordinates.push(appState.mousePos.x);
        coordinates.push(appState.mousePos.y);
        if (coordinates.length === 4) {
          const lineObject = new GLObject(renderer.count, program, gl, "lines");
          lineObject.setVertexArray(coordinates);
          lineObject.setPosition(0, 0);
          lineObject.setRotation(360);
          lineObject.setScale(1, 1);
          lineObject.calcProjectionMatrix();
          lineObject.bind();
          coordinates = [];
          renderer.addObject(lineObject);
          console.log(renderer.objectList);
        }
      } else if (type === "square") {
        console.log("square clicked");
        coordinates.push(appState.mousePos.x);
        coordinates.push(appState.mousePos.y);
        if (coordinates.length === 4) {
          var deltaY = coordinates[3] - coordinates[1];
          var deltaX = coordinates[2] - coordinates[0];
          coordinates.push(coordinates[2] - deltaY);
          coordinates.push(coordinates[3] + deltaX);
          coordinates.push(coordinates[0] - deltaY);
          coordinates.push(coordinates[1] + deltaX);
          const squareObject = new GLObject(
            renderer.count,
            program,
            gl,
            "polygon"
          );
          squareObject.setVertexArray(coordinates);
          squareObject.setPosition(0, 0);
          squareObject.setRotation(360);
          squareObject.setScale(1, 1);
          squareObject.calcProjectionMatrix();
          squareObject.bind();
          renderer.addObject(squareObject);
          coordinates = [];

          console.log(renderer.objectList);
        }
      } else {
        if (countCoordinates > 0) {
          coordinates.push(appState.mousePos.x);
          coordinates.push(appState.mousePos.y);
          console.log(coordinates);
          countCoordinates -= 1;
          if (countCoordinates > 0) {
            console.log("Click " + countCoordinates + " more!");
          }
          if (countCoordinates === 0) {
            console.log(coordinates);
            console.log("DONE");
            const polygonObject = new GLObject(
              renderer.count,
              program,
              gl,
              "polygon"
            );
            polygonObject.setVertexArray(coordinates);
            polygonObject.setPosition(0, 0);
            polygonObject.setRotation(360);
            polygonObject.setScale(1, 1);
            polygonObject.calcProjectionMatrix();
            polygonObject.bind();
            console.log(polygonObject.vertexArray);
            renderer.addObject(polygonObject);
          }
        }
      }
    },
    false
  );

  document.getElementById("type").onchange = function handleChange() {
    type = (document.getElementById("type") as HTMLInputElement).value;
    coordinates = [];
    if (type === "polygon") {
      teta = parseInt(prompt("Masukkan jumlah titik: "));
      while (!teta || teta < 0) {
        teta = parseInt(prompt("Jumlah titik harus berupa angka dan > 0 "));
      }
      countCoordinates = teta;
    }
  };

  document.getElementById("mode").onchange = function handleChange() {
    mode = (document.getElementById("mode") as HTMLInputElement).value;
  };

  document.getElementById("savefile").onclick = function handleClick() {
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
    download(JSON.stringify(renderer.objectList),"test","txt");
    alert("Saving file...");
  };
}

main();
