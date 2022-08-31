let DEG = 180 / Math.PI;

let drag = document.querySelector("#drag");
let path = document.querySelector(".path");

let pathLength = path.getTotalLength() || 0;
let startPoint = path.getPointAtLength(0);
let startAngle = getRotation(startPoint, path.getPointAtLength(0.1));

let endPoint = path.getPointAtLength(1);

//console.log(pathLength);

TweenLite.set(drag, {
  transformOrigin: "center",
  rotation: startAngle + "_rad",
  xPercent: -50,
  yPercent: -50,
  x: startPoint.x,
  y: startPoint.y,
});

let draggable = new Draggable(drag, {
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

  let position = bestLength + (bestLength === pathLength ? -0.1 : 0.1);
  let rotation = getRotation(best, pathNode.getPointAtLength(position));

  //
  const progress = document.querySelector(".progress");
  progress.style.stroke = "var(--slider-progress-color)";
  //progress.style.d = `path('M 0 0, ${position} 0')`;
  progress.setAttribute("d", `M 0 0, ${position} 0`);

  //Arch red line progress path
  // progress.style.d = `path('M 0 100, A 45 45, 0, 0, 1, ${best.x} ${best.y}')`;

  //console.log((270 * Math.PI) / 180);

  let percent = Math.round((position / pathLength) * 100); //bestLength

  //console.log(percent);

  //let options = [25, 50, 75]; // %
  let options = {
    25: "walk",
    50: "take a bath",
    75: "music",
  };

  //insert data to fake a real response from other users

  let data = {
    walk: 1000,
    bath: 1500,
    music: 900,
  };

  let totals = Object.values(data);
  let max = Math.max(...totals);

  //let [common] = Object.entries(data).find(([key, value]) => value === max);

  let [common, votes] = Object.entries(data).find(function (entries) {
    return entries[1] === max;
  });

  console.log(common);
  let commonAnswer = document.querySelector(".commonAnswer");
  commonAnswer.innerHTML = `The most common answer is : ${common}, with ${votes} votes.`;

  let answer = document.querySelector(".answer");

  //calculate the nearest %
  let nearest = Object.keys(options).reduce((previous, current) =>
    Math.abs(current - percent) < Math.abs(previous - percent)
      ? current
      : previous
  );
  //console.log(nearest);
  /*
  if (options.includes(percent)) {
    answer.innerHTML = `I am ${percent} % happy`;
    //console.log(`I am ${percent} % happy`);
  } else {
    //console.log(`I am ${percent} % happy.`);
    answer.innerHTML = "I am not happy";
  }*/
  /*
  if (nearest === options[0]) {
    console.log("I choose walk");
  } else if (nearest === options[1]) {
    console.log("I choose take a bath");
  } else if (nearest === options[2]) {
    console.log("I choose music");
  }*/

  //console.log(`I choose ${options[nearest]}.`);
  answer.innerHTML = `I choose : ${options[nearest]}`;

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

//move into celtra

//make fake poll with fake data and make it show the most common answer
//snap: function(endValue) { return Math.round(endValue / 50) * 50;
//As an Array - If you use an array of values, InertiaPlugin will first plot the natural landing position and then loop through the array and find the closest number (as long as it’s not outside any bounds you defined). For example, to have it choose the closest number from 10, 50, 200, and 450, you’d do snap: [10,50,200,450].
