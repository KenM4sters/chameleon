import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import texture_gen_frag from "./shaders/experimental/buffer_a.frag?raw";
import animation_frag from "./shaders/experimental/buffer_b.frag?raw";
import sharpen_frag from "./shaders/experimental/buffer_c.frag?raw";
import image_frag from "./shaders/experimental/image.frag?raw";
import color_frag from "./shaders/experimental/color.frag?raw";
import background_frag from "./shaders/experimental/background.frag?raw";


let planet_image_vertices : number[] = 
[
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 0.0, 1.0
];

let planet_image_indices : number[] = 
[
    0, 1, 2,
    0, 3, 2
];


export function RunDemo2() 
{
    // Init.
    //

    let canvas = document.getElementById("webgl") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let settings : cml.GraphicsSettings = 
    {
        canvas: canvas,
        name: "demo",
        backend: cml.GraphicsBackend.WebGL,
        pixelViewportWidth: canvas.width,
        pixelViewportHeight: canvas.height
    }

    cml.init(settings);

    // View Frustum (maybe all of these should be part of the framework?).
    //
    let projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(45), window.innerWidth / window.innerHeight, 0.1, 100.0);
    let viewMatrix = glm.mat4.lookAt(glm.mat4.create(), [0, 0, 4], [0, 0, 0], [0, 1, 0]);
    let uProjection = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(projectionMatrix), name: "u_projection", writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerFrame});
    let uView = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(viewMatrix), name: "u_view", writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerFrame});

    // Canvas, mouse and time uniforms (maybe all of these should be part of the framework?).
    //
    let uCanvasWidth = cml.createUniformResource({type: "Float", name: "u_canvasWidth", data: window.innerWidth, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
    let uCanvasHeight = cml.createUniformResource({type: "Float", name: "u_canvasHeight", data: window.innerHeight, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
    let uTime = cml.createUniformResource({type: "Float", name: "u_time", data: performance.now(), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
    let uIsFirstFrame = cml.createUniformResource({type: "Int", name: "u_isFirstFrame", data: 1, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
    let mousePosition = glm.vec2.create();
    window.addEventListener("mousemove", (e : MouseEvent) => 
    {
        let yPos = ((e.clientY - window.innerHeight) * -1) / window.innerHeight;
        let xPos = e.clientX / window.innerWidth;
        mousePosition = [xPos, yPos];  
    });
    let uMousePosition = cml.createUniformResource({type: "Vec2f", name: "u_mousePosition", data: new Float32Array(mousePosition), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});


    // Common sampler (maybe this should be part of the framework?).
    //
    let sampler1 = cml.createSampler(
        {
            addressModeS: cml.SamplerAddressMode.ClampToEdge,
            addressModeT: cml.SamplerAddressMode.ClampToEdge,
            addressModeR: cml.SamplerAddressMode.ClampToEdge,
            minFilter: cml.SamplerFilterMode.Linear,
            magFilter: cml.SamplerFilterMode.Linear,
        }
    );




    // planet_image Input.
    //
    let planet_image_vbo = cml.createVertexBuffer({data: new Float32Array(planet_image_vertices), byteSize: planet_image_vertices.length * 4});
    let planet_image_ebo = cml.createIndexBuffer({data: new Uint16Array(planet_image_indices), byteSize: planet_image_indices.length * 4});
    
    let planet_image_layout = new cml.VertexLayout(
        [
            new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
            new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
        ], 
        2
    );

    let planet_image_input = cml.createVertexInput(
    {
        vBuffer: planet_image_vbo,
        iBuffer: planet_image_ebo,
        layout: planet_image_layout,
        verticesCount: planet_image_indices.length
    });


    // RT 1.
    //
    let texture1 = cml.createTexture(
        {
            target: cml.TargetType.Texture2D,
            nMipMaps: 0,
            level: 0,
            internalFormat: cml.InternalFormat.RGBA32F,
            format: cml.Format.RGBA,
            type: cml.ValueType.Float,
            usage: cml.Usage.ReadWrite,
            sampler: sampler1,
            width: window.innerWidth,
            height: window.innerHeight,
            data : null
        }
    );

    let colorAttachment1 : cml.FrameBufferAttachment = 
    {
        texture: texture1,
        attachment: cml.Attachment.Color0
    }

    let frameBuffer1 = cml.createFrameBuffer({attachments: [colorAttachment1], count: 1});

    // RT 2.
    //
    let texture2 = cml.createTexture(
        {
            target: cml.TargetType.Texture2D,
            nMipMaps: 0,
            level: 0,
            internalFormat: cml.InternalFormat.RGBA32F,
            format: cml.Format.RGBA,
            type: cml.ValueType.Float,
            usage: cml.Usage.ReadWrite,
            sampler: sampler1,
            width: window.innerWidth,
            height: window.innerHeight,
            data : null
        }
    );

    let colorAttachment2 : cml.FrameBufferAttachment = 
    {
        texture: texture2,
        attachment: cml.Attachment.Color0
    };

    let frameBuffer2 = cml.createFrameBuffer({attachments: [colorAttachment2], count: 1});

 
    
    let model_identity = glm.mat4.create();
    
    let planet_image_model = glm.mat4.scale(glm.mat4.create(), model_identity, [0.95, 0.95, 0.95]);
    let uPlanetImageModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(planet_image_model), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    

    // Pass 1.
    //
    let planetTextureProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_gen_frag});
    let planetTextureShader = cml.createShader({program: planetTextureProgram, resources: [uPlanetImageModel, uTime, uMousePosition, uCanvasWidth, uIsFirstFrame, uCanvasHeight], count: 6});
    
    // Pass 2.
    //
    let sPlanetTexture = cml.createSamplerResource({name: "s_planetTexture", texture: texture1, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    
    let animationProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: animation_frag});
    let animationShader = cml.createShader({program: animationProgram, resources: [uPlanetImageModel, uCanvasWidth, uIsFirstFrame, uCanvasHeight, uMousePosition, uProjection, uView], count: 7});

    // Pass 3.
    //
    let sPlanetScene = cml.createSamplerResource({name: "s_planetScene", texture: texture2, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let sharpenProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: sharpen_frag});
    let sharpenShader = cml.createShader({program: sharpenProgram, resources: [uPlanetImageModel, uCanvasWidth, uIsFirstFrame, uCanvasHeight, uMousePosition, uProjection, uView], count: 7});
 
    // Pass 4.
    //
    let sImage = cml.createSamplerResource({name: "s_image", texture: texture1, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let imageProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: image_frag});
    let imageShader = cml.createShader({program: imageProgram, resources: [uPlanetImageModel, uCanvasWidth, uIsFirstFrame, uCanvasHeight, uMousePosition, uProjection, uView], count: 7});


    let scaledPlanetImageModel = glm.mat4.scale(glm.mat4.create(), model_identity, [0.952, 0.955, 0.955]);
    glm.mat4.translate(scaledPlanetImageModel, scaledPlanetImageModel, [0, 0, -0.1]);
    let uScaledPlanetImageModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(scaledPlanetImageModel), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let scaledImageProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: color_frag});    
    let scaledImageShader = cml.createShader({program: scaledImageProgram, resources: [uScaledPlanetImageModel], count: 1}); 
    
    let backgroundModel = glm.mat4.scale(glm.mat4.create(), model_identity, [1.0, 1.0, 1.0]);
    glm.mat4.translate(backgroundModel, backgroundModel, [0, 0, -0.1]);
    let ubackgroundModel = cml.createUniformResource({name: "u_model", type: "Mat4x4f", data: new Float32Array(backgroundModel), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let backgroundProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: background_frag});
    let backgroundShader = cml.createShader({program: backgroundProgram, resources: [ubackgroundModel, uCanvasHeight, uCanvasHeight, uMousePosition], count: 4}); 


    // Run.
    //
    loop();

    function loop() : void 
    {
        window.requestAnimationFrame(() => 
        {
            uMousePosition.update(new Float32Array(mousePosition));
            uTime.update(performance.now() * 0.0005);

            cml.begin(frameBuffer1);  
            cml.submit(planet_image_input, planetTextureShader); 
            cml.end();

            cml.begin(frameBuffer2);
            cml.submit(planet_image_input, animationShader);
            cml.end();

            cml.begin(frameBuffer1);
            cml.submit(planet_image_input, sharpenShader);
            cml.end();

            cml.begin(null);
            cml.submit(planet_image_input, backgroundShader);
            cml.submit(planet_image_input, scaledImageShader);
            cml.submit(planet_image_input, imageShader);
            cml.end();

            uIsFirstFrame.update(0);

            loop();
        });  
    }

    // Clean up.
    //
    window.addEventListener("close", () => 
    {
        planetTextureShader.destroy();
        animationShader.destroy();
        sharpenShader.destroy();
        imageShader.destroy();
        
        planet_image_input.destroy();

        frameBuffer1.destroy();
        frameBuffer2.destroy();
    })
}