

export let planet_image_vertices = new Float32Array([ 
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
    1.0, 0.90, 0.0, 1.0, 1.0,
    0.6, 0.90, 0.0, 1.0, 1.0,
    0.55, 1.0, 0.0, 1.0, 1.0,
    -1.0, 0.90, 0.0, 0.0, 1.0,
    -0.85, 0.90, 0.0, 0.0, 1.0,
    -0.80, 1.0, 0.0, 0.0, 1.0
]);


export let screen_quad_vertices = new Float32Array([ 
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 0.0, 1.0
]);

export let screen_quad_indices = new Float32Array([ 
    0, 1, 2, 
    0, 3, 2,
]);


export let cube_vertices = new Float32Array([
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

export let cube_indices = new Uint16Array([
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


export function generateBeveledCube(size : number, bevelRadius : number, segments : number) {
    const vertices : number[] = [];
    const normals : number[] = [];
    const indices : number[] = [];

    const halfSize = size / 2;
    const bevelSegments = Math.max(1, segments);
    const segmentStep = bevelRadius / bevelSegments;
    const faceSegments = bevelSegments + 1;

    // Helper function to create vertices and normals
    function addVertex(x : number, y : number, z : number, nx : number, ny : number, nz : number) 
    {
        vertices.push(x, y, z);
        normals.push(nx, ny, nz);
    }

    // Create vertices and normals for each face
    for (let face = 0; face < 6; face++) {
        const uDir = (face % 3) === 0 ? 1 : 0;
        const vDir = (face % 3) === 1 ? 1 : 0;
        const wDir = (face % 3) === 2 ? 1 : 0;

        const sign = (face < 3) ? 1 : -1;

        for (let i = 0; i <= faceSegments; i++) {
            for (let j = 0; j <= faceSegments; j++) {
                const u = (i / faceSegments) * 2 - 1;
                const v = (j / faceSegments) * 2 - 1;

                const x = halfSize * (wDir ? u : (uDir ? sign : v));
                const y = halfSize * (uDir ? u : (vDir ? sign : v));
                const z = halfSize * (vDir ? u : (wDir ? sign : v));

                const nx = (x === 0 ? 0 : (x > 0 ? 1 : -1)) * (1 - wDir);
                const ny = (y === 0 ? 0 : (y > 0 ? 1 : -1)) * (1 - uDir);
                const nz = (z === 0 ? 0 : (z > 0 ? 1 : -1)) * (1 - vDir);

                addVertex(x, y, z, nx, ny, nz);
            }
        }
    }

    // Create indices for the faces
    const numVertsPerFace = (faceSegments + 1) * (faceSegments + 1);
    for (let face = 0; face < 6; face++) {
        const offset = face * numVertsPerFace;

        for (let i = 0; i < faceSegments; i++) {
            for (let j = 0; j < faceSegments; j++) {
                const a = offset + i * (faceSegments + 1) + j;
                const b = a + 1;
                const c = a + (faceSegments + 1);
                const d = c + 1;

                indices.push(a, b, d);
                indices.push(a, d, c);
            }
        }
    }

    return { vertices, normals, indices };
}
