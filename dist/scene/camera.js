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
exports.PerspectiveCamera = exports.CameraControllerTypes = void 0;
var glm = __importStar(require("gl-matrix"));
var controller_1 = require("../controller");
var CameraControllerTypes;
(function (CameraControllerTypes) {
    CameraControllerTypes[CameraControllerTypes["TurnTable"] = 0] = "TurnTable";
    CameraControllerTypes[CameraControllerTypes["FPS"] = 1] = "FPS";
})(CameraControllerTypes || (exports.CameraControllerTypes = CameraControllerTypes = {}));
;
/**
 * @brief Holds and updates the View and Projection matrices used to transform each
 * object in the Scene instance relative to this camera object.
 */
var PerspectiveCamera = /** @class */ (function () {
    function PerspectiveCamera(pos) {
        this.target = [0.0, 0.0, 0.0];
        this.front = [0.0, 0.0, -1.0];
        this.up = [0.0, 1.0, 0.0];
        this.right = [1.0, 0.0, 0.0];
        this.fov = 45;
        this.controllable = false;
        this.projectionMatrix = glm.mat4.create();
        this.viewMatrix = glm.mat4.create();
        this.position = pos;
        this.fpsController = new controller_1.FPSController(this);
        this.turnTableController = new controller_1.TurnTableController(this);
        this.controllerType = CameraControllerTypes.FPS;
        this.controller = this.fpsController;
    }
    PerspectiveCamera.prototype.Update = function (elapsedTime, timeStep) {
        if (this.controller instanceof controller_1.TurnTableController) {
            this.controller.Update(timeStep);
        }
    };
    PerspectiveCamera.prototype.SetController = function (type) {
        if (type == CameraControllerTypes.FPS) {
            this.controllable = false;
            this.controller = this.fpsController;
            this.position = [-3, 0, -1];
            this.fpsController.UpdateCameraViewMatrix();
            this.fpsController.UpdateCameraProjectionMatrix();
        }
        else {
            this.controllable = true;
            this.controller = this.turnTableController;
            this.position = [0, 5, 10];
            this.turnTableController.UpdateCameraViewMatrix();
            this.turnTableController.UpdateCameraProjectionMatrix();
        }
    };
    PerspectiveCamera.prototype.SetViewMatrix = function (viewMatrix) {
        this.viewMatrix = viewMatrix;
    };
    PerspectiveCamera.prototype.SetProjectionMatrix = function (projectionMatrix) {
        this.projectionMatrix = projectionMatrix;
    };
    PerspectiveCamera.prototype.Resize = function (width, height) {
        this.projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(this.fov), width / height, 0.1, 100);
    };
    // Getters.
    PerspectiveCamera.prototype.GetProjectionMatrix = function () { return this.projectionMatrix; };
    PerspectiveCamera.prototype.GetViewMatrix = function () { return this.viewMatrix; };
    return PerspectiveCamera;
}());
exports.PerspectiveCamera = PerspectiveCamera;
;
