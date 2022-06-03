var canvas = document.querySelector("canvas");
var tileContainer = document.querySelector(".tilemap-container");
var tileSelection = document.querySelector(".tilemap_selection");
var tileImage = document.querySelector("#tilemap-source");
var ctx = canvas.getContext("2d");

var selection = [0, 0];
var currentLayer = 0;
var layers = [{}, {}, {}];
var isMouseDown = false;

tileContainer.addEventListener("mousedown", (e) => {
  selection = getCoords(e);
  tileSelection.style.left = selection[0] * 36 + "px";
  tileSelection.style.top = selection[1] * 36 + "px";
});

canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
  isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    addTile(e);
  }
});
function addTile(event) {
  var clicked = getCoords(event);
  var key = clicked[0] + "-" + clicked[1];

  if (event.shiftKey) {
    delete layers[currentLayer][key];
  } else {
    layers[currentLayer][key] = [selection[0], selection[1]];
  }

  draw();
}
function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var tileSize = 12;

  //Desenha primeiro as camadas superiores
  for (let i = layers.length - 1; i >= 0; i--) {
    Object.keys(layers[i]).forEach((key) => {
      var xPos = Number(key.split("-")[0]);
      var yPos = Number(key.split("-")[1]);
      var [tilesheetX, tilesheetY] = layers[i][key];

      ctx.drawImage(
        tileImage,
        tilesheetX * 12,
        tilesheetY * 12,
        tileSize,
        tileSize,
        xPos * 36,
        yPos * 36,
        36,
        36
      );
    });
  }
}
function getCoords(e) {
  const { x, y } = e.target.getBoundingClientRect();
  const mouseX = e.clientX - x;
  const mouseY = e.clientY - y;
  return [Math.floor(mouseX / 36), Math.floor(mouseY / 36)];
}
function setLayer(layer) {
  currentLayer = layer;
  var last = document.querySelector(".layer.selected");
  if (last) {
    last.classList.remove("selected");
  }

  document.querySelector(`[layer="${currentLayer}"]`).classList.add("selected");
}
function clearCanvas() {
  layers = [{}, {}, {}];
  draw();
}
function exportImage(){
  var content = canvas.toDataURL();
  var a = document.createElement('a');
  a.href = content;
  a.download = 'map.png';
  document.body.appendChild(a);
  a.click();
}

tileImage.onload = function () {
  draw();
};

tileImage.src = "./assets/Tilemap.png";
