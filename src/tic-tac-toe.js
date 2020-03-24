/**
 * @file tic-tac-toe.js
 * @author Sergio Tabares Hernández <alu0101124896@ull.edu.es>
 * @since Spring 2020
 * @summary University of La Laguna
 * @summary Computer Science - Interactive Aplication Programing
 * @description This program prints a tic tac toe board in screen
 */

"use strict"

/**
 * @description Function that draws the lines that divides the board
 *
 * @param {number} thirdOfCanvas - Size of the canvas divided by three
 * @param {*} CONTEXT - Canvas context
 * @param {*} CANVAS - Canvas
 */
function drawLines(thirdOfCanvas, CANVAS, CONTEXT) {
  CONTEXT.beginPath();
  CONTEXT.moveTo(thirdOfCanvas, 0);
  CONTEXT.lineTo(thirdOfCanvas, CANVAS.height);
  CONTEXT.lineWidth = 5;
  CONTEXT.strokeStyle = 'black';
  CONTEXT.stroke();

  CONTEXT.beginPath();
  CONTEXT.moveTo(thirdOfCanvas * 2, 0);
  CONTEXT.lineTo(thirdOfCanvas * 2, CANVAS.height);
  CONTEXT.lineWidth = 5;
  CONTEXT.strokeStyle = 'black';
  CONTEXT.stroke();

  CONTEXT.beginPath();
  CONTEXT.moveTo(0, thirdOfCanvas);
  CONTEXT.lineTo(CANVAS.width, thirdOfCanvas);
  CONTEXT.lineWidth = 5;
  CONTEXT.strokeStyle = 'black';
  CONTEXT.stroke();

  CONTEXT.beginPath();
  CONTEXT.moveTo(0, thirdOfCanvas * 2);
  CONTEXT.lineTo(CANVAS.width, thirdOfCanvas * 2);
  CONTEXT.lineWidth = 5;
  CONTEXT.strokeStyle = 'black';
  CONTEXT.stroke();
}

/**
 * @description Function that draws one X on given coordinates
 *
 * @param {number} xCoordinate - X coordinate of the X
 * @param {number} yCoordinate - Y coordinate of the X
 * @param {number} thirdOfCanvas - Size of the canvas divided by three
 * @param {*} CONTEXT - Canvas context
 */
function drawX(xCoordinate, yCoordinate, thirdOfCanvas, CONTEXT) {
  CONTEXT.beginPath();
  CONTEXT.moveTo(xCoordinate + 10, yCoordinate + 10);
  CONTEXT.lineTo(xCoordinate + thirdOfCanvas - 10, yCoordinate + thirdOfCanvas - 10);
  CONTEXT.lineWidth = 5;
  CONTEXT.strokeStyle = 'black';
  CONTEXT.stroke();

  CONTEXT.beginPath();
  CONTEXT.moveTo(xCoordinate + 10, yCoordinate + thirdOfCanvas - 10);
  CONTEXT.lineTo(xCoordinate + thirdOfCanvas - 10, yCoordinate + 10);
  CONTEXT.lineWidth = 5;
  CONTEXT.strokeStyle = 'black';
  CONTEXT.stroke();
}

/**
 * @description Function that draws one O on given coordinates
 *
 * @param {number} xCoordinate - X coordinate of the O
 * @param {number} yCoordinate - Y coordinate of the O
 * @param {number} thirdOfCanvas - Size of the canvas divided by three
 * @param {*} CONTEXT - Canvas context
 */
function drawO(xCoordinate, yCoordinate, thirdOfCanvas, CONTEXT) {
  CONTEXT.beginPath();
  // CONTEXT.moveTo(xCoordinate + (thirdOfCanvas / 2), yCoordinate + (thirdOfCanvas / 2));
  CONTEXT.arc(xCoordinate + (thirdOfCanvas / 2), yCoordinate + (thirdOfCanvas / 2),  + (thirdOfCanvas / 2) * 0.9, 0, 2 * Math.PI);
  CONTEXT.stroke();
}

/**
 * @description Function that draws a tic tac toe
 *
 * @param {*} CONTEXT - Canvas context
 * @param {*} CANVAS - Canvas
 */
function drawTicTacToe(CANVAS, CONTEXT) {
  let thirdOfCanvas = CANVAS.height / 3;

  drawLines(thirdOfCanvas, CANVAS, CONTEXT);

  drawX(0, thirdOfCanvas, thirdOfCanvas, CONTEXT);
  drawX(thirdOfCanvas * 2, thirdOfCanvas * 2, thirdOfCanvas, CONTEXT);

  drawO(0, thirdOfCanvas * 2, thirdOfCanvas, CONTEXT);
  drawO(thirdOfCanvas, thirdOfCanvas, thirdOfCanvas, CONTEXT);
  drawO(thirdOfCanvas * 2, 0, thirdOfCanvas, CONTEXT);
}

/**
 * @description Function that starts the execution of the progran
 */
function main() {
  const CANVAS = document.getElementById("canvas");
  if (CANVAS.getContext) {
    const CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerHeight - 150;
    CANVAS.height = window.innerHeight - 150;

    drawTicTacToe(CANVAS, CONTEXT);
  }
}

main();
