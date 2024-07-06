

```
 
let cube = Factory.BuildMesh({
    shader: 
    {
        vertCode: vertex,
        fragCode: fragment,
        vertexInput: 
        {
            data: cubeVertices,
            layout: 
            [
                {ShaderInputTypes.vec3f},
                {ShaderInputTypes.vec3f},
                {ShaderInputTypes.vec2f}
            ]
        },
        uniforms: 
        [
            {ShaderInputTypes.mat4x4, "model", modelMatrix},
            {ShaderInputTypes.mat4x4, "projeciton", camera.projection},
            {ShaderInputTypes.mat4x4, "view", camera.view},
        ]
    }
    worldTransforms: 
    {
        position: [0, 0, 0]
    }
});

```