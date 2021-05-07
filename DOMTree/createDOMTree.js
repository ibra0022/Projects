class Node {
  element;
  x;
  y;
  children;
  parent;
  isActive;
  isMouseOver;
  isClicked;
  isAttributes;
  isMouseDown;
  isMouseUp;
  placeChanged;

  constructor(element, parent = null) {
    this.element = element;
    this.children = [];
    this.parent = parent;
    this.isActive = true;
    this.isMouseOver = false;
    this.isClicked = false;
    this.isAttributes = false;
    this.isMouseDown = false;
    this.isMouseUp = true;
    this.placeChanged = false;
  }
}
let canvWidth = 1300;
let canvHeight = 1000;
let red = 30;

var b;

function makeRoot(root, ctx, canvas, draw) {
  const path = new Path2D();
  ctx.fillStyle = "black";
  path.rect(root.x - 40, root.y, 10, 10);
  ctx.stroke(path);
  ctx.fillStyle = "red";
  ctx.font = "15px sans-serif";

  function getXY(canvas, event) {
    //shape
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top; //mouse event
    const x = event.clientX - rect.left;
    return { x: x, y: y };
  }
  if (root.isActive) {
    ctx.fillText("-", root.x - 38, root.y + 8, 50);
  } else {
    ctx.fillText("+", root.x - 39, root.y + 10, 50);
  }

  document.addEventListener(
    "click",
    function (e) {
      const XY = getXY(canvas, e);
      if (ctx.isPointInPath(path, XY.x, XY.y)) {
        //isClicked = true;
        if (root.isActive) {
          console.log("is active");
          root.isActive = false;
          ctx.clearRect(0, 0, 1300, 1000);
          //makeRoot(root, ctx, canvas);
          draw();
          e.stopImmediatePropagation();
        } else {
          console.log("is not active");
          root.isActive = true;
          ctx.clearRect(0, 0, 1300, 1000);
          //makeRoot(root, ctx, canvas);
          draw();
          e.stopImmediatePropagation();
        }
      }
    },
    false
  );

  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(root.x, root.y, red, 0, 2 * Math.PI);
  ctx.stroke();
  const tag = root.element.nodeName;
  ctx.font = "10px sans-serif";
  ctx.fillText(tag, root.x - 15, root.y, 400);
}

let body = new Node(document.querySelector("body"));

let array = new Array();
let layer = 0;

var canvas = document.getElementById("project");
var ctx = canvas.getContext("2d");

//--------------body things---------------------

body.x = canvWidth / 2;
body.y = 35;

arr(body);
console.log(array);
// --------- to create the levels ----------------
function arr(node) {
  console.log("asd");
  if (array.length < layer + 1) {
    array[layer] = new Array();
  }

  for (let i = 0; i < node.element.childNodes.length; i++) {
    if (
      node.element.childNodes[i].nodeType === 3 &&
      node.element.childNodes[i].nodeValue.trim() === ""
    ) {
      continue;
    }

    if (
      node.element.childNodes[i].nodeType === 1 ||
      node.element.childNodes[i].nodeType === 3
    ) {
      const element = new Node(node.element.childNodes[i], node);
      element.parent.children.push(element);
      if (element.element.childNodes.length > 0) {
        layer++;
        arr(element);
        layer--;
      }

      array[layer].push(element);
    }
  }
}

let isClicked = false;

//let active = true;
draw();

