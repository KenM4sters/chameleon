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

void main()
{
	// vec3 N = normalize(vec3(0.0, 0.0, 1.0));
	vec3 N = texture(s_normalMap, v_uv).rgb;
	
	vec3 light_pos = vec3(0.0, 0.0, 0.0);
	vec3 light_color = vec3(1.0, 1.0, 1.0);

	vec3 light_dir = v_clipPosition - light_pos;

	float light_angle = dot(light_dir, N);

	float light_distance = length(light_dir);

	float attenuation = 1.0 / (light_distance * light_distance);

	vec3 albedo = vec3(mix(vec3(0.1, 0.1, 0.3), vec3(0.1, 0.1, 0.15), u_currentView));

	albedo += light_color * light_angle * attenuation * LIGHT_INTENSITY;

	scene_color = vec4(albedo, 1.0);

	mesh_id_color = vec4(13.0);
}