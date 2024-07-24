#version 300 es
precision highp float;

layout(location = 0) out vec4 scene_color;
layout(location = 1) out vec4 mesh_id_color;

in vec2 v_uv;
in vec3 v_clipPosition;

uniform int u_projectId;
uniform sampler2D s_srcTexture;


void main() 
{   
    float opacity = 1.0 - v_clipPosition.z;

    if(v_uv.x >= 1.0) 
    {
        scene_color = vec4(1.0, 1.0, 1.0, 1.0);
    }
    else 
    {
        scene_color = vec4(texture(s_srcTexture, v_uv).rgb, 1.0);
    };

    mesh_id_color = vec4(u_projectId, 0.0, 0.0, 0.0);
}