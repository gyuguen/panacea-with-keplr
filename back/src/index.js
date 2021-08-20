"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeplrUtils_1 = require("./classes/KeplrUtils");
window.onload = function () {
    var keplr = new KeplrUtils_1.KeplrUtils("gyuguen-1", "gyuguen", "http://localhost:26657", "http://localhost:9090");
};
