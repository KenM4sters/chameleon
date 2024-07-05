import * as glm from "gl-matrix";
export declare enum CameraControllerTypes {
    TurnTable = 0,
    FPS = 1
}
/**
 * @brief Holds and updates the View and Projection matrices used to transform each
 * object in the Scene instance relative to this camera object.
 */
export declare class PerspectiveCamera {
    constructor(pos: glm.vec3);
    Update(elapsedTime: number, timeStep: number): void;
    SetController(type: CameraControllerTypes): void;
    SetViewMatrix(viewMatrix: glm.mat4): void;
    SetProjectionMatrix(projectionMatrix: glm.mat4): void;
    Resize(width: number, height: number): void;
    GetProjectionMatrix(): glm.mat4;
    GetViewMatrix(): glm.mat4;
    position: glm.vec3;
    target: glm.vec3;
    front: glm.vec3;
    up: glm.vec3;
    right: glm.vec3;
    fov: number;
    controllable: boolean;
    private projectionMatrix;
    private viewMatrix;
    private controller;
    private fpsController;
    private turnTableController;
    private controllerType;
}
