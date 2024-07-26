import { ProjectMesh } from "./mesh"
import { ProjectID } from "./renderer";


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