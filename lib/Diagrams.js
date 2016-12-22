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
                        let distX = x - linkFrom[0] - linkFrom[3];
                        let distY = y - linkFrom[1] - linkFrom[4];

                        newPart = [
                            linkFrom[0] + linkFrom[3], linkFrom[1] + linkFrom[4],
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