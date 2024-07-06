

export enum ShaderInputFormat 
{
    i32,
    f32,
    vec2f,
    vec3f,
    vec4f,
    mat3x3,
    mat4x4,
};

export enum ShaderDescriptorType 
{
    Uniform,
    Image,
    Storage
};

export function GetShaderTypeSize(type : ShaderInputFormat) : number 
{
    switch(type) 
    {
        case ShaderInputFormat.i32:       return 4;
        case ShaderInputFormat.f32:       return 4;
        case ShaderInputFormat.vec2f:     return 4*2;
        case ShaderInputFormat.vec3f:     return 4*3;
        case ShaderInputFormat.vec4f:     return 4*4;
        case ShaderInputFormat.mat3x3:    return 4*9;
        case ShaderInputFormat.mat4x4:    return 4*16;
    }
}

export abstract class IShaderProgram 
{
    constructor() 
    {

    }
};