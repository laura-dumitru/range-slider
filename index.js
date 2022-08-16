/*let slider = document.querySelector(".sliderLine");
let circle = document.querySelector(".sliderCircle");

//result.innerHTML = slider.value; // Display the default slider value

let options = ["25", "50", "75"];

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function (input) {
  result.innerHTML = this.value;

  if (options.includes(this.value)) {
    console.log(`I am ${this.value}% happy`);
  } else {
    console.log("I am not in the array!");
  }
};

// a range from 0 to 100, 0 being very sad, 100 very happy.
//Breakpoints for Custom events at 25/50/75%
//but if someone puts their input at around 35% for example, it should log the closest custom event, in this instance being 25%.

//math.ceil

let line = document.querySelector(".line");

console.log(line.attributes.d.value);

//line.attributes.d.value = "M 0 100 800 100";
*/

// Closest Point on Path
// https://bl.ocks.org/mbostock/8027637

var DEG = 180 / Math.PI;

var drag = document.querySelector("#drag");
var path = document.querySelector(".path");

var pathLength = path.getTotalLength() || 0;
var startPoint = path.getPointAtLength(0);
var startAngle = getRotation(startPoint, path.getPointAtLength(0.1));

TweenLite.set(drag, {
  transformOrigin: "center",
  rotation: startAngle + "_rad",
  xPercent: -50,
  yPercent: -50,
  x: startPoint.x,
  y: startPoint.y,
});

var draggable = new Draggable(drag, {
  liveSnap: {
    points: pointModifier,
  },
});

TweenLite.set(".container", {
  autoAlpha: 1,
});

function pointModifier(point) {
  var p = closestPoint(path, pathLength, point);

  TweenLite.set(drag, {
    rotation: p.rotation,
  });

  return p.point;
}

function closestPoint(pathNode, pathLength, point) {
  var precision = 8,
    best,
    bestLength,
    bestDistance = Infinity;

  // linear scan for coarse approximation
  for (
    var scan, scanLength = 0, scanDistance;
    scanLength <= pathLength;
    scanLength += precision
  ) {
    if (
      (scanDistance = distance2(
        (scan = pathNode.getPointAtLength(scanLength))
      )) < bestDistance
    ) {
      (best = scan), (bestLength = scanLength), (bestDistance = scanDistance);
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
    if (
      (beforeLength = bestLength - precision) >= 0 &&
      (beforeDistance = distance2(
        (before = pathNode.getPointAtLength(beforeLength))
      )) < bestDistance
    ) {
      (best = before),
        (bestLength = beforeLength),
        (bestDistance = beforeDistance);
    } else if (
      (afterLength = bestLength + precision) <= pathLength &&
      (afterDistance = distance2(
        (after = pathNode.getPointAtLength(afterLength))
      )) < bestDistance
    ) {
      (best = after),
        (bestLength = afterLength),
        (bestDistance = afterDistance);
    } else {
      precision /= 2;
    }
  }

  var len2 = bestLength + (bestLength === pathLength ? -0.1 : 0.1);
  var rotation = getRotation(best, pathNode.getPointAtLength(len2));

  return {
    point: best,
    rotation: rotation * DEG,
    // distance: Math.sqrt(bestDistance),
  };

  function distance2(p) {
    var dx = p.x - point.x,
      dy = p.y - point.y;
    return dx * dx + dy * dy;
  }
}

function getRotation(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}
