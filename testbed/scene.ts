import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { ProjectMesh } from "./project_mesh"
import { ProjectID } from "./renderer";


/**
 * @brief
 */
export class BackgroundMesh 
{
    constructor() 
    {
    }

    public create(program : cml.Program, vertexInput : cml.VertexInput, model : glm.mat4, uModelMatrix : cml.UniformResource, shader : cml.Shader) : void 
    {
        this.program = program;
        this.vertexInput = vertexInput;
        this.modelMatrix = model;
        this.uModelMatrix = uModelMatrix;
        this.shader = shader;
    }

    public select() : void 
    {

    }

    public destroy() : void 
    {
        this.program.destroy();
        this.vertexInput.destroy();
    }

    public program !: cml.Program;
    public shader !: cml.Shader;
    public vertexInput !: cml.VertexInput;
    public modelMatrix !: glm.mat4;
    public uModelMatrix !: cml.UniformResource;
};



/**
 * @brief
 */
export class Scene 
{
    constructor() 
    {
        this.meshes = [];
    }

    public create() : void 
    {
        
    }

    public getMesh(id : ProjectID) : ProjectMesh 
    {
        this.meshes.forEach((mesh : ProjectMesh) => 
        {
            if(mesh.id == id)     
            {
                return mesh;
            }
        })

        return this.meshes[id];
    }

    public addMesh(mesh : ProjectMesh) : void 
    {
        this.meshes.push(mesh);
    }

    public traverse(callback : (mesh : ProjectMesh) => void) : void 
    {
        this.meshes.forEach((mesh : ProjectMesh) => 
        {
            callback(mesh);
        });
    }

    private meshes : ProjectMesh[];
};