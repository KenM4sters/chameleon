export declare class Preloader {
    constructor();
    private Rotate;
    Resize(width: number, height: number): void;
    Update(elapsedTime: number, timeStep: number): void;
    Destroy(): void;
    isDestroyed: boolean;
    private loadingDiv;
    private cube;
    private gl;
    private projectionMatrix;
    private viewMatrix;
}
