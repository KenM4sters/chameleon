import { ShaderInputFormat } from "../shader_program";
import { IUniform } from "../uniform";

export interface GLUniformBlueprint 
{
    format : ShaderInputFormat;
    label : string;
    value : unknown;
};


export class GLUniform extends IUniform 
{
    constructor() 
    {
        super();
    }

    data : any;
};