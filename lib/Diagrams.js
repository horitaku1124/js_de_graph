"use strict";

const DTextBox = Symbol('Diagrams_TextBox');

class Diagrams {
    constructor(id) {
        this.id = id;
    }
    paint(parts) {
        this.parts = parts;
        let newParts = [];
        let objects = {};
        let linkArrows = [];
        for(let part of this.parts) {
            let type = part[0], id = part[1];
            switch (type) {
                case DTextBox:
                {
                    let x = part[2], y = part[3], text = part[4];
                    let newPart = [x, y, GTextBox, 80, 40, text];
                    newParts.push(newPart);
                    objects[id] = newPart;

                    let linkToIds = part[5];
                    // console.log("linkToIds", linkToIds);
                    if (linkToIds) {
                        for (let arrowTo of linkToIds) {
                            linkArrows.push([id, arrowTo]);
                        }
                    }
                }
                    break;
                default:
                    break
            }
        }
        for (let [fromId, toId] of linkArrows) {
            let [toX, toY, , toW, toH] = objects[toId];
            let [fromX, fromY, , fromW, fromH] = objects[fromId];

            let startX = fromX + fromW;
            let startY = fromY + fromH / 2;
            let newPart;
            if (toY === fromY) {
                let distX = toX - fromX - fromW;
                newPart = [startX, startY, GArrow, 0, distX];
            } else {
                // console.log("startY", startY, "distY", distY, "toY", toY, "fromY", fromY);
                let stopY = toY + toH / 2;
                newPart = [startX, startY, GDoubleCurvedArrow, toX, stopY];
            }
            
            newParts.push(newPart);
        }

        let graph = new GraphPaint(this.id);
        graph.paint(newParts);
    }
}