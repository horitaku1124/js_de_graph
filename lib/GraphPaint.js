"use strict";

const GTextBox = Symbol('GraphPaint_TextBox'),
      GCircle = Symbol('GraphPaint_Circle'),
      GArrow = Symbol('GraphPaint_Arrow'),
      GPageBreak = Symbol('GraphPaint_PageBreak'),
      GCurvedArrow = Symbol('GraphPaint_CurveArrow'),
      GDoubleCurvedArrow = Symbol('GraphPaint_DoubleCurveArrow')


class GraphPaint {
    constructor(parts) {
        this.parts = parts;
    }
    paint(id) {
        const ARC_FULL = Math.PI * 2;
        let context = document.getElementById(id).getContext('2d');
        context.font = "10px sans-serif";
        for(let part of this.parts) {
            let x = part[0], y = part[1], type = part[2];
            switch (type) {
                case GTextBox:
                {
                    let width = part[3] || 50,  height = part[4] || 50;
                    let text = part[5];
                    context.strokeRect(x, y, width, height);
                    if(text) {
                        let metrics = context.measureText(text);
                        let offsetX = (width - metrics.width) / 2;
                        let offsetY = (height - 10) / 2;
                        context.strokeText(text, x + offsetX, y + offsetY + 10);
                    }
                }
                    break;
                case GCircle:
                {
                    let radius = part[3] || 50;
                    context.beginPath();
                    context.arc(x, y, radius, 0, ARC_FULL, false);
                    context.stroke();
                }
                    break;
                case GArrow:
                {
                    let angle = -Math.PI * (part[3] || 0 ) / 180;
                    let radius = part[4] || 50;
                    let stopX = x + radius * Math.cos(angle);
                    let stopY = y + radius * Math.sin(angle);
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(stopX, stopY);
                    context.stroke();

                    let leaf = radius / 10;
                    let lStopX = stopX - leaf * Math.cos(angle + Math.PI / 4);
                    let lStopY = stopY - leaf * Math.sin(angle + Math.PI / 4);

                    context.beginPath();
                    context.moveTo(lStopX, lStopY);
                    context.lineTo(stopX, stopY);
                    context.stroke();

                    lStopX = stopX - leaf * Math.cos(angle - Math.PI / 4);
                    lStopY = stopY - leaf * Math.sin(angle - Math.PI / 4);
                    context.lineTo(lStopX, stopY);

                    context.beginPath();
                    context.moveTo(lStopX, lStopY);
                    context.lineTo(stopX, stopY);
                    context.stroke();
                }
                    break;
                case GPageBreak:
                {
                    let patternCanvas = document.createElement("canvas");
                    patternCanvas.width = 8;
                    patternCanvas.height = 8;
                    let patternContext = patternCanvas.getContext("2d");
                    patternContext.fillStyle = '#666';
                    patternContext.fillRect(0, 0, 5, 5);

                    let pattern = context.createPattern(patternCanvas, 'repeat');

                    let width = (part[3] || 50), height = 10;
                    let text = part[4];

                    let metrics = context.measureText(text);
                    let offsetX = (width - metrics.width) / 2;
                    let offsetY = (height - 10) / 2;
                    context.strokeText(text, x + offsetX, y + offsetY + 5);

                    context.fillStyle = pattern;
                    context.fillRect(x, y, offsetX - 5, 2);
                    context.fillRect(x + offsetX + metrics.width, y, offsetX - 5, 2);

                    context.strokeStyle = 'rgba(0, 0, 0, 255)';
                }
                    break;
                case GCurvedArrow:
                {
                    let stopX = part[3];
                    let stopY = part[4];
                    let vertical = part[5] || 0;
                    context.beginPath();
                    context.moveTo(x, y);
                    let angle = 0.75;
                    if (stopX == x || stopY == y) {
                        context.lineTo(stopX, stopY);
                    } else {
                        if(vertical) {
                            context.lineTo(stopX, y);
                            context.lineTo(stopX, stopY);
                        } else {
                            context.lineTo(x, stopY);
                            context.lineTo(stopX, stopY);
                        }
                    }
                    if (vertical) {
                        angle = stopY - y > 0 ? 1.25 : 0.25;
                    } else {
                        angle = stopX - x > 0 ? 0.75 : -0.25;
                    }
                    // console.log("angle", angle);
                    context.stroke();
                    let radius = 50;
                    
                    let leaf = 10;
                    angle = angle * Math.PI;
                    let lStopX = stopX + leaf * Math.cos(angle);
                    let lStopY = stopY + leaf * Math.sin(angle);

                    context.beginPath();
                    context.moveTo(lStopX, lStopY);
                    context.lineTo(stopX, stopY);
                    context.stroke();

                    lStopX = stopX - leaf * Math.cos(angle - Math.PI / 2);
                    lStopY = stopY - leaf * Math.sin(angle - Math.PI / 2);
                    context.lineTo(lStopX, stopY);

                    context.beginPath();
                    context.moveTo(lStopX, lStopY);
                    context.lineTo(stopX, stopY);
                    context.closePath();
                    context.stroke();
                }
                    break;
                case GDoubleCurvedArrow:
                    {
                        let stopX = part[3];
                        let stopY = part[4];
                        let vertical = part[5] || 0;
                        context.beginPath();
                        context.moveTo(x, y);
                        let angle = 0.75;

                        let centerX = x + (stopX - x) / 2;
                        let centerY = y + (stopY - y) / 2;

                        // First Line
                        if(vertical) {
                            context.lineTo(x, centerY);
                        } else {
                            context.lineTo(centerX, y);
                        }

                        // Second Line
                        if(vertical) {
                            context.lineTo(stopX, centerY);
                        } else {
                            context.lineTo(centerX, stopY);
                        }

                        // Third Line
                        context.lineTo(stopX, stopY);

                        context.stroke();

                        if (vertical) {
                            angle = stopY - y > 0 ? 1.25 : 0.25;
                        } else {
                            angle = stopX - x > 0 ? 0.75 : -0.25;
                        }
                        
                        let leaf = 10;
                        angle = angle * Math.PI;
                        let lStopX = stopX + leaf * Math.cos(angle);
                        let lStopY = stopY + leaf * Math.sin(angle);
    
                        context.beginPath();
                        context.moveTo(lStopX, lStopY);
                        context.lineTo(stopX, stopY);
                        context.stroke();
    
                        lStopX = stopX - leaf * Math.cos(angle - Math.PI / 2);
                        lStopY = stopY - leaf * Math.sin(angle - Math.PI / 2);
                        context.lineTo(lStopX, stopY);
    
                        context.beginPath();
                        context.moveTo(lStopX, lStopY);
                        context.lineTo(stopX, stopY);
                        context.stroke();
                    }
                        break;
                default:
                    break
            }
        }
    }
}