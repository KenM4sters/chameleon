import { Program } from "../common/context";
import { ProgramProps } from "../../graphics";
import { gl } from "./gl_context";



/**
 * @brief A GLShaderPogram instance merely holds a reference to a WebGLShaderProgram which
 * gets compiled and linked by providing paths to the vertex and shader files.
 */
export class GLProgram extends Program
{
    constructor() 
    {
        super();

        this.program = 0;
    }

    /**
     * @brief Compiles and links a vertex and fragment program into a a WebGLShaderProgram
     * that should be bound using gl.useProgram() when wanting to make a draw call with this
     * shader program.
     * @param props GLProgramProps instance describing each stage of the shader.
     */
    public override create(props : ProgramProps) : void
    {
        const vShader : WebGLProgram | null = gl.createShader(gl.VERTEX_SHADER);
        if(vShader == null)
        {
            throw new Error("Failed to create vertex shader!")
        };

        gl.shaderSource(vShader, props.vertCode); 
        gl.compileShader(vShader); 
        if(gl.getShaderInfoLog(vShader)) 
        {
            console.log(gl.getShaderInfoLog(vShader))
        };
        
        const fShader : WebGLProgram | null = gl.createShader(gl.FRAGMENT_SHADER);
        if(fShader == null)
        {
            throw new Error("Failed to create fragment shader!")
        };

        gl.shaderSource(fShader, props.fragCode); 
        gl.compileShader(fShader); 
        if(gl.getShaderInfoLog(fShader)) 
        {
            console.log(gl.getShaderInfoLog(fShader))
        };

        // lastly, we need to link the 2 shaders into a single shader program that we can use/release
        // as and when we want to use the two shaders.
        const id = gl.createProgram();

        if(!id) 
        {
            throw new Error("Failed to create shader program!")
        }

        this.program = id;

        gl.attachShader(this.program, vShader);
        gl.attachShader(this.program, fShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) 
        {
            console.warn("Could not initialise shaders");
            console.log(gl.getProgramInfoLog(this.program));
        }

        gl.useProgram(this.program);
    }   

    public override destroy() : void 
    {
        gl.useProgram(null);
        gl.deleteProgram(this.program);
        this.program = 0;
    }

    public getContextHandle() : WebGLProgram { return this.program; }

    public program : WebGLProgram;
};