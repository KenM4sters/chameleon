import { Resource, Shader } from "../common/context";
import { ShaderProps, WriteFrequency } from "../../graphics";
import { GLProgram } from "./gl_program";
import { gl } from "./gl_context";
import { GLTexture } from "./gl_texture";
import { GLSamplerResource, GLUniformResource } from "./gl_resource";



export class GLShader extends Shader 
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
            this.resources.set(props.resources[i].getName(), props.resources[i] as Resource);
        }

        gl.useProgram(this.program.getContextHandle());

        for(const entry of this.resources) 
        {
            const res = entry[1];

            let textureUnitCounter = 0;

            if(res.getType() == "Sampler") 
            {
                gl.uniform1i(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), textureUnitCounter);
                textureUnitCounter++;
            }
            else 
            {
                let uniformResource = res as GLUniformResource;

                switch(res.getType()) 
                {
                    case "Int":
                        gl.uniform1i(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as number);  
                        break;    
                    case "Float":
                        gl.uniform1f(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as number);  
                        break;    
                    case "Vec2i":
                        gl.uniform2iv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Uint16Array);  
                        break;    
                    case "Vec2f":
                        gl.uniform2fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Float32Array);  
                        break;    
                    case "Vec3i":
                        gl.uniform3iv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Uint16Array);  
                        break;    
                    case "Vec3f":
                        gl.uniform3fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Float32Array);  
                        break;    
                    case "Vec4i":
                        gl.uniform4iv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Uint16Array);  
                        break;    
                    case "Vec4f":
                        gl.uniform4fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Float32Array);  
                        break;    
                    case "Mat3x3f":
                        gl.uniformMatrix3fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), false, uniformResource.getData() as Float32Array);  
                        break;    
                    case "Mat4x4f":
                        gl.uniformMatrix4fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), false, uniformResource.getData() as Float32Array);  
                        break;    
                    default:
                        gl.uniform1i(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as number);  
                }
            }
        }
    }

    public override bind() : void 
    {
        gl.useProgram(this.program.getContextHandle());

        for(const entry of this.resources) 
        {
            const res = entry[1];
            
            if(res.getWriteFrequency() == WriteFrequency.Dynamic) 
            {                
                if(res.getType() == "Sampler") 
                {
                    const textureResource = res as GLSamplerResource;
                    let tex = textureResource.getTexture() as GLTexture;
                    gl.bindTexture(gl.TEXTURE_2D, tex.getContextHandle());
                }
                else 
                {
                    let uniformResource = res as GLUniformResource;
    
                    switch(res.getType()) 
                    {
                        case "Int":
                            gl.uniform1i(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as number);  
                            break;    
                        case "Float":
                            gl.uniform1f(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as number);  
                            break;    
                        case "Vec2i":
                            gl.uniform2iv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Uint16Array);  
                            break;    
                        case "Vec2f":
                            gl.uniform2fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Float32Array);  
                            break;    
                        case "Vec3i":
                            gl.uniform3iv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Uint16Array);  
                            break;    
                        case "Vec3f":
                            gl.uniform3fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Float32Array);  
                            break;    
                        case "Vec4i":
                            gl.uniform4iv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Uint16Array);  
                            break;    
                        case "Vec4f":
                            gl.uniform4fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as Float32Array);  
                            break;    
                        case "Mat3x3f":
                            gl.uniformMatrix3fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), false, uniformResource.getData() as Float32Array);  
                            break;    
                        case "Mat4x4f":
                            gl.uniformMatrix4fv(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), false, uniformResource.getData() as Float32Array);  
                            break;    
                        default:
                            gl.uniform1i(gl.getUniformLocation(this.program.getContextHandle(), entry[0]), uniformResource.getData() as number);  
                    }
                }
            }
        }
    }

    public override destroy(): void 
    {        
        this.program.destroy();
    
        this.resources.forEach((res : Resource) => 
        {
            res.destroy();
        })
    }

    public getProgram() : GLProgram { return this.program; }
    public getResources() : Map<string, Resource> { return this.resources; }

    private program !: GLProgram;
    private resources : Map<string, Resource> = new Map();
}
