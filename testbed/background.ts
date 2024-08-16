import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"
import { StateResponder } from "./state_responder";

import background_vert from "./shaders/background.vert?raw";
import background_frag from "./shaders/background.frag?raw";

import { View } from "./portfolio";
import { screen_quad_indices, screen_quad_vertices } from "./primitives";
import { Resources } from "./resources";


/**
 * @brief 
 */
export class Background extends StateResponder 
{
    constructor() 
    {
        super();

        this.handleViewChange = this.handleViewChange.bind(this);
        this.onViewChange(this.handleViewChange);
    }
    

    public create(uCanvasDimensions : cml.UniformResource, uMousePosition : cml.UniformResource) : void 
    {
        // Screen Quad rendering data.
        // full screen quad input (generally used input for all squares with a model matrix).
        //
        this.vbo = cml.createVertexBuffer({data: new Float32Array(screen_quad_vertices), byteSize: screen_quad_vertices.length * 4});
        this.ebo = cml.createIndexBuffer({data: new Uint16Array(screen_quad_indices), byteSize: screen_quad_indices.length * 4});

        this.layout = new cml.VertexLayout(
            [
                new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
                new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
            ], 
            2
        );

        this.input = cml.createVertexInput(
        {
            vBuffer: this.vbo,
            iBuffer: this.ebo,
            layout: this.layout,
            verticesCount: screen_quad_indices.length
        });

        this.program = cml.createProgram({vertCode: background_vert, fragCode: background_frag});


        let img = Resources.GetInstance().GetTexture("background_1");

        if(!img) 
        {
            throw new Error("Failed to get texture from Resources: background_1");
        } 


        this.linear_repeat_sampler = cml.createSampler(
        {
            addressModeS: cml.SamplerAddressMode.Repeat,
            addressModeT: cml.SamplerAddressMode.Repeat,
            addressModeR: cml.SamplerAddressMode.Repeat,
            minFilter: cml.SamplerFilterMode.Linear,
            magFilter: cml.SamplerFilterMode.Linear
        });

        this.normal_texture = cml.createTexture(
        {
            target: cml.TargetType.Texture2D,
            nMipMaps: 0,
            level: 0,
            internalFormat: cml.InternalFormat.RGBA32F,
            format: cml.Format.RGBA,
            type: cml.ValueType.Float,
            usage: cml.Usage.ReadWrite,
            sampler: this.linear_repeat_sampler,
            width: window.innerWidth,
            height: window.innerHeight,
            data : img
        });
        

        this.modelMatrix = glm.mat4.create();
        glm.mat4.translate(this.modelMatrix, this.modelMatrix, [0, 0, 1.0]);
        this.uModelMatrix = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(this.modelMatrix), accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});
        let sNormalMap = cml.createSamplerResource({name: "s_normalMap", texture: this.normal_texture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
        this.uCurrentView = cml.createUniformResource({name: "u_currentView", type: "Float", data: 0.0, accessType: cml.ResourceAccessType.PerDrawCall, writeFrequency: cml.WriteFrequency.Dynamic});


        this.shader = cml.createShader({program: this.program, resources: [sNormalMap, this.uModelMatrix, uCanvasDimensions, uMousePosition, this.uCurrentView], count: 5});
    }


    public handleViewChange(view : View) : void 
    {        
        switch(view) 
        {
            case "home": this.uCurrentView.update(0.0); break;
            case "about": this.uCurrentView.update(0.0); break;
            default: this.uCurrentView.update(1.0); break;
        }
    }


    public destroy() : void 
    {
        this.program.destroy();
    }



    public vbo !: cml.VertexBuffer;
    public ebo !: cml.IndexBuffer;
    public layout !: cml.VertexLayout;
    public input !: cml.VertexInput;
    public program !: cml.Program;
    public shader !: cml.Shader;
    public normal_texture !: cml.Texture;
    public linear_repeat_sampler !: cml.Sampler;

    public modelMatrix !: glm.mat4;
    public uModelMatrix !: cml.UniformResource;
    public uCurrentView !: cml.UniformResource;
};