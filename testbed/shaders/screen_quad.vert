#version 300 es

in vec3 a_position; 
in vec2 a_uv;

out vec2 v_uv;
out vec3 v_clipPosition;

void main() 
{
    v_uv = a_uv;

    vec4 clipPosition = vec4(a_position, 1.0);

    v_clipPosition = vec3(clipPosition);

    gl_Position = clipPosition;
}