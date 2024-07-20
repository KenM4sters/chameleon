#version 300 es

in vec2 a_position; 
in vec2 a_uv;

out vec2 v_uv;

uniform mat4 u_model;

void main() 
{
    v_uv = a_uv;
    gl_Position = u_model * vec4(a_position, 0.0, 1.0);
}