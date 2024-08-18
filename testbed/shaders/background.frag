#version 300 es
precision highp float;

layout(location = 0) out vec4 scene_color;
layout(location = 1) out vec4 mesh_id_color;

in vec2 v_uv;
in vec3 v_clipPosition;

uniform sampler2D s_normalMap;
uniform float u_time;
uniform vec2 u_canvasDimensions;
uniform vec2 u_mousePosition;
uniform float u_currentView;

#define LIGHT_INTENSITY 0.01 


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

vec3 simplex_normal() 
{
    vec2 st = gl_FragCoord.xy / u_canvasDimensions;
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.0);
    q.x = fbm(st + 0.0);
    q.y = fbm(st + vec2(1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126);

    float f = fbm(st + r);

    color = mix(vec3(0.101961, 0.619608, 0.666667), vec3(0.666667, 0.666667, 0.498039), clamp((f * f) * 4.0, 0.0, 1.0));

    color = mix(color, vec3(0.0, 0.1, 0.2), clamp(length(q), 0.0, 1.0));

    color = mix(color, vec3(0.0, 0.16, 0.16), clamp(length(r.x), 0.0, 1.0));

    vec3 simplex_normal = vec3((f * f * f + 0.6 * f * f + 0.9 * f) * color);

	return simplex_normal;
}


#define PI 3.14159265359

float N21 (vec2 p){
    return fract(sin(p.x * 100.0 + p.y * 657.0) * 5647.0);
}

float SmoothNoise(vec2 uv){
    vec2 lv = fract(uv);
    vec2 id = floor(uv);

    lv = lv * lv * (3.0 - 2.0 * lv); //3x^2 - 2x^3

    float bl = N21(id);
    float br = N21(id + vec2(1.0, 0.0));
    float b = mix(bl, br, lv.x);

    float tl = N21(id + vec2(0.0, 1.0));
    float tr = N21(id + vec2(1.0, 1.0));
    float t = mix(tl, tr, lv.x);

    return mix(b, t, lv.y);
}

float SmoothNoise2(vec2 uv){
    float c = SmoothNoise(uv * 4.0);
    c += SmoothNoise(uv * 8.0) * 0.5;
    c += SmoothNoise(uv * 16.0) * 0.25;
    c += SmoothNoise(uv * 32.0) * 0.125;
    c += SmoothNoise(uv * 65.0) * 0.0625;

    return c /= 1.9375; // (sum of all possible maximum values)so that it's always between 0 - 1
}


void main()
{
	vec2 mouse_position_clip_space = vec2(u_mousePosition.x * 2.0 - 1.0, u_mousePosition.y * 2.0 - 1.0);
    vec2 uv = v_uv - mouse_position_clip_space * vec2(0.01);


    //fix uv aspect ratio
    float aspect = u_canvasDimensions.x / u_canvasDimensions.y;
    uv.x *= aspect * 0.5;

    float t = u_time * 0.1;

    vec3 color1 = vec3(0.1, 0.1, 0.2);
    vec3 color2 = vec3(0.2, 0.2, 0.4);
    vec3 colorMixed = mix(color1, color2, uv.y);
    
    float c = SmoothNoise2(vec2(uv.x + t * 1.3, uv.y + t *0.1));
    float c2 = SmoothNoise2(vec2(uv.x + t * 8.0, uv.y));
    c = mix(c, c2, 0.2);

    colorMixed = mix(colorMixed, vec3(c), 0.8);

    scene_color = vec4(colorMixed, 1.0);


	vec3 simplex_normal = simplex_normal();

	// vec3 N = normalize(vec3(0, 0, 1));
	vec3 N = normalize(texture(s_normalMap, (v_uv * vec2(0.1)) + (mouse_position_clip_space * 0.002)).rgb);
	
	vec3 light_pos = vec3(0, 0, 3.0);
    
	vec3 light_color = vec3(1.0, 1.0, 1.0);

	vec3 light_dir = v_clipPosition - light_pos;

	float light_angle = dot(light_dir, N);

	float light_distance = length(light_dir);

	float attenuation = 1.0 / (light_distance * light_distance);

	vec3 albedo = mix((vec3(0.1, 0.1, 0.25)), vec3(0.1, 0.1, 0.15), u_currentView);

	albedo += light_color * light_angle * attenuation * LIGHT_INTENSITY;

	scene_color = vec4(albedo, 1.0);

	mesh_id_color = vec4(100.0);
}