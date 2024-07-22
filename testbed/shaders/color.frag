#version 300 es
precision highp float;

out vec4 frag_color;

in vec2 v_uv;
in vec3 v_normal;

void main() 
{   
    frag_color = vec4(v_normal, 1.0);
}