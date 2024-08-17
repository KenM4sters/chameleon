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


        this.primary_texture = cml.createTexture(
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
        this.uIsIntersected = cml.createUniformResource({name: "u_isIntersected", type: "Int", data: this.isIntersected, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.uProjectId = cml.createUniformResource({name: "u_projectId", type: "Int", data: this.id, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        this.sTexture = cml.createSamplerResource({name: "s_texture", texture: this.primary_texture, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});

        this.shader = cml.createShader({program: props.program, resources: [this.sTexture, this.uProjectId, this.uModelMatrix, this.uIsIntersected, uProjection, uView], count: 6});
    }

    public select() : void 
    {

    }

    public resize(width : number, height : number) : void 
    {
        this.primary_texture.resize(width, height);
    }

    public destroy() : void 
    {
        this.primary_texture.destroy();
    }


    public primary_texture !: cml.Texture;  
    public shader !: cml.Shader;
    public uModelMatrix !: cml.UniformResource;
    public uIsIntersected !: cml.UniformResource;
    public uProjectId !: cml.UniformResource;
    public sTexture !: cml.SamplerResource;
    public modelMatrix !: glm.mat4;
    public isIntersected !: number;

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
        this.project_positions = [];
        this.current_angle = 0;
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


        let division = (Math.PI * 2) / ProjectID.count;

        for(let i = 0; i < ProjectID.count; i++) 
        {
            const angle = division * i;

            const x_pos = Math.cos(angle) * 5.0;
            const y_pos = 0;
            const z_pos = Math.sin(angle) * 5.0;

            this.project_positions.push(glm.vec3.fromValues(x_pos, y_pos, z_pos));
        }

        // Projects
        //
        let projectMeshes : ProjectMeshProps[] = 
        [
            {id: ProjectID.wgpu,            label: "wgpu_1",           translation:this.project_positions[0], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.actixWeb,        label: "actix_web_1",           translation:this.project_positions[1], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.mammoth,         label: "mammoth_1",           translation: this.project_positions[2], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.silverback,      label: "silverback_1",           translation: this.project_positions[3], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.pbr,             label: "pbr_1",         translation:this.project_positions[4], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.sandbox,         label: "sandbox_1",           translation:this.project_positions[5], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.vulkanLights,    label: "vulkan_lights_1",     translation: this.project_positions[6], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.raytracer,       label: "raytracer_1",         translation: this.project_positions[7], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.shmup,           label: "shmup_1",             translation: this.project_positions[8], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.chameleon,       label: "chameleon_1", translation: this.project_positions[9], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.bankingApp,      label: "banking_app_1",           translation: this.project_positions[10], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.gamesList,       label: "games_list_1",        translation: this.project_positions[11], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.gravitySimulator,label: "gravity_simulator_1",        translation: this.project_positions[12], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
            {id: ProjectID.primeNumbers,    label: "prime_numbers_1",        translation: this.project_positions[13], scale: [0.8, 1.0, 0.08], vertexInput: this.cube_input, program: this.project_program, sampler: this.cube_sampler},
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

    public update(e: WheelEvent) : void {
        let delta = e.deltaY * 0.001;

        this.current_angle += delta;

        let angle_between_cubes = ((Math.PI * 2) / ProjectID.count);

        let i = 0;
        this.traverse((mesh: ProjectMesh) => {
            let angle = this.current_angle + i * angle_between_cubes;

            let x = 5.0 * Math.cos(angle);
            let y = 0;
            let z = 5.0 * Math.sin(angle);
    
            // Set the position of the cube
            mesh.position = [x, y, z];
                
            mesh.modelMatrix = glm.mat4.create();
            glm.mat4.translate(mesh.modelMatrix, mesh.modelMatrix, mesh.position);
            glm.mat4.scale(mesh.modelMatrix, mesh.modelMatrix, mesh.scale);
    
            mesh.uModelMatrix.update(new Float32Array(mesh.modelMatrix));

            i++;
        })
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
        this.meshes.forEach((mesh : ProjectMesh) => 
        {
            mesh.resize(width, height);
        })
    }

    
    private meshes : ProjectMesh[];
    public cube_vbo !: cml.VertexBuffer;
    public cube_ebo !: cml.VertexBuffer;
    public cube_layout !: cml.VertexLayout;
    public cube_input !: cml.VertexInput;
    public project_program !: cml.Program;
    public cube_sampler !: cml.Sampler;

    private project_positions !: glm.vec3[];
    private current_angle !: number;
};