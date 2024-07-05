import { Graphics } from "../../core/graphics";
import { IRenderer } from "../renderer";


export class GLRenderer extends IRenderer
{
    constructor()
    {
        super();

        const canvas = Graphics.canvas;

        GLRenderer.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    }
    
    public override Resize(width: number, height: number): void 
    {
        
    }

    public static gl : WebGL2RenderingContext;
};