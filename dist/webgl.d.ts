/**
 * @brief Simple interface to force clases to handle window resizing.
 */
export interface Layer {
    Resize(width: number, height: number): void;
}
/**
 * @brief Wrapper around any variable to ensure that it's passed by reference and not value.
 */
export declare class Ref<T> {
    val: T;
    constructor(val: T);
}
/**
 * @brief Singleton class that merely provies easier access to the canvas and WebGl context
 * instances that are needed throughout the application.
 */
export declare class WebGL {
    private constructor();
    static GetInstance(): WebGL;
    canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    private static instance;
}