// ---------- to drwa the cirles and lines -------------
function draw() {
  console.log("dsa");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  makeRoot(body, ctx, canvas, draw);

  for (let i = 0; i < array.length; i++) {
    let arr = array[i];
    let margen = 0;

    margen = canvWidth / arr.length;
    let numOfChild = 0;

    for (let n = 0; n < arr.length; n++) {
      const element = arr[n];

      if (element.parent.isActive) {
        numOfChild++;
      }
    }

    margen = canvWidth / numOfChild;

    let x = margen;
    let y = 100 * (i + 1) + 35;

    for (let j = 0; j < arr.length; j++) {
      //arrX.push(x - margen / 2);

      // console.log(x);
      const element = arr[j];
      // element.parent.children.push(element);
      if (element.isMouseDown || element.placeChanged) {
        // element.x = x - margen / 2;
      } else {
        element.x = x - margen / 2;
      }
      element.y = y;
      if (!element.parent.isActive) {
        element.isActive = false;
        continue;
      }

      if (element.element.nodeType === 3) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.rect(element.x - 30, element.y - 30, 60, 30);
        ctx.stroke();

        const tag = element.element.nodeValue;
        //console.log(tag);
        ctx.font = "10px sans-serif";
        ctx.fillText(tag, element.x - 28, element.y - 15, 400);
      } else {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(element.x, element.y, red, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        //const path = new Path2D();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.rect(element.x - 40, element.y, 10, 10);
        ctx.stroke();
        ctx.closePath();

        // collaps
        if (element.isActive) {
          ctx.fillStyle = "red";
          ctx.font = "15px sans-serif";
          //console.log("hope active");
          ctx.fillText("-", element.x - 38, element.y + 8, 50);
        } else {
          ctx.fillStyle = "red";
          ctx.font = "15px sans-serif";
          //console.log("hope not active");
          ctx.fillText("+", element.x - 39, element.y + 10, 50);
        }

        // hover
        if (element.isMouseOver) {
          let hoverText = element.element.outerHTML;

          String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
          };

          for (let i = 30; i < hoverText.length; i = i + 20) {
            hoverText = hoverText.splice(i, 0, "\n");
          }

          var lines = hoverText.split("\n");

          ctx.beginPath();
          ctx.rect(
            element.x - 200,
            element.y - 40,
            200 - 30,
            lines.length * 15
          );
          ctx.strokeStyle = "#e3941e";
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "black";
          ctx.fillStyle = "#030054";
          ctx.fill();
          ctx.closePath();

          ctx.fillStyle = "white";
          ctx.font = "13px sans-serif";
          for (var h = 0; h < lines.length; h++)
            ctx.fillText(lines[h], element.x - 198, element.y - 29 + h * 15);
          //ctx.fillText(hoverText, element.x - 125, element.y - 30, 300);
        }

        //Atterbute

        ctx.rect(element.x - 50, element.y - 20, 20, 10);

        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = "15px sans-serif";

        ctx.fillText("...", element.x - 48, element.y - 15, 50);

        if (element.isAttributes) {
          let attributes = "";
          for (let i = 0; i < element.element.attributes.length; i++) {
            attributes +=
              element.element.attributes.item(i).localName +
              " = " +
              element.element.attributes.item(i).value +
              "\n";
          }

          var lines = attributes.split("\n");

          ctx.beginPath();
          ctx.rect(element.x - 150, element.y - 40, 90, lines.length * 15);
          ctx.strokeStyle = "#c2b82b";
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "black";
          ctx.fillStyle = "#40013a";
          ctx.fill();
          ctx.closePath();

          ctx.fillStyle = "white";
          ctx.font = "13px sans-serif";
          for (var z = 0; z < lines.length; z++)
            ctx.fillText(lines[z], element.x - 148, element.y - 29 + z * 15);
        }
        // event for expantion
        // expantionEvent(element, canvas, ctx, draw);

        ctx.fillStyle = "black";
        const tag = element.element.nodeName;
        // console.log(tag);
        ctx.font = "10px sans-serif";
        ctx.fillText(tag, element.x - 15, element.y, 400);
      }

      ctx.beginPath();
      ctx.moveTo(element.x, element.y - red);
      // console.log(element.parent.x);
      ctx.lineTo(element.parent.x, element.parent.y + red);
      ctx.stroke();
      ctx.closePath();

      x += margen;
    }
  }

  // -------- to draw the lines to the body
  for (let index = 0; index < array[0].length; index++) {
    const element = array[0][index];
    // console.log("----------");
    // console.log(element);
    if (body.isActive) {
      ctx.beginPath();
      ctx.moveTo(element.x, element.y - red);
      // console.log(element.parent.x);
      ctx.lineTo(element.parent.x, element.parent.y + red);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
// });

// --------- event function for expantion --------------

function getXY(canvas, event) {
  //shape
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top; //mouse event
  const x = event.clientX - rect.left;
  return { x: x, y: y };
}
//});
function downloadCanvas() {
  // get canvas data
  var image = canvas.toDataURL();

  // create temporary link
  var tmpLink = document.createElement("a");
  tmpLink.download = "image.png"; // set the name of the download file
  tmpLink.href = image;

  // temporarily add link to body and initiate the download
  document.body.appendChild(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
}

document.addEventListener("click", (e) => {
  expantion(e);
  atterbute(e);
});

document.addEventListener("mousemove", (e) => {
  hover(e);
  nodeMove(e);
});

document.addEventListener("dblclick", (e) => {
  addChild(e);
});

document.addEventListener("mousedown", (e) => {
  mouseDown(e);
});
document.addEventListener("mouseup", (e) => {
  mouseUp(e);
});

function getXY(canvas, event) {
  //shape
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top; //mouse event
  const x = event.clientX - rect.left;
  return { x: x, y: y };
}

function expantion(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];
      //for showing and hiding children
      const path = new Path2D();

      if (element.element.nodeType === 1) {
        path.rect(element.x - 40, element.y, 10, 10);
        const XY = getXY(canvas, e);
        if (ctx.isPointInPath(path, XY.x, XY.y)) {
          if (element.isActive) {
            element.isActive = false;
          } else {
            element.isActive = true;
          }

          ctx.clearRect(0, 0, 1300, 1000);
          //y = 50;
          draw();
        }
      }
    }
  }
}

