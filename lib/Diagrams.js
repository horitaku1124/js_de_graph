"use strict";

class Diagrams {
    constructor(parts) {
        this.parts = parts;
    }
    paint(id) {
        let newParts = [];
        let objects = {};
        for(let part of this.parts) {
            let type = part[0], id = part[1];
            switch (type) {
                case "textbox":
                {
                    let x = part[2], y = part[3], text = part[4];
                    let newPart = [x, y, "textbox", 80, 40, text];
                    newParts.push(newPart);
                    objects[id] = newPart;

                    let linkFromId = part[5];
                    if(linkFromId) {
                        let linkFrom = objects[linkFromId];
                        let linkFrom_X = linkFrom[0], linkFrom_Y = linkFrom[1];
                        let linkFrom_W = linkFrom[3], linkFrom_H = linkFrom[4];
                        let distX = x - linkFrom_X - linkFrom_W;
                        let distY = y - linkFrom_Y - linkFrom_H;

                        newPart = [
                            linkFrom_X + linkFrom_W, linkFrom_Y + linkFrom_H / 2,
                            "arrow", 0, distX];
                        newParts.push(newPart);
                    }
                }
                    break;
                default:
                    break
            }
        }

        let graph = new GraphPaint(newParts);
        graph.paint(id);
    }
}