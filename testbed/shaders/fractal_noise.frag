#version 300 es
precision highp float;

out vec4 frag_color;


uniform float u_time;
uniform float u_canvasWidth;
uniform float u_canvasHeight;
uniform vec2 u_mousePosition;

uniform vec2 u_resolution;

float random (in vec2 _st) 
{
    return fract(sin(dot(_st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) 
{
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 10

float fbm ( in vec2 _st) 
{
    float v = 0.0;
    float a = 0.5;

    vec2 shift = vec2(100.0);

    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));

    for (int i = 0; i < NUM_OCTAVES; i++) 
    {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }

    return v;
}

void main() 
{
    vec2 st = gl_FragCoord.xy / vec2(u_canvasWidth, u_canvasHeight).xy;
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.0);
    q.x = fbm(st + 0.0 * u_time);
    q.y = fbm(st + vec2(1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

    float f = fbm(st + r);

    color = mix(vec3(0.101961, 0.619608, 0.666667), vec3(0.666667, 0.666667, 0.498039), clamp((f * f) * 4.0, 0.0, 1.0));

    color = mix(color, vec3(0.0, 0.1, 0.2), clamp(length(q), 0.0, 1.0));

    color = mix(color, vec3(0.0, 0.16, 0.16), clamp(length(r.x), 0.0, 1.0));

    frag_color = vec4((f * f * f + 0.6 * f * f + 0.9 * f) * color, 1.0);
}