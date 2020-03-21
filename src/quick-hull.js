/**
 * @file country-abbreviation.js
 * @author Sergio Tabares Hernández <alu0101124896@ull.edu.es>
 * @since Spring 2020
 * @summary University of La Laguna
 * @summary Computer Science - Interactive Aplication Programing
 * @description This program implements the Quick Hull Algorithm. More info about it here: https://en.wikipedia.org/wiki/Quickhull
 */

"use strict"

/**
 * @description Function that generates random numbers between the given values
 *
 * @param {number} min_val - Minimum random value
 * @param {number} max_val - Maximum random value
 * @returns {number} Returns the random number generated
 */
function random(min_val, max_val) {
  return (Math.floor(Math.random() * (max_val - min_val)) + min_val);
}

/**
 * @description Class representing a point
 *
 * @class Point
 */
class Point {

  /**
   * @description Constructor that creates an instance of Point and gives it a random color.
   * 
   * @param {number} [x=0] - X coordinate
   * @param {number} [y=0] - Y coordinate
   * @memberof Point
   */
  constructor(x = 0, y = 0) {
    this.x = Number(x);
    this.y = Number(y);
    this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'
  }

  /**
   * @description Getter function of attribute x
   *
   * @returns {number} Returns the X coordinate of the point
   * @memberof Point
   */
  get_x() { return this.x; }

  /**
   * @description Getter function of attribute y
   *
   * @returns {number} Returns the Y coordinate of the point
   * @memberof Point
   */
  get_y() { return this.y; }

  /**
   * @description Function that draws this point in canvas
   *
   * @param {*} CONTEXT - Canvas context
   * @memberof Point
   */
  draw(CONTEXT) {
    CONTEXT.fillStyle = this.color;
    CONTEXT.beginPath();
    CONTEXT.ellipse(this.x, this.y, 5, 5, 0, 0, 2 * Math.PI);
    CONTEXT.fill();
  }
}

/**
 * @description Function that calls draw function for each point at given array
 *
 * @param {array} points - Array of points
 * @param {*} CONTEXT - Canvas context
 */
function drawPoints(points, CONTEXT) {
  points.forEach(point => { point.draw(CONTEXT); });
}

/**
 * @description Function that draws a line between the two given points
 *
 * @param {Point} lineStartingPoint - Line starting point
 * @param {Point} lineEndingPoint - Line ending point
 * @param {*} CONTEXT - Canvas context
 */
function drawLine(lineStartingPoint, lineEndingPoint, CONTEXT) {
  CONTEXT.beginPath();
  CONTEXT.moveTo(lineStartingPoint.get_x(), lineStartingPoint.get_y());
  CONTEXT.lineTo(lineEndingPoint.get_x(), lineEndingPoint.get_y());
  CONTEXT.lineWidth = 3;
  CONTEXT.strokeStyle = 'red';
  CONTEXT.stroke();
}

/**
 * @description Function that draws all points and the current state of the convex hull
 *
 * @param {array} convexHull - Array of points that forms the convex hull
 * @param {array} points - Array of points
 * @param {*} CONTEXT - Canvas context
 * @param {*} CANVAS - Canvas
 */
function redrawAll(convexHull, points, CONTEXT, CANVAS) {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  drawPoints(points, CONTEXT);
  for (let convexHullIterator = 1; convexHullIterator < convexHull.length; convexHullIterator++) {
    drawLine(convexHull[convexHullIterator - 1], convexHull[convexHullIterator], CONTEXT);
  }
  drawLine(convexHull[convexHull.length - 1], convexHull[0], CONTEXT);
}

/**
 * @description Function that finds the left most point
 *
 * @param {array} points - Array of points
 * @returns {Point} Returns the left most point
 */
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

/**
 * @description Function that finds the right most point
 *
 * @param {array} points - Array of points
 * @returns {Point} Returns the right most point
 */
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

/**
 * @description Function that calculates the distance between a given point and the line between the other two givens
 *
 * @param {Point} pointToCheck - Point to calculate the distance to the line
 * @param {Point} lineStartingPoint - Line starting point
 * @param {Point} lineEndingPoint - Line ending point
 * @returns {number} Returns the distance calculated
 */
