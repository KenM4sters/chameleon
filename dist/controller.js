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
exports.FPSController = exports.TurnTableController = exports.CameraController = void 0;
var glm = __importStar(require("gl-matrix"));
var input_1 = require("./input");
var maths_1 = require("./maths");
var CameraController = /** @class */ (function () {
    function CameraController(camera) {
        this.camera = camera;
        this.input = input_1.Input.GetInstance();
        this.canvas = document.querySelector('#canvas');
    }
    return CameraController;
}());
exports.CameraController = CameraController;
var TurnTableController = /** @class */ (function (_super) {
    __extends(TurnTableController, _super);
    function TurnTableController(camera) {
        var _this = _super.call(this, camera) || this;
        _this.spherical = new maths_1.Spherical();
        _this.isDragging = false;
        _this.previousMousePosition = [0, 0];
        _this.zoomFactor = 46;
        _this.zoomSensitivity = 0.01;
        _this.mouseSensitivity = 0.005;
        _this.cameraStartPosition = [0, 0, 0];
        _this.cameraTargetPosition = [0, 0, 0];
        _this.lerpTime = 0;
        _this.lerpDuration = 1.0;
        _this.input.AddMouseMoveCallback(function (e) { return _this.OnMouseMove(e); });
        _this.input.AddMouseDownCallback(function (e) { return _this.OnMouseDown(e); });
        _this.input.AddMouseUpCallback(function (e) { return _this.OnMouseUp(e); });
        // this.input.AddScrollCallback((e : WheelEvent) => this.OnScroll(e)); 
        _this.camera.position = glm.vec3.fromValues(0, 5, 10);
        _this.spherical.setFromVector3(_this.camera.position);
        var viewMatrix = glm.mat4.lookAt(glm.mat4.create(), _this.camera.position, _this.camera.target, _this.camera.up);
        _this.camera.SetViewMatrix(viewMatrix);
        var projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(_this.camera.fov), _this.canvas.width / _this.canvas.height, 0.1, 100);
        _this.camera.SetProjectionMatrix(projectionMatrix);
        return _this;
    }
    TurnTableController.prototype.Update = function (timeStep) {
        // if(this.lerpTime < this.lerpDuration) 
        // {   
        //     this.lerpTime += timeStep * 0.001;
        //     const t = EaseInOut(this.lerpTime / this.lerpDuration);
        //     glm.vec3.lerp(this.camera.position, this.cameraStartPosition, this.cameraTargetPosition, t);            
        // }
    };
    TurnTableController.prototype.SetCameraPosition = function (newPosition) {
        this.cameraStartPosition = glm.vec3.clone(this.camera.position);
        this.cameraTargetPosition = glm.vec3.clone(newPosition);
        this.lerpTime = 0;
    };
    TurnTableController.prototype.OnMouseMove = function (event) {
        if (this.camera.controllable) {
            if (!this.isDragging) {
                return;
            }
            var deltaMove = {
                x: event.clientX - this.previousMousePosition[0],
                y: event.clientY - this.previousMousePosition[1],
            };
            this.spherical.setFromVector3(this.camera.position);
            this.spherical.theta -= deltaMove.x * this.mouseSensitivity;
            this.spherical.phi = (0, maths_1.Clamp)(this.spherical.phi - deltaMove.y * this.mouseSensitivity, 0.1, Math.PI - 0.1);
            var cartesian = (0, maths_1.SphericalToCartesian)(this.spherical.radius, this.spherical.theta, this.spherical.phi);
            var newPosition = glm.vec3.add(glm.vec3.create(), cartesian, [0, 0, 0]);
            this.camera.position = newPosition;
            var viewMatrix = glm.mat4.lookAt(glm.mat4.create(), this.camera.position, this.camera.target, this.camera.up);
            this.camera.SetViewMatrix(viewMatrix);
            this.previousMousePosition = [event.clientX, event.clientY];
        }
    };
    TurnTableController.prototype.OnMouseDown = function (event) {
        var clickedElement = event.target;
        if (clickedElement.classList.contains("landing")) {
            event.preventDefault();
            this.isDragging = true;
            this.previousMousePosition = [event.clientX, event.clientY];
        }
    };
    TurnTableController.prototype.OnMouseUp = function (event) {
        this.isDragging = false;
    };
    TurnTableController.prototype.UpdateCameraViewMatrix = function () {
        this.spherical.setFromVector3(this.camera.position);
        var viewMatrix = glm.mat4.lookAt(glm.mat4.create(), this.camera.position, this.camera.target, this.camera.up);
        this.camera.SetViewMatrix(viewMatrix);
    };
    TurnTableController.prototype.UpdateCameraProjectionMatrix = function () {
        var projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(this.camera.fov), this.canvas.width / this.canvas.height, 0.1, 100);
        this.camera.SetProjectionMatrix(projectionMatrix);
    };
    TurnTableController.prototype.OnScroll = function (event) {
        event.preventDefault();
        var delta = event.deltaY;
        if (this.camera.fov >= 100) {
            delta = Math.min(delta, 0);
        }
        else if (this.camera.fov <= 5) {
            delta = Math.max(0, delta);
        }
        this.zoomFactor += delta * this.zoomSensitivity;
        this.camera.fov = (0, maths_1.Clamp)(this.zoomFactor, 5, 100);
        console.log(this.zoomFactor, this.camera.fov);
        var projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(this.camera.fov), this.canvas.width / this.canvas.height, 0.1, 100);
        this.camera.SetProjectionMatrix(projectionMatrix);
    };
    return TurnTableController;
}(CameraController));
exports.TurnTableController = TurnTableController;
;
var FPSController = /** @class */ (function (_super) {
    __extends(FPSController, _super);
    function FPSController(camera) {
        var _this = _super.call(this, camera) || this;
        _this.timeStep = 0.016;
        window.addEventListener("keydown", function (e) { return _this.OnKeyDown(e); });
        _this.camera.position = glm.vec3.fromValues(-3, 0, -1);
        _this.camera.front = [1.0, 0.0, 0.0];
        _this.UpdateCameraViewMatrix();
        _this.UpdateCameraProjectionMatrix();
        return _this;
    }
    FPSController.prototype.Update = function (timeStep) {
        this.timeStep = timeStep;
    };
    FPSController.prototype.OnKeyDown = function (event) {
        // if(event.code == "w") 
        // {
        //     glm.vec3.add(this.camera.position, this.camera.position, this.camera.target);
        //     glm.vec3.multiply(this.camera.position, this.camera.position, glm.vec3.fromValues(this.timeStep, this.timeStep, this.timeStep));
        // }
        // if(event.code == "A") 
        // {
        //     glm.vec3.add(this.camera.position, this.camera.position, this.camera.target);
        //     glm.vec3.multiply(this.camera.position, this.camera.position, glm.vec3.fromValues(this.timeStep, this.timeStep, this.timeStep));
        // }
        // if(event.code == "S") 
        // {
        //     glm.vec3.add(this.camera.position, this.camera.position, this.camera.target);
        //     glm.vec3.multiply(this.camera.position, this.camera.position, glm.vec3.fromValues(this.timeStep, this.timeStep, this.timeStep));
        // }
        // if(event.code == "D") 
        // {
        //     glm.vec3.add(this.camera.position, this.camera.position, this.camera.target);
        //     glm.vec3.multiply(this.camera.position, this.camera.position, glm.vec3.fromValues(this.timeStep, this.timeStep, this.timeStep));
        // }
        this.UpdateCameraDirections();
    };
    FPSController.prototype.UpdateCameraDirections = function () {
    };
    FPSController.prototype.UpdateCameraViewMatrix = function () {
        var viewMatrix = glm.mat4.lookAt(glm.mat4.create(), this.camera.position, glm.vec3.add(glm.vec3.create(), this.camera.position, this.camera.front), this.camera.up);
        this.camera.SetViewMatrix(viewMatrix);
    };
    FPSController.prototype.UpdateCameraProjectionMatrix = function () {
        var projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(this.camera.fov), this.canvas.width / this.canvas.height, 0.1, 100.0);
        this.camera.SetProjectionMatrix(projectionMatrix);
    };
    return FPSController;
}(CameraController));
exports.FPSController = FPSController;
;
