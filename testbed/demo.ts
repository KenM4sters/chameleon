import * as cml from "../src/chameleon"


let squareVertices : number[] = 
[
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5,
    -0.5, 0.5
];

let squareIndices : number[] = 
[
    0, 1, 2,
    0, 3, 2
];


export function RunDemo() 
{
    let settings : cml.GraphicsSettings = 
    {
        canvas: document.createElement("canvas") as HTMLCanvasElement,
        name: "demo",
        backend: cml.GraphicsBackend.WebGL,
        pixelViewportWidth: window.innerWidth,
        pixelViewportHeight: window.innerHeight
    }

    cml.init(settings);

    let vertexShader : string = 
    `
        #verions 330 es
        in vec3 a_position;

        void main() 
        {
            gl_Position = vec4(a_position, 1.0);
        }
    
    `;

    let fragmentShader : string = 
    `
        precision highp float;

        out vec4 frag_color;

        void main() 
        {
            frag_color = vec4(1.0, 1.0, 0.0, 1.0);
        }
    `;

    let program = cml.createProgram({vertCode: vertexShader, fragCode: fragmentShader});
    let vertexBuffer = cml.createVertexBuffer({data: new Float32Array(squareVertices), byteSize: squareVertices.length * 4});
    let indexBuffer = cml.createIndexBuffer({data: new Uint16Array(squareIndices), byteSize: squareIndices.length * 4});

    let layout = new cml.VertexLayout(
        [new cml.VertexAttribute("Position", cml.ValueType.Float, 3)], 1
    );

    let input = cml.createVertexInput(
    {
        vBuffer: vertexBuffer,
        iBuffer: indexBuffer,
        layout: layout
    });


    let uTest = cml.createResource({type: "Int", name: "uTest", data: 10})

    let shader = cml.createShader({program: program, resources: [uTest], count: 1});




    window.requestAnimationFrame(() => 
    {
        cml.begin(null);

        cml.submit(input, shader);
    })  
}