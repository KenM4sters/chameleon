import { Graphics } from "./graphics/graphics";
import { Scene } from "./scene/scene";
import { IScript } from "./script";
/**
 * @brief The main entry point for our application. Dragon has instances of the scene, graphics,
 * script and assets and runs the main game loop.
 */
export declare class Dragon {
    /**
     * @brief Constructs all necessary members (scene, graphics etc...)
     * @param script The scripts that defines an initiaztion and loop function to call.
     */
    constructor(script: IScript);
    DrawPreloader(): void;
    /**
     * @brief This needs to be called by the initialization function of the IScript instance
     * which gives a callback to the function that will be called each frame.
     * @param callback The loop function to be called each frame.
     */
    SetAnimationLoop(callback: (elapsedTime: number, timeStep: number) => void): void;
    private AnimationLoop;
    /**
     * @brief Updates the graphics member instance.
     */
    Update(): void;
    /**
     * @brief Resizes each member instance whenver the window is resized.
     */
    OnResize(): void;
    Stop(): void;
    scene: Scene;
    graphics: Graphics;
    private script;
    private assets;
    private preloader;
    private interface;
    private frontend;
    private isReady;
    private animationCallback;
    private animationFrameId;
    private lastFrame;
    private elapsedTime;
    private timeStep;
}
