import { Program, Resource, Shader } from "../../graphics";
import { ShaderProps, VertexData } from "../../types";
import { GLResource } from "./gl_resource";
import { GLProgram } from "./gl_program";



class GLShader extends Shader 
{
    constructor() 
    {
        super();
    }

    public override create(props: ShaderProps): void 
    {
        this.program = props.program as GLProgram;

        for(let i = 0; i < props.count; i++) 
        {
            this.resources.set(props.resources[i].getName(), props.resources[i]);
        }
    }

    public override update(name: string, data: VertexData): void 
    {
    }

    public override destroy(): void 
    {        
        this.program.destroy();
    
        this.resources.forEach((res : GLResource) => 
        {
            res.destroy();
        })
    }

    public getProgram() : GLProgram { return this.program; }
    public getResources() : Map<string, GLResource> { return this.resources; }

    private program !: GLProgram;
    private resources : Map<string, GLResource> = new Map();
}

export {GLShader}