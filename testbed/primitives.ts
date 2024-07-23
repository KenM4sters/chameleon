import * as cml from "../src/chameleon"

import model_view_projection_vert from "./shaders/model_view_projection.vert?raw";
import project_frag from "./shaders/project.frag?raw";


export class Primitives 
{
    private constructor() 
    {

    }

    public create() : void
    {
        // Project cubes input
        //
        this.projectCubeVBO = cml.createVertexBuffer({data: this.cube_vertices, byteSize: this.cube_vertices.byteLength});
        this.projectCubeEBO = cml.createIndexBuffer({data: this.cube_indices, byteSize: this.cube_indices.byteLength});
        
        this.projectCubeLayout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("Normal", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            3
        );    
        
        
        this.projectCubeInput = cml.createVertexInput(
        {
            vBuffer: this.projectCubeVBO,
            iBuffer: this.projectCubeEBO,
            layout: this.projectCubeLayout,
            verticesCount: this.cube_indices.length
        });
        
        
        // Common sampler (maybe this should be part of the framework?).
        //
        this.sampler = cml.createSampler(
            {
                addressModeS: cml.SamplerAddressMode.ClampToEdge,
                addressModeT: cml.SamplerAddressMode.ClampToEdge,
                addressModeR: cml.SamplerAddressMode.ClampToEdge,
                minFilter: cml.SamplerFilterMode.Linear,
                magFilter: cml.SamplerFilterMode.Linear,
            }
        );
        
        // full screen quad input (generally used input for all squares with a model matrix).
        //
        this.fullScreenQuadVBO = cml.createVertexBuffer({data: new Float32Array(this.screen_quad_vertices), byteSize: this.screen_quad_vertices.length * 4});
        this.fullScreenQuadEBO = cml.createIndexBuffer({data: new Uint16Array(this.screen_quad_indices), byteSize: this.screen_quad_indices.length * 4});
        
        this.fullScreenQuadLayout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            2
        );
        
        this.fullScreenQuadInput = cml.createVertexInput(
        {
            vBuffer: this.fullScreenQuadVBO,
            iBuffer: this.fullScreenQuadEBO,
            layout: this.fullScreenQuadLayout,
            verticesCount: this.screen_quad_indices.length
        });

        this.projectMeshProgram = cml.createProgram({vertCode: model_view_projection_vert, fragCode: project_frag});
    }

    public static getInstance() : Primitives 
    {
        if(!Primitives.instance) 
        {
            Primitives.instance = new Primitives();
        }

        return this.instance;
    }

    private static instance : Primitives;
        
    // Project cubes input
    //
    public projectCubeVBO !: cml.VertexBuffer;
    public projectCubeEBO !: cml.IndexBuffer;    
    public projectCubeLayout !: cml.VertexLayout;
    public projectCubeInput !: cml.VertexInput;

    // Common sampler (maybe this should be part of the framework?).
    //
    public sampler !: cml.Sampler;
    
    // full screen quad input (generally used input for all squares with a model matrix).
    //
    public fullScreenQuadVBO !: cml.VertexBuffer;
    public fullScreenQuadEBO !: cml.IndexBuffer;
    public fullScreenQuadLayout !: cml.VertexLayout;
    public fullScreenQuadInput !: cml.VertexInput;
    public projectMeshProgram !: cml.Program;


    public planet_image_vertices = new Float32Array([ 
        -1.0, -1.0, 0.0, 0.0, 0.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        1.0, 0.90, 0.0, 1.0, 1.0,
        0.6, 0.90, 0.0, 1.0, 1.0,
        0.55, 1.0, 0.0, 1.0, 1.0,
        -1.0, 0.90, 0.0, 0.0, 1.0,
        -0.85, 0.90, 0.0, 0.0, 1.0,
        -0.80, 1.0, 0.0, 0.0, 1.0
    ]);
    
    
    public screen_quad_vertices = new Float32Array([ 
        -1.0, -1.0, 0.0, 0.0, 0.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, 0.0, 0.0, 1.0
    ]);
    
    public screen_quad_indices = new Float32Array([ 
        0, 1, 2, 
        0, 3, 2,
    ]);
    
    
    public cube_vertices = new Float32Array([
        // Position         // Normal         // UV
        // Front face
        -1.0, -1.0,  1.0,  0.0,  0.0,  1.0,  0.0, 0.0,  // Bottom-left
         1.0, -1.0,  1.0,  0.0,  0.0,  1.0,  1.0, 0.0,  // Bottom-right
         1.0,  1.0,  1.0,  0.0,  0.0,  1.0,  1.0, 1.0,  // Top-right
        -1.0,  1.0,  1.0,  0.0,  0.0,  1.0,  0.0, 1.0,  // Top-left
        
        // Back face
        -1.0, -1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Bottom-left
         1.0, -1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Bottom-right
         1.0,  1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Top-right
        -1.0,  1.0, -1.0,  0.0,  0.0, -1.0,  9.0, 9.0,  // Top-left
        
        // Left face
        -1.0,  1.0,  1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Top-right
        -1.0,  1.0, -1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Top-left
        -1.0, -1.0, -1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-left
        -1.0, -1.0,  1.0, -1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-right
        
        // Right face
         1.0,  1.0,  1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Top-left
         1.0, -1.0, -1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-right
         1.0,  1.0, -1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Top-right
         1.0, -1.0,  1.0,  1.0,  0.0,  0.0,  9.0, 9.0,  // Bottom-left
        
        // Top face
        -1.0,  1.0,  1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Top-left
         1.0,  1.0,  1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Top-right
         1.0,  1.0, -1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Bottom-right
        -1.0,  1.0, -1.0,  0.0,  1.0,  0.0,  9.0, 9.0,  // Bottom-left
        
        // Bottom face
        -1.0, -1.0,  1.0,  0.0, -1.0,  0.0,  9.0, 9.0,  // Top-left
         1.0, -1.0,  1.0,  0.0, -1.0,  0.0,  9.0, 9.0,  // Top-right
         1.0, -1.0, -1.0,  0.0, -1.0,  0.0,  9.0, 9.0,  // Bottom-right
        -1.0, -1.0, -1.0,  0.0, -1.0,  0.0,  9.0, 9.0   // Bottom-left
    ]);
    
    public cube_indices = new Uint16Array([
        // Front face
        0, 1, 2,
        2, 3, 0,
        
        // Back face
        4, 5, 6,
        6, 7, 4,
        
        // Left face
        8, 9, 10,
        10, 11, 8,
        
        // Right face
        12, 13, 14,
        14, 15, 12,
        
        // Top face
        16, 17, 18,
        18, 19, 16,
        
        // Bottom face
        20, 21, 22,
        22, 23, 20
    ]);
};



