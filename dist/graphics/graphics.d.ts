import { Layer } from "../webgl";
import { Renderer } from "./renderer/renderer";
import { Scene } from "../scene/scene";
import { SpecialFX } from "./specialFx/specialFX";
/**
 * @brief A wrapper around a Renderer that's designed manage and tell the renderer
 * what it should be doing each frame.
 */
export declare class Graphics implements Layer {
    constructor();
    /**
     * @brief Has to be called in order for any rendering to happen. This function will tell
     * the scene to render followed by any specialFx passes (some are required by default, such
     * as toneMapping).
     * @param scene An instance of a scene (should only be one) to render.
     * @param elapsedTime Time since the application began.
     * @param timeStep Time between each frame.
     */
    Update(scene: Scene, elapsedTime: number, timeStep: number): void;
    /**
     * @brief Calls the entire graphics pipeline to resize to the user defined dimensions.
     * If this isn't set, the default will be the dimensions of the canvas.
     * @param width Should be the width of the desired viewport.
     * @param height Should be the height of the desired viewport.
     */
    SetSizes(width: number, height: number): void;
    /**
     * @brief Called everytime the window is resized, and resizes the canvas and specialFx passes.
     * @param width The new width.
     * @param height The new height.
     */
    Resize(width: number, height: number): void;
    GetRenderer(): Renderer;
    specialFx: SpecialFX;
    private renderer;
    private gl;
    private width;
    private height;
}
