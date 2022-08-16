let DEG = 180 / Math.PI;

let drag = document.querySelector("#drag");
let path = document.querySelector(".path");

let pathLength = path.getTotalLength() || 0;
let startPoint = path.getPointAtLength(0);
let startAngle = getRotation(startPoint, path.getPointAtLength(0.1));

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
  let p = closestPoint(path, pathLength, point);

  TweenLite.set(drag, {
    rotation: p.rotation,
  });

  return p.point;
}

function closestPoint(pathNode, pathLength, point) {
  let precision = 8,
    best,
    bestLength,
    bestDistance = Infinity;

  // linear scan for coarse approximation
  for (
    let scan, scanLength = 0, scanDistance;
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
    let before, after, beforeLength, afterLength, beforeDistance, afterDistance;
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

  let len2 = bestLength + (bestLength === pathLength ? -0.1 : 0.1);
  let rotation = getRotation(best, pathNode.getPointAtLength(len2));

  return {
    point: best,
    rotation: rotation * DEG,
    // distance: Math.sqrt(bestDistance),
  };

  function distance2(p) {
    let dx = p.x - point.x,
      dy = p.y - point.y;
    return dx * dx + dy * dy;
  }
}

function getRotation(p1, p2) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}
