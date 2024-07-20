#version 300 es
precision highp float;

out vec4 frag_color;

in vec2 v_uv;


uniform sampler2D s_neptuneTexture;

void main() 
{   
    frag_color = texture(s_neptuneTexture, v_uv).rgba;
}