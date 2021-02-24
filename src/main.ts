import { initShaderProgram } from "./loaders/shaders";
import GLObject from "./GLObject";
import Renderer from "./renderer";
const canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
var type = (document.getElementById("type") as HTMLInputElement).value;
var mode = (document.getElementById("mode") as HTMLInputElement).value;
var editType = (document.getElementById("editType") as HTMLInputElement).value;
var colors = document.getElementById("colorpick").elements;
var colorArr = [];
colorArr = colors["mycolors"].value;
console.log(colorArr);
var teta: number;
var coordinates = [];
var countCoordinates: number;
var dragging = false;
var edittingObject: number;
var mouseclick = false;

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
        if (mouseclick && dragging && edittingObject !== -1) {
          var objIndex = edittingObject[0];
          var i_x_obj = edittingObject[1];
          var i_y_obj = edittingObject[2];
          if (renderer.objectList[objIndex].type === 'square') {
            var value_1 = appState.mousePos.x;
            var value_2 = appState.mousePos.y;
            var deltaX = value_1 - renderer.objectList[objIndex].getVertexIndexValue(i_x_obj);
            var deltaY = value_2 - renderer.objectList[objIndex].getVertexIndexValue(i_y_obj);
            var delta = Math.min(deltaX, deltaY);

            if (i_x_obj == 0) {
              var i_x_1 = 2;
              var i_y_2 = 7;
              deltaX = -delta;
              deltaY = delta;
            } else if (i_x_obj == 2) {
              var i_x_1 = 0;
              var i_y_2 = 5;
              deltaX = -delta;
              deltaY = -delta;
            } else if (i_x_obj == 4) {
              var i_x_1 = 6;
              var i_y_2 = 3;
              deltaX = delta;
              deltaY = -delta;
            } else {
              var i_x_1 = 4;
              var i_y_2 = 1;
              deltaX = delta;
              deltaY = delta;
            }
            console.log(deltaX + ' ' + deltaY);
            renderer.objectList[objIndex].updateVertexArray(i_x_obj, value_1 + deltaX);
            renderer.objectList[objIndex].updateVertexArray(i_y_obj, value_2 + deltaY);
            renderer.objectList[objIndex].updateVertexArray(i_x_1, value_1 + deltaX);
            renderer.objectList[objIndex].updateVertexArray(i_y_2, value_2 + deltaY);
          } else {
            renderer.objectList[objIndex].updateVertexArray(i_x_obj, appState.mousePos.x);
            renderer.objectList[objIndex].updateVertexArray(i_y_obj, appState.mousePos.y);
          }
          renderer.objectList[edittingObject[0]].calcProjectionMatrix();
          renderer.objectList[edittingObject[0]].bind();
          renderer.render();
        }
    },
    false
  );

  canvas.addEventListener("mouseup", (event) => {
    mouseclick = false;
    if (mode !== "create") {
      if (editType === "drag") {
        dragging = false;
        edittingObject = -1;
      }
    }
  });

  canvas.addEventListener("mousedown", (event) => {
    mouseclick = true;
    if (mode !== "create") {
      if (editType === "drag") {
        edittingObject = getNearestObject(
          appState.mousePos.x,
          appState.mousePos.y
        );
        if (edittingObject !== -1) {
          dragging = true;
        }
      }
    }
    if (mode === "create") {
      if (type === "lines") {
        coordinates.push(appState.mousePos.x);
        coordinates.push(appState.mousePos.y);
        if (coordinates.length === 4) {
          const lineObject = new GLObject(
            renderer.count,
            program,
            gl,
            "lines"
          );
          lineObject.setVertexArray(coordinates);
          lineObject.setColorArr(colorArr);
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
            "square"
          );
          squareObject.setVertexArray(coordinates);
          squareObject.setColorArr(colorArr);
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
            polygonObject.setColorArr(colorArr);
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
    } else {
      if (editType === "drag") {
      }
    }
    renderer.render();
  });

  function euclideanDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt(a * a + b * b);
  }

  function getNearestObject(x: number, y: number) {
    var result = -1;
    renderer.objectList.forEach((globject: GLObject, index: number) => {
      var count = 0;
      while (count <= globject.vertexArray.length) {
        if (
          euclideanDistance(
            x,
            y,
            globject.vertexArray[count],
            globject.vertexArray[count + 1]
          ) <= 0.3
        ) {
          result = [index,count,count+1];
          break;
        }
        count += 2;
      }
    });
    return result;
  }

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

  document.getElementById("editType").onchange = function handleChange() {
    editType = (document.getElementById("editType") as HTMLInputElement).value;
  };

  document.getElementById("savefile").onclick = function handleClick() {
    function download(data, filename, type) {
      var file = new Blob([data], { type: type });
      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        // Others
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    }
    download(JSON.stringify(renderer.objectList), "test", "txt");
    alert("Saving file...");
  };
}

main();
