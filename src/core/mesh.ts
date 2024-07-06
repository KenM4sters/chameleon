import * as glm from "gl-matrix";


export interface MeshBlueprint 
{
    
};   

export class Mesh 
{
    constructor(blueprint : MeshBlueprint) 
    {
        
    }

    public position : glm.vec3;
    public rotation : glm.quat;
    public scale : glm.vec3;
};
