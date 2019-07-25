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
  constructor(elm) {
    this.canvas = elm;
  }

  paint(values, axis) {
    let canObj = {
      w: this.canvas.width, h: this.canvas.height
    };

    let ctx = this.canvas.getContext('2d');
    ctx.lineWidth = 0.5;
    const offsetX = 30.5;
    const offsetY = 10.5;
    const offsetWidth = 20;
    const offsetHeight = 120;
    const graphWidth = canObj.w - offsetWidth - offsetX;
    const graphHeight = canObj.h - offsetY - offsetHeight;
    const zeroPointX = offsetX + 1;
    const zeroPointXY = canObj.h  - offsetHeight;
    const axisNum = 10;
    const axisRotate = 75 / 180 * Math.PI;
    console.log("graphWidth", graphWidth, "graphHeight", graphHeight);
    ctx.strokeRect(offsetX, offsetY, canObj.w - offsetX - offsetWidth, canObj.h - offsetY - offsetHeight);
    ctx.stroke();


    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const axisValues = chooseAxisValues(axis, values, axisNum);
    // console.log(axisValues);
    console.log("min", min, "max", max);

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

    ctx.fillStyle = '#000';
    ctx.font = '12px Sans-Serif';

    ctx.scale(1, -1);
    ctx.fillText(max.toString(), -20, offsetY - graphHeight);
    ctx.fillText(min.toString(), -20, offsetY);
    ctx.translate(-offsetX - 1, -offsetY - graphHeight);


    ctx.fillStyle = '#000';
    ctx.font = '12px Sans-Serif';
    ctx.textBaseline = 'hanging';


    ctx.translate(zeroPointX - 5, zeroPointXY);
    let txtWidth = 0;
    let diff = graphWidth / axisNum;
    for (let i = 0;i <= axisNum;i++) {
      ctx.rotate(-axisRotate);
      let txt = "" + axisValues[i];
      let txtWidth = ctx.measureText(txt).width;

      ctx.fillText(txt, -txtWidth, 0);
      ctx.rotate(axisRotate);
      ctx.translate(diff, 0);
    }
  }
}