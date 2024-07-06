import { BufferAttribLayout } from "../../core/vertex_layout";
import { IShader } from "../shader";
import { GLConstant } from "./gl_constant";
import { GLShaderProgram } from "./gl_shader_program";
import { GLUniform, GLUniformBlueprint } from "./gl_uniform";
import { GLVertexInput } from "./gl_vertex_input";


export interface GLShaderBlueprint 
{
    vertCode : string;
    fragCode : string;
    vertexInput : 
    {
        data : Float32Array;
        layout : BufferAttribLayout
    };
    uniforms : GLUniformBlueprint[];
};

export class GLShader extends IShader 
{
    constructor() 
    {
        super();
    }

    public program : GLShaderProgram;
    public constant : GLConstant;
    public vertexInput : GLVertexInput;
    public uniform : GLUniform;
};