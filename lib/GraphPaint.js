"use strict";

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
                case "textbox":
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
                case "circle":
                {
                    let radius = part[3] || 50;
                    context.beginPath();
                    context.arc(x, y, radius, 0, ARC_FULL, false);
                    context.stroke();
                }
                    break;
                case "arrow":
                {
                    let angle = -Math.PI * (part[3] || 0 ) / 180;
                    let radius = part[4] || 50;
                    let stopX = x + radius * Math.cos(angle);
                    let stopY = y + radius * Math.sin(angle);
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(stopX, stopY);
                    context.closePath();
                    context.stroke();

                    let leaf = radius / 10;
                    let lStopX = stopX - leaf * Math.cos(angle + Math.PI / 4);
                    let lStopY = stopY - leaf * Math.sin(angle + Math.PI / 4);

                    context.beginPath();
                    context.moveTo(lStopX, lStopY);
                    context.lineTo(stopX, stopY);
                    context.closePath();
                    context.stroke();

                    lStopX = stopX - leaf * Math.cos(angle - Math.PI / 4);
                    lStopY = stopY - leaf * Math.sin(angle - Math.PI / 4);
                    context.lineTo(lStopX, stopY);

                    context.beginPath();
                    context.moveTo(lStopX, lStopY);
                    context.lineTo(stopX, stopY);
                    context.closePath();
                    context.stroke();
                }
                    break;
                default:
                    break
            }
        }
    }
}