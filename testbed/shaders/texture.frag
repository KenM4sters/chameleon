#version 300 es
precision highp float;

out vec4 frag_color;

in vec2 v_uv;

uniform sampler2D s_srcTexture;

void main() 
{   
    frag_color = vec4(texture(s_srcTexture, v_uv).rgb, 1.0);
}