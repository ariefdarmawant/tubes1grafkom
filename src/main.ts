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
<<<<<<< HEAD
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
=======
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
>>>>>>> ddc3ce54233effcb4dd07ad41c0250b39407638d
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
