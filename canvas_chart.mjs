"use strict";

function chooseAxisValues(axis, data, splitNum) {
  let useIndex = typeof axis === 'undefined';
  let axisValues = [];
  axisValues.push(useIndex ? 0 : axis[0]);
  for (let i = 1;i < splitNum;i++) {
    let index = parseInt(i / splitNum * data.length);
    axisValues.push(useIndex ? index : axis[index]);
  }
  axisValues.push(useIndex ? data.length : axis[axis.length - 1]);
  return axisValues;
}

class CanvasChart {
  constructor(elm, config = {}) {
    this.canvas = elm;
    this.offsetX = config["offsetX"] || 30.5;
    this.offsetY = config["offsetY"] || 10.5;
    this.offsetWidth = config["offsetWidth"] || 20;
    this.offsetHeight = config["offsetHeight"] || 120;
    this.axisNum = config["axisNum"] || 10;
  }

  paint(values, axis) {
    let canObj = {
      w: this.canvas.width, h: this.canvas.height
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
    const zeroPointXY = canObj.h  - offsetHeight;
    const axisNum = this.axisNum;
    const axisRotate = 75 / 180 * Math.PI;
    const xAxisGap = graphWidth / axisNum;
    console.log("graphWidth", graphWidth, "graphHeight", graphHeight);
    ctx.strokeRect(offsetX, offsetY, canObj.w - offsetX - offsetWidth, canObj.h - offsetY - offsetHeight);
    ctx.stroke();


    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const axisValues = chooseAxisValues(axis, values, axisNum);
    // console.log(axisValues);
    console.log("min", min, "max", max);

    // Axis line
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#7777777f';
    for (let i = 0;i < axisNum;i++) {
      let x = xAxisGap * i + offsetX;
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x,offsetY + graphHeight);
      ctx.stroke();
    }


    // Paint main chart
    ctx.strokeStyle = 'deeppink';
    ctx.beginPath();

    ctx.translate(offsetX + 1, offsetY + graphHeight);
    ctx.scale(1, -1);
    const ratio = graphHeight / (max - min);
    for (let i = 0;i <= values.length;i++) {
      let val = values[i];
      let x = ((graphWidth) * i / values.length);
      let y = (val - min) * ratio;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Paint Vertical Axis
    ctx.fillStyle = '#000';
    ctx.font = '12px Sans-Serif';

    ctx.scale(1, -1);
    ctx.fillText(max.toString(), -offsetX, offsetY - graphHeight);
    ctx.fillText(min.toString(), -offsetX, offsetY);
    ctx.translate(-offsetX - 1, -offsetY - graphHeight);


    // Paint Horizontal axis
    ctx.fillStyle = '#000';
    ctx.font = '12px Sans-Serif';
    ctx.textBaseline = 'hanging';

    ctx.translate(zeroPointX - 5, zeroPointXY);
    for (let i = 0;i <= axisNum;i++) {
      ctx.rotate(-axisRotate);
      let txt = "" + axisValues[i];
      let txtWidth = ctx.measureText(txt).width;

      ctx.fillText(txt, -txtWidth, 0);
      ctx.rotate(axisRotate);
      ctx.translate(xAxisGap, 0);
    }
  }
}