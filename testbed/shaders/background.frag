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

#define LIGHT_INTENSITY 0.0


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


void main()
{

	vec2 mouse_position_clip_space = vec2(u_mousePosition.x * 2.0 - 1.0, u_mousePosition.y * 2.0 - 1.0);

	vec3 simplex_normal = simplex_normal();

	// vec3 N = normalize(vec3(0, 0, 1));
	vec3 N = normalize(texture(s_normalMap, v_uv).rgb);
	
	vec3 light_pos = vec3(0, 0, 2.0);
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