function distanceToLine(pointToCheck, lineStartingPoint, lineEndingPoint) {
  return (((pointToCheck.get_y() - lineStartingPoint.get_y()) * (lineEndingPoint.get_x() - lineStartingPoint.get_x())) -
    ((lineEndingPoint.get_y() - lineStartingPoint.get_y()) * (pointToCheck.get_x() - lineStartingPoint.get_x())));
}

/**
 * @description Function that checks if a given point is on one side of the line or the other
 *
 * @param {Point} pointToCheck - Point to check the side
 * @param {Point} lineStartingPoint - Line starting point
 * @param {Point} lineEndingPoint - Line ending point
 * @returns {number} Retuns a number depending of the side in which the point is
 */
function isInSide(pointToCheck, lineStartingPoint, lineEndingPoint) {
  if (distanceToLine(pointToCheck, lineStartingPoint, lineEndingPoint) > 0) {
    return 1;
  } else if (distanceToLine(pointToCheck, lineStartingPoint, lineEndingPoint) < 0) {
    return 2;
  } else {
    return 0;
  }
}

/**
 * @description Function that searchs for points outside of the current convex hull
 * 
 * @param {array} convexHull - Array of points that forms the convex hull
 * @param {array} allCanvasPoints - Array of all canvas points
 * @param {array} points - Array of points
 * @param {Point} leftMostPoint - Left most point of the current section of the convex hull
 * @param {Point} rightMostPoint - Right most point of the current section of the convex hull
 * @param {*} CONTEXT - Canvas context
 * @param {*} CANVAS - Canvas
 * @returns
 */
function recursiveFindHull(convexHull, allCanvasPoints, points, leftMostPoint, rightMostPoint, CONTEXT, CANVAS) {
  if (points.length === 0) {
    return;
  } else if (points.length === 1) {
    convexHull.splice(convexHull.indexOf(leftMostPoint), 0, points[0]);
    redrawAll(convexHull, allCanvasPoints, CONTEXT, CANVAS);
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
    redrawAll(convexHull, allCanvasPoints, CONTEXT, CANVAS);

    let pointsInSide1 = [];
    let pointsInSide2 = [];

    points.forEach(pointToCheck => {
      if (isInSide(pointToCheck, leftMostPoint, farthestPoint) === 1) {
        pointsInSide1.push(pointToCheck);
      } else if (isInSide(pointToCheck, farthestPoint, rightMostPoint) === 1) {
        pointsInSide2.push(pointToCheck);
      }
    });

    recursiveFindHull(convexHull, allCanvasPoints, pointsInSide1, leftMostPoint, farthestPoint, CONTEXT, CANVAS);
    recursiveFindHull(convexHull, allCanvasPoints, pointsInSide2, farthestPoint, rightMostPoint, CONTEXT, CANVAS);
  }
}

/**
 * @description Function that starts to search the convex hull of the given array of points
 * 
 * @param {array} allCanvasPoints - Array of all canvas points
 * @param {*} CONTEXT - Canvas context
 * @param {*} CANVAS - Canvas
 */
function recursiveQuickHull(allCanvasPoints, CONTEXT, CANVAS) {
  let convexHull = [];

  let leftMostPoint = findLeftMostPoint(allCanvasPoints);
  let rightMostPoint = findRightMostPoint(allCanvasPoints);

  convexHull.push(leftMostPoint);
  convexHull.push(rightMostPoint);
  redrawAll(convexHull, allCanvasPoints, CONTEXT, CANVAS);

  let pointsInSide1 = [];
  let pointsInSide2 = [];

  allCanvasPoints.forEach(pointToCheck => {
    if (isInSide(pointToCheck, leftMostPoint, rightMostPoint) === 1) {
      pointsInSide1.push(pointToCheck);
    } else if (isInSide(pointToCheck, leftMostPoint, rightMostPoint) === 2) {
      pointsInSide2.push(pointToCheck);
    }
  });

  recursiveFindHull(convexHull, allCanvasPoints, pointsInSide1, leftMostPoint, rightMostPoint, CONTEXT, CANVAS);
  recursiveFindHull(convexHull, allCanvasPoints, pointsInSide2, rightMostPoint, leftMostPoint, CONTEXT, CANVAS);
}

/**
 * @description Function that starts the execution of the progran
 */
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
