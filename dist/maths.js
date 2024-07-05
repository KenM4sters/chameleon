"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EaseInOut = exports.Lerp = exports.SphericalToCartesian = exports.Clamp = exports.Spherical = void 0;
var glm = __importStar(require("gl-matrix"));
var Spherical = /** @class */ (function () {
    function Spherical(radius, theta, phi) {
        if (radius === void 0) { radius = 1; }
        if (theta === void 0) { theta = 0; }
        if (phi === void 0) { phi = 0; }
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;
    }
    Spherical.prototype.setFromVector3 = function (vec) {
        this.radius = glm.vec3.length(vec);
        this.theta = Math.atan2(vec[0], vec[2]);
        this.phi = Math.acos(vec[1] / this.radius);
    };
    Spherical.prototype.setFromSpherical = function (spherical) {
        this.radius = spherical.radius;
        this.theta = spherical.theta;
        this.phi = spherical.phi;
    };
    return Spherical;
}());
exports.Spherical = Spherical;
// Utility function to clamp values
function Clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
exports.Clamp = Clamp;
function SphericalToCartesian(radius, theta, phi) {
    return glm.vec3.fromValues(radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta));
}
exports.SphericalToCartesian = SphericalToCartesian;
function Lerp(start, end, t) {
    return start + (end - start) * t;
}
exports.Lerp = Lerp;
function EaseInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
exports.EaseInOut = EaseInOut;
