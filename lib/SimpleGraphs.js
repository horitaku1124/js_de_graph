"use strict";

const SGTextBox = Symbol('SimpleGraph_TextBox');
class SimpleGraphs {
    constructor(parts) {
        this.parts = parts;
    }
    paint(id) {
        let canvas = document.getElementById(id);
        console.log(canvas.clientWidth, canvas.clientHeight);
        let newParts = [];
        for (let part of this.parts) {
            newParts.push([DTextBox, part[1], 10, 10, part[2]]);
        }
        let diagram = new Diagrams(newParts);
        diagram.paint(id);
    }
}