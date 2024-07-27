import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { ProjectID } from "./renderer";

import { Resources } from "./resources";
import { cube_indices, cube_vertices } from "./primitives";

import mvp_vert from "./shaders/model_view_projection.vert?raw";
import project_frag from "./shaders/project.frag?raw";

/**
 * @brief
 */
export interface ProjectMeshProps 
{
    id : ProjectID, 
    label : string
    translation : glm.vec3, 
    scale : glm.vec3, 
    vertexInput : cml.VertexInput,
    program : cml.Program,
    sampler : cml.Sampler
};


/**
 * @brief
 */
export class ProjectMesh 
{
    constructor() 
    {
        this.label = "";
        this.position = [0, 0, 0];
        this.scale = [1, 1, 1];
    }

    public create(props : ProjectMeshProps, img : HTMLImageElement, uProjection : cml.UniformResource, uView : cml.UniformResource) : void 
    {
        this.id = props.id;
        this.label = props.label;
        this.position = props.translation;
        this.scale = props.scale;


        let texture = cml.createTexture(
            {
                target: cml.TargetType.Texture2D,
                nMipMaps: 0,
                level: 0,
                internalFormat: cml.InternalFormat.RGB32,
                format: cml.Format.RGB,
                type: cml.ValueType.UChar,
                usage: cml.Usage.ReadWrite,
                sampler: props.sampler,
                width: img.width,
                height: img.height,
                data : img
            }
        );

        this.modelMatrix = glm.mat4.create();
        glm.mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        glm.mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

        this.uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(this.modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.uProjectId = cml.createUniformResource({name: "u_projectId", type: "Int", data: this.id, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.sTexture = cml.createSamplerResource({name: "s_texture", texture: texture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});

        this.shader = cml.createShader({program: props.program, resources: [this.sTexture, this.uProjectId, this.uModelMatrix, uProjection, uView], count: 5});
    }

    public select() : void 
    {

    }

    public destroy() : void 
    {
        this.texture.destroy();
    }


    public texture !: cml.Texture;
    public shader !: cml.Shader;
    public uModelMatrix !: cml.UniformResource;
    public uProjectId !: cml.UniformResource;
    public sTexture !: cml.SamplerResource;
    public modelMatrix !: glm.mat4;

    public position : glm.vec3;
    public scale : glm.vec3;
    
    public label : string;
    public id !: ProjectID;
};


/**
 * @brief
 */
export class ProjectsList 
{
    constructor() 
    {
        this.meshes = [];
    }

    public create(uProjection : cml.UniformResource, uView : cml.UniformResource) : void 
    {

        // Cube vertex input.
        //
        this.cube_vbo = cml.createVertexBuffer({data: cube_vertices, byteSize: cube_vertices.byteLength});
        this.cube_ebo = cml.createIndexBuffer({data: cube_indices, byteSize: cube_indices.byteLength});

        this.cube_layout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("Normal", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            3
        );    


        this.cube_input = cml.createVertexInput(
        {
            vBuffer: this.cube_vbo,
            iBuffer: this.cube_ebo,
            layout: this.cube_layout,
            verticesCount: cube_indices.length
        });


        // Project program.
        //
        this.project_program = cml.createProgram({vertCode: mvp_vert, fragCode: project_frag});


        // Common sampler (maybe this should be part of the framework?).
        //
        this.cube_sampler = cml.createSampler(
            {
                addressModeS: cml.SamplerAddressMode.ClampToEdge,
                addressModeT: cml.SamplerAddressMode.ClampToEdge,
                addressModeR: cml.SamplerAddressMode.ClampToEdge,
                minFilter: cml.SamplerFilterMode.Linear,
                magFilter: cml.SamplerFilterMode.Linear,
            }
        );


        // Projects
        //
        let projectMeshes : ProjectMeshProps[] = 
        [
            {id: ProjectID.mammoth,         label: "mammoth",           translation: [0.0, 0.0, 0.0], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.silverback,      label: "mammoth",           translation: [0.0, 0.0, 0.6], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.wgpu,            label: "mammoth",           translation: [0.0, 0.0, 1.2], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.chameleon,       label: "chameleon_marbles", translation: [0.0, 0.0, 1.8], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.pbr,             label: "pbr_metal",         translation: [0.0, 0.0, 2.4], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.sandbox,         label: "sandbox",           translation: [0.0, 1.0, 3.0], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.vulkanLights,    label: "vulkan_lights",     translation: [0.0, 0.0, 3.6], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.raytracer,       label: "raytracer",         translation: [0.0, 0.0, 4.2], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.shmup,           label: "shmup",             translation: [0.0, 0.0, 4.8], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.bankingApp,      label: "mammoth",           translation: [0.0, 0.0, 5.4], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.gamesList,       label: "games_list",        translation: [0.0, 0.0, 6.0], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.actixWeb,        label: "mammoth",           translation: [0.0, 0.0, 6.6], scale: [0.8, 0.8, 0.04], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler}
        ];


        // Loops through project and generates the mesh.
        //
        projectMeshes.forEach((project) => 
        {
            let resources = Resources.GetInstance();
            let img = resources.GetTexture(project.label);
            
            if(!img) 
            {
                throw new Error(`Failed to create mesh - no matching texture with name, ${project.label}`);
            }
                
            let mesh = new ProjectMesh();

            mesh.create(project, img, uProjection, uView);

            this.addMesh(mesh);
        });
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

    public destroy() : void 
    {

    } 

    public resize(width : number, height : number) : void 
    {
        
    }

    
    private meshes : ProjectMesh[];
    public cube_vbo !: cml.VertexBuffer;
    public cube_ebo !: cml.VertexBuffer;
    public cube_layout !: cml.VertexLayout;
    public cube_input !: cml.VertexInput;
    public project_program !: cml.Program;
    public cube_sampler !: cml.Sampler;
};