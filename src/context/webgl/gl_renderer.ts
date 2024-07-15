import { Graphics } from "../../chameleon";
import { IRenderer } from "../renderer";


export class GLRenderer extends IRenderer
{
    constructor()
    {
        super();
    }
    
    public override Resize(width: number, height: number): void 
    {
        
    }

    public static gl : WebGL2RenderingContext;
};