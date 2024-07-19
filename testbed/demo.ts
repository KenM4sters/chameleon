import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

import fractal_noise_frag from "./shaders/fractal_noise.frag?raw";
import screen_quad_vert from "./shaders/screen_quad.vert?raw";
import planet_vert from "./shaders/planet.vert?raw";
import planet_frag from "./shaders/planet.frag?raw";
import texture_frag from "./shaders/texture.frag?raw";
import cursor_effect_frag from "./shaders/cursor_effect.frag?raw";


function GenerateCompleteSphere(radius: number, stackCount: number, sectorCount: number): { vertices: Float32Array, indices: Uint16Array } {
    const vert: number[] = [];
    const ind: number[] = [];

    let x, y, z, xy, nx, ny, nz, s, t, i, j, k1, k2, kk = 0;
    const lengthInv = 1 / radius;
    const sectorStep = 2 * Math.PI / sectorCount;
    const stackStep = Math.PI / stackCount;
    let offset = 0.0;

    for (i = 0; i <= stackCount; i++) 
    {
        const stackAngle = Math.PI / 2 - i * stackStep; // starting from pi/2 to -pi/2
        xy = radius * Math.cos(stackAngle); // r * cos(u)
        z = radius * Math.sin(stackAngle); // r * sin(u)

        for (j = 0; j <= sectorCount; ++j) {
            const sectorAngle = j * sectorStep; // starting from 0 to 2pi

            // Vertex position
            x = xy * Math.cos(sectorAngle); // r * cos(u) * cos(v)
            y = xy * Math.sin(sectorAngle); // r * cos(u) * sin(v)

            // r * sin(u)
            vert.push(x);
            vert.push(y);
            vert.push(z);

            // Normalized vertex normal
            nx = x * lengthInv;
            ny = y * lengthInv;
            nz = z * lengthInv;
            vert.push(nx);
            vert.push(ny);
            vert.push(nz);

            // Vertex tex coord between [0, 1]
            s = j / sectorCount;
            t = i / stackCount;
            vert.push(s);
            vert.push(t);

            // next
            offset += 3;
            offset += 3;
            offset += 2;
        }
    }

    for(i = 0; i < stackCount; i++)
    {
        k1 = i * (sectorCount + 1);            // beginning of current stack
        k2 = k1 + sectorCount + 1;             // beginning of next stack

        for(j=0; j < sectorCount; ++j, ++k1, ++k2)
        {
            // 2 triangles per sector excluding 1st and last stacks
            if(i != 0)
            {
                ind[kk] = (k1);  // k1---k2---k1+1
                ind[kk+1] = (k2);  // k1---k2---k1+1
                ind[kk+2] = (k1+1);  // k1---k2---k1+1
                kk += 3;
            }

            if(i != (stackCount-1))
            {
                ind[kk] = (k1+1);  // k1---k2---k1+1
                ind[kk+1] = (k2);  // k1---k2---k1+1
                ind[kk+2] = (k2+1);  // k1---k2---k1+1
                kk += 3;
            }
        }
    }
    

    const vertices = new Float32Array(vert);
    const indices = new Uint16Array(ind);

    return { vertices, indices };
}

let squareVertices : number[] = 
[
    -1.0, -1.0, 0.0, 0.0,
    1.0, -1.0, 1.0, 0.0,
    1.0, 1.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 1.0
];

let squareIndices : number[] = 
[
    0, 1, 2,
    0, 3, 2
];


