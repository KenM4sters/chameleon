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
exports.Preloader = void 0;
var glm = __importStar(require("gl-matrix"));
var export_1 = require("./export");
var webgl_1 = require("./webgl");
var Preloader = /** @class */ (function () {
    function Preloader() {
        this.isDestroyed = false;
        var mat = new export_1.NormalMaterial();
        var geo = new export_1.BoxGeometry();
        this.cube = new export_1.Mesh(geo, mat);
        this.cube.scale = [1.0, 1.0, 1.0];
        this.gl = webgl_1.WebGL.GetInstance().gl;
        var canvas = webgl_1.WebGL.GetInstance().canvas;
        var app = document.querySelector('#app');
        this.loadingDiv = document.createElement('div');
        this.loadingDiv.innerHTML =
            "\n            <div class=\"preloader-header\"> loading... </div>\n        ";
        app.appendChild(this.loadingDiv);
        this.projectionMatrix = glm.mat4.perspective(glm.mat4.create(), 45, canvas.width / canvas.height, 0.1, 100);
        this.viewMatrix = glm.mat4.lookAt(glm.mat4.create(), [0, 0, 10], [0, 0, 0], [0, 1, 0]);
        this.gl.viewport(0, 0, canvas.width, canvas.height);
    }
    Preloader.prototype.Rotate = function (elapsedTime, timeStep) {
        var axis = glm.vec3.fromValues(1, -1, 0);
        var angle = elapsedTime * 45 * 0.0005;
        var quat = glm.quat.setAxisAngle(this.cube.rotation, axis, glm.glMatrix.toRadian(angle));
        this.cube.rotation = glm.quat.normalize(quat, quat);
    };
    Preloader.prototype.Resize = function (width, height) {
        this.projectionMatrix = glm.mat4.perspective(glm.mat4.create(), 45, width / height, 0.1, 100);
    };
    Preloader.prototype.Update = function (elapsedTime, timeStep) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0.9, 0.9, 0.9, 0.9);
        this.Rotate(elapsedTime, timeStep);
        if (this.cube.material instanceof export_1.NormalMaterial && this.cube.geometry instanceof export_1.BoxGeometry) {
            var shader = this.cube.material.GetShader().GetId().val;
            var vao = this.cube.geometry.GetVertexArray().GetId().val;
            var modelMatrix = glm.mat4.create();
            modelMatrix = glm.mat4.fromQuat(modelMatrix, this.cube.rotation);
            modelMatrix = glm.mat4.scale(glm.mat4.create(), modelMatrix, this.cube.scale);
            modelMatrix = glm.mat4.translate(glm.mat4.create(), modelMatrix, this.cube.position);
            this.gl.useProgram(shader);
            this.gl.bindVertexArray(vao);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(shader, "projection"), false, this.projectionMatrix);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(shader, "view"), false, this.viewMatrix);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(shader, "model"), false, modelMatrix);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 36);
        }
    };
    Preloader.prototype.Destroy = function () {
        this.isDestroyed = true;
        this.loadingDiv.remove();
        this.gl.bindVertexArray(null);
        this.gl.useProgram(null);
        // TODO:
    };
    return Preloader;
}());
exports.Preloader = Preloader;