function hover(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];
      const path = new Path2D();

      if (!element.isMouseDown) {
        path.arc(element.x, element.y, red, 0, 2 * Math.PI);

        var timer = 0;
        const XY = getXY(canvas, e);
        if (ctx.isPointInPath(path, XY.x, XY.y)) {
          console.log("hover");
          clearTimeout(timer);
          if (!element.isMouseOver) {
            element.isMouseOver = true;
            //console.log("not Over" + element.isMouseOver);
            ctx.clearRect(0, 0, 1300, 1000);
            document.removeEventListener("mousemove", hover, false);
            draw();
          }
          timer = setTimeout(() => {
            element.isMouseOver = false;
            ctx.clearRect(0, 0, 1300, 1000);
            document.removeEventListener("mousemove", hover, false);
            draw();
          }, 3000);
        }
      }
    }
  }
}

function addChild(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];
      const path = new Path2D();

      path.arc(element.x, element.y, red, 0, 2 * Math.PI);

      const XY = getXY(canvas, e);
      if (ctx.isPointInPath(path, XY.x, XY.y)) {
        var tag = prompt("Please enter new Child node:", "div");
        // e.preventDefault();
        if (tag == null || tag == "") {
          txt = "User cancelled the prompt.";
        } else {
          txt = "you enter " + tag;
          var node = document.createElement(tag); // Create a <li> node
          element.element.appendChild(node); // Append <li> to <ul> with id="myList"
        }

        array = new Array();
        layer = 0;
        ctx.clearRect(0, 0, 1300, 1000);
        arr(body);
        draw();
      }
    }
  }
}

function atterbute(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];
      //for showing and hiding children
      const path = new Path2D();
      path.rect(element.x - 50, element.y - 20, 20, 10);

      const XY = getXY(canvas, e);
      if (ctx.isPointInPath(path, XY.x, XY.y)) {
        //console.log(element.element.attributes);
        console.log("atterbute");
        if (element.isAttributes) {
          element.isAttributes = false;
        } else {
          element.isAttributes = true;
        }

        //console.log(attributes);
        ctx.clearRect(0, 0, 1300, 1000);
        draw();
        //e.stopImmediatePropagation();
      }
    }
  }
}

function mouseDown(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];
      //for showing and hiding children
      const path = new Path2D();
      path.arc(element.x, element.y, red, 0, 2 * Math.PI);

      const XY = getXY(canvas, e);
      if (ctx.isPointInPath(path, XY.x, XY.y)) {
        console.log("mouse down");
        element.isMouseDown = true;
        element.isMouseUp = false;
      }
    }
  }
}

function nodeMove(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];

      const XY = getXY(canvas, e);

      if (element.isMouseDown && !element.isMouseUp) {
        console.log(XY.x);
        element.x = XY.x;
        ctx.clearRect(0, 0, 1300, 1000);
        draw();
      }
    }
  }
}

function mouseUp(e) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const element = array[i][j];

      console.log("mouse Up");
      element.isMouseDown = false;
      element.isMouseUp = true;
      element.placeChanged = true;
      // }
    }
  }
}
