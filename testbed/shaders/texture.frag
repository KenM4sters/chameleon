#version 300 es
precision highp float;

out vec4 frag_color;

in vec2 v_uv;

uniform sampler2D s_srcTexture;

void main() 
{   
    if(v_uv.x >= 1.0) 
    {
        frag_color = vec4(0.1, 0.1, 0.1, 1.0);
    }
    else 
    {
        frag_color = vec4(texture(s_srcTexture, v_uv).rgb, 1.0);
    }
}