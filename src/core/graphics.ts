import { GLRenderer } from "../context/webgl/gl_renderer";
import { WGPURenderer } from "../context/webgpu/wgpu_renderer";
import { IRenderer } from "../context/renderer";


export enum GraphicsContexts 
{
    WebGL,
    WebGPU
}   

export class Graphics 
{
    constructor(canvas : HTMLCanvasElement, context : GraphicsContexts) 
    {
        Graphics.canvas = canvas;

        switch(context) 
        {
            case GraphicsContexts.WebGL: this.renderer = new GLRenderer(); break;
            case GraphicsContexts.WebGPU: this.renderer = new WGPURenderer(); break;
        }

        window.addEventListener("resize", () => this.Resize());
    }

    /**
     * @brief Called whenever the window is resized, and resizes the canvas to match, for now
     * at least, the new window dimensions. Resize() is then called on the renderer with the new
     * dimensions.
     */
    private Resize() : void 
    {
        if(Graphics.canvas.width != window.innerWidth || Graphics.canvas.height != window.innerHeight)
        {
            Graphics.canvas.width = window.innerWidth;
            Graphics.canvas.height = window.innerHeight;
        }

        this.renderer.Resize(Graphics.canvas.width, Graphics.canvas.height);
    }
    
    
    public static canvas : HTMLCanvasElement;

    private renderer : IRenderer;
}