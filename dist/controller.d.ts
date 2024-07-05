import { PerspectiveCamera } from "./export";
import { Input } from "./input";
export declare abstract class CameraController {
    constructor(camera: PerspectiveCamera);
    protected readonly camera: PerspectiveCamera;
    protected readonly input: Input;
    protected readonly canvas: HTMLCanvasElement;
}
export declare class TurnTableController extends CameraController {
    constructor(camera: PerspectiveCamera);
    Update(timeStep: number): void;
    private SetCameraPosition;
    private OnMouseMove;
    private OnMouseDown;
    private OnMouseUp;
    UpdateCameraViewMatrix(): void;
    UpdateCameraProjectionMatrix(): void;
    private OnScroll;
    private spherical;
    private isDragging;
    private previousMousePosition;
    private zoomFactor;
    private zoomSensitivity;
    private mouseSensitivity;
    private cameraStartPosition;
    private cameraTargetPosition;
    private lerpTime;
    private lerpDuration;
}
export declare class FPSController extends CameraController {
    constructor(camera: PerspectiveCamera);
    Update(timeStep: number): void;
    private OnKeyDown;
    private UpdateCameraDirections;
    UpdateCameraViewMatrix(): void;
    UpdateCameraProjectionMatrix(): void;
    private timeStep;
}
