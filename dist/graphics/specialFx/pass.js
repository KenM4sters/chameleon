"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialFXPass = exports.SpecialFXPassTypes = void 0;
var webgl_1 = require("../../webgl");
var SpecialFXPassTypes;
(function (SpecialFXPassTypes) {
    SpecialFXPassTypes[SpecialFXPassTypes["Undefined"] = 0] = "Undefined";
    SpecialFXPassTypes[SpecialFXPassTypes["BloomBlur"] = 1] = "BloomBlur";
    SpecialFXPassTypes[SpecialFXPassTypes["BloomCombine"] = 2] = "BloomCombine";
    SpecialFXPassTypes[SpecialFXPassTypes["ToneMapping"] = 3] = "ToneMapping";
    SpecialFXPassTypes[SpecialFXPassTypes["ColorCorrection"] = 4] = "ColorCorrection";
})(SpecialFXPassTypes || (exports.SpecialFXPassTypes = SpecialFXPassTypes = {}));
;
var SpecialFXPass = /** @class */ (function () {
    function SpecialFXPass(renderer, type, dependancies) {
        this.renderer = renderer;
        this.gl = webgl_1.WebGL.GetInstance().gl;
        this.type = type;
        this.dependencies = dependancies;
    }
    SpecialFXPass.prototype.GetType = function () { return this.type; };
    return SpecialFXPass;
}());
exports.SpecialFXPass = SpecialFXPass;
