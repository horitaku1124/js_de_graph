"use strict";

function chooseAxisLabels(labels, data, splitNum) {
  let useIndex = typeof labels === 'undefined';
  let axisValues = [];
  for (let i = 0; i < splitNum - 1; i++) {
    let index = parseInt(i / splitNum * data.length);
    axisValues.push(useIndex ? index + 1 : labels[index]);
  }
  axisValues.push(useIndex ? data.length : labels[labels.length - 1]);
  return axisValues;
}

const tei = 10;

function findMinBorder(values, ratio) {
  let min = Math.min.apply(null, values);
  console.log("min", min);
  const isNegative = min < 0;
  min = isNegative ? -min * ratio : min / ratio;
  let a = Math.floor(Math.log(min) / Math.log(tei));
  console.log("a", a);
  console.log("min / Math.pow(tei,  a)", min / Math.pow(tei,  a));
  console.log("parseInt(min / Math.pow(tei,  a))", parseInt(min / Math.pow(tei,  a)) );
  let smallerMin = parseInt(min / Math.pow(tei,  a)) * Math.pow(tei,  a);
  return isNegative ? -smallerMin : smallerMin;
}

function findMaxBorder(values, ratio) {
  let max = Math.max.apply(null, values);
  const isNegative = max < 0;
  max = isNegative ? -max / ratio : max * ratio;
  let a = Math.floor(Math.log(max) / Math.log(tei));
  let smallerMax = Math.ceil(max / Math.pow(tei,  a)) * Math.pow(tei,  a);
  return isNegative ? -smallerMax : smallerMax;
}

class CanvasChart {
  constructor(elm, config = {}) {
    this.canvas = elm;
    this.offsetX = config["offsetX"] || 40.5;
    this.offsetY = config["offsetY"] || 10.5;
    this.offsetWidth = config["offsetWidth"] || 20;
    this.offsetHeight = config["offsetHeight"] || 70;
    this.axisNum = config["axisNum"] || 10;
  }

  paint(values, labels) {

    let canObj = {
      w: this.canvas.clientWidth, h: this.canvas.clientHeight
    };

    const ctx = this.canvas.getContext('2d');
    ctx.lineWidth = 0.5;
    const offsetX = this.offsetX;
    const offsetY = this.offsetY;
    const offsetWidth = this.offsetWidth;
    const offsetHeight = this.offsetHeight;
    const graphWidth = canObj.w - offsetWidth - offsetX;
    const graphHeight = canObj.h - offsetY - offsetHeight;
    const zeroPointX = offsetX + 1;
    const zeroPointXY = canObj.h - offsetHeight;
    const axisNum = this.axisNum;
    const axisRotate = 75 / 180 * Math.PI;
    const xAxisGap = graphWidth / (axisNum - 1);
    const xGraphGap = graphWidth / (values.length - 1);
    console.log("graphWidth", graphWidth, "graphHeight", graphHeight, "axisNum", axisNum);
    ctx.strokeRect(offsetX, offsetY, canObj.w - offsetX - offsetWidth, canObj.h - offsetY - offsetHeight);
    ctx.stroke();

    const min = findMinBorder(values, 1.1);
    const max = findMaxBorder(values, 1.1);
    const axisValues = chooseAxisLabels(labels, values, axisNum);

    console.log("min", min, "max", max);
    const yAxisFormatRule = (val) => {
      if (min > 1 && max > 1) {
        return val.toFixed(0);
      } else if (min > 0.1) {
        return val.toFixed(3);
      } else {
        return val.toFixed(4);
      }
    }

    // Axis line
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#7777777f';
    // vertical
    for (let i = 0; i < axisNum; i++) {
      let x = xAxisGap * i + offsetX;
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + graphHeight);
      ctx.stroke();
    }
    // horizon
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + graphHeight / 2);
    ctx.lineTo(offsetX + graphWidth, offsetY + graphHeight / 2);
    ctx.stroke();


    // Paint main chart
    ctx.strokeStyle = 'deeppink';
    ctx.beginPath();

    ctx.translate(offsetX + 1, offsetY + graphHeight);
    ctx.scale(1, -1);
    const ratio = graphHeight / (max - min);
    for (let i = 0; i < values.length; i++) {
      let val = values[i];
      let x = xGraphGap * i;
      let y = (val - min) * ratio;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Paint Vertical Axis
    ctx.fillStyle = '#000';
    ctx.font = '12px Sans-Serif';

    ctx.scale(1, -1);
    ctx.fillText(yAxisFormatRule(max), -offsetX, offsetY - graphHeight);
    let center = max - (max - min) / 2;
    ctx.fillText(yAxisFormatRule(center), -offsetX, offsetY - graphHeight / 2);
    ctx.fillText(yAxisFormatRule(min), -offsetX, offsetY);
    ctx.translate(-offsetX - 1, -offsetY - graphHeight);


    // Paint Horizontal axis
    ctx.fillStyle = '#000';
    ctx.font = '12px Sans-Serif';
    ctx.textBaseline = 'hanging';

    ctx.translate(zeroPointX - 5, zeroPointXY);
    for (let i = 0; i < axisNum; i++) {
      ctx.rotate(-axisRotate);
      let txt = "" + axisValues[i];
      let txtWidth = ctx.measureText(txt).width;

      ctx.fillText(txt, -txtWidth, 0);
      ctx.rotate(axisRotate);
      ctx.translate(xAxisGap, 0);
    }
  }
}