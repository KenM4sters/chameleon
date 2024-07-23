import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { Primitives } from "./primitives";
import { ProjectID } from "./renderer";

/**
 * @brief
 */
export class ProjectMesh 
{
    constructor() 
    {
        this.label = "";
    }

    public create(projectId : ProjectID, label : string, img : HTMLImageElement, uProjection : cml.UniformResource, uView : cml.UniformResource, translation : glm.vec3, scale : glm.vec3) : void 
    {
        this.id = projectId;

        const primitves = Primitives.getInstance();

        this.label = label;

        let texture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: primitves.sampler,
                width: img.width,
                height: img.height,
                data : img
            }
        );

        this.vertexInput = primitves.projectCubeInput;

        this.modelMatrix = glm.mat4.create();
        glm.mat4.translate(this.modelMatrix, this.modelMatrix, translation);
        glm.mat4.scale(this.modelMatrix, this.modelMatrix, scale);
        this.uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(this.modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.uProjectId = cml.createUniformResource({name: "u_projectId", type: "Int", data: this.id, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.sTexture = cml.createSamplerResource({name: "s_texture", texture: texture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.shader = cml.createShader({program: primitves.projectMeshProgram, resources: [this.uModelMatrix, this.uProjectId, uProjection, uView, this.sTexture], count: 5});
    }

    public select() : void 
    {

    }

    public destroy() : void 
    {
        this.texture.destroy();
        this.program.destroy();
        this.vertexInput.destroy();
    }

    public texture !: cml.Texture;
    public program !: cml.Program;
    public shader !: cml.Shader;
    public vertexInput !: cml.VertexInput;
    public uModelMatrix !: cml.UniformResource;
    public uProjectId !: cml.UniformResource;
    public sTexture !: cml.SamplerResource;
    public modelMatrix !: glm.mat4;
    
    public label : string;
    public id !: ProjectID;
};