export function RunDemo() 
{
    // Init.
    //
    let settings : cml.GraphicsSettings = 
    {
        canvas: document.getElementById("webgl") as HTMLCanvasElement,
        name: "demo",
        backend: cml.GraphicsBackend.WebGL,
        pixelViewportWidth: window.innerWidth,
        pixelViewportHeight: window.innerHeight
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

    // Square Input.
    //
    let square_vbo = cml.createVertexBuffer({data: new Float32Array(squareVertices), byteSize: squareVertices.length * 4});
    let square_ebo = cml.createIndexBuffer({data: new Uint16Array(squareIndices), byteSize: squareIndices.length * 4});
    
    let square_layout = new cml.VertexLayout(
        [
            new cml.VertexAttribute("Position", cml.ValueType.Float, 2),
            new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
        ], 
        2
    );

    let square_input = cml.createVertexInput(
    {
        vBuffer: square_vbo,
        iBuffer: square_ebo,
        layout: square_layout,
        verticesCount: squareIndices.length
    });

    // Sphere Input.
    //
    const sphere_data = GenerateCompleteSphere(1, 100, 100);
    let sphere_vbo = cml.createVertexBuffer({data: new Float32Array(sphere_data.vertices), byteSize: squareVertices.length * 4});
    let sphere_ebo = cml.createIndexBuffer({data: new Uint16Array(sphere_data.indices), byteSize: squareIndices.length * 4});
    
    let sphere_layout = new cml.VertexLayout(
        [
            new cml.VertexAttribute("Position", cml.ValueType.Float, 3),
            new cml.VertexAttribute("Normal", cml.ValueType.Float, 3),
            new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
        ], 
        3
    );

    let sphere_input = cml.createVertexInput(
    {
        vBuffer: sphere_vbo,
        iBuffer: sphere_ebo,
        layout: sphere_layout,
        verticesCount: sphere_data.indices.length
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

 
    
     
    
    
    
    // Pass 1.
    //
    let fractalNoiseProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: fractal_noise_frag});
    let fractalNoiseShader = cml.createShader({program: fractalNoiseProgram, resources: [uTime, uMousePosition, uCanvasWidth, uCanvasHeight, uProjection, uView], count: 6});
    
    // Pass 2.
    //
    let sFractalNoise = cml.createSamplerResource({name: "s_fractalNoiseTexture", texture: texture1, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let planetModel = glm.mat4.create();
    planetModel = glm.mat4.scale(glm.mat4.create(), planetModel, [1.0, 1.0, 1.0]);
    let uPlanetModel = cml.createUniformResource({type: "Mat4x4f", name: "u_model", data: new Float32Array(planetModel), writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerMaterial});
    
    let planetProgram = cml.createProgram({vertCode: planet_vert, fragCode: planet_frag});
    let planetShader = cml.createShader({program: planetProgram, resources: [sFractalNoise, uCanvasWidth, uCanvasHeight, uMousePosition, uPlanetModel, uProjection, uView], count: 7});

    // Pass 3.
    //
    let sScene = cml.createSamplerResource({name: "s_sceneTexture", texture: texture2, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let cursorEffectProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: cursor_effect_frag});
    let cursorEffectShader = cml.createShader({program: cursorEffectProgram, resources: [sScene, uCanvasWidth, uCanvasHeight, uMousePosition, uProjection, uView], count: 6});
 
    // Pass 4.
    //
    let sCursor = cml.createSamplerResource({name: "s_sceneTexture", texture: texture1, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});    
    let screenProgram = cml.createProgram({vertCode: screen_quad_vert, fragCode: texture_frag});
    let screenShader = cml.createShader({program: screenProgram, resources: [sCursor, uCanvasWidth, uCanvasHeight, uMousePosition, uProjection, uView], count: 6});


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
            cml.submit(square_input, fractalNoiseShader); 
            cml.end();

            // cml.begin(frameBuffer2);
            // cml.submit(sphere_input, planetShader);
            // cml.end();

            // cml.begin(frameBuffer1);
            // cml.submit(square_input, cursorEffectShader);
            // cml.end();

            cml.begin(null);
            cml.submit(square_input, screenShader);
            cml.end();

            loop();
        });  
    }

    // Clean up.
    //
    window.addEventListener("close", () => 
    {
        fractalNoiseShader.destroy();
        planetShader.destroy();
        cursorEffectShader.destroy();
        screenShader.destroy();
        
        square_input.destroy();
        sphere_input.destroy();

        frameBuffer1.destroy();
        frameBuffer2.destroy();
    })
}