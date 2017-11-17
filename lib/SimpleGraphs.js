"use strict";

const SGTextBox = Symbol('SimpleGraph_TextBox');
class SimpleGraphs {
    constructor(id) {
        this.id = id;
    }
    paint(parts) {
        this.parts = parts;
        let canvas = document.getElementById(this.id);
        console.log(canvas.clientWidth, canvas.clientHeight);
        let newParts = [];
        let partY = 10, stepY = 60;
        for (let part of this.parts) {
            newParts.push([DTextBox, part[1], 10, partY, part[2]]);
            partY += stepY;
        }
        let diagram = new Diagrams(this.id);
        diagram.paint(newParts);
    }
}