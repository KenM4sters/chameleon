import * as cml from "../src/chameleon"
import * as glm from "gl-matrix"

let squareVertices : number[] = 
[
    -0.5, -0.5, 0.0, 0.0,
    0.5, -0.5, 1.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    -0.5, 0.5, 0.0, 1.0
];

let squareIndices : number[] = 
[
    0, 1, 2,
    0, 3, 2
];


let sceneVert : string = 
`   #version 300 es

    in vec2 a_position; 
    in vec2 a_uv;

    uniform mat4 u_model;
    uniform mat4 u_view;
    uniform mat4 u_projection;

    out vec2 v_uv;

    void main() 
    {
        v_uv = a_uv;
        gl_Position = u_projection * u_view * u_model * vec4(a_position, 0.0, 1.0);
    }
`;

let sceneFrag : string = 
`   #version 300 es
    precision highp float;

    out vec4 frag_color;

    void main() 
    {
        frag_color = vec4(0.2, 0.2, 1.0, 1.0);
    }
`;

let screenVert : string = 
`   #version 300 es

    in vec2 a_position; 
    in vec2 a_uv;

    out vec2 v_uv;

    uniform mat4 u_model;

    void main() 
    {
        v_uv = a_uv;
        gl_Position = u_model * vec4(a_position, 0.0, 1.0);
    }
`;

let screenFrag : string = 
`   #version 300 es
    precision highp float;

    out vec4 frag_color;

    in vec2 v_uv;

    uniform sampler2D s_sceneTexture;
    uniform float u_canvasWidth;
    uniform float u_canvasHeight;
    uniform vec2 u_mousePosition;

    void main() 
    {
        vec2 fragPosition = gl_FragCoord.xy / vec2(u_canvasWidth, u_canvasHeight);

        float texelWidth = 1.0 / u_canvasWidth;
        float texelHeight = 1.0 / u_canvasHeight;

        vec2 mouseCover = vec2(100.0*texelWidth, 100.0*texelHeight);

        vec4 finalColor;

        float radius = 10.0 * texelWidth;

        if(length(fragPosition - u_mousePosition) < radius) 
        {
            finalColor = vec4(0.7, 0.7, 0.8, 1.0);
        }
        else 
        {
            vec3 color = texture(s_sceneTexture, v_uv).rgb;
            finalColor = vec4(color, 1.0);
        }

        frag_color = finalColor;
    }
`;


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

    // View Frustum.
    //
    let projectionMatrix = glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(45), window.innerWidth / window.innerHeight, 0.1, 100.0);
    let viewMatrix = glm.mat4.lookAt(glm.mat4.create(), [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    let uProjection = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(projectionMatrix), name: "u_projection", writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerFrame});
    let uView = cml.createUniformResource({type: "Mat4x4f", data: new Float32Array(viewMatrix), name: "u_view", writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerFrame});


    // Vertex Input.
    //
    let vertexBuffer = cml.createVertexBuffer({data: new Float32Array(squareVertices), byteSize: squareVertices.length * 4});
    let indexBuffer = cml.createIndexBuffer({data: new Uint16Array(squareIndices), byteSize: squareIndices.length * 4});
    
    let layout = new cml.VertexLayout(
        [
            new cml.VertexAttribute("Position", cml.ValueType.Float, 2),
            new cml.VertexAttribute("TexCoords", cml.ValueType.Float, 2),
        ], 
        2
    );

    let input = cml.createVertexInput(
    {
        vBuffer: vertexBuffer,
        iBuffer: indexBuffer,
        layout: layout
    });


    // Scene Shader.
    //
    let sceneModel = glm.mat4.create();
    sceneModel = glm.mat4.scale(glm.mat4.create(), sceneModel, [1.0, 1.0, 1.0]);
    let uSceneModel = cml.createUniformResource({type: "Mat4x4f", name: "u_model", data: new Float32Array(sceneModel), writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerMaterial});
    
    let program = cml.createProgram({vertCode: sceneVert, fragCode: sceneFrag});
    
    let sceneShader = cml.createShader({program: program, resources: [uSceneModel, uProjection, uView], count: 3});

    // Shader.
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
    
    let texture = cml.createTexture(
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

    // Framebuffer.
    //
    let colorAttachment : cml.FrameBufferAttachment = 
    {
        texture: texture,
        attachment: cml.Attachment.Color0
    }

    let frameBuffer = cml.createFrameBuffer({attachments: [colorAttachment], count: 1});


    // Screen Shader.
    //
    let screenModel = glm.mat4.create();
    screenModel = glm.mat4.scale(glm.mat4.create(), screenModel, [2.0, 2.0, 2.0]);
    let uScreenModel = cml.createUniformResource({type: "Mat4x4f", name: "u_model", data: new Float32Array(screenModel), writeFrequency: cml.WriteFrequency.Static, accessType: cml.ResourceAccessType.PerMaterial});
    let uCanvasWidth = cml.createUniformResource({type: "Float", name: "u_canvasWidth", data: window.innerWidth, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
    let uCanvasHeight = cml.createUniformResource({type: "Float", name: "u_canvasHeight", data: window.innerHeight, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerMaterial});
    let mousePosition = glm.vec2.create();
    window.addEventListener("mousemove", (e : MouseEvent) => 
    {
        let yPos = ((e.clientY - window.innerHeight) * -1) / window.innerHeight;
        let xPos = e.clientX / window.innerWidth;
        mousePosition = [xPos, yPos];  
    });
    let uMousePosition = cml.createUniformResource({type: "Vec2f", name: "u_mousePosition", data: new Float32Array(mousePosition), writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerFrame});
    let uSceneTexture = cml.createSamplerResource({name: "s_sceneTexture", texture: texture, writeFrequency: cml.WriteFrequency.Dynamic, accessType: cml.ResourceAccessType.PerDrawCall});
        
    let screenProgram = cml.createProgram({vertCode: screenVert, fragCode: screenFrag});
    
    let screenShader = cml.createShader({program: screenProgram, resources: [uSceneTexture, uCanvasWidth, uCanvasHeight, uMousePosition, uScreenModel, uProjection, uView], count: 7});

    // Run.
    //
    loop();

    function loop() : void 
    {
        window.requestAnimationFrame(() => 
        {
            uMousePosition.update(new Float32Array(mousePosition));

            cml.begin(frameBuffer);  
            
            cml.submit(input, sceneShader); 

            cml.end();

            cml.begin(null);

            cml.submit(input, screenShader);

            loop();
        });  
    }

    // Clean up.
    //
    window.addEventListener("close", () => 
    {
        sceneShader.destroy();
        input.destroy();
        frameBuffer.destroy();
    })
}