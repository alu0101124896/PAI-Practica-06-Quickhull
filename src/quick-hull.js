/**
 * @file country-abbreviation.js
 * @author Sergio Tabares Hernández <alu0101124896@ull.edu.es>
 * @since Spring 2020
 * @summary University of La Laguna
 * @summary Computer Science - Interactive Aplication Programing
 * @description This program implements the Quick Hull Algorithm. More info about it here: https://en.wikipedia.org/wiki/main
 */

"use strict"

function random(min_val, max_val) {
  return (Math.floor(Math.random() * (max_val - min_val)) + min_val);
}

class Point {
  constructor(x = 0, y = 0) {
    this.x = Number(x);
    this.y = Number(y);
    this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'
  }

  get_x() { return this.x; }

  get_y() { return this.y; }

  draw(CONTEXT) {
    CONTEXT.fillStyle = this.color;
    CONTEXT.beginPath();
    CONTEXT.ellipse(this.x, this.y, 5, 5, 0, 0, 2 * Math.PI);
    CONTEXT.fill();
  }
}

function drawPoints(points, CONTEXT) {
  points.forEach(point => { point.draw(CONTEXT); });
}

function drawLine(firstPoint, secondPoint, CONTEXT) {
  CONTEXT.beginPath();
  CONTEXT.moveTo(firstPoint.get_x(), firstPoint.get_y());
  CONTEXT.lineTo(secondPoint.get_x(), secondPoint.get_y());
  CONTEXT.lineWidth = 3;
  CONTEXT.strokeStyle = 'red';
  CONTEXT.stroke();
}

function redrawAll(convexHull, points, CONTEXT, CANVAS) {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  drawPoints(points, CONTEXT);
  for (let convexHullIterator = 1; convexHullIterator < convexHull.length; convexHullIterator++) {
    drawLine(convexHull[convexHullIterator - 1], convexHull[convexHullIterator], CONTEXT);
  }
  drawLine(convexHull[convexHull.length - 1], convexHull[0], CONTEXT);
}

function findLeftMostPoint(points) {
  let leftMostPoint = points[0];
  points.forEach(point => {
    if (point.get_x() < leftMostPoint.get_x()) {
      leftMostPoint = point;
    } else if ((point.get_x() === leftMostPoint.get_x()) && (point.get_y() < leftMostPoint.get_y())) {
      leftMostPoint = point;
    }
  });
  return leftMostPoint;
}

function findRightMostPoint(points) {
  let rightMostPoint = points[0];
  points.forEach(point => {
    if (point.get_x() > rightMostPoint.get_x()) {
      rightMostPoint = point;
    } else if ((point.get_x() === rightMostPoint.get_x()) && (point.get_y() > rightMostPoint.get_y())) {
      rightMostPoint = point;
    }
  });
  return rightMostPoint;
}

function distanceToLine(pointToCheck, leftMostPoint, rightMostPoint) {
  return (((pointToCheck.get_y() - leftMostPoint.get_y()) * (rightMostPoint.get_x() - leftMostPoint.get_x())) -
    ((rightMostPoint.get_y() - leftMostPoint.get_y()) * (pointToCheck.get_x() - leftMostPoint.get_x())));
}

function isInSide(pointToCheck, leftMostPoint, rightMostPoint) {
  if (distanceToLine(pointToCheck, leftMostPoint, rightMostPoint) > 0) {
    return 1;
  } else if (distanceToLine(pointToCheck, leftMostPoint, rightMostPoint) < 0) {
    return 2;
  } else {
    return 0;
  }
}

function recursiveFindHull(convexHull, allPoints, points, leftMostPoint, rightMostPoint, CONTEXT, CANVAS) {
  if (points.length === 0) {
    return;
  } else if (points.length === 1) {
    convexHull.splice(convexHull.indexOf(leftMostPoint), 0, points[0]);
    redrawAll(convexHull, allPoints, CONTEXT, CANVAS);
  } else {
    let farthestPoint;
    let farthestPointDistance = 0

    points.forEach(pointToCheck => {
      let thisPointDistance = Math.abs(distanceToLine(pointToCheck, leftMostPoint, rightMostPoint));
      if (thisPointDistance > farthestPointDistance) {
        farthestPoint = pointToCheck;
        farthestPointDistance = thisPointDistance;
      }
    });

    convexHull.splice(convexHull.indexOf(leftMostPoint), 0, farthestPoint);
    redrawAll(convexHull, allPoints, CONTEXT, CANVAS);

    let pointsInSide1 = [];
    let pointsInSide2 = [];

    points.forEach(pointToCheck => {
      if (isInSide(pointToCheck, leftMostPoint, farthestPoint) === 1) {
        pointsInSide1.push(pointToCheck);
      } else if (isInSide(pointToCheck, farthestPoint, rightMostPoint) === 1) {
        pointsInSide2.push(pointToCheck);
      }
    });

    recursiveFindHull(convexHull, allPoints, pointsInSide1, leftMostPoint, farthestPoint, CONTEXT, CANVAS);
    recursiveFindHull(convexHull, allPoints, pointsInSide2, farthestPoint, rightMostPoint, CONTEXT, CANVAS);
  }
}

function recursiveQuickHull(points, CONTEXT, CANVAS) {
  let convexHull = [];

  let leftMostPoint = findLeftMostPoint(points);
  let rightMostPoint = findRightMostPoint(points);

  convexHull.push(leftMostPoint);
  convexHull.push(rightMostPoint);
  redrawAll(convexHull, points, CONTEXT, CANVAS);

  let pointsInSide1 = [];
  let pointsInSide2 = [];

  points.forEach(pointToCheck => {
    if (isInSide(pointToCheck, leftMostPoint, rightMostPoint) === 1) {
      pointsInSide1.push(pointToCheck);
    } else if (isInSide(pointToCheck, leftMostPoint, rightMostPoint) === 2) {
      pointsInSide2.push(pointToCheck);
    }
  });

  recursiveFindHull(convexHull, points, pointsInSide1, leftMostPoint, rightMostPoint, CONTEXT, CANVAS);
  recursiveFindHull(convexHull, points, pointsInSide2, rightMostPoint, leftMostPoint, CONTEXT, CANVAS);
}

function main() {
  const CANVAS = document.getElementById("canvas");
  if (CANVAS.getContext) {
    const CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth - 100;
    CANVAS.height = window.innerHeight - 150;

    let numOfPoints = 0;
    let points = [];

    do {
      numOfPoints = prompt("Enter number of points (needs to be higher than 2):", "0");
    } while (numOfPoints <= 2);

    for (let numOfPointsIterator = 0; numOfPointsIterator < numOfPoints; numOfPointsIterator++) {
      points.push(new Point(random(0, CANVAS.width), random(0, CANVAS.height)));
    }

    debugger;
    drawPoints(points, CONTEXT);
    recursiveQuickHull(points, CONTEXT, CANVAS);
  }
}

main();
