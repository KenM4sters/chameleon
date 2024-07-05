"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointLight = exports.Light = void 0;
var Light = /** @class */ (function () {
    function Light() {
    }
    return Light;
}());
exports.Light = Light;
/**
 * @brief Holds information about a light sources that radiates equally from a point in space.
 * A Light instance isn't rendered, but used by mesh shaders for accurate shading.
 */
var PointLight = /** @class */ (function (_super) {
    __extends(PointLight, _super);
    function PointLight(position, color, intensity) {
        var _this = _super.call(this) || this;
        _this.position = position;
        _this.color = color;
        _this.intensity = intensity;
        return _this;
    }
    return PointLight;
}(Light));
exports.PointLight = PointLight